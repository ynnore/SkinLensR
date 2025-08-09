import logging
import ollama

logger = logging.getLogger(__name__)

def chat_with_gemma(prompt_text: str) -> str:
    """
    Envoie un prompt au modèle gemma3 via Ollama et retourne la réponse.
    """
    try:
        response = ollama.chat(
            model='gemma3',
            messages=[{'role': 'user', 'content': prompt_text}]
        )
        # Accès sécurisé à la réponse
        return response.get('message', {}).get('content', '')
    except Exception as e:
        logger.error(f"Erreur dans chat_with_gemma: {e}", exc_info=True)
        return "Désolé, une erreur est survenue lors de la communication avec l'IA."
