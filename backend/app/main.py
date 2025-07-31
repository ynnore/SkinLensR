from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, AsyncGenerator, List
import uuid
import chromadb
import logging

# Modules internes
import app.chroma_setup
import app.auth as auth
import app.crud as crud
import app.schemas as schemas
from app.database import get_db
from app.models.base import Base
from app.models.legal_document import LegalDocument
from app.models.user_legal_agreement import UserLegalAgreement
from app.models.agent_document import AgentDocument, VECTOR_DIMENSION
from app.embeddings import get_embedding, get_llm_response

# Configurer le logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Variables globales
chroma_client_instance: Optional[chromadb.PersistentClient] = None
chroma_collection_instance: Optional[chromadb.Collection] = None

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    global chroma_client_instance, chroma_collection_instance

    try:
        Base.metadata.create_all(bind=get_db().get_bind())
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
    
    try:
        chroma_client_instance = app.chroma_setup.get_chroma_client()
        if chroma_client_instance:
            chroma_collection_instance = chroma_client_instance.get_or_create_collection("agent_documents")
            app.state.chroma_collection = chroma_collection_instance
            logger.info("ChromaDB initialized successfully.")
        else:
            app.state.chroma_collection = None
            logger.warning("ChromaDB client could not be initialized.")
    except Exception as e:
        logger.error(f"ChromaDB init error: {e}")
        chroma_collection_instance = None
        app.state.chroma_collection = None

    yield

# FastAPI app
app = FastAPI(
    title="Kiwi-ops Backend API",
    description="API pour gestion utilisateurs, documents et IA RAG.",
    version="0.1.0",
    lifespan=lifespan
)

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://kiwi-ops.com",
        "https://www.kiwi-ops.com",
        "https://api.kiwi-ops.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dépendances
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = auth.decode_access_token(token)
    if not payload or not (email := payload.get("sub")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user = crud.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return schemas.UserResponse(id=user.id, email=user.email, role=user.role)

async def get_current_admin_user(current_user: schemas.UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

def get_chroma_client() -> chromadb.PersistentClient:
    if not chroma_client_instance:
        raise HTTPException(status_code=503, detail="ChromaDB not initialized")
    return chroma_client_instance

def get_chroma_collection() -> chromadb.Collection:
    collection = getattr(app.state, "chroma_collection", None)
    if not collection:
        raise HTTPException(status_code=503, detail="ChromaDB collection not available")
    return collection

# --- ROUTES ---

@app.get("/")
async def read_root():
    return {"message": "Kiwi-ops Backend is live"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/register", response_model=schemas.UserResponse, status_code=201)
async def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_email(db, user.email):
        raise HTTPException(400, detail="Email already registered")
    hashed = auth.get_password_hash(user.password)
    logger.info(f"Creating user with email: {user.email}")
    return crud.create_user(db, user, hashed)

@app.post("/token", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(401, detail="Invalid login")

    access_token = auth.create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    logger.info(f"User {form_data.username} logged in successfully.")
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.UserResponse)
async def me(current_user: schemas.UserResponse = Depends(get_current_user)):
    return current_user

@app.post("/legal-documents", response_model=schemas.LegalDocumentResponse, status_code=201)
async def create_legal(doc: schemas.LegalDocumentCreate, db: Session = Depends(get_db), _: schemas.UserResponse = Depends(get_current_admin_user)):
    if crud.get_legal_document(db, doc.type, doc.language, doc.version):
        raise HTTPException(400, "Document version already exists")
    logger.info(f"Creating legal document: {doc.type}, version: {doc.version}")
    return crud.create_legal_document(db, doc)

@app.get("/legal-documents", response_model=List[schemas.LegalDocumentResponse])
async def list_legals(type: Optional[str] = None, language: Optional[str] = None, db: Session = Depends(get_db)):
    docs = db.query(LegalDocument).all()
    return [d for d in docs if (not type or d.type == type) and (not language or d.language == language)]

@app.post("/user-agreements", response_model=schemas.UserLegalAgreementResponse, status_code=201)
async def record_agreement(agreement: schemas.UserLegalAgreementCreate, db: Session = Depends(get_db), current_user: schemas.UserResponse = Depends(get_current_user)):
    doc = db.query(LegalDocument).filter(LegalDocument.id == agreement.document_id).first()
    if not doc:
        raise HTTPException(404, "Legal document not found")
    return crud.record_user_agreement(db, current_user.id, agreement.document_id)

@app.post("/agent-documents", response_model=schemas.AgentDocumentResponse, status_code=201)
async def create_agent_doc(doc_data: schemas.AgentDocumentCreate, db: Session = Depends(get_db), _: schemas.UserResponse = Depends(get_current_admin_user), chroma: chromadb.Collection = Depends(get_chroma_collection)):
    embedding = get_embedding(doc_data.content)
    if not embedding or len(embedding) != VECTOR_DIMENSION:
        raise HTTPException(500, "Embedding error or dimension mismatch")
    
    agent_doc = AgentDocument(title=doc_data.title, content=doc_data.content, source=doc_data.source, embedding=embedding)
    db.add(agent_doc)
    db.commit()
    db.refresh(agent_doc)

    chroma.add(
        embeddings=[embedding],
        documents=[doc_data.content],
        metadatas=[{"db_id": str(agent_doc.id), "title": doc_data.title}],
        ids=[str(agent_doc.id)]
    )

    logger.info(f"Created agent document: {doc_data.title}")
    return agent_doc

@app.get("/agent-documents/{document_id}", response_model=schemas.AgentDocumentResponse)
async def get_agent_doc(document_id: int, db: Session = Depends(get_db)):
    doc = db.query(AgentDocument).filter(AgentDocument.id == document_id).first()
    if not doc:
        raise HTTPException(404, "Document not found")
    return doc

@app.post("/scan", response_model=schemas.AgentResponse)
async def scan(query_data: schemas.AgentQuery, db: Session = Depends(get_db), chroma: chromadb.Collection = Depends(get_chroma_collection)):
    embedding = get_embedding(query_data.query)
    if not embedding:
        raise HTTPException(500, "Failed to embed query")

    docs = (
        db.query(AgentDocument)
        .order_by(AgentDocument.embedding.cosine_distance(embedding))
        .limit(query_data.top_k)
        .all()
    )

    if not docs:
        return {"response": "Aucune info pertinente trouvée."}

    context = "\n\n".join(doc.content for doc in docs)
    prompt = f"Contexte:\n{context}\n\nQuestion: {query_data.query}\n\nRéponse:"
    response = get_llm_response(prompt)

    return {"response": response}