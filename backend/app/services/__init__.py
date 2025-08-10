# /home/manik/skinlensr/SkinLensR/backend/app/services/__init__.py

# Expose les classes principales des services pour un accès simplifié.

try:
    from .chat_service import ChatService
    from .agentic import Agent  # Assurez-vous que la classe principale s'appelle Agent
    from .huggingface import HuggingFaceService
    from .memory_manager import MemoryManager
    from .openai_compatible_llm import OpenAICompatibleLLM # <-- CORRIGÉ pour utiliser le bon nom
# ...
    from .rag import RAGService

    # Vous pouvez également exposer des classes ou fonctions utilitaires spécifiques si elles sont souvent utilisées directement
    # from .utils import some_utility_function

    # Il est bon de définir __all__ pour indiquer quelles sont les entités publiques du package.
    # Cela améliore la clarté et le comportement avec `from app.services import *` (même si ce dernier est moins recommandé).
    __all__ = [
        "ChatService",
        "Agent",
        "HuggingFaceService",
        "MemoryManager",
        "OpenAICompatibleLLM",
        "RAGService",
        # "some_utility_function", # Si vous en exposez
    ]

except ImportError as e:
    # Gérer le cas où certains services ne seraient pas encore implémentés ou correctement placés.
    print(f"Warning: Could not import all services. Missing module or class: {e}")
    # Vous pourriez vouloir définir les classes importées jusqu'à présent dans __all__
    # pour éviter des erreurs si l'importation partielle réussit.
    # C'est une gestion d'erreur basique, pour une application robuste, une meilleure gestion des dépendances
    # ou une vérification plus poussée pourrait être nécessaire.
    __all__ = []
    # En fonction de la gravité de l'échec, vous pourriez vouloir relancer l'exception
    # ou définir des classes stub pour permettre à d'autres parties du code de fonctionner
    # même si un service spécifique n'est pas prêt.