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

# --- Utilitaires de Base de Données ---
# Cette fonction est utile pour créer toutes les tables définies par SQLAlchemy
# au démarrage de l'application. Idéal pour le développement, mais les migrations
# Alembic sont préférables pour la production.
def create_tables():
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
    existing_doc = crud.get_legal_document(db, doc.type, doc.language, doc.version)
    if existing_doc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Document version already exists for this type and language")
    return crud.create_legal_document(db=db, doc=doc)

@app.get("/legal-documents/", response_model=List[schemas.LegalDocumentResponse])
async def get_legal_documents(
    type: Optional[str] = None,
    language: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Retourne toutes les versions si aucun filtre n'est appliqué
    # Ou filtre par type et langue
    # Assurez-vous que 'auth.LegalDocument' est bien le modèle SQLAlchemy approprié
    documents = db.query(auth.LegalDocument).all()
    if type:
        documents = [d for d in documents if d.type == type]
    if language:
        documents = [d for d in documents if d.language == language]
    return documents

@app.get("/legal-documents/latest", response_model=schemas.LegalDocumentResponse)
async def get_latest_legal_document(doc_type: str, lang: str, db: Session = Depends(get_db)):
    doc = crud.get_legal_document(db, doc_type, lang)
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
    # Assurez-vous que 'auth.LegalDocument' est bien le modèle SQLAlchemy approprié
    doc = db.query(auth.LegalDocument).filter(auth.LegalDocument.id == agreement.document_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Legal document not found")

    # Optionnel: marquer les anciens accords comme non-derniers pour ce type de document si besoin
    # Ceci est un commentaire et doit être implémenté si la logique est requise
    #
    # Exemple de logique pour marquer les anciens accords:
    # from app.models.user_legal_agreement import UserLegalAgreement # Assurez-vous d'importer le modèle UserLegalAgreement
    #
    # existing_agreements = db.query(UserLegalAgreement).filter(
    #     UserLegalAgreement.user_id == current_user.id,
    #     UserLegalAgreement.document.has(type=doc.type) # Ceci nécessite une relation configurée
    # ).all()
    #
    # for ag in existing_agreements:
    #    ag.is_latest_version_agreed = False
    # db.commit() # N'oubliez pas de committer les changements si vous faites cela

    return crud.record_user_agreement(db=db, user_id=current_user.id, document_id=agreement.document_id)