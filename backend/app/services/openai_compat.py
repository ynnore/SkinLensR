# /home/manik/skinlensr/SkinLensR/backend/app/services/openai_compat.py

import os
import uuid
from typing import List, Dict, Any, Optional, Union, Iterator
from openai import OpenAI # Assurez-vous d'avoir installé la librairie 'openai'
# Si vous ciblez des modèles locaux avec des API compatibles OpenAI,
# il faut souvent spécifier le base_url et d'autres configurations.
# Exemple: client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama") pour Ollama

# Si vous utilisez des modèles locaux via `transformers` et que vous voulez les exposer
# comme une API compatible OpenAI, vous devrez avoir un serveur web (comme FastAPI/Uvicorn)
# qui utilise `huggingface.py` ou votre logique LLM personnalisée et expose une API.
# Ce fichier `openai_compat.py` servirait alors d'interface pour appeler CETTE API locale.

# --- Classe d'Interface Unifiée ---

class OpenAICompatibleLLM:
    """
    Gère les interactions avec des LLM, que ce soit via l'API OpenAI officielle
    ou via des API compatibles OpenAI (locales ou autres fournisseurs).
    """

    def __init__(self,
                 api_key: Optional[str] = None,
                 base_url: Optional[str] = None,
                 model_name: str = "gpt-3.5-turbo", # Modèle par défaut
                 default_params: Optional[Dict[str, Any]] = None):
        """
        Initialise l'interface LLM compatible.

        Args:
            api_key (Optional[str]): La clé API pour les services externes. Peut être lue depuis l'environnement.
            base_url (Optional[str]): L'URL de base pour les API non-OpenAI (ex: pour Ollama, LM Studio).
                                      Si None, utilise l'URL par défaut d'OpenAI.
            model_name (str): Le nom du modèle à utiliser par défaut.
            default_params (Optional[Dict[str, Any]]): Paramètres par défaut pour les appels LLM
                                                       (ex: temperature, max_tokens).
        """
        self.api_key = api_key if api_key else os.environ.get("OPENAI_API_KEY")
        self.base_url = base_url
        self.model_name = model_name
        self.default_params = default_params if default_params else {
            "temperature": 0.7,
            "max_tokens": 150,
            "top_p": 0.9,
            "stream": False # Par défaut, pas de streaming
        }

        # Initialiser le client OpenAI. S'adapte automatiquement si base_url est fourni.
        try:
            self.client = OpenAI(
                api_key=self.api_key,
                base_url=self.base_url,
                # Si vous utilisez un modèle local qui n'est pas sur la liste des modèles officiels OpenAI,
                # il peut être nécessaire d'ajouter une configuration pour que le client OpenAI reconnaisse ces modèles.
                # La librairie `openai` récente peut gérer cela plus dynamiquement.
            )
            print(f"LLM Client initialized. Base URL: {self.client.base_url}, Model: {self.model_name}")
        except Exception as e:
            print(f"Error initializing OpenAI client: {e}")
            self.client = None # Le client n'a pas pu être initialisé

    def _get_client(self) -> Optional[OpenAI]:
        """Retourne le client OpenAI initialisé, ou None si l'initialisation a échoué."""
        if not self.client:
            print("Error: LLM client is not initialized.")
        return self.client

    def _prepare_chat_completion_params(self,
                                        prompt: str,
                                        model: Optional[str] = None,
                                        messages: Optional[List[Dict[str, str]]] = None,
                                        stream: Optional[bool] = None,
                                        **kwargs) -> Dict[str, Any]:
        """
        Prépare les paramètres pour l'appel à `client.chat.completions.create`.
        Gère la conversion d'un simple prompt en format de messages chat.
        """
        if model is None:
            model = self.model_name

        # Si un historique de messages est fourni (format OpenAI chat), l'utiliser.
        # Sinon, convertir un simple prompt en un message utilisateur.
        chat_messages = messages if messages is not None else [
            {"role": "user", "content": prompt}
        ]

        # Fusionner les paramètres par défaut avec les paramètres spécifiques de l'appel
        params = {
            "model": model,
            "messages": chat_messages,
            "stream": stream if stream is not None else self.default_params.get("stream", False),
            **self.default_params, # Les paramètres par défaut sont écrasés par ceux spécifiés
            **kwargs
        }
        return params

    def _prepare_embedding_params(self,
                                  input_texts: Union[str, List[str]],
                                  model: Optional[str] = None,
                                  **kwargs) -> Dict[str, Any]:
        """Prépare les paramètres pour l'appel à `client.embeddings.create`."""
        if model is None:
            model = "text-embedding-ada-002" # Modèle d'embedding OpenAI par défaut

        params = {
            "model": model,
            "input": input_texts,
            **kwargs
        }
        return params

    async def generate_text_completion(self,
                                       prompt: str,
                                       model: Optional[str] = None,
                                       messages: Optional[List[Dict[str, str]]] = None,
                                       stream: Optional[bool] = None,
                                       **kwargs) -> Union[str, Iterator[str]]:
        """
        Génère du texte via l'API Chat Completions.
        Peut retourner une chaîne de caractères ou un générateur de texte en streaming.

        Args:
            prompt (str): Le prompt textuel si `messages` n'est pas fourni.
            model (Optional[str]): Le modèle à utiliser. Si None, utilise celui par défaut.
            messages (Optional[List[Dict[str, str]]]): Un historique de messages au format OpenAI.
                                                      Si fourni, le `prompt` seul est ignoré.
            stream (Optional[bool]): Activer ou désactiver le mode streaming. Si None, utilise la valeur par défaut.
            **kwargs: Paramètres supplémentaires pour l'appel API (ex: temperature, max_tokens).

        Returns:
            Union[str, Iterator[str]]: La réponse du LLM ou un flux de tokens.
        """
        client = self._get_client()
        if not client:
            return "LLM client not available."

        params = self._prepare_chat_completion_params(
            prompt=prompt,
            model=model,
            messages=messages,
            stream=stream,
            **kwargs
        )

        try:
            if params["stream"]:
                # Gestion du streaming : retourner un générateur
                response_stream = client.chat.completions.create(**params)
                
                async def stream_generator():
                    full_response = ""
                    for chunk in response_stream:
                        if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
                            content = chunk.choices[0].delta.content
                            full_response += content
                            yield content
                    # Après la fin du stream, vous pouvez stocker la réponse complète si nécessaire
                    # print(f"Full streamed response: {full_response}")
                
                return stream_generator()
            else:
                # Gestion de la réponse non-streamée
                response = client.chat.completions.create(**params)
                if response.choices and response.choices[0].message and response.choices[0].message.content:
                    return response.choices[0].message.content.strip()
                else:
                    print(f"Warning: Received empty response from LLM. Response object: {response}")
                    return "LLM did not return a valid response."

        except Exception as e:
            print(f"Error during LLM completion: {e}")
            return f"Error during LLM completion: {e}"

    async def get_embeddings(self,
                           input_texts: Union[str, List[str]],
                           model: Optional[str] = None,
                           **kwargs) -> List[List[float]]:
        """
        Génère des embeddings pour un texte ou une liste de textes.

        Args:
            input_texts (Union[str, List[str]]): Le texte ou la liste de textes à vectoriser.
            model (Optional[str]): Le modèle d'embedding à utiliser. Si None, utilise le défaut.
            **kwargs: Paramètres supplémentaires pour l'appel API.

        Returns:
            List[List[float]]: La liste des embeddings.
        """
        client = self._get_client()
        if not client:
            return []

        params = self._prepare_embedding_params(input_texts, model, **kwargs)

        try:
            response = client.embeddings.create(**params)
            # Les embeddings sont généralement dans response.data[i].embedding
            if response.data:
                embeddings = [item.embedding for item in response.data]
                return embeddings
            else:
                print(f"Warning: Received empty embedding response. Response object: {response}")
                return []
        except Exception as e:
            print(f"Error generating embeddings: {e}")
            return []

    # --- Fonctions d'aide supplémentaires ---

    def get_default_model(self) -> str:
        """Retourne le nom du modèle LLM par défaut."""
        return self.model_name

    def get_default_params(self) -> Dict[str, Any]:
        """Retourne les paramètres par défaut pour les appels LLM."""
        return self.default_params

# --- Exemple d'Utilisation ---
# Ce bloc `if __name__ == "__main__":` est pour tester le service directement.

if __name__ == "__main__":
    import asyncio
    import os

    async def test_llm_service():
        # --- Configuration ---
        # Pour tester avec l'API OpenAI réelle, assurez-vous que la clé API est dans votre environnement
        # ou passez-la explicitement.
        # export OPENAI_API_KEY='your-api-key'

        # Pour tester avec un modèle local (ex: Ollama) :
        # Assurez-vous qu'Ollama est installé et en cours d'exécution, et que vous avez téléchargé un modèle
        # Exemple : ollama run llama2
        # Configurez le base_url pour pointer vers votre serveur Ollama
        # LOCAL_OLLAMA_BASE_URL = "http://localhost:11434/v1"
        # LOCAL_OLLAMA_API_KEY = "ollama" # Clé API arbitraire pour Ollama

        # --- Test avec OpenAI (si la clé API est configurée) ---
        if os.environ.get("OPENAI_API_KEY"):
            print("--- Testing with OpenAI API ---")
            openai_service = OpenAICompatibleLLM(
                model_name="gpt-3.5-turbo", # Ou "gpt-4" si vous y avez accès
                default_params={"temperature": 0.7, "max_tokens": 100}
            )

            # Test de génération de texte (non-stream)
            print("\nTesting text generation (non-stream)...")
            prompt = "What is the capital of France?"
            response_text = await openai_service.generate_text_completion(prompt=prompt)
            print(f"Prompt: {prompt}")
            print(f"Response: {response_text}")

            # Test de génération de texte (stream)
            print("\nTesting text generation (stream)...")
            prompt_stream = "Explain the concept of recursion in programming."
            response_stream = await openai_service.generate_text_completion(
                prompt=prompt_stream,
                stream=True,
                temperature=0.8,
                max_tokens=200
            )
            print(f"Prompt: {prompt_stream}")
            print("Streaming response:")
            full_streamed_response = ""
            if isinstance(response_stream, Iterator):
                async for chunk in response_stream:
                    print(chunk, end="", flush=True)
                    full_streamed_response += chunk
            print("\n--- End of stream ---")

            # Test des embeddings
            print("\nTesting embeddings...")
            texts_to_embed = ["This is the first sentence.", "This is the second sentence."]
            embeddings = await openai_service.get_embeddings(texts_to_embed)
            print(f"Generated {len(embeddings)} embeddings. Shape of first: {len(embeddings[0]) if embeddings else 0}")

        else:
            print("Skipping OpenAI API tests: OPENAI_API_KEY environment variable not set.")

        # --- Test avec un modèle local compatible OpenAI (Ex: Ollama) ---
        # Décommentez et adaptez si vous avez Ollama en cours d'exécution
        # print("\n--- Testing with Local Ollama API ---")
        # try:
        #     local_llm_service = OpenAICompatibleLLM(
        #         base_url=LOCAL_OLLAMA_BASE_URL,
        #         api_key=LOCAL_OLLAMA_API_KEY,
        #         model_name="llama2" # Assurez-vous que ce modèle est téléchargé sur Ollama
        #     )
        #
        #     # Test de génération de texte (non-stream) depuis Ollama
        #     print("\nTesting local text generation (non-stream)...")
        #     local_prompt = "Write a short poem about a cat."
        #     local_response = await local_llm_service.generate_text_completion(local_prompt, max_tokens=50)
        #     print(f"Prompt: {local_prompt}")
        #     print(f"Response: {local_response}")
        #
        #     # Test des embeddings depuis Ollama (si le modèle supporte les embeddings)
        #     # Not all models in Ollama support embeddings via the OpenAI compatible API. Check Ollama docs.
        #     # print("\nTesting local embeddings...")
        #     # local_texts = ["Hello world", "Testing embeddings"]
        #     # local_embeddings = await local_llm_service.get_embeddings(local_texts)
        #     # print(f"Generated {len(local_embeddings)} local embeddings.")
        #
        # except Exception as e:
        #     print(f"Error during local LLM tests: {e}. Make sure Ollama is running and the model is downloaded.")

    asyncio.run(test_llm_service())