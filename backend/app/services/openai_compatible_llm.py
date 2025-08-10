import os
import uuid
from typing import List, Dict, Any, Optional, Union, Iterator
from openai import OpenAI
from pydantic import BaseModel, Field
import logging

logger = logging.getLogger(__name__)

class OpenAICompatibleLLM:
    def __init__(self,
                 api_key: Optional[str] = None,
                 base_url: Optional[str] = None,
                 model_name: str = "gpt-3.5-turbo",
                 default_params: Optional[Dict[str, Any]] = None):
        self.api_key = api_key if api_key else os.environ.get("OPENAI_API_KEY")
        self.base_url = base_url
        self.model_name = model_name
        self.default_params = default_params if default_params else {
            "temperature": 0.7,
            "max_tokens": 150,
            "top_p": 0.9,
            "stream": False
        }

        try:
            self.client = OpenAI(
                api_key=self.api_key,
                base_url=self.base_url,
            )
            logger.info(f"LLM Client initialized. Base URL: {self.client.base_url}, Model: {self.model_name}")
        except Exception as e:
            logger.error(f"Error initializing OpenAI client: {e}")
            self.client = None

    def _get_client(self) -> Optional[OpenAI]:
        if not self.client:
            logger.error("LLM client is not initialized.")
        return self.client

    def _prepare_chat_completion_params(self,
                                        prompt: str,
                                        model: Optional[str] = None,
                                        messages: Optional[List[Dict[str, str]]] = None,
                                        stream: Optional[bool] = None,
                                        **kwargs) -> Dict[str, Any]:
        if model is None:
            model = self.model_name

        chat_messages = messages if messages is not None else [
            {"role": "user", "content": prompt}
        ]

        params = {
            "model": model,
            "messages": chat_messages,
            "stream": stream if stream is not None else self.default_params.get("stream", False),
            **self.default_params,
            **kwargs
        }
        return params

    def _prepare_embedding_params(self,
                                  input_texts: Union[str, List[str]],
                                  model: Optional[str] = None,
                                  **kwargs) -> Dict[str, Any]:
        if model is None:
            model = "text-embedding-ada-002"

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
                response_stream = client.chat.completions.create(**params)
                async def stream_generator():
                    full_response = ""
                    for chunk in response_stream:
                        if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
                            content = chunk.choices[0].delta.content
                            full_response += content
                            yield content
                return stream_generator()
            else:
                response = client.chat.completions.create(**params)
                if response.choices and response.choices[0].message and response.choices[0].message.content:
                    return response.choices[0].message.content.strip()
                else:
                    logger.warning(f"Received empty response from LLM. Response object: {response}")
                    return "LLM did not return a valid response."

        except Exception as e:
            logger.error(f"Error during LLM completion: {e}")
            return f"Error during LLM completion: {e}"

    async def get_embeddings(self,
                           input_texts: Union[str, List[str]],
                           model: Optional[str] = None,
                           **kwargs) -> List[List[float]]:
        client = self._get_client()
        if not client:
            return []

        params = self._prepare_embedding_params(input_texts, model, **kwargs)

        try:
            response = client.embeddings.create(**params)
            if response.data:
                embeddings = [item.embedding for item in response.data]
                return embeddings
            else:
                logger.warning(f"Received empty embedding response. Response object: {response}")
                return []
        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            return []
