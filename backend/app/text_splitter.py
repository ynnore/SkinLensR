# /home/manik/skinlensr/SkinLensR/backend/app/text_splitter.py

"""
Ce module fournit des utilitaires pour découper des textes longs en chunks gérables.
Ceci est particulièrement utile pour le traitement de documents dans le cadre du RAG.
"""

from typing import List, Optional, Dict, Any # <-- Assurez-vous que ces types sont bien importés
# LangChain offre des outils robustes pour découper les textes.
# Installez-le : pip install langchain-text-splitters
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Importez également logging si vous l'utilisez (comme dans les exemples précédents)
import logging

# --- Configuration ---
# Définir la taille des chunks et le chevauchement entre eux.
# Ces valeurs peuvent être ajustées en fonction des modèles et des documents.
DEFAULT_CHUNK_SIZE = 1000  # Nombre de caractères par chunk
DEFAULT_CHUNK_OVERLAP = 200 # Nombre de caractères de chevauchement entre chunks

logger = logging.getLogger(__name__) # Déclaration du logger

class DocumentSplitter:
    """
    Un service pour découper des documents en chunks utilisables pour le RAG.
    """
    def __init__(self, chunk_size: int = DEFAULT_CHUNK_SIZE, chunk_overlap: int = DEFAULT_CHUNK_OVERLAP):
        """
        Initialise le découpeur de texte.
        
        Args:
            chunk_size (int): La taille approximative de chaque chunk.
            chunk_overlap (int): Le nombre de caractères de chevauchement entre les chunks consécutifs.
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        
        try:
            self.text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=self.chunk_size,
                chunk_overlap=self.chunk_overlap,
                length_function=len,
                add_start_index=True
            )
            logger.info(f"DocumentSplitter initialized with chunk_size={self.chunk_size}, chunk_overlap={self.chunk_overlap}")
        except Exception as e:
            logger.error(f"Error initializing RecursiveCharacterTextSplitter: {e}")
            self.text_splitter = None 

    def split_document(self, document_content: str, source_info: Optional[str] = None) -> List[str]:
        """
        Découpe le contenu d'un document en une liste de chunks.
        
        Args:
            document_content (str): Le texte complet du document.
            source_info (Optional[str]): Informations sur la source du document (ex: nom de fichier).

        Returns:
            List[str]: Une liste de chaînes de caractères, où chaque chaîne est un chunk.
        """
        if not self.text_splitter:
            logger.error("Text splitter not initialized. Cannot split document.")
            return []
            
        if not document_content:
            logger.warning("Attempted to split empty document content.")
            return []
            
        logger.info(f"Splitting document (content length: {len(document_content)}) into chunks...")
        
        try:
            chunks = self.text_splitter.split_text(document_content)
            logger.info(f"Document split into {len(chunks)} chunks.")
            return chunks
            
        except Exception as e:
            logger.error(f"Error splitting document: {e}")
            return []

# --- Exemple d'Utilisation ---
if __name__ == "__main__":
    # Exemple de texte long
    long_text = """
    This is the first sentence.
    This is the second sentence.
    This is the third sentence.
    This is the fourth sentence.
    This is the fifth sentence.
    This is the sixth sentence.
    This is the seventh sentence.
    This is the eighth sentence.
    This is the ninth sentence.
    This is the tenth sentence.
    This is the eleventh sentence.
    This is the twelfth sentence.
    This is the thirteenth sentence.
    This is the fourteenth sentence.
    This is the fifteenth sentence.
    This is the sixteenth sentence.
    This is the seventeenth sentence.
    This is the eighteenth sentence.
    This is the nineteenth sentence.
    This is the twentieth sentence.
    This is the twenty-first sentence.
    This is the twenty-second sentence.
    This is the twenty-third sentence.
    This is the twenty-fourth sentence.
    This is the twenty-fifth sentence.
    This is the twenty-sixth sentence.
    This is the twenty-seventh sentence.
    This is the twenty-eighth sentence.
    This is the twenty-ninth sentence.
    This is the thirtieth sentence.
    """ * 50 

    # Instancier le découpeur de texte
    splitter = DocumentSplitter(chunk_size=200, chunk_overlap=50)

    # Découper le document
    document_chunks = splitter.split_document(long_text, source_info="example_document.txt")

    # Afficher les premiers chunks
    print(f"Generated {len(document_chunks)} chunks.")
    for i, chunk in enumerate(document_chunks[:3]): 
        print(f"--- Chunk {i+1} ---\n{chunk}\n")