# agent.py

import ollama

# LA LIGNE INUTILE A ÉTÉ SUPPRIMÉE

def chat_with_gemma(prompt_text):
    """
    Cette fonction prend un prompt et retourne la réponse de gemma3.
    """
    try:
        response = ollama.chat(
            model='gemma3',
            messages=[
                {
                    'role': 'user',
                    'content': prompt_text,
                },
            ]
        )
        return response['message']['content']
    except Exception as e:
        print(f"Erreur dans chat_with_gemma: {e}")
        return "Désolé, une erreur est survenue lors de la communication avec l'IA."