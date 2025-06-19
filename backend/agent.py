# agent.py
print("--- Début de l'exécution de agent.py ---")

import os
import logging
from tools import SampleTool  # Tu pourras ajouter d'autres outils ici

# Configuration logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
if not logger.handlers:
    stream_handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)

logger.debug("agent.py: Imports initiaux effectués.")

# Récupération des variables d’environnement
PROJECT_ID = os.getenv("GCP_PROJECT_ID", "skinlens-new-test")
LOCATION = os.getenv("GCP_LOCATION", "us-central1")
MODEL_ID = os.getenv("MODEL_ID", "gemini-1.5-flash-001")

logger.debug(f"agent.py: Environnement => PROJECT_ID={PROJECT_ID}, LOCATION={LOCATION}, MODEL_ID={MODEL_ID}")

# Configuration LLM
llm_config = {
    "provider": "vertex_ai",
    "project_id": PROJECT_ID,
    "location": LOCATION,
    "model_id": MODEL_ID,
    "generation_config": {
        "temperature": 0.7,
        "max_output_tokens": 800,
        "top_p": 0.9,
        "top_k": 40
    }
}
logger.debug(f"agent.py: llm_config = {llm_config}")

# Tentative d'import de Agent depuis google_adk
try:
    from google_adk.agent import Agent
    logger.debug("agent.py: Import officiel de google_adk.agent.Agent réussi.")
except ImportError:
    logger.warning("agent.py: google_adk introuvable, définition d’un Agent local simulé.")
    
    class Agent:
        def __init__(self, llm_config=None, tools=None, verbose=False):
            self.llm_config = llm_config
            self.tools = tools or []
            self.verbose = verbose

        def run(self, prompt):
            tool_responses = [tool.execute(prompt) for tool in self.tools]
            return {
                "output": f"[Mock Gemini] Réponse pour: {prompt}",
                "tools": tool_responses
            }

# Initialisation de l'agent
chat_agent = None
try:
    logger.info("agent.py: Initialisation de l’agent...")
    chat_agent = Agent(
        llm_config=llm_config,
        tools=[SampleTool()],
        verbose=True
    )
    logger.info("agent.py: chat_agent initialisé avec succès.")
except Exception as e:
    logger.error(f"agent.py: ERREUR lors de l'initialisation de Agent(): {e}", exc_info=True)

print("--- Fin de l'exécution de agent.py ---")
