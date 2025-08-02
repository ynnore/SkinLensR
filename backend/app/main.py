# backend/main.py
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

from app.embeddings import get_embedding, get_llm_response
from app.models.agent_document import AgentDocument
from app.models.agent_document import VECTOR_DIMENSION
from app.auth import router as auth_router  # ← importe ton router ici

app = FastAPI()

# Monte les routes
app.include_router(auth_router)
# --- Utilitaires de Base de Données ---
def create_tables():
    Base.metadata.create_all(bind=engine)

# Gestionnaire de contexte pour le cycle de vie de l'application
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    print("Application démarre...")
    # Utilisez l'engine pour create_all(), pas get_db()
    Base.metadata.create_all(bind=engine)
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
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schéma de sécurité OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dépendances d'Authentification
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

    # DEBUGGING
    print(f"DEBUG in get_current_user: Token Payload: {payload}")
    print(f"DEBUG in get_current_user: User from DB - Email: {user.email}, Role: {user.role}")

    # Retourner un schéma pour la réponse, pas le modèle ORM brut
    return schemas.UserResponse(id=user.id, email=user.email, role=user.role)


async def get_current_admin_user(current_user: schemas.UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions (Admin required)"
        )
    return current_user

# --- ROUTES ---

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
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    print(f"DEBUG in login_for_access_token: User logging in - Email: {user.email}, Role: {user.role}")
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
    # Assurez-vous que 'LegalDocument' est importé depuis app.models.legal_document
    documents = db.query(LegalDocument).all() # Utilisation correcte du modèle importé
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
    # Assurez-vous que 'LegalDocument' est importé depuis app.models.legal_document
    doc = db.query(LegalDocument).filter(LegalDocument.id == agreement.document_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Legal document not found")

    # Assurez-vous que 'UserLegalAgreement' est importé depuis app.models.user_legal_agreement
    # Exemple de logique pour marquer les anciens accords (commenté pour la simplicité)
    # existing_agreements = db.query(UserLegalAgreement).filter(UserLegalAgreement.user_id == current_user.id).all()
    # for ag in existing_agreements:
    #     if ag.document.type == doc.type:
    #         ag.is_latest_version_agreed = False
    # db.commit()

    return crud.record_user_agreement(db=db, user_id=current_user.id, document_id=agreement.document_id)


# ==============================================================================
# ROUTES POUR LA GESTION DES DOCUMENTS D'AGENT (RAG) - AVEC PGVECTOR SEUL
# ==============================================================================

@app.post("/agent-documents/", response_model=schemas.AgentDocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_agent_document_and_embedding(
    doc_data: schemas.AgentDocumentCreate,
    db: Session = Depends(get_db),
    current_admin: schemas.UserResponse = Depends(get_current_admin_user)
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
        embedding=embedding # Stocker l'embedding dans PostgreSQL (via pgvector)
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

@app.get("/agent-documents/{document_id}", response_model=schemas.AgentDocumentResponse)
async def get_agent_document(document_id: int, db: Session = Depends(get_db)):
    doc = db.query(AgentDocument).filter(AgentDocument.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return doc

@app.post("/ask", response_model=schemas.AgentResponse)
async def ask_agent(query_data: schemas.AgentQuery, db: Session = Depends(get_db)):
    query_embedding = get_embedding(query_data.query)
    if not query_embedding:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate embedding for the query.")

    # Recherche de similarité directement dans PostgreSQL avec pgvector
    similar_documents = (
        db.query(AgentDocument)
        .order_by(AgentDocument.embedding.cosine_distance(query_embedding))
        .limit(query_data.top_k)
        .all()
    )

    if not similar_documents:
        return {"response": "Aucune information pertinente trouvée."}

    context_text = "\n\n".join([doc.content for doc in similar_documents])
    prompt = (
        f"Utilise les informations suivantes pour répondre à la question :\n\n"
        f"Contexte:\n{context_text}\n\n"
        f"Question: {query_data.query}\n\n"
        f"Réponse:"
    )

    llm_response = get_llm_response(prompt)

    return {"response": llm_response}