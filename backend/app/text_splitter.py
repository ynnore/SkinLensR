# /home/manik/skinlensr/SkinLensR/backend/app/text_splitter.py
"""
Ce module fournit des utilitaires pour découper des textes longs en chunks gérables.
Ceci est particulièrement utile pour le traitement de documents dans le cadre du RAG.
"""

from typing import List
# LangChain offre des outils robustes pour découper les textes.
# Installez-le : pip install langchain-text-splitters
from langchain_text_splitters import RecursiveCharacterTextSplitter

# --- Configuration ---
# Définir la taille des chunks et le chevauchement entre eux.
# Ces valeurs peuvent être ajustées en fonction des modèles et des documents.
DEFAULT_CHUNK_SIZE = 1000  # Nombre de caractères par chunk
DEFAULT_CHUNK_OVERLAP = 200 # Nombre de caractères de chevauchement entre chunks

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
        
        # Initialiser le découpeur avec les paramètres spécifiés.
        # LangChain offre plusieurs stratégies, RecursiveCharacterTextSplitter est un bon choix général.
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            length_function=len, # Fonction pour mesurer la longueur des chunks
            add_start_index=True # Ajouter l'index de début pour le contexte
        )
        logger.info(f"DocumentSplitter initialized with chunk_size={self.chunk_size}, chunk_overlap={self.chunk_overlap}")

    def split_document(self, document_content: str, source_info: Optional[str] = None) -> List[str]:
        """
        Découpe le contenu d'un document en une liste de chunks.
        
        Args:
            document_content (str): Le texte complet du document.
            source_info (Optional[str]): Informations sur la source du document (ex: nom de fichier).

        Returns:
            List[str]: Une liste de chaînes de caractères, où chaque chaîne est un chunk.
        """
        if not document_content:
            logger.warning("Attempted to split empty document content.")
            return []
            
        logger.info(f"Splitting document (content length: {len(document_content)}) into chunks...")
        
        try:
            # Utiliser le découpeur pour diviser le texte.
            # LangChain retourne des objets 'Document' qui contiennent le texte et les métadonnées.
            # Pour simplifier ici, nous retournons juste le texte des chunks.
            chunks = self.text_splitter.split_text(document_content)
            
            # Si vous avez besoin d'inclure des métadonnées avec chaque chunk (ex: source_info)
            # Il faudrait adapter la sortie ou ajouter les métadonnées ici si le splitter ne le fait pas.
            # Exemple si vous retournez des objets Document de LangChain :
            # documents = self.text_splitter.create_documents([document_content], metadatas=[{"source": source_info}])
            # chunks = [doc.page_content for doc in documents]

            logger.info(f"Document split into {len(chunks)} chunks.")
            return chunks
            
        except Exception as e:
            logger.error(f"Error splitting document: {e}")
            return []

# --- Exemple d'Utilisation ---
# Ce bloc s'exécute uniquement si le script est lancé directement.

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
    """ * 50 # Répéter le texte pour créer un contenu long

    # Instancier le découpeur de texte
    splitter = DocumentSplitter(chunk_size=200, chunk_overlap=50)

    # Découper le document
    document_chunks = splitter.split_document(long_text, source_info="example_document.txt")

    # Afficher les premiers chunks
    print(f"Generated {len(document_chunks)} chunks.")
    for i, chunk in enumerate(document_chunks[:3]): # Afficher les 3 premiers chunks
        print(f"--- Chunk {i+1} ---\n{chunk}\n")