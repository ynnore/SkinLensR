# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List, Optional, AsyncGenerator
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from app.database import get_db, engine
from app.models.base import Base
from app import schemas, crud, auth

# Assurez-vous que app/embeddings.py contient bien get_embedding et get_llm_response
from app.embeddings import get_embedding, get_llm_response
from app.models.agent_document import AgentDocument
from app.models.agent_document import VECTOR_DIMENSION

# --- Utilitaires de Base de Données ---
def create_tables():
    Base.metadata.create_all(bind=engine)

# Gestionnaire de contexte pour le cycle de vie de l'application
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    print("Application démarre...")
    create_tables()
    print("Base de données initialisée (tables créées).")

    yield # L'application commence à traiter les requêtes ici

    print("Application s'arrête...")


# Initialise l'application FastAPI
app = FastAPI(
    title="Kiwi-ops Backend API",
    description="API pour la gestion stratégique, l'authentification, les documents légaux et les agents IA de Kiwi-ops.",
    version="0.1.0",
    lifespan=lifespan
)

# Configuration CORS
# Permet aux requêtes provenant de ces origines d'accéder à votre API.
# C'est essentiel pour que votre frontend Next.js puisse communiquer avec le backend.
origins = [
    "http://localhost:3000",       # Pour le développement local du frontend Next.js
    "https://kiwi-ops.com",        # Votre domaine de production pour le frontend
    "https://www.kiwi-ops.com",    # Votre domaine www pour le frontend
    "https://api.kiwi-ops.com",    # Si votre frontend appelle l'API depuis ce domaine (peut être redondant)
]

# Ajout du middleware CORS pour gérer les requêtes cross-origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,       # Permet l'envoi de cookies et d'en-têtes d'autorisation
    allow_methods=["*"],          # Autorise toutes les méthodes HTTP (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],          # Autorise toutes les en-têtes
)

# Schéma de sécurité OAuth2 pour la gestion des tokens JWT
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Dépendances d'Authentification ---

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Dépendance pour obtenir l'utilisateur actuel à partir d'un token JWT.
    Valide le token, décode l'email et récupère l'utilisateur depuis la base de données.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = auth.decode_access_token(token) # Décode le token pour obtenir les informations utilisateur
    if payload is None:
        raise credentials_exception
    email: str = payload.get("sub") # Récupère l'email (soumis dans le token)
    if email is None:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=email) # Trouve l'utilisateur dans la DB
    if user is None:
        raise credentials_exception

    # DEBUGGING
    print(f"DEBUG in get_current_user: Token Payload: {payload}")
    print(f"DEBUG in get_current_user: User from DB - Email: {user.email}, Role: {user.role}")

    return user # Retourne l'objet utilisateur

async def get_current_admin_user(current_user: schemas.UserResponse = Depends(get_current_user)):
    """
    Dépendance pour s'assurer que l'utilisateur actuel est un administrateur.
    Utilise get_current_user pour obtenir l'utilisateur, puis vérifie son rôle.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions (Admin required)"
        )
    return current_user # Retourne l'utilisateur si c'est un admin

# --- Routes de l'API ---

@app.get("/")
async def read_root():
    """Route racine pour vérifier que le serveur fonctionne."""
    return {"message": "Welcome to Kiwi-ops Backend! Mission Control Online."}

@app.get("/health")
async def health_check():
    """Route pour vérifier l'état de santé du service."""
    return {"status": "ok", "service": "Kiwi-ops Backend"}

# --- Routes d'Authentification ---

@app.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Enregistre un nouvel utilisateur."""
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password) # Hache le mot de passe
    return crud.create_user(db=db, user=user, hashed_password=hashed_password) # Crée l'utilisateur dans la DB

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Génère un token d'accès JWT lors de la connexion."""
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        # Vérifie l'email et le mot de passe
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    print(f"DEBUG in login_for_access_token: User logging in - Email: {user.email}, Role: {user.role}")
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    # Crée le token avec l'email et le rôle de l'utilisateur
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me/", response_model=schemas.UserResponse)
async def read_users_me(current_user: schemas.UserResponse = Depends(get_current_user)):
    """Route protégée pour obtenir les informations de l'utilisateur actuel."""
    return current_user

# --- Routes pour les documents légaux ---

@app.post("/legal-documents/", response_model=schemas.LegalDocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_legal_document(
    doc: schemas.LegalDocumentCreate,
    db: Session = Depends(get_db),
    current_admin: schemas.UserResponse = Depends(get_current_admin_user) # Nécessite un admin
):
    """Crée un nouveau document légal."""
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
    """Récupère une liste de documents légaux, avec filtres optionnels par type et langue."""
    documents = db.query(auth.LegalDocument).all()
    if type:
        documents = [d for d in documents if d.type == type]
    if language:
        documents = [d for d in documents if d.language == language]
    return documents

@app.get("/legal-documents/latest", response_model=schemas.LegalDocumentResponse)
async def get_latest_legal_document(doc_type: str, lang: str, db: Session = Depends(get_db)):
    """Récupère la dernière version d'un document légal pour un type et une langue donnés."""
    doc = crud.get_legal_document(db, doc_type, lang)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Latest legal document not found")
    return doc

@app.post("/user-agreements/", response_model=schemas.UserLegalAgreementResponse, status_code=status.HTTP_201_CREATED)
async def record_user_agreement(
    agreement: schemas.UserLegalAgreementCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user) # Nécessite un utilisateur authentifié
):
    """Enregistre l'accord d'un utilisateur sur un document légal."""
    doc = db.query(auth.LegalDocument).filter(auth.LegalDocument.id == agreement.document_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Legal document not found")
    # Assurez-vous que le crud.record_user_agreement est implémenté pour gérer la logique
    return crud.record_user_agreement(db=db, user_id=current_user.id, document_id=agreement.document_id)

# ==============================================================================
# ROUTES POUR LA GESTION DES DOCUMENTS D'AGENT (RAG)
# ==============================================================================

@app.post("/agent-documents/", response_model=schemas.AgentDocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_agent_document_and_embedding(
    doc_data: schemas.AgentDocumentCreate,
    db: Session = Depends(get_db),
    current_admin: schemas.UserResponse = Depends(get_current_admin_user) # Nécessite un admin
):
    """
    Crée un document d'agent et son embedding.
    Utilise la fonction get_embedding importée de app.embeddings.
    """
    embedding = get_embedding(doc_data.content)
    if not embedding:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate embedding for the document.")
    
    # Vérifie si la dimension de l'embedding correspond à la dimension attendue par le modèle
    if len(embedding) != VECTOR_DIMENSION:
         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Embedding dimension mismatch: expected {VECTOR_DIMENSION}, got {len(embedding)}. Please check your embedding model configuration.")

    # Crée une nouvelle instance du modèle AgentDocument avec les données et l'embedding
    db_document = AgentDocument(
        title=doc_data.title,
        content=doc_data.content,
        source=doc_data.source,
        embedding=embedding # Stocke l'embedding comme une liste de floats
    )
    db.add(db_document) # Ajoute le nouveau document à la session SQLAlchemy
    db.commit()       # Valide la transaction
    db.refresh(db_document) # Rafraîchit l'objet pour obtenir les champs générés par la DB (comme l'ID)
    return db_document # Retourne le document créé

@app.get("/agent-documents/{document_id}", response_model=schemas.AgentDocumentResponse)
async def get_agent_document(document_id: int, db: Session = Depends(get_db)):
    """Récupère un document d'agent spécifique par son ID."""
    document = db.query(AgentDocument).filter(AgentDocument.id == document_id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent document not found")
    return document

@app.post("/ask", response_model=schemas.AgentResponse)
async def ask_agent(query_data: schemas.AgentQuery, db: Session = Depends(get_db)):
    """
    Traite une requête utilisateur pour l'agent conversationnel (RAG).
    Génère un embedding pour la requête, trouve les documents similaires,
    construit un contexte et utilise un LLM pour générer une réponse.
    """
    query_embedding = get_embedding(query_data.query) # Obtient l'embedding de la requête utilisateur
    if not query_embedding:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate embedding for the query.")

    # Récupère les documents les plus similaires à la requête en utilisant la distance cosinus de l'embedding
    similar_documents = (
        db.query(AgentDocument)
        .order_by(AgentDocument.embedding.cosine_distance(query_embedding)) # Tri par similarité
        .limit(query_data.top_k) # Limite le nombre de résultats
        .all()
    )

    if not similar_documents:
        # Si aucun document pertinent n'est trouvé
        return {"response": "Désolé, je n'ai trouvé aucune information pertinente dans ma base de connaissances."}

    # Construit le texte de contexte à partir des documents trouvés
    context_text = "\n\n".join([doc.content for doc in similar_documents])
    
    # Crée le prompt final pour le LLM, incluant le contexte et la question de l'utilisateur
    prompt = (
        f"Utilise les informations suivantes pour répondre à la question :\n\n"
        f"Contexte:\n{context_text}\n\n"
        f"Question: {query_data.query}\n\n"
        f"Réponse:"
    )

    # Appelle la fonction get_llm_response pour obtenir la réponse du modèle de langage
    llm_response = get_llm_response(prompt)

    return {"response": llm_response} # Retourne la réponse dans le format attendu