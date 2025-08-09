import os
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google.cloud import aiplatform_v1
from dotenv import load_dotenv

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if os.path.exists(".env"):
    load_dotenv()
    logger.info(".env file loaded")

PROJECT_ID = os.getenv("GCP_PROJECT_ID", "skinlens-new-test")
LOCATION = os.getenv("GCP_LOCATION", "us-central1")
MODEL_ID = os.getenv("MODEL_ID", "gemini-1.5-flash-001")

API_ENDPOINT = f"{LOCATION}-aiplatform.googleapis.com"
MODEL_ENDPOINT_PATH = f"projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/{MODEL_ID}"

client_options = {"api_endpoint": API_ENDPOINT}
prediction_client = aiplatform_v1.PredictionServiceClient(client_options=client_options)

app = FastAPI()

# Configure CORS — restreindre aux domaines autorisés en prod
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À remplacer par ton frontend en prod, ex: ["https://app.kiwi-ops.com"]
    allow_methods=["POST"],
    allow_headers=["*"],
)

class AgentRequest(BaseModel):
    prompt: str

class AgentResponse(BaseModel):
    response: str

@app.get("/")
async def root():
    return {"message": "Agent is running"}

@app.post("/agent", response_model=AgentResponse)
async def agent_endpoint(request: AgentRequest):
    try:
        instances = [{"content": request.prompt}]
        parameters = {
            "candidate_count": 1,
            "max_output_tokens": 800,
            "temperature": 0.7,
            "top_p": 0.9,
            "top_k": 40,
        }
        response = prediction_client.predict(
            endpoint=MODEL_ENDPOINT_PATH,
            instances=instances,
            parameters=parameters,
        )

        if response.predictions and len(response.predictions) > 0:
            prediction_result = response.predictions[0]
            generated_text = None

            # Extraction robuste du texte généré
            if isinstance(prediction_result, dict) and "content" in prediction_result:
                generated_text = prediction_result["content"]
            elif hasattr(prediction_result, "string_value") and prediction_result.string_value:
                generated_text = prediction_result.string_value
            elif hasattr(prediction_result, "struct_value") and "content" in prediction_result.struct_value:
                generated_text = prediction_result.struct_value["content"]
            else:
                generated_text = str(prediction_result)

            return AgentResponse(response=generated_text)
        else:
            raise HTTPException(status_code=500, detail="No prediction available from model")
    except Exception as e:
        logger.error(f"Error during prediction: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error during prediction")

