# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime, timezone
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import uuid

import app.chroma_setup
import app.auth
import app.crud
import app.schemas
from app.database import get_db, engine
from app.models.base import Base
from app.models.legal_document import LegalDocument
from app.models.user_legal_agreement import UserLegalAgreement
from app.models.agent_document import AgentDocument, VECTOR_DIMENSION
from app.embeddings import get_embedding, get_llm_response

# --- Variables globales pour le client et la collection ChromaDB ---
chroma_client_instance: Optional[chromadb.PersistentClient] = None
chroma_collection_instance: Optional[chromadb.Collection] = None

# --- Utilitaires de Base de Données ---
def create_tables():
    Base.metadata.create_all(bind=engine)

# --- Gestionnaire de contexte pour le cycle de vie de l'application ---
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    global chroma_client_instance, chroma_collection_instance

    print("Application démarre...")
    create_tables()
    print("Base de données relationnelle initialisée (tables créées).")

    chroma_client_instance = app.chroma_setup.get_chroma_client()
    if chroma_client_instance:
        print("Client ChromaDB initialisé avec succès.")
        try:
            collection_name = "agent_documents"
            chroma_collection_instance = chroma_client_instance.get_or_create_collection(collection_name)
            print(f"Collection ChromaDB '{collection_name}' prête.")
            app.state.chroma_collection = chroma_collection_instance
        except Exception as e:
            print(f"Erreur lors de la préparation de la collection ChromaDB '{collection_name}' : {e}")
            chroma_collection_instance = None
            app.state.chroma_collection = None
    else:
        print("Échec de l'initialisation du client ChromaDB. Les fonctionnalités IA pourraient ne pas fonctionner.")
        app.state.chroma_collection = None

    yield

    print("Application s'arrête...")

# --- Initialisation de l'application FastAPI ---
app = FastAPI(
    title="Kiwi-ops Backend API",
    description="API pour la gestion stratégique, l'authentification, les documents légaux et les agents IA de Kiwi-ops.",
    version="0.1.0",
    lifespan=lifespan
)

# --- Configuration CORS ---
origins = [
    "http://localhost:3000",
    "https://kiwi-ops.com",
    "https://www.kiwi-ops.com",
    "https://api.kiwi-ops.com",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Schéma de sécurité OAuth2 ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Dépendances d'Authentification ---
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
    return schemas.UserResponse(id=user.id, email=user.email, role=user.role)

async def get_current_admin_user(current_user: schemas.UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions (Admin required)"
        )
    return current_user

# --- Dépendance pour obtenir le client ChromaDB ---
def get_chroma_client() -> chromadb.PersistentClient:
    if chroma_client_instance is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="ChromaDB client is not initialized.")
    return chroma_client_instance

# --- Dépendance pour obtenir la collection ChromaDB ---
def get_chroma_collection() -> chromadb.Collection:
    collection = getattr(app.state, "chroma_collection", None)
    if collection is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="ChromaDB collection is not available.")
    return collection

# --- Routes de l'API ---

@app.get("/")
async def read_root():
    return {"message": "Welcome to Kiwi-ops Backend! Mission Control Online."}

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "Kiwi-ops Backend"}

# --- Routes pour les Documents Légaux ---
@app.post("/legal-documents/", response_model=schemas.LegalDocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_legal_document(
    doc: schemas.LegalDocumentCreate,
    db: Session = Depends(get_db),
    current_admin: schemas.UserResponse = Depends(get_current_admin_user)
):
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
    documents = db.query(auth.LegalDocument).all()
    if type:
        documents = [d for d in documents if d.type == type]
    if language:
        documents = [d for d in documents if d.language == language]
    return documents

@app.get("/legal-documents/latest", response_model=schemas.LegalDocumentResponse)
async def get_latest_legal_document(doc_type: str, lang: str, db: Session = Depends(get_db)):
    doc = crud.get_latest_legal_document(db, doc_type, lang)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Latest legal document not found")
    return doc

@app.post("/user-agreements/", response_model=schemas.UserLegalAgreementResponse, status_code=status.HTTP_201_CREATED)
async def record_user_agreement(
    agreement: schemas.UserLegalAgreementCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    doc = db.query(auth.LegalDocument).filter(auth.LegalDocument.id == agreement.document_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Legal document not found")
    return crud.record_user_agreement(db=db, user_id=current_user.id, document_id=agreement.document_id)

# --- Routes d'Authentification ---
@app.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    return crud.create_user(db=db, user=user, hashed_password=hashed_password)

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
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

@app.get("/users/me/", response_model=schemas.UserResponse)
async def read_users_me(current_user: schemas.UserResponse = Depends(get_current_user)):
    return current_user

# --- Routes pour les Documents d'Agent (RAG) ---
@app.post("/agent-documents/", response_model=schemas.AgentDocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_agent_document_and_embedding(
    doc_data: schemas.AgentDocumentCreate,
    db: Session = Depends(get_db),
    current_admin: schemas.UserResponse = Depends(get_current_admin_user),
    chroma_collection: chromadb.Collection = Depends(get_chroma_collection)
):
    embedding = get_embedding(doc_data.content)
    if not embedding:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate embedding for the document.")
    
    if len(embedding) != VECTOR_DIMENSION:
         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Embedding dimension mismatch: expected {VECTOR_DIMENSION}, got {len(embedding)}. Please check your embedding model configuration.")

    db_document = AgentDocument(
        title=doc_data.title,
        content=doc_data.content,
        source=doc_data.source,
        embedding=embedding
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)

    chroma_doc_id = str(db_document.id) 
    
    try:
        print(f"Ajout de l'embedding pour le document ID {chroma_doc_id} à ChromaDB.")
        chroma_collection.add(
            embeddings=[embedding],
            documents=[doc_data.content],
            metadatas=[{"db_id": chroma_doc_id, "title": doc_data.title, "source": doc_data.source}],
            ids=[chroma_doc_id]
        )
        print(f"Document {chroma_doc_id} ajouté avec succès à ChromaDB.")
    except Exception as e:
        print(f"Erreur lors de l'ajout du document {chroma_doc_id} à ChromaDB : {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to add document to vector store.")

    return db_document

@app.get("/agent-documents/{document_id}", response_model=schemas.AgentDocumentResponse)
async def get_agent_document(document_id: int, db: Session = Depends(get_get_db)):
    document = db.query(AgentDocument).filter(AgentDocument.id == document_id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent document not found")
    return document

@app.post("/scan", response_model=schemas.AgentResponse)
async def scan_agent(query_data: schemas.AgentQuery, db: Session = Depends(get_db)), chroma_collection: chromadb.Collection = Depends(get_chroma_collection)):
    query_embedding = get_embedding(query_data.query)
    if not query_embedding:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate embedding for the query.")

    similar_documents = (
        db.query(AgentDocument)
        .order_by(AgentDocument.embedding.cosine_distance(query_embedding))
        .limit(query_data.top_k)
        .all()
    )

    if not similar_documents:
        return {"response": "Désolé, je n'ai trouvé aucune information pertinente dans ma base de connaissances."}

    context_text = "\n\n".join([doc.content for doc in similar_documents])

    prompt = (
        f"Utilise les informations suivantes pour répondre à la question :\n\n"
        f"Contexte:\n{context_text}\n\n"
        f"Question: {query_data.query}\n\n"
        f"Réponse:"
    )

    llm_response = get_llm_response(prompt)

    return {"response": llm_response}