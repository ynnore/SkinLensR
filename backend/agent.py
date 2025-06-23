# agent.py (version corrigée)

import ollama

def chat_with_gemma(prompt_text):
    """
    Cette fonction prend un prompt et retourne la réponse de gemma3.
    C'est la seule chose dont main.py a besoin.
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
        # On retourne directement la réponse texte
        return response['message']['content']
    except Exception as e:
        print(f"Erreur dans chat_with_gemma: {e}")
        return "Désolé, une erreur est survenue lors de la communication avec l'IA."

# On crée une instance de la fonction pour que main.py puisse l'importer
# sous le nom "chat_agent". Ici, on va simplifier et on importera directement
# la fonction. Nous allons adapter main.py pour ça.