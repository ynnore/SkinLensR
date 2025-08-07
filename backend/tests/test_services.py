import pytest
from app.services.legal_documents import create_legal_document  # Assurez-vous d'importer la bonne fonction
from app.models.legal_document import LegalDocument
from app.database import SessionLocal  # Utilisez la session locale pour les tests

# Initialisation de la session de test
@pytest.fixture
def db_session():
    # Crée une session de base de données pour les tests
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def test_create_legal_document(db_session):
    # Test de la création d'un document légal
    type = "Contrat"
    version = "v1.0"
    language = "fr"
    content = "Voici le contenu du document légal."
    
    new_document = create_legal_document(db_session, type, version, language, content)
    
    assert new_document is not None
    assert new_document.type == type
    assert new_document.version == version
    assert new_document.language == language
    assert new_document.content == content

# Ajouter d'autres tests selon les services définis dans `app/services/`
