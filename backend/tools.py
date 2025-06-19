# tools.py
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)

class SampleTool:
    """Un outil exemple qui peut être appelé par l'agent"""

    def __init__(self):
        self.name = "SampleTool"

    def execute(self, prompt: str):
        logger.debug(f"SampleTool: exécution sur le prompt: {prompt}")
        return {
            "tool_name": self.name,
            "result": f"(Résultat simulé) Vous avez demandé : {prompt}"
        }
