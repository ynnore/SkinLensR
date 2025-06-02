# services/sentiment_analyzer.py
import os
import vertexai
from vertexai.generative_models import GenerativeModel, Part
import json

# Les variables PROJECT_ID et LOCATION seront initialisées dans app.py
# et vertexai.init() sera appelé là-bas.
# On suppose ici que vertexai a déjà été initialisé.

# Récupérer l'ID du modèle depuis les variables d'environnement ou une valeur par défaut
SENTIMENT_MODEL_ID = os.environ.get('SENTIMENT_MODEL_ID', 'gemini-1.5-flash-001') # ou le modèle que vous préférez pour le sentiment

def analyze_chat_sentiment(chat_message: str, user_id: str = "unknown_user"):
    """
    Analyse le sentiment d'un message de chat en utilisant un modèle Gemini via Vertex AI.
    Assurez-vous que vertexai.init() a été appelé au préalable.
    """
    try:
        # Utiliser un modèle spécifique pour l'analyse de sentiment si différent
        # ou le même que le chat si vous préférez.
        # Pour cet exemple, on peut utiliser un modèle configuré pour le sentiment.
        sentiment_model = GenerativeModel(SENTIMENT_MODEL_ID)

        prompt_text = f"""
        Contexte : Vous êtes un analyseur de sentiment expert.
        Message de l'utilisateur (ID: {user_id}):
        "{chat_message}"

        Tâche : Classez le sentiment principal de ce message comme étant "Positif", "Négatif", ou "Neutre".
        Répondez UNIQUEMENT au format JSON suivant, sans aucun texte explicatif avant ou après le JSON :
        {{
          "sentiment_label": "..."
        }}
        """

        # Envoyer la requête au modèle Gemini
        response = sentiment_model.generate_content(
            contents=[prompt_text], # Gemini prend une liste de "contents"
            generation_config={
                "temperature": 0.1,  # Très bas pour des réponses factuelles/classifications
                "max_output_tokens": 64, # Suffisant pour le JSON de sentiment
                "response_mime_type": "application/json", # Demander une réponse JSON
                # Le schema de réponse aide le modèle à structurer sa sortie
                 "response_schema": {
                    "type": "object",
                    "properties": {"sentiment_label": {"type": "string", "enum": ["Positif", "Négatif", "Neutre"]}},
                    "required": ["sentiment_label"]
                }
            }
        )

        if response.candidates and response.candidates[0].content.parts:
            # La réponse devrait déjà être une chaîne JSON parsable grâce à response_mime_type et response_schema
            # et la manière dont Gemini traite cela.
            raw_json_response_text = response.candidates[0].content.parts[0].text
            try:
                # Le texte est déjà censé être un JSON valide
                sentiment_data = json.loads(raw_json_response_text)
                if "sentiment_label" in sentiment_data:
                    return sentiment_data # Retourne le dict {'sentiment_label': '...'}
                else:
                    print(f"Clé 'sentiment_label' manquante dans la réponse JSON: {sentiment_data}")
                    return {"error": "Sentiment label missing in AI response", "raw_response": raw_json_response_text}
            except json.JSONDecodeError as e:
                print(f"Erreur de décodage JSON pour l'analyse de sentiment: {e}")
                print(f"Réponse brute reçue: {raw_json_response_text}")
                return {"error": "Failed to decode AI sentiment response", "raw_response": raw_json_response_text}
        else:
            print(f"Réponse inattendue ou vide de Gemini pour l'analyse de sentiment. Réponse: {response}")
            return {"error": "No valid sentiment response from AI"}

    except Exception as e:
        print(f"Une erreur est survenue lors de l'appel à Vertex AI Gemini pour le sentiment: {e}")
        # Loggez l'erreur complète avec le logger de l'app si possible
        # from flask import current_app
        # current_app.logger.error(f"Sentiment analysis error: {e}", exc_info=True)
        return {"error": f"General error during sentiment analysis: {str(e)}"}