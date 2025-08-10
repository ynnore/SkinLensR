# /home/manik/skinlensr/SkinLensR/backend/app/services/agent_manager_service.py

import logging
import uuid
from typing import List, Dict, Any, Optional

from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

# Importez vos modèles SQLAlchemy pour les agents
# Assurez-vous que le modèle Agent existe dans app/models/agent.py
from app.models.agent import Agent as AgentModel, AgentStatus # Si vous utilisez un Enum pour le statut
# Vous pourriez aussi avoir besoin d'autres modèles liés aux agents (ex: AgentTask, AgentTool)

# Importez vos schémas Pydantic pour la création/réponse d'agents
# Assurez-vous qu'ils sont dans app/schemas/agent.py
from app.schemas.agent import (
    AgentCreate, AgentResponse, AgentUpdate
)

# Importez la classe Agent principale qui contient la logique d'exécution
from app.services.agentic import Agent as AgenticAgent 

# Importez les services dont ce manager a besoin
from app.services.huggingface import HuggingFaceService # Si nécessaire pour les outils ou le LLM de l'agent
from app.services.openai_compatible_llm import OpenAICompatibleLLM # Pour injecter le LLM principal
from app.services.memory_manager import MemoryManager # Pour injecter la mémoire aux agents

logger = logging.getLogger(__name__)

class AgentManagerService:
    def __init__(self,
                 db_session: Session,
                 llm_client: OpenAICompatibleLLM, # Le LLM utilisé par défaut pour les agents
                 memory_manager: MemoryManager, # Le gestionnaire de mémoire pour les agents
                 # Potentiellement d'autres services comme HuggingFaceService si les agents utilisent ses outils
                 # huggingface_service: HuggingFaceService 
                ):
        """
        Initialise le service de gestion des agents.
        """
        self.db_session = db_session
        self.llm_client = llm_client
        self.memory_manager = memory_manager
        # self.huggingface_service = huggingface_service
        
        # Ici, vous chargeriez/configureriez les tools que les agents peuvent utiliser.
        # Vous pourriez avoir une logique pour récupérer les tools depuis la DB ou un fichier de config.
        # self.tools = self.load_available_tools()

        logger.info("AgentManagerService initialized.")

    def _get_agent_model_by_id(self, agent_id: int) -> Optional[AgentModel]:
        """Méthode interne pour récupérer l'agent depuis la base de données relationnelle."""
        # Si vous utilisez des UUIDs pour les agents, changez le type de ID.
        logger.debug(f"Fetching agent model from DB by ID: {agent_id}")
        try:
            agent_record = self.db_session.query(AgentModel).get(agent_id)
            if agent_record:
                logger.debug(f"Agent model found: ID={agent_record.id}, Name='{agent_record.name}'")
            else:
                logger.warning(f"Agent model not found for ID: {agent_id}")
            return agent_record
        except SQLAlchemyError as e:
            logger.error(f"Database error fetching agent model ID {agent_id}: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error fetching agent model ID {agent_id}: {e}")
            return None

    def _create_agent_instance(self, agent_model: AgentModel) -> AgenticAgent:
        """
        Crée une instance de la logique d'agent (AgenticAgent) à partir du modèle DB.
        Injecte les services nécessaires (LLM, Mémoire, Outils).
        """
        logger.info(f"Creating agent instance for agent model ID: {agent_model.id}, Name: '{agent_model.name}'")
        try:
            # Charger les outils de l'agent à partir de sa configuration
            # tools_list = self.load_tools_from_config(agent_model.tools_config) # Méthode à implémenter
            
            agent_instance = AgenticAgent(
                id=str(agent_model.id), # Assurez-vous que l'ID est compatible (str pour UUID, int pour ID DB)
                name=agent_model.name,
                role=agent_model.role,
                description=agent_model.description,
                llm_model=self.llm_client, # Injecter le LLM global
                memory=self.memory_manager, # Injecter le gestionnaire de mémoire global
                tools=[], # Injecter les outils spécifiques de l'agent ici
                max_iterations=10 # Valeur par défaut, peut être configurable
            )
            logger.info(f"Agent instance created for ID: {agent_model.id}")
            return agent_instance
        except Exception as e:
            logger.error(f"Failed to create agent instance for agent ID {agent_model.id}: {e}")
            # C'est une erreur critique, l'agent ne pourra pas fonctionner
            raise

    async def create_agent(self, agent_data: AgentCreate) -> Optional[AgenticAgent]:
        """
        Crée un nouvel agent, le sauvegarde en DB, puis retourne une instance active.
        """
        logger.info(f"Creating new agent with name: '{agent_data.name}', role: '{agent_data.role}'")
        try:
            # 1. Sauvegarder les informations de base de l'agent dans la DB
            # Assurez-vous d'avoir une fonction CRUD pour les agents, ex: crud.create_agent(db, agent_data)
            # Qui retourne l'objet modèle SQLAlchemy de l'agent créé.
            
            # Placeholder pour la création de l'agent en DB
            # Si vous avez un crud.create_agent qui retourne le modèle SQLAlchemy:
            # agent_model = crud.create_agent(self.db_session, agent_data=agent_data)
            
            # Simulation pour l'exemple : créer un agent en mémoire et lui assigner un ID
            agent_id_str = str(uuid.uuid4())
            agent_model_mock = AgentModel( # Simule un enregistrement en DB
                id=agent_id_str, # Si votre modèle utilise UUID
                # id=int(uuid.uuid4()), # Si votre modèle utilise Integer (généré par DB)
                name=agent_data.name,
                role=agent_data.role,
                description=agent_data.description,
                status="active", # Statut par défaut
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            # Ici, vous devriez insérer agent_model_mock dans self.db_session et commiter.
            # Pour le mock, on assume qu'il est créé et on le met dans un cache interne.
            
            # 2. Créer l'instance de l'agent avec les services injectés
            agent_instance = self._create_agent_instance(agent_model_mock)
            
            # Sauvegarder l'instance créée en mémoire pour une récupération rapide (optionnel)
            # self._agents[agent_instance.id] = agent_instance # Si vous avez un cache interne

            logger.info(f"Agent '{agent_instance.name}' created successfully with ID: {agent_instance.id}")
            return agent_instance
            
        except ValueError as ve: # Erreurs de validation
            logger.error(f"Validation error creating agent '{agent_data.name}': {ve}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
        except Exception as e:
            logger.error(f"Failed to create agent '{agent_data.name}': {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to create agent: {e}")

    def get_agent(self, agent_id: str) -> Optional[AgenticAgent]:
        """
        Récupère une instance d'agent actif par son ID.
        Cherche d'abord dans un cache interne, sinon charge depuis la DB.
        """
        logger.debug(f"Fetching agent by ID: {agent_id}")
        
        # 1. Essayer de récupérer une instance active (si vous gardez un cache des agents actifs)
        # if agent_id in self._agents:
        #     logger.debug(f"Agent {agent_id} found in cache.")
        #     return self._agents[agent_id]

        # 2. Si non trouvé en cache, charger depuis la base de données
        agent_model = self._get_agent_model_by_id(agent_id) # Utilise la méthode interne pour récupérer le modèle DB
        if agent_model:
            # Vérifier le statut de l'agent
            if agent_model.status == "active":
                try:
                    # Créer l'instance de l'agent et potentiellement la mettre en cache
                    agent_instance = self._create_agent_instance(agent_model)
                    # self._agents[agent_id] = agent_instance # Ajouter au cache si utilisé
                    return agent_instance
                except Exception as e:
                    logger.error(f"Could not create instance for active agent {agent_id}: {e}")
                    return None # L'agent existe mais ne peut être instancié
            else:
                logger.warning(f"Agent {agent_id} found but is not active (status: {agent_model.status}).")
                return None # Agent existe mais n'est pas actif
        else:
            logger.warning(f"Agent model not found in DB for ID: {agent_id}")
            return None # Agent non trouvé en DB

    def get_all_agents(self, user_id: Optional[int] = None) -> List[AgenticAgent]:
        """
        Récupère toutes les instances d'agents actifs.
        Peut potentiellement filtrer par utilisateur si les agents sont spécifiques.
        """
        logger.debug(f"Fetching all active agents (user_id: {user_id}).")
        all_agents = []
        try:
            # Récupérer tous les modèles d'agents actifs de la DB
            query = self.db_session.query(AgentModel)
            if user_id: # Filtrer par utilisateur si nécessaire
                query = query.filter(AgentModel.user_id == user_id)
            
            active_agent_models = query.filter(AgentModel.status == "active").all()

            for agent_model in active_agent_models:
                try:
                    agent_instance = self._create_agent_instance(agent_model)
                    if agent_instance:
                        all_agents.append(agent_instance)
                except Exception as e:
                    logger.error(f"Skipping agent {agent_model.id} due to instantiation error: {e}")
            
            logger.info(f"Retrieved {len(all_agents)} active agent instances.")
            return all_agents
            
        except SQLAlchemyError as e:
            logger.error(f"Database error fetching active agents: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error fetching active agents: {e}")
            return []

    async def delete_agent(self, agent_id: str) -> bool:
        """
        Supprime un agent (enregistrement DB et instance active si nécessaire).
        Retourne True si l'agent a été trouvé et supprimé, False sinon.
        """
        logger.info(f"Attempting to delete agent ID: {agent_id}")
        try:
            # 1. Supprimer l'instance active si elle est en cache (gestion mémoire)
            # if agent_id in self._agents:
            #     del self._agents[agent_id]
            #     logger.debug(f"Removed agent {agent_id} from cache.")

            # 2. Supprimer l'enregistrement de l'agent de la base de données
            agent_model = self._get_agent_model_by_id(agent_id) # Utilise l'ID interne si c'est un int, sinon adapter.
            if not agent_model:
                logger.warning(f"Agent model not found in DB for ID: {agent_id}.")
                return False

            self.db_session.delete(agent_model)
            self.db_session.commit()
            logger.info(f"Agent model with ID {agent_id} deleted from DB.")
            return True
            
        except SQLAlchemyError as e:
            self.db_session.rollback()
            logger.error(f"Database error deleting agent ID {agent_id}: {e}")
            return False
        except Exception as e:
            self.db_session.rollback()
            logger.error(f"Unexpected error deleting agent ID {agent_id}: {e}")
            return False

    # --- Méthodes pour l'exécution des tâches ---
    # Ces méthodes sont plus complexes car elles impliquent de gérer le cycle de vie des tâches.
    # async def create_and_run_task(self, agent_id: str, task_description: str, params: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    #     agent = self.get_agent(agent_id)
    #     if not agent:
    #         raise HTTPException(status_code=404, detail="Agent not found.")
            
    #     # Lancer la tâche de manière asynchrone
    #     task_id = str(uuid.uuid4())
    #     task_info = {
    #         "task_id": task_id,
    #         "agent_id": agent_id,
    #         "status": "pending",
    #         "task_description": task_description,
    #         "created_at": datetime.utcnow()
    #     }
        
    #     # Vous pourriez vouloir créer une entrée 'AgentTask' dans la DB ici
    #     # et lancer l'exécution de l'agent en arrière-plan (ex: avec Celery ou FastAPI background tasks)
    #     # async def run_agent_task():
    #     #     try:
    #     #         result = await agent.run(task_description, params=params)
    #     #         # Mettre à jour le statut de la tâche dans la DB
    #     #         # update_task_status(db, task_id, status="completed", result=result)
    #     #     except Exception as e:
    #     #         # update_task_status(db, task_id, status="failed", error=str(e))
    #     #         logger.error(f"Task {task_id} for agent {agent_id} failed: {e}")
        
    #     # asyncio.create_task(run_agent_task()) # Lancer en tâche de fond
        
    #     return task_info # Retourner l'info de la tâche immédiatement

    # async def get_task_status(self, agent_id: str, task_id: str) -> Dict[str, Any]:
    #     """Récupère le statut et le résultat d'une tâche."""
    #     pass # Implémenter la récupération depuis la DB ou un cache