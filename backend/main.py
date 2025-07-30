# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime, timezone # Importez datetime et timezone
from typing import List, Optional, AsyncGenerator, Dict, Any # Importez Dict et Any pour les types généraux
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import uuid # Pour générer des IDs uniques

# Assurez-vous que les chemins d'importation sont corrects pour votre structure de projet
from app.database import get_db, engine
from app.models.base import Base
from app import schemas, crud, auth
from app.models.legal_document import LegalDocument
from app.models.user_legal_agreement import UserLegalAgreement
from app.models.agent_document import AgentDocument, VECTOR_DIMENSION
from app.embeddings import get_embedding

# --- Importation du module de configuration ChromaDB ---
import app.chroma_setup # Assurez-vous que le chemin est correct pour votre projet

# --- Global pour le client ChromaDB ---
# Stocker l'instance du client ChromaDB pour qu'elle soit accessible via lifespan et les dépendances.
# Il est préférable de gérer les ressources globales de manière plus sophistiquée,
# mais pour ce cas, une variable globale est acceptable.
chroma_client_instance: Optional[chromadb.PersistentClient] = None
chroma_collection_instance: Optional[chromadb.Collection] = None


# --- Utilitaires de Base de Données ---
def create_tables():
    Base.metadata.create_all(bind=engine)

# --- Gestionnaire de contexte pour le cycle de vie de l'application ---
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    global chroma_client_instance, chroma_collection_instance # Accès aux variables globales

    print("Application démarre...")
    create_tables()
    print("Base de données relationnelle initialisée (tables créées).")

    # --- Initialisation de ChromaDB ---
    chroma_client_instance = chroma_setup.get_chroma_client()
    if chroma_client_instance:
        print("Client ChromaDB initialisé avec succès.")
        try:
            # Obtenir ou créer la collection principale pour les documents d'agent
            collection_name = "agent_documents"
            chroma_collection_instance = chroma_client_instance.get_or_create_collection(collection_name)
            print(f"Collection ChromaDB '{collection_name}' prête.")
            # Stocker la collection dans l'état de l'application pour un accès facile
            app.state.chroma_collection = chroma_collection_instance
        except Exception as e:
            print(f"Erreur lors de la préparation de la collection ChromaDB '{collection_name}' : {e}")
            # Si la collection ne peut pas être créée/obtenue, les fonctionnalités IA seront limitées
            chroma_collection_instance = None # Assurez-vous que l'instance est nulle en cas d'erreur
            app.state.chroma_collection = None
    else:
        print("Échec de l'initialisation du client ChromaDB. Les fonctionnalités IA pourraient ne pas fonctionner.")
        app.state.chroma_collection = None


    yield # L'application commence à traiter les requêtes ici

    # Logique d'arrêt
    print("Application s'arrête...")
    # Il n'y a généralement pas de méthode close() explicite pour PersistentClient,
    # car il gère la persistance sur disque/GCS.
    # Si vous aviez un client client.HttpClient, vous pourriez appeler client.close()


# --- Initialisation de l'application FastAPI ---
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
    # Retourner un schéma pour la réponse, pas le modèle ORM brut
    return schemas.UserResponse(id=user.id, email=user.email, role=user.role)


async def get_current_admin_user(current_user: schemas.UserResponse = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions (Admin required)"
        )
    return current_user

# --- Dépendance pour obtenir le client ChromaDB ---
# Cette dépendance retourne l'instance du client initialisée dans le lifespan
def get_chroma_client() -> chromadb.PersistentClient:
    if chroma_client_instance is None:
        raise HTTPException(status_code=503, detail="ChromaDB client is not initialized.")
    return chroma_client_instance

# --- Dépendance pour obtenir la collection ChromaDB ---
# Utilise app.state pour accéder à la collection initialisée dans le lifespan
def get_chroma_collection(
    # Si vous avez besoin d'injecter le client pour des opérations spécifiques à la collection
    # chroma_client: chromadb.PersistentClient = Depends(get_chroma_client)
) -> chromadb.Collection:
    
    # Accéder à la collection stockée dans app.state
    collection = getattr(app.state, "chroma_collection", None)
    
    if collection is None:
        raise HTTPException(status_code=503, detail="ChromaDB collection is not available.")
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
    query = db.query(LegalDocument)
    if type:
        query = query.filter(LegalDocument.type == type)
    if language:
        query = query.filter(LegalDocument.language == language)
    
    documents = query.all()
    return documents

@app.get("/legal-documents/latest", response_model=schemas.LegalDocumentResponse)
async def get_latest_legal_document(doc_type: str, lang: str, db: Session = Depends(get_db)):
    doc = crud.get_latest_legal_document(db, doc_type, lang)
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Latest legal document not found")
    return doc

# --- Routes pour les Accords Utilisateurs ---
@app.post("/user-agreements/", response_model=schemas.UserLegalAgreementResponse, status_code=status.HTTP_201_CREATED)
async def record_user_agreement(
    agreement: schemas.UserLegalAgreementCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    db_document = db.query(LegalDocument).filter(LegalDocument.id == agreement.document_id).first()
    if not db_document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Legal document not found")

    existing_agreement = crud.get_user_agreements_for_document(db, current_user.id, agreement.document_id)

    if existing_agreement:
        if not existing_agreement.is_latest_version_agreed:
            existing_agreement.agreed_at = datetime.utcnow()
            existing_agreement.is_latest_version_agreed = True
            db.commit()
            db.refresh(existing_agreement)
            return existing_agreement
        else:
            return existing_agreement
    else:
        return crud.record_user_agreement(db=db, user_id=current_user.id, document_id=agreement.document_id)

@app.get("/users/me/agreements/", response_model=List[schemas.UserLegalAgreementResponse])
async def get_my_agreements(
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(get_current_user)
):
    agreements = crud.get_all_agreements_by_user(db, current_user.id)
    return agreements

# --- Routes pour les Documents d'Agent (RAG) ---
@app.post("/agent-documents/", response_model=schemas.AgentDocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_agent_document_and_embedding(
    doc_data: schemas.AgentDocumentCreate,
    db: Session = Depends(get_db),
    current_admin: schemas.UserResponse = Depends(get_current_admin_user),
    chroma_collection: chromadb.Collection = Depends(get_chroma_collection) # Injecter la collection ChromaDB
):
    # 1. Générer l'embedding
    embedding = get_embedding(doc_data.content)
    if not embedding:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate embedding for the document.")
    
    if len(embedding) != VECTOR_DIMENSION:
         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Embedding dimension mismatch: expected {VECTOR_DIMENSION}, got {len(embedding)}. Please check your embedding model configuration.")

    # 2. Créer l'entrée dans la base de données relationnelle (SQL)
    # Note: Assurez-vous que votre modèle AgentDocument a une référence ou une façon de lier
    # l'entrée SQL avec l'entrée ChromaDB, par exemple via un champ 'chroma_id' ou en stockant l'ID ChromaDB dans les métadonnées SQL.
    # Ici, je crée d'abord en SQL, puis je récupère l'ID pour l'utiliser dans ChromaDB.
    
    # --- Création dans PostgreSQL ---
    db_document = AgentDocument(
        title=doc_data.title,
        content=doc_data.content,
        source=doc_data.source,
        embedding=embedding # Stocker l'embedding dans PostgreSQL (car vous utilisez pgvector)
        # Si vous ne stockez plus l'embedding dans PostgreSQL, retirez cette ligne.
        # Si vous stockez le texte et les métadonnées en SQL, et l'embedding SEULEMENT dans ChromaDB,
        # il faudrait modifier le modèle AgentDocument pour ne pas avoir la colonne 'embedding'.
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document) # Rafraîchit l'objet pour obtenir l'ID et les timestamps

    # 3. Ajouter l'embedding à ChromaDB
    # Utiliser l'ID du document SQL comme ID pour ChromaDB, ou un UUID séparé si préférable.
    # Il faut que l'ID soit un string.
    chroma_doc_id = str(db_document.id) 
    
    try:
        print(f"Ajout de l'embedding pour le document ID {chroma_doc_id} à ChromaDB.")
        chroma_collection.add(
            embeddings=[embedding], # L'embedding généré
            documents=[doc_data.content], # Le contenu du document (pour la recherche de texte)
            metadatas=[{"db_id": chroma_doc_id, "title": doc_data.title, "source": doc_data.source}], # Stocker des métadonnées utiles
            ids=[chroma_doc_id] # L'ID unique pour ChromaDB
        )
        print(f"Document {chroma_doc_id} ajouté avec succès à ChromaDB.")
    except Exception as e:
        print(f"Erreur lors de l'ajout du document {chroma_doc_id} à ChromaDB : {e}")
        # Gérer l'erreur : peut-être supprimer le document de la base de données SQL s'il est crucial que les deux soient synchronisés.
        # Ou simplement logger l'erreur et continuer.
        raise HTTPException(status_code=500, detail="Failed to add document to vector store.")

    # Retourner le document créé dans la base de données SQL
    return db_document

@app.get("/agent-documents/{document_id}", response_model=schemas.AgentDocumentResponse)
async def get_agent_document(document_id: int, db: Session = Depends(get_db)):
    document = db.query(AgentDocument).filter(AgentDocument.id == document_id).first()
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent document not found")
    return document

# --- Route pour la recherche RAG ---
# Exemple de route pour une recherche simple dans ChromaDB
@app.post("/agent-search/", response_model=List[Dict[str, Any]]) # Retourne une liste de résultats
async def search_agent_documents(
    query_text: str, # Le texte de la requête de l'utilisateur
    db: Session = Depends(get_db), # Pour récupérer des métadonnées liées
    chroma_collection: chromadb.Collection = Depends(get_chroma_collection) # La collection ChromaDB
):
    if not query_text:
        raise HTTPException(status_code=400, detail="Query text cannot be empty.")

    # 1. Générer l'embedding de la requête de l'utilisateur
    query_embedding = get_embedding(query_text)
    if not query_embedding:
        raise HTTPException(status_code=500, detail="Failed to generate embedding for the query.")

    # 2. Interroger ChromaDB pour trouver les documents les plus similaires
    try:
        # Utilisez .query() pour rechercher des documents similaires à l'embedding de la requête
        # where={"title": "some_title"} ou where_document={"$contains":"text"} pour des filtres.
        # here we are just querying by embedding similarity.
        results = chroma_collection.query(
            query_embeddings=[query_embedding],
            n_results=5, # Nombre de résultats à retourner
            # include=['documents', 'metadatas', 'distances'] # Spécifiez ce que vous voulez récupérer
            include=['documents', 'metadatas', 'distances']
        )
        print(f"ChromaDB query results: {results}")

        # 3. Formater et retourner les résultats
        # Les résultats de ChromaDB sont généralement des listes imbriquées,
        # donc il faut les aplatir pour une réponse plus propre.
        formatted_results = []
        if results and results.get('ids') and results['ids'][0]:
            for i in range(len(results['ids'][0])):
                doc_id_chroma = results['ids'][0][i]
                doc_content = results['documents'][0][i]
                metadata = results['metadatas'][0][i]
                distance = results['distances'][0][i]

                # Vous pouvez récupérer plus d'informations depuis la base de données SQL
                # en utilisant le 'db_id' stocké dans les métadonnées si nécessaire.
                # Par exemple :
                # db_doc = db.query(AgentDocument).filter(AgentDocument.id == int(metadata.get('db_id'))).first()
                # if db_doc: ...

                formatted_results.append({
                    "id": doc_id_chroma,
                    "content": doc_content,
                    "metadata": metadata,
                    "distance": distance,
                    # "db_id_linked": metadata.get('db_id') # L'ID du document dans votre DB SQL
                })
        
        return formatted_results

    except Exception as e:
        print(f"Erreur lors de la recherche dans ChromaDB : {e}")
        raise HTTPException(status_code=500, detail="Failed to perform search in vector store.")