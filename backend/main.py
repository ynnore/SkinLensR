# backend/main.py

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List, Optional, AsyncGenerator
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import logging

# --- Logging Configuration ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Imports ---
# Base de données
# Assurez-vous que database.py est bien à la racine du dossier 'backend/'
from database import get_db, engine
from app.models.base import Base

# Schémas Pydantic
# Important : On importe les classes directement depuis app.schemas.schemas
from app.schemas.schemas import (
    UserCreate, LegalDocumentCreate, UserLegalAgreementCreate, UserResponse, Token, AgentDocumentCreate, AgentResponse, AgentQuery,
    LegalDocumentResponse,
    UserLegalAgreementResponse, # <-- AJOUTÉ ICI
    AgentDocumentResponse # <-- AJOUTÉ ICI
)

# Fonctions CRUD
# Assurez-vous que app/crud/__init__.py exporte bien toutes ces fonctions depuis app/crud/operations.py
from app.crud import (
    get_user_by_email, create_user, get_legal_document, create_legal_document, get_latest_legal_document, record_user_agreement,
    get_agent_document, create_agent_document
)

# Routeur d'authentification
# Assurez-vous que auth_router est défini dans app/auth.py
from app.auth import router as auth_router

# Fonctions d'embeddings et LLM
from app.embeddings import get_embedding, get_llm_response

# Modèles ORM SQLAlchemy
from app.models.user import User as UserModel
from app.models.legal_document import LegalDocument as LegalDocumentModel
from app.models.user_legal_agreement import UserLegalAgreement as UserLegalAgreementModel
from app.models.agent_document import AgentDocument as AgentDocumentModel, VECTOR_DIMENSION

# --- Gestionnaire de contexte pour le cycle de vie de l'application ---
# La fonction lifespan DOIT être définie AVANT son utilisation dans l'initialisation de FastAPI
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("Application démarre...")
    try:
        # Base.metadata.create_all(bind=engine) est essentiel pour créer les tables si elles n'existent pas.
        # Vérifiez que 'engine' est correctement configuré et que les modèles SQLAlchemy sont définis.
        Base.metadata.create_all(bind=engine)
        logger.info("Base de données initialisée (tables créées).")
    except Exception as e:
        logger.error(f"Erreur lors de l'initialisation de la base de données: {e}")
        raise # Relance l'exception pour que FastAPI puisse la gérer

    yield # Le point de suspension où l'application commence à traiter les requêtes

    logger.info("Application s'arrête...")

# --- Initialisation FastAPI ---
app = FastAPI(
    title="Kiwi-ops Backend API",
    description="API pour la gestion stratégique, l'authentification, les documents légaux et les agents IA de Kiwi-ops.",
    version="0.1.0",
    lifespan=lifespan # Utilisation directe de la fonction lifespan, désormais définie plus haut
)

# --- Configuration CORS ---
origins = [
    "http://localhost:3000",  # Origine de votre frontend local (par exemple, Next.js)
    "http://127.0.0.1:8000",  # Origine du backend local (pour Swagger UI)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes HTTP (GET, POST, PUT, DELETE, OPTIONS, etc.)
    allow_headers=["*"],  # Autorise tous les headers
)

# --- Inclusion des Routeurs ---
# Le préfixe "/auth" sera appliqué à toutes les routes définies dans auth_router
app.include_router(auth_router, prefix="/auth")

# Si vous avez d'autres routeurs (par exemple pour les documents légaux), incluez-les ici :
# from app.routers.legal_documents import router as legal_document_router
# app.include_router(legal_document_router, prefix="/v1/legal-documents") # Exemple de préfixe

# --- Schéma de sécurité OAuth2 ---
# tokenUrl doit pointer vers le endpoint POST qui génère le token d'accès
# Si votre route token est à la racine, "/token" est correct. Si elle est sous "/auth", ce serait "/auth/token".
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

# --- Dépendances d'Authentification ---
# Ces fonctions sont utilisées pour protéger les routes et obtenir l'utilisateur courant.
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserResponse:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    # Assurez-vous que la fonction auth.decode_access_token existe dans app/auth.py
    payload = auth.decode_access_token(token)
    if payload is None:
        logger.warning("Token decoding failed.")
        raise credentials_exception
    email: str = payload.get("sub") # Le sujet du token est généralement l'email
    if email is None:
        logger.warning("Token payload missing 'sub' (email).")
        raise credentials_exception

    # Utilisation de la fonction CRUD pour récupérer l'utilisateur depuis la DB
    user = get_user_by_email(db, email=email)
    if user is None:
        logger.warning(f"User not found in DB for email: {email}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    logger.debug(f"User authenticated: {user.email}")
    # Retourne le schéma Pydantic pour la réponse de l'API
    return UserResponse(id=user.id, email=user.email, role=user.role)

# Dépendance pour vérifier si l'utilisateur courant est un administrateur
async def get_current_admin_user(current_user: UserResponse = Depends(get_current_user)) -> UserResponse:
    if current_user.role != "admin":
        logger.warning(f"User {current_user.email} tried to access admin route with role: {current_user.role}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions (Admin required)"
        )
    logger.debug(f"Admin user verified: {current_user.email}")
    return current_user

# --- ROUTES ---

@app.get("/")
async def read_root():
    logger.info("Access to root path '/'")
    return {"message": "Welcome to Kiwi-ops Backend! Mission Control Online."}

@app.get("/health")
async def health_check():
    logger.info("Health check endpoint accessed.")
    return {"status": "ok", "service": "Kiwi-ops Backend"}

# Route d'inscription
# Utilise UserCreate pour le corps de la requête et UserResponse pour la réponse
@app.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        logger.warning(f"Attempt to register with existing email: {user.email}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    # Assurez-vous que auth.get_password_hash existe dans app/auth.py
    hashed_password = auth.get_password_hash(user.password)
    # Assurez-vous que create_user dans app/crud prend bien 'user_data' et 'hashed_password'
    new_user = create_user(db=db, user_data=user, hashed_password=hashed_password)
    logger.info(f"User registered successfully: {user.email}")
    return new_user # Retourne le schéma UserResponse

# Route de connexion (génère un token JWT)
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user_by_email(db, email=form_data.username)
    # Assurez-vous que auth.verify_password et auth.create_access_token existent dans app/auth.py
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        logger.warning(f"Login failed for username: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    logger.info(f"User logged in: {user.email}")
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES) # Assurez-vous que ACCESS_TOKEN_EXPIRE_MINUTES est défini dans app/auth.py
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

# Route protégée pour l'utilisateur actuel
@app.get("/users/me/", response_model=UserResponse)
async def read_users_me(current_user: UserResponse = Depends(get_current_user)):
    logger.debug(f"Accessing /users/me/ for user: {current_user.email}")
    return current_user

# --- Routes pour les documents légaux (admin) ---
# Utilise LegalDocumentResponse pour la réponse et LegalDocumentCreate pour le corps de la requête
@app.post("/legal-documents/", response_model=LegalDocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_legal_document(
    doc: LegalDocumentCreate,
    db: Session = Depends(get_db),
    current_admin: UserResponse = Depends(get_current_admin_user) # Dépendance pour vérifier si l'utilisateur est admin
):
    # Utilise la fonction CRUD importée
    existing_doc = get_legal_document(db, doc.type, doc.language, doc.version)
    if existing_doc:
        logger.warning(f"Attempt to create duplicate legal document: Type={doc.type}, Lang={doc.language}, Version={doc.version}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Document version already exists for this type and language")
    
    # Utilise la fonction CRUD importée
    new_doc = create_legal_document(db=db, doc=doc)
    logger.info(f"Legal document created: Type={doc.type}, Version={doc.version}")
    return new_doc # Retourne le schéma LegalDocumentResponse

# Utilise List[LegalDocumentResponse] pour la réponse
@app.get("/legal-documents/", response_model=List[LegalDocumentResponse])
async def get_legal_documents(
    type: Optional[str] = None,
    language: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Utilisation de l'alias LegalDocumentModel pour la table SQLAlchemy
    documents = db.query(LegalDocumentModel).all()
    if type:
        documents = [d for d in documents if d.type == type]
    if language:
        documents = [d for d in documents if d.language == language]
    logger.info(f"Retrieved {len(documents)} legal documents. Filters: type={type}, language={language}")
    return documents

# Utilise LegalDocumentResponse pour la réponse
@app.get("/legal-documents/latest", response_model=LegalDocumentResponse)
async def get_latest_legal_document(doc_type: str, lang: str, db: Session = Depends(get_db)):
    # Utilise la fonction CRUD importée
    doc = get_latest_legal_document(db, doc_type, lang)
    if not doc:
        logger.warning(f"Latest legal document not found for Type={doc_type}, Lang={lang}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Latest legal document not found")
    logger.info(f"Retrieved latest legal document: Type={doc_type}, Lang={lang}, Version={doc.version}")
    return doc

# --- Route pour l'accord utilisateur sur les documents légaux ---
# Utilise UserLegalAgreementCreate et UserLegalAgreementResponse directement
@app.post("/user-agreements/", response_model=UserLegalAgreementResponse, status_code=status.HTTP_201_CREATED)
async def record_user_agreement(
    agreement: UserLegalAgreementCreate,
    db: Session = Depends(get_db),
    current_user: UserResponse = Depends(get_current_user) # Dépendance pour obtenir l'utilisateur actuel
):
    # Utilisation de l'alias LegalDocumentModel pour la table SQLAlchemy
    doc = db.query(LegalDocumentModel).filter(LegalDocumentModel.id == agreement.document_id).first()
    if not doc:
        logger.warning(f"Attempt to record agreement for non-existent legal document ID: {agreement.document_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Legal document not found")

    # Utilise la fonction CRUD importée
    new_agreement = record_user_agreement(db=db, user_id=current_user.id, document_id=agreement.document_id)
    logger.info(f"User {current_user.email} agreed to document ID: {agreement.document_id}")
    return new_agreement


# ==============================================================================
# ROUTES POUR LA GESTION DES DOCUMENTS D'AGENT (RAG) - AVEC PGVECTOR SEUL
# ==============================================================================

# Utilise AgentResponse et AgentDocumentCreate directement
@app.post("/scan", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
async def add_agent_document(
    doc_data: AgentDocumentCreate,
    db: Session = Depends(get_db),
    current_admin: UserResponse = Depends(get_current_admin_user) # Dépendance pour vérifier si l'utilisateur est admin
):
    # Utilisation de la fonction d'embedding importée
    document_embedding = get_embedding(doc_data.content)
    if not document_embedding:
        logger.error("Failed to generate embedding for the document content.")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate embedding for the document content.")
    
    # Vérification de la dimension de l'embedding
    if len(document_embedding) != VECTOR_DIMENSION:
         logger.error(f"Embedding dimension mismatch for document: expected {VECTOR_DIMENSION}, got {len(document_embedding)}.")
         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Embedding dimension mismatch: expected {VECTOR_DIMENSION}, got {len(document_embedding)}. Please check your embedding model configuration.")

    # Utilisation de l'alias AgentDocumentModel
    db_document = AgentDocumentModel(
        title=doc_data.title,
        content=doc_data.content,
        source=doc_data.source,
        embedding=document_embedding
    )
    
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    logger.info(f"Agent document added successfully: Title='{doc_data.title}', Source='{doc_data.source}'")
    # Retourne le schéma AgentResponse
    return AgentResponse(id=db_document.id, title=db_document.title, source=db_document.source, content_preview=db_document.content[:50] + "...")

# Utilise AgentDocumentResponse directement
@app.get("/agent-documents/{document_id}", response_model=AgentDocumentResponse)
async def get_agent_document(document_id: int, db: Session = Depends(get_db)):
    # Utilisation de l'alias AgentDocumentModel et de la fonction CRUD importée
    doc = db.query(AgentDocumentModel).filter(AgentDocumentModel.id == document_id).first()
    if not doc:
        logger.warning(f"Agent document not found for ID: {document_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    
    # Retourne le schéma AgentDocumentResponse
    return AgentDocumentResponse(
        id=doc.id,
        title=doc.title,
        content=doc.content,
        source=doc.source,
        created_at=doc.created_at,
        updated_at=doc.updated_at
    )

# Utilise AgentQuery et AgentResponse directement
@app.post("/ask", response_model=AgentResponse)
async def ask_agent(query_data: AgentQuery, db: Session = Depends(get_db)):
    # Utilisation de la fonction d'embedding importée
    query_embedding = get_embedding(query_data.query)
    if not query_embedding:
        logger.error("Failed to generate embedding for the user query.")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate embedding for the query.")

    try:
        # Recherche de documents similaires en utilisant la fonction d'embedding stockée
        similar_documents = (
            db.query(AgentDocumentModel)
            # Assurez-vous que .embedding.cosine_distance est une méthode valide pour votre configuration de pgvector/SQLAlchemy
            .order_by(AgentDocumentModel.embedding.cosine_distance(query_embedding))
            .limit(query_data.top_k) # 'top_k' doit être une propriété de AgentQuery
            .all()
        )
    except Exception as e:
        logger.error(f"Error during similarity search: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error during similarity search in database.")

    if not similar_documents:
        logger.info(f"No similar documents found for query: '{query_data.query}'")
        return AgentResponse(response="Aucune information pertinente trouvée.")

    # Construction du contexte pour le modèle LLM
    context_text = "\n\n".join([f"Source: {doc.source}\nContent: {doc.content}" for doc in similar_documents])
    
    prompt = (
        f"Utilise les informations suivantes pour répondre à la question :\n\n"
        f"Contexte:\n{context_text}\n\n"
        f"Question: {query_data.query}\n\n"
        f"Réponse:"
    )
    logger.info(f"Asking LLM with prompt (first 100 chars): {prompt[:100]}...")

    # Appel à la fonction LLM importée
    llm_response = get_llm_response(prompt)

    return AgentResponse(response=llm_response)