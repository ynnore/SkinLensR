from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List, Optional, AsyncGenerator
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.database import get_db, engine
from app.models.base import Base
import logging

# --- Logging Configuration ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Imports ---
# Base de données
from database import get_db, engine
from app.models.base import Base

# Schémas Pydantic
from app.schemas.schemas import (
    UserCreate, LegalDocumentCreate, UserLegalAgreementCreate, UserResponse, Token, AgentDocumentCreate, AgentResponse, 
    LegalDocumentResponse,
    UserLegalAgreementResponse, # <-- AJOUTÉ ICI
    AgentDocumentResponse # <-- AJOUTÉ ICI
)

# Fonctions CRUD
from app.crud import (
    get_user_by_email, create_user, get_legal_document, create_legal_document, get_latest_legal_document, record_user_agreement,
    get_agent_document, create_agent_document
)

# Routeur d'authentification
from app.auth import router as auth_router

# Fonctions d'embeddings et LLM
from app.embeddings import get_embedding, get_llm_response

# Modèles ORM SQLAlchemy
from app.models.user import User as UserModel
from app.models.legal_document import LegalDocument as LegalDocumentModel
from app.models.user_legal_agreement import UserLegalAgreement as UserLegalAgreementModel
from app.models.agent_document import AgentDocument as AgentDocumentModel, VECTOR_DIMENSION

# --- Gestionnaire de contexte pour le cycle de vie de l'application ---
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("Application démarre...")
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Base de données initialisée (tables créées).")
    except Exception as e:
        logger.error(f"Erreur lors de l'initialisation de la base de données: {e}")
        raise

    yield
    logger.info("Application s'arrête...")

# --- Initialisation FastAPI ---
app = FastAPI(
    title="Kiwi-ops Backend API",
    description="API pour la gestion stratégique, l'authentification, les documents légaux et les agents IA de Kiwi-ops.",
    version="0.1.0",
    lifespan=lifespan
)

# --- Configuration CORS ---
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Inclusion des Routeurs ---
app.include_router(auth_router, prefix="/auth")

# --- Schéma de sécurité OAuth2 ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

# --- Dépendances d'Authentification ---
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> UserResponse:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = auth.decode_access_token(token)
    if payload is None:
        logger.warning("Token decoding failed.")
        raise credentials_exception
    email: str = payload.get("sub")
    if email is None:
        logger.warning("Token payload missing 'sub' (email).")
        raise credentials_exception

    user = get_user_by_email(db, email=email)
    if user is None:
        logger.warning(f"User not found in DB for email: {email}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    logger.debug(f"User authenticated: {user.email}")
    return UserResponse(id=user.id, email=user.email, role=user.role)

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

@app.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        logger.warning(f"Attempt to register with existing email: {user.email}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = create_user(db=db, user_data=user, hashed_password=hashed_password)
    logger.info(f"User registered successfully: {user.email}")
    return new_user

@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        logger.warning(f"Login failed for username: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    logger.info(f"User logged in: {user.email}")
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

@app.get("/users/me/", response_model=UserResponse)
async def read_users_me(current_user: UserResponse = Depends(get_current_user)):
    logger.debug(f"Accessing /users/me/ for user: {current_user.email}")
    return current_user

@app.post("/scan", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
async def add_agent_document(
    doc_data: AgentDocumentCreate,
    db: Session = Depends(get_db),
    current_admin: UserResponse = Depends(get_current_admin_user)
):
    document_embedding = get_embedding(doc_data.content)
    if not document_embedding:
        logger.error("Failed to generate embedding for the document content.")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate embedding for the document content.")
    
    if len(document_embedding) != VECTOR_DIMENSION:
         logger.error(f"Embedding dimension mismatch for document: expected {VECTOR_DIMENSION}, got {len(document_embedding)}.")
         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Embedding dimension mismatch: expected {VECTOR_DIMENSION}, got {len(document_embedding)}. Please check your embedding model configuration.")

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
    return AgentResponse(id=db_document.id, title=db_document.title, source=db_document.source, content_preview=db_document.content[:50] + "...")

@app.get("/agent-documents/{document_id}", response_model=AgentDocumentResponse)
async def get_agent_document(document_id: int, db: Session = Depends(get_db)):
    doc = db.query(AgentDocumentModel).filter(AgentDocumentModel.id == document_id).first()
    if not doc:
        logger.warning(f"Agent document not found for ID: {document_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    
    return AgentDocumentResponse(
        id=doc.id,
        title=doc.title,
        content=doc.content,
        source=doc.source,
        created_at=doc.created_at,
        updated_at=doc.updated_at
    )
