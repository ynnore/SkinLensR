from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List, Optional, AsyncGenerator
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware # Assurez-vous d'avoir installé 'fastapi-cors'

from app.database import get_db, engine # Importe le moteur aussi pour la création des tables si besoin
from app.models.base import Base # Pour créer les tables au démarrage si elles n'existent pas
from app import schemas, crud, auth # Importe les modules schemas, crud et auth

# ✅ IMPORTS NÉCESSAIRES POUR LES DOCUMENTS LÉGAUX ET LES ACCORDS UTILISATEURS
from app.models.legal_document import LegalDocument # Importation directe du modèle LegalDocument
from app.models.user_legal_agreement import UserLegalAgreement # Importation du modèle UserLegalAgreement

# ✅ IMPORTS POUR LES EMBEDDINGS ET DOCUMENTS D'AGENT
from app.embeddings import get_embedding
from app.models.agent_document import AgentDocument
from app.models.agent_document import VECTOR_DIMENSION # Pour la vérification de la dimension du vecteur

# --- Utilitaires de Base de Données ---
# Cette fonction est utile pour créer toutes les tables définies par SQLAlchemy
# au démarrage de l'application. Idéal pour le développement, mais les migrations
# Alembic sont préférables pour la production.
def create_tables():
    # Assurez-vous que tous vos modèles sont importés et enregistrés avec Base.metadata
    # et que les relations sont bien définies avant d'appeler create_all.
    Base.metadata.create_all(bind=engine)

# Gestionnaire de contexte pour le cycle de vie de l'application (startup/shutdown)
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Fonction de gestion du cycle de vie de l'application.
    Exécute la logique de démarrage avant de servir les requêtes
    et la logique d'arrêt après.
    """
    print("Application démarre...")
    # Logique de démarrage: Création des tables de la DB
    create_tables()
    print("Base de données initialisée (tables créées).")

    yield # L'application commence à traiter les requêtes ici

    # Logique d'arrêt (si vous en aviez, par exemple, fermer des connexions)
    print("Application s'arrête...")
    # print("Ressources nettoyées (exemple: fermeture de pool de connexions).")


# Initialise L'APPLICATION FASTAPI UNE SEULE FOIS en utilisant le gestionnaire de cycle de vie
app = FastAPI(
    title="Kiwi-ops Backend API",
    description="API pour la gestion stratégique, l'authentification, les documents légaux et les agents IA de Kiwi-ops.",
    version="0.1.0",
    lifespan=lifespan # <-- Ici, nous passons le gestionnaire lifespan
)

# Configuration CORS - APPLIQUÉE À LA SEULE ET UNIQUE INSTANCE DE L'APP
origins = [
    "http://localhost:3000",  # L'URL de votre frontend Next.js
    # "http://localhost",
    # "http://localhost:8080",
    # Ajoutez d'autres origines de production ici si nécessaire
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Ou spécifiez ['GET', 'POST', 'PUT', 'DELETE']
    allow_headers=["*"], # Ou spécifiez les en-têtes que vous utilisez
)


# Initialise le schéma de sécurité OAuth2 pour l'authentification par jeton
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# Dépendance pour récupérer l'utilisateur courant à partir du token JWT
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = auth.decode_access_token(token)
    if payload is None:
        raise credentials_exception
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

# Dépendance pour s'assurer que l'utilisateur est un administrateur
async def get_current_admin_user(current_user: schemas.UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions (Admin required)"
        )
    return current_user

# --- Routes de l'API ---

# La fonction @app.on_event("startup") est supprimée car remplacée par lifespan

@app.get("/")
async def read_root():
    return {"message": "Welcome to Kiwi-ops Backend! Mission Control Online."}

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "Kiwi-ops Backend"}

# Route d'inscription
@app.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    return crud.create_user(db=db, user=user, hashed_password=hashed_password)

# Route de connexion (génère un token JWT)
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username) # username est en fait l'email ici
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Route protégée pour l'utilisateur actuel
@app.get("/users/me/", response_model=schemas.UserResponse)
async def read_users_me(current_user: schemas.UserResponse = Depends(get_current_user)):
    return current_user

# --- Routes pour les documents légaux (admin) ---
@app.post("/legal-documents/", response_model=schemas.LegalDocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_legal_document(
    doc: schemas.LegalDocumentCreate,
    db: Session = Depends(get_db),
    current_admin: schemas.UserResponse = Depends(get_current_admin_user) # Seuls les admins peuvent créer
):
    # Vérifier si la version existe déjà pour ce type/langue
    # Ici, on utilise la fonction CRUD pour la vérification
    existing_doc = crud.get_legal_document_by_details(db, doc.type, doc.language, doc.version)
    if existing_doc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Document version already exists for this type and language")
    return crud.create_legal_document(db=db, doc=doc)

@app.get("/legal-documents/", response_model=List[schemas.LegalDocumentResponse])
async def get_legal_documents(
    type: Optional[str] = None,
    language: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Utilisez une logique de filtrage plus propre via le CRUD si possible,
    # ou une requête SQLAlchemy directe avec des filtres.
    # Ici, j'utilise LegalDocument directement pour les requêtes de liste.
    query = db.query(LegalDocument)
    if type:
        query = query.filter(LegalDocument.type == type)
    if language:
        query = query.filter(LegalDocument.language == language)
    
    documents = query.all()
    return documents

@app.get("/legal-documents/latest", response_model=schemas.LegalDocumentResponse)
async def get_latest_legal_document(doc_type: str, lang: str, db: Session = Depends(get_db)):
    # Utilise la fonction CRUD pour obtenir le dernier document
    doc = crud.get_latest_legal_document(db, doc_type, lang)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Latest legal document not found")
    return doc

# --- Route pour l'accord utilisateur sur les documents légaux ---
@app.post("/user-agreements/", response_model=schemas.UserLegalAgreementResponse, status_code=status.HTTP_201_CREATED)
async def record_user_agreement(
    agreement: schemas.UserLegalAgreementCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    # S'assurer que le document existe
    # Utilisation de LegalDocument directement, assurez-vous que l'import est présent
    db_document = db.query(LegalDocument).filter(LegalDocument.id == agreement.document_id).first()
    if not db_document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Legal document not found")

    # Vérifier si l'utilisateur a déjà accepté ce document
    existing_agreement = crud.get_user_agreements_for_document(db, current_user.id, agreement.document_id)

    if existing_agreement:
        # Si l'accord existe et n'est pas marqué comme la dernière version, le mettre à jour.
        if not existing_agreement.is_latest_version_agreed:
            existing_agreement.agreed_at = datetime.utcnow() # Mettre à jour la date d'accord
            existing_agreement.is_latest_version_agreed = True # Marquer comme dernière version
            db.commit()
            db.refresh(existing_agreement)
            return existing_agreement
        else:
            # Si c'est déjà la dernière version acceptée, retourner l'accord existant.
            return existing_agreement
    else:
        # Enregistrer un nouvel accord pour l'utilisateur courant
        return crud.record_user_agreement(db=db, user_id=current_user.id, document_id=agreement.document_id)

# Route pour récupérer tous les accords d'un utilisateur
@app.get("/users/me/agreements/", response_model=List[schemas.UserLegalAgreementResponse])
async def get_my_agreements(
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    # Utilisation de la fonction CRUD pour récupérer tous les accords de l'utilisateur courant
    agreements = crud.get_all_agreements_by_user(db, current_user.id)
    return agreements

# ==============================================================================
# ✅ NOUVELLES ROUTES POUR LA GESTION DES DOCUMENTS D'AGENT (RAG)
# ==============================================================================

@app.post("/agent-documents/", response_model=schemas.AgentDocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_agent_document_and_embedding(
    doc_data: schemas.AgentDocumentCreate, # Utilise le schéma AgentDocumentCreate
    db: Session = Depends(get_db),
    # Si vous voulez restreindre cette route aux administrateurs, décommentez la ligne ci-dessous:
    current_admin: schemas.UserResponse = Depends(get_current_admin_user) # Nécessite d'être admin
):
    # Vous pouvez ajouter ici une logique pour vérifier les doublons par titre ou source
    # existing_doc = db.query(AgentDocument).filter(AgentDocument.title == doc_data.title).first()
    # if existing_doc:
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Document with this title already exists")

    # 1. Générer l'embedding du contenu du document
    embedding = get_embedding(doc_data.content)
    if not embedding:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate embedding for the document.")
    
    # S'assurer que la dimension du vecteur correspond à celle attendue par la base de données
    # VECTOR_DIMENSION est maintenant importé, donc cette vérification est possible
    if len(embedding) != VECTOR_DIMENSION:
         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Embedding dimension mismatch: expected {VECTOR_DIMENSION}, got {len(embedding)}. Please check your embedding model configuration.")


    # 2. Créer l'entrée dans la base de données
    db_document = AgentDocument(
        title=doc_data.title,
        content=doc_data.content,
        source=doc_data.source,
        embedding=embedding # Le vecteur d'embedding généré
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document) # Rafraîchit l'objet pour obtenir l'ID et les timestamps

    return db_document

@app.get("/agent-documents/{document_id}", response_model=schemas.AgentDocumentResponse)
async def get_agent_document(document_id: int, db: Session = Depends(get_db)):
    document = db.query(AgentDocument).filter(AgentDocument.id == document_id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent document not found")
    return document