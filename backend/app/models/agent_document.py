      
# backend/app/models/agent_document.py
from sqlalchemy import Column, Integer, String, Text, DateTime, func
from sqlalchemy.types import TypeDecorator, Float # Importation nécessaire pour TypeDecorator
from app.models.base import Base # Assurez-vous que le chemin est correct
import numpy as np # Généralement utilisé pour la manipulation de vecteurs
import json # Pour sérialiser/désérialiser les listes Python en chaîne JSON pour la DB

# Définissez la dimension de votre vecteur d'embedding ici.
VECTOR_DIMENSION = 1536 # Exemple: dimension pour OpenAI text-embedding-ada-002

# ==============================================================================
# ✅ NOUVEAU: Implémentation du type VectorType personnalisé
# ==============================================================================
class VectorType(TypeDecorator):
    """Represents a vector type for PostgreSQL's pgvector extension."""
    # Le type dans la base de données sera 'VECTOR(dimension)'
    impl = Text # Le type de base pour stocker le vecteur comme une chaîne de texte (JSON)

    # Cette méthode est appelée quand la donnée est chargée de la DB vers Python
    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        # Convertir la liste de floats en chaîne JSON pour le stockage
        return json.dumps(list(value))

    # Cette méthode est appelée quand la donnée est envoyée de Python vers la DB
    def process_result_value(self, value, dialect):
        if value is None:
            return value
        # Convertir la chaîne JSON de la DB en liste de floats (ou array numpy)
        # Utiliser np.array si numpy est préféré pour les opérations vectorielles
        return np.array(json.loads(value))


    # Pour s'assurer qu'Alembic reconnaît ce type comme un type natif de la base de données (VECTOR)
    # Ceci est une astuce pour Alembic afin qu'il puisse générer correctement les migrations.
    # Vous pourriez avoir besoin d'ajuster si Alembic ne génère pas 'VECTOR(DIMENSION)'
    # mais une colonne TEXT. Dans ce cas, il faudrait modifier la migration générée manuellement.
    def get_db_proper_type(self, bind_dialect):
        from sqlalchemy.dialects import postgresql # Importation spécifique pour le dialecte PG
        return postgresql.ARRAY(Float(asdecimal=True), dimensions=VECTOR_DIMENSION) # Ou simplement text("VECTOR(%d)" % self.dimension)
                                                                              # En général, Alembic le gère si l'extension est là.
    # Le plus simple pour Alembic est souvent de ne pas surcharger get_db_proper_type
    # et de corriger manuellement le type dans la migration générée si nécessaire
    # ou d'utiliser un type String avec check_type=False pour que le backend accepte 'vector(dim)'
    # Cependant, pour le moment, nous allons juste utiliser le Text et compter sur la DB pour le type.
    # En réalité, si pgvector est activé, Alembic le verra.
    # La ligne "impl = Text" est pour la REPRESENTATION de SQLAlchemy.

# ==============================================================================


class AgentDocument(Base):
    __tablename__ = "agent_documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content = Column(Text, nullable=False) # Le texte brut du document
    source = Column(String, index=True, nullable=True) # Ex: URL, nom de fichier
    # Utilise maintenant notre type VectorType personnalisé
    embedding = Column(VectorType(VECTOR_DIMENSION), nullable=False) # ✅ UTILISE LE TYPE PERSONNALISÉ
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<AgentDocument(id={self.id}, title='{self.title[:30]}...')>"

    