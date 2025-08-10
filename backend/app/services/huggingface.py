# /home/manik/skinlensr/SkinLensR/backend/app/services/huggingface.py

import os
from typing import List, Dict, Any, Optional, Union, Tuple
from transformers import (
    pipeline,
    AutoModelForCausalLM,
    AutoTokenizer,
    AutoModel,
    AutoModelForSequenceClassification,
    AutoModelForTokenClassification,
    AutoModelForQuestionAnswering,
    GenerationConfig
)
# Supposons que vous utilisez PyTorch ou TensorFlow. PyTorch est plus courant avec transformers.
import torch

# Importations hypothétiques pour les embeddings si vous utilisez Sentence-Transformers
# from sentence_transformers import SentenceTransformer

# --- Classes et Fonctions Utilitaires ---

class HuggingFaceService:
    """
    Service pour interagir avec les modèles et pipelines de Hugging Face.
    Permet de charger des modèles, des tokenizers, et d'exécuter des tâches NLP.
    """

    def __init__(self, cache_dir: Optional[str] = None):
        """
        Initialise le service Hugging Face.

        Args:
            cache_dir (Optional[str]): Répertoire pour mettre en cache les modèles téléchargés.
                                       Par défaut, utilise celui défini par HF (souvent ~/.cache/huggingface).
        """
        self.cache_dir = cache_dir
        if self.cache_dir:
            os.makedirs(self.cache_dir, exist_ok=True)
            print(f"Hugging Face cache directory set to: {self.cache_dir}")

        # Stocker les pipelines et modèles chargés pour réutilisation
        self.loaded_pipelines: Dict[str, Any] = {} # {task_model_name: pipeline_instance}
        self.loaded_models: Dict[str, Any] = {}    # {model_name: model_instance}
        self.loaded_tokenizers: Dict[str, Any] = {} # {model_name: tokenizer_instance}

        # Détecter automatiquement le device (GPU si disponible, sinon CPU)
        self.device = 0 if torch.cuda.is_available() else -1
        print(f"Using device: {'GPU' if self.device == 0 else 'CPU'}")

    def _get_model_name(self, model_name_or_path: str) -> str:
        """
        Récupère un nom de modèle simplifié pour les clés de cache internes.
        Ex: 'gpt2' au lieu de 'gpt2' ou 'path/to/local/gpt2'.
        """
        return os.path.basename(model_name_or_path)

    def _get_pipeline(self, task: str, model_name_or_path: str, device: int = None, **kwargs) -> Any:
        """
        Charge ou récupère un pipeline Hugging Face.

        Args:
            task (str): La tâche NLP (ex: 'text-generation', 'sentiment-analysis', 'feature-extraction').
            model_name_or_path (str): Nom du modèle sur Hugging Face Hub ou chemin local.
            device (int): Le périphérique sur lequel charger le modèle (0 pour GPU, -1 pour CPU).
                          Si None, utilise le périphérique par défaut du service.
            **kwargs: Arguments supplémentaires à passer à `transformers.pipeline`.

        Returns:
            Any: L'instance du pipeline chargé.
        """
        pipeline_key = f"{task}-{model_name_or_path}"
        if pipeline_key in self.loaded_pipelines:
            print(f"Returning cached pipeline for: {pipeline_key}")
            return self.loaded_pipelines[pipeline_key]

        print(f"Loading pipeline for task '{task}' with model '{model_name_or_path}'...")
        try:
            # Utiliser le device spécifié ou celui par défaut du service
            pipeline_device = device if device is not None else self.device

            # Gérer les arguments spécifiques aux pipelines (ex: task_specific_params pour text-generation)
            # Pour les modèles de génération, on peut configurer le GenerationConfig ici
            if task == "text-generation":
                kwargs.setdefault("generation_config", GenerationConfig(
                    max_new_tokens=50,
                    temperature=0.7,
                    top_p=0.9,
                    do_sample=True,
                    pad_token_id=50256 # GPT-2, par exemple
                ))
                # Si le modèle n'a pas de pad_token_id par défaut, on peut le définir via tokenizer
                if "tokenizer" not in kwargs and "pad_token_id" not in kwargs.get("generation_config", {}):
                    try:
                        tokenizer_key = self._get_model_name(model_name_or_path)
                        if tokenizer_key in self.loaded_tokenizers:
                            tokenizer = self.loaded_tokenizers[tokenizer_key]
                        else:
                            tokenizer = AutoTokenizer.from_pretrained(model_name_or_path, cache_dir=self.cache_dir)
                            self.loaded_tokenizers[tokenizer_key] = tokenizer
                        if tokenizer.pad_token is None:
                            tokenizer.pad_token = tokenizer.eos_token # Utiliser EOS comme pad token si pas défini
                        kwargs["tokenizer"] = tokenizer
                        kwargs.setdefault("generation_config", GenerationConfig()).pad_token_id = tokenizer.pad_token_id
                    except Exception as e:
                        print(f"Warning: Could not automatically set pad_token_id for {model_name_or_path}: {e}")


            pipe = pipeline(
                task,
                model=model_name_or_path,
                tokenizer=model_name_or_path, # Souvent, le tokenizer a le même nom/chemin que le modèle
                device=pipeline_device,
                cache_dir=self.cache_dir,
                **kwargs
            )

            self.loaded_pipelines[pipeline_key] = pipe
            print(f"Pipeline loaded successfully for: {pipeline_key}")
            return pipe
        except Exception as e:
            print(f"Error loading pipeline for task '{task}' and model '{model_name_or_path}': {e}")
            raise

    def _get_model_and_tokenizer(self, model_name_or_path: str, model_class: Any = AutoModel, tokenizer_class: Any = AutoTokenizer) -> Tuple[Any, Any]:
        """
        Charge ou récupère un modèle et son tokenizer.

        Args:
            model_name_or_path (str): Nom du modèle sur Hugging Face Hub ou chemin local.
            model_class (Any): La classe de modèle à utiliser (ex: AutoModelForCausalLM, AutoModel).
            tokenizer_class (Any): La classe de tokenizer à utiliser (ex: AutoTokenizer).

        Returns:
            Tuple[Any, Any]: Instance du modèle et instance du tokenizer.
        """
        model_key = self._get_model_name(model_name_or_path)

        if model_key in self.loaded_models and model_key in self.loaded_tokenizers:
            print(f"Returning cached model and tokenizer for: {model_key}")
            return self.loaded_models[model_key], self.loaded_tokenizers[model_key]

        print(f"Loading model '{model_name_or_path}' and tokenizer...")
        try:
            tokenizer = tokenizer_class.from_pretrained(model_name_or_path, cache_dir=self.cache_dir)
            # Assurez-vous que le pad_token est défini si nécessaire pour l'inférence batch ou la génération
            if tokenizer.pad_token is None:
                tokenizer.pad_token = tokenizer.eos_token # Common practice if no pad_token is set

            # Charger le modèle sur le bon périphérique
            model = model_class.from_pretrained(
                model_name_or_path,
                cache_dir=self.cache_dir,
                torch_dtype=torch.float16 if self.device == 0 else torch.float32, # Utiliser float16 sur GPU pour économiser la mémoire
                device_map="auto" if self.device == 0 else None # Laisse transformers gérer la distribution sur GPU
            )

            # Si device_map="auto" n'est pas utilisé (ex: CPU), mover explicitement le modèle
            if self.device != 0 and model is not None:
                 model.to(self.device) # Le device -1 sera interprété comme CPU par torch

            self.loaded_models[model_key] = model
            self.loaded_tokenizers[model_key] = tokenizer
            print(f"Model and tokenizer loaded successfully for: {model_key}")
            return model, tokenizer
        except Exception as e:
            print(f"Error loading model or tokenizer for '{model_name_or_path}': {e}")
            raise

    # --- Pipelines et Tâches Spécifiques ---

    def get_text_generator(self, model_name_or_path: str = "gpt2", **kwargs) -> Any:
        """
        Obtient un pipeline de génération de texte.
        Modèle par défaut : GPT-2. Vous pouvez le changer pour un modèle plus puissant comme `meta-llama/Llama-2-7b-chat-hf`.
        """
        # Exemple de génération de config, peut être passé via kwargs
        # kwargs.setdefault("generation_config", GenerationConfig(max_new_tokens=100))
        return self._get_pipeline("text-generation", model_name_or_path, **kwargs)

    def get_sentiment_analyzer(self, model_name_or_path: str = "distilbert-base-uncased-finetuned-sst-2-english", **kwargs) -> Any:
        """
        Obtient un pipeline d'analyse de sentiment.
        Modèle par défaut : distilbert-base-uncased-finetuned-sst-2-english.
        """
        return self._get_pipeline("sentiment-analysis", model_name_or_path, **kwargs)

    def get_feature_extractor(self, model_name_or_path: str = "sentence-transformers/all-MiniLM-L6-v2", **kwargs) -> Any:
        """
        Obtient un pipeline d'extraction de caractéristiques (embeddings).
        Modèle par défaut : sentence-transformers/all-MiniLM-L6-v2.
        """
        # Pour la tâche 'feature-extraction', le pipeline peut retourner des embeddings directement.
        # Note: Si vous utilisez SentenceTransformer, c'est souvent plus simple de l'utiliser directement.
        return self._get_pipeline("feature-extraction", model_name_or_path, **kwargs)

    def get_qa_pipeline(self, model_name_or_path: str = "distilbert-base-cased-distilled-squad", **kwargs) -> Any:
        """
        Obtient un pipeline de Question Answering.
        Modèle par défaut : distilbert-base-cased-distilled-squad.
        """
        return self._get_pipeline("question-answering", model_name_or_path, **kwargs)

    # --- Fonctions pour l'inférence directe (plus de contrôle) ---

    def get_embedding_model(self, model_name_or_path: str = "sentence-transformers/all-MiniLM-L6-v2", **kwargs) -> Any:
        """
        Charge un modèle spécifiquement pour générer des embeddings.
        Utilise AutoModel pour une flexibilité maximale.
        """
        # Ici, on pourrait utiliser SentenceTransformer si c'est le cas
        # if "sentence-transformers" in model_name_or_path:
        #     try:
        #         model_key = self._get_model_name(model_name_or_path)
        #         if model_key in self.loaded_models:
        #             return self.loaded_models[model_key]
        #         st_model = SentenceTransformer(model_name_or_path, cache_folder=self.cache_dir)
        #         self.loaded_models[model_key] = st_model
        #         return st_model
        #     except Exception as e:
        #         print(f"Error loading SentenceTransformer model {model_name_or_path}: {e}")
        #         raise
        
        # Sinon, on utilise AutoModel (qui peut être plus lent pour les embeddings que SBERT)
        model, tokenizer = self._get_model_and_tokenizer(
            model_name_or_path,
            model_class=AutoModel, # AutoModel pour les embeddings génériques
            tokenizer_class=AutoTokenizer,
            **kwargs
        )
        return model, tokenizer

    def get_causal_lm_model(self, model_name_or_path: str = "gpt2", **kwargs) -> Tuple[Any, Any]:
        """
        Charge un modèle Language Model Causal (pour la génération de texte).
        """
        model, tokenizer = self._get_model_and_tokenizer(
            model_name_or_path,
            model_class=AutoModelForCausalLM,
            tokenizer_class=AutoTokenizer,
            **kwargs
        )
        return model, tokenizer

    # --- Méthodes pour exécuter des tâches avec les modèles chargés ---

    async def generate_text(self, model_name_or_path: str, prompt: str, max_length: int = 150, **kwargs) -> str:
        """
        Génère du texte à partir d'un modèle causal LLM.

        Args:
            model_name_or_path (str): Le nom ou chemin du modèle LLM.
            prompt (str): Le texte d'entrée pour la génération.
            max_length (int): La longueur maximale du texte généré (incluant le prompt).
            **kwargs: Arguments supplémentaires pour la génération (ex: temperature, top_p).

        Returns:
            str: Le texte généré.
        """
        # Utiliser le pipeline pour une simplicité maximale
        generator = self.get_text_generator(model_name_or_path, **kwargs)
        
        # Préparer les arguments pour le pipeline
        pipeline_args = {
            "max_length": max_length,
            "pad_token_id": generator.tokenizer.pad_token_id if generator.tokenizer.pad_token_id is not None else 50256, # S'assurer que pad_token_id est géré
            "eos_token_id": generator.tokenizer.eos_token_id,
            **kwargs
        }
        # Si le prompt est long, il peut être tronqué. Une stratégie plus avancée pourrait être nécessaire.

        print(f"Generating text with model '{model_name_or_path}' for prompt: '{prompt[:100]}...'")
        try:
            # Le pipeline gère la tokenization et l'appel au modèle
            results = generator(prompt, **pipeline_args)
            # Le résultat est une liste de dictionnaires, souvent [{'generated_text': '...'}]
            if results and isinstance(results, list) and 'generated_text' in results[0]:
                generated_text = results[0]['generated_text']
                # Pour éviter de renvoyer le prompt dans la réponse si le LLM le répète
                if generated_text.startswith(prompt):
                    return generated_text[len(prompt):].strip()
                return generated_text.strip()
            else:
                print(f"Unexpected result format from text generation: {results}")
                return "Error: Could not generate text from model."
        except Exception as e:
            print(f"Error during text generation: {e}")
            return f"Error generating text: {e}"

    async def get_embeddings(self, texts: List[str], model_name_or_path: str = "sentence-transformers/all-MiniLM-L6-v2", **kwargs) -> List[List[float]]:
        """
        Génère des embeddings pour une liste de textes.

        Args:
            texts (List[str]): La liste des textes à vectoriser.
            model_name_or_path (str): Le nom ou chemin du modèle d'embedding.
            **kwargs: Arguments supplémentaires pour le modèle/pipeline.

        Returns:
            List[List[float]]: La liste des vecteurs d'embedding.
        """
        if not texts:
            return []

        # Utiliser le pipeline pour une simplicité maximale
        # Si vous utilisez SentenceTransformer, il est plus efficace de le charger directement une fois
        # et d'appeler `model.encode(texts)`

        try:
            # Option 1: Utiliser le pipeline 'feature-extraction'
            # extractor = self.get_feature_extractor(model_name_or_path, **kwargs)
            # embeddings_results = extractor(texts, **kwargs)
            # # Le format peut varier, il faut souvent moyenner les tokens pour obtenir un embedding de phrase
            # embeddings = [sum(emb)/len(emb) for emb in embeddings_results] # Simple moyenne des tokens

            # Option 2: Utiliser le modèle chargé directement (plus performant pour SBERT)
            # Pour cela, il faudrait charger le modèle avec get_embedding_model
            # Assurez-vous que model_name_or_path est bien reconnu par SentenceTransformer si vous utilisez cette approche
            
            # Exemple avec SentenceTransformer (si importé)
            # from sentence_transformers import SentenceTransformer
            # model_key = self._get_model_name(model_name_or_path)
            # model = self.loaded_models.get(model_key)
            # if not model or not isinstance(model, SentenceTransformer):
            #     model = self.get_embedding_model(model_name_or_path) # Charge le SBERT model

            # Si vous utilisez AutoModel, vous devez faire la tokenization et le passage au modèle manuellement.
            model_key = self._get_model_name(model_name_or_path)
            model, tokenizer = self.get_embedding_model(model_name_or_path, **kwargs)

            print(f"Encoding texts using model '{model_name_or_path}'...")
            
            # Tokenization
            encoded_inputs = tokenizer(
                texts,
                padding=True,
                truncation=True,
                return_tensors="pt", # Retourner des tenseurs PyTorch
                max_length=512 # Limite pour éviter les problèmes de mémoire/performance
            )

            # Déplacer les tenseurs sur le bon device
            device = torch.device("cuda" if self.device == 0 else "cpu")
            encoded_inputs = {key: val.to(device) for key, val in encoded_inputs.items()}

            # Passage au modèle pour obtenir les embeddings
            with torch.no_grad(): # Désactiver le calcul de gradient pour l'inférence
                model_output = model(**encoded_inputs)

            # Obtenir les embeddings : souvent le pooler_output ou une moyenne des token embeddings
            # Pour SentenceTransformers, c'est souvent le [CLS] token output ou une moyenne.
            # Si vous utilisez AutoModel, la sortie peut varier. Pour les modèles comme BERT/RoBERTa,
            # le CLS token output est souvent utilisé. `model.pooler_output` est commun si le modèle a un pooler.
            # Sinon, on peut faire une moyenne des embeddings des tokens.
            
            # Si le modèle a un pooler
            if hasattr(model_output, 'pooler_output') and model_output.pooler_output is not None:
                sentence_embeddings = model_output.pooler_output
            else:
                # Sinon, une moyenne simple des token embeddings (ignorer les tokens padding)
                # Il faut s'assurer que attention_mask est bien géré ici
                token_embeddings = model_output.last_hidden_state
                input_mask_expanded = encoded_inputs['attention_mask'].unsqueeze(-1).expand(token_embeddings.size()).float()
                sum_embeddings = torch.sum(token_embeddings * input_mask_expanded, 1)
                sum_mask = torch.clamp(input_mask_expanded.sum(1), min=1e-9) # Éviter la division par zéro
                sentence_embeddings = sum_embeddings / sum_mask

            # Déplacer les embeddings sur CPU et convertir en liste de listes de floats
            embeddings = sentence_embeddings.cpu().numpy().tolist()
            
            print(f"Generated {len(embeddings)} embeddings.")
            return embeddings

        except Exception as e:
            print(f"Error during embedding generation: {e}")
            raise # Renvoyer l'exception pour qu'elle soit gérée par l'appelant

    # --- Gestion des modèles et pipelines chargés ---

    def unload_pipeline(self, task: str, model_name_or_path: str):
        """Décharge un pipeline spécifique."""
        pipeline_key = f"{task}-{model_name_or_path}"
        if pipeline_key in self.loaded_pipelines:
            del self.loaded_pipelines[pipeline_key]
            print(f"Pipeline '{pipeline_key}' unloaded.")
            # Vous pourriez aussi vouloir libérer la mémoire GPU ici si nécessaire (ex: `del pipe; torch.cuda.empty_cache()`)

    def unload_model(self, model_name_or_path: str):
        """Décharge un modèle et son tokenizer."""
        model_key = self._get_model_name(model_name_or_path)
        if model_key in self.loaded_models:
            del self.loaded_models[model_key]
            print(f"Model '{model_key}' unloaded.")
        if model_key in self.loaded_tokenizers:
            del self.loaded_tokenizers[model_key]
            print(f"Tokenizer '{model_key}' unloaded.")
        # Libérer la mémoire GPU si elle a été utilisée
        if self.device == 0:
            torch.cuda.empty_cache()

# --- Exemple d'Utilisation ---
# Ce bloc `if __name__ == "__main__":` est pour tester le service directement.
# Dans votre application FastAPI, vous instancieriez ce service une seule fois
# et l'injecteriez dans vos routes ou services dépendants.

if __name__ == "__main__":
    import asyncio

    async def test_hf_service():
        # Crée une instance du service
        # Si vous avez un répertoire de cache spécifique, passez-le. Sinon, utilisez celui par défaut.
        hf_service = HuggingFaceService(cache_dir="./hf_models_cache") # Crée un dossier pour les modèles téléchargés

        # --- Test du Générateur de Texte ---
        print("\n--- Testing Text Generation ---")
        try:
            # Modèle petit pour un test rapide. Pour de meilleures performances, utilisez "meta-llama/Llama-2-7b-chat-hf" ou similaire.
            # Assurez-vous d'avoir les permissions si le modèle est privé.
            generator_model = "gpt2" # Ou "distilgpt2" pour un test encore plus rapide
            prompt_text = "In the future, AI will"
            generated_text = await hf_service.generate_text(generator_model, prompt_text, max_length=50)
            print(f"Prompt: {prompt_text}")
            print(f"Generated: {generated_text}")

            # Vous pouvez spécifier d'autres paramètres de génération
            generated_text_creative = await hf_service.generate_text(
                generator_model,
                prompt_text,
                max_length=70,
                temperature=0.9,
                top_p=0.95,
                num_return_sequences=1
            )
            print(f"\nPrompt: {prompt_text}")
            print(f"Generated (creative): {generated_text_creative}")

        except Exception as e:
            print(f"Text generation test failed: {e}")

        # --- Test des Embeddings ---
        print("\n--- Testing Embeddings ---")
        try:
            texts_to_embed = [
                "This is the first sentence.",
                "This is the second sentence.",
                "Hugging Face provides powerful NLP models."
            ]
            embedding_model = "sentence-transformers/all-MiniLM-L6-v2"
            embeddings = await hf_service.get_embeddings(texts_to_embed, embedding_model)
            print(f"Generated {len(embeddings)} embeddings.")
            # Afficher la forme du premier embedding
            if embeddings:
                print(f"Shape of the first embedding: {len(embeddings[0])}")
                # print(f"First embedding (first 5 values): {embeddings[0][:5]}")

        except Exception as e:
            print(f"Embeddings test failed: {e}")
            
        # --- Test de l'Analyse de Sentiment ---
        print("\n--- Testing Sentiment Analysis ---")
        try:
            analyzer_model = "distilbert-base-uncased-finetuned-sst-2-english"
            sentiment_results = await hf_service.get_sentiment_analyzer(analyzer_model, ["I love using Hugging Face!", "This is a terrible movie."])
            print(f"Sentiment results: {sentiment_results}")
        except Exception as e:
            print(f"Sentiment analysis test failed: {e}")
            
        # --- Test de QA ---
        print("\n--- Testing Question Answering ---")
        try:
            qa_model = "distilbert-base-cased-distilled-squad"
            context = "Hugging Face is a company that builds tools for natural language processing."
            question = "What is Hugging Face?"
            qa_results = await hf_service.get_qa_pipeline(qa_model, {"question": question, "context": context})
            print(f"Context: {context}")
            print(f"Question: {question}")
            print(f"Answer: {qa_results['answer']}")
        except Exception as e:
            print(f"QA test failed: {e}")

        # --- Nettoyage (déchargement des modèles pour libérer la mémoire) ---
        print("\n--- Unloading models ---")
        hf_service.unload_model("gpt2")
        hf_service.unload_model("sentence-transformers/all-MiniLM-L6-v2")
        hf_service.unload_model("distilbert-base-uncased-finetuned-sst-2-english")
        hf_service.unload_model("distilbert-base-cased-distilled-squad")

    asyncio.run(test_hf_service())