# /home/manik/skinlensr/SkinLensR/backend/app/api/agent.py

import logging
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .openai_compatible_llm import OpenAICompatibleLLM
# Importez vos schémas Pydantic pour les agents
# Assurez-vous qu'ils existent, idéalement dans app/schemas/agent.py
from app.schemas.agent import ( # Supposons ces schémas pour l'exemple
    AgentCreate, AgentResponse, AgentTaskCreate, AgentTaskResponse,
    AgentStatusUpdate, AgentConfigUpdate
)

# Importez votre service agentic ou la classe Agent principale
from app.services.agentic import Agent as AgenticAgent # Renommez pour éviter les conflits si besoin
# Si vous avez un AgentService qui gère les instances d'agents, importez-le ici.
# from app.services.agent_manager_service import AgentManagerService

# Importez vos fonctions de dépendance
from app.database import get_db
from app.core.dependencies import (
    get_current_user, # Pour authentification
    get_current_admin_user, # Pour les opérations sensibles sur les agents
    get_openai_compatible_llm, # Pour injecter le LLM aux agents
    get_memory_manager # Pour injecter la mémoire aux agents
    # get_huggingface_service, # Si des outils/embeddings HF sont utilisés par les agents
)

router = APIRouter(
    prefix="/agents", # Préfixe pour toutes les routes liées aux agents
    tags=["AI Agents"],
    dependencies=[Depends(get_current_user)] # Toutes les routes nécessitent un utilisateur authentifié
)

logger = logging.getLogger(__name__)

# --- Dépendance pour le Service Agent Manager (si vous en créez un) ---
# Si vous avez un service qui gère la création/persistance des agents.
# Sinon, vous pouvez instancier les agents directement dans les routes.
# Pour l'exemple, nous allons simuler un AgentManagerService simple.
class MockAgentManagerService:
    """Service mock pour gérer la persistance des agents."""
    def __init__(self, db_session: Session, llm_client: Any, memory_manager: Any):
        self.db_session = db_session
        self.llm_client = llm_client
        self.memory_manager = memory_manager
        self._agents: Dict[str, AgenticAgent] = {} # Simule un stockage en mémoire

    async def create_agent(self, agent_data: AgentCreate) -> AgenticAgent:
        # Dans un vrai cas, vous sauvegarderiez l'agent dans la DB et retourneriez un objet modèle.
        # Ici, on crée une instance de AgenticAgent en mémoire.
        new_agent = AgenticAgent(
            name=agent_data.name,
            role=agent_data.role,
            llm_model=self.llm_client, # Injecter le LLM
            memory=self.memory_manager # Injecter le gestionnaire de mémoire
            # Vous pourriez aussi passer des outils ici si les agents ont des outils spécifiques
            # tools=self.get_agent_tools(agent_data.type)
        )
        self._agents[new_agent.id] = new_agent
        print(f"MockAgentManagerService: Created agent {new_agent.name} with ID {new_agent.id}")
        return new_agent

    def get_agent(self, agent_id: str) -> Optional[AgenticAgent]:
        # Dans un vrai cas, vous récupéreriez l'agent depuis la DB et l'instancieriez.
        return self._agents.get(agent_id)

    def get_all_agents(self) -> List[AgenticAgent]:
        return list(self._agents.values())

    async def delete_agent(self, agent_id: str) -> Optional[AgenticAgent]:
        return self._agents.pop(agent_id, None)

# Dépendance pour le MockAgentManagerService (à adapter pour votre vrai service)
def get_agent_manager_service(
    db: Session = Depends(get_db),
    llm_client: Any = Depends(get_openai_compatible_llm),
    memory_manager: Any = Depends(get_memory_manager)
) -> MockAgentManagerService:
    """
    Fournit une instance du service de gestion des agents.
    """
    # Si vous voulez une instance unique, vous pouvez la créer une fois et la retourner.
    # Pour le mock, on peut le créer à chaque fois pour la simplicité.
    return MockAgentManagerService(db, llm_client, memory_manager)


# --- Routes pour la gestion des Agents ---

@router.post("/", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
async def create_agent_route(
    agent_data: AgentCreate,
    agent_manager_service: MockAgentManagerService = Depends(get_agent_manager_service),
    current_admin: Any = Depends(get_current_admin_user) # Seuls les admins peuvent créer des agents
):
    """
    Crée un nouvel agent IA. Nécessite des permissions d'administrateur.
    """
    logger.info(f"Admin {current_admin.id} creating new agent: {agent_data.name}")
    try:
        new_agent = await agent_manager_service.create_agent(agent_data)
        logger.info(f"Agent '{new_agent.name}' created with ID: {new_agent.id}")
        return AgentResponse(
            id=new_agent.id,
            name=new_agent.name,
            role=new_agent.role,
            status="active" # Ou le statut réel de l'agent
        )
    except Exception as e:
        logger.error(f"Error creating agent '{agent_data.name}': {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to create agent: {e}")

@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent_details(
    agent_id: str,
    agent_manager_service: MockAgentManagerService = Depends(get_agent_manager_service),
    current_user: Any = Depends(get_current_user) # N'importe quel utilisateur authentifié peut voir les détails
):
    """
    Récupère les détails d'un agent spécifique.
    """
    logger.info(f"Fetching details for agent ID: {agent_id} by user {current_user.id}")
    agent = agent_manager_service.get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found.")
    
    return AgentResponse(
        id=agent.id,
        name=agent.name,
        role=agent.role,
        status="active" # Ou le statut réel de l'agent
    )

@router.get("/", response_model=List[AgentResponse])
async def get_all_agents_route(
    agent_manager_service: MockAgentManagerService = Depends(get_agent_manager_service),
    current_user: Any = Depends(get_current_user) # Peut-être seulement pour admins ?
):
    """
    Liste tous les agents disponibles.
    """
    logger.info(f"Fetching all agents by user {current_user.id}")
    agents = agent_manager_service.get_all_agents()
    return [
        AgentResponse(id=agent.id, name=agent.name, role=agent.role, status="active") # Mapper les agents aux schémas
        for agent in agents
    ]

@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agent_route(
    agent_id: str,
    agent_manager_service: MockAgentManagerService = Depends(get_agent_manager_service),
    current_admin: Any = Depends(get_current_admin_user) # Seuls les admins peuvent supprimer des agents
):
    """
    Supprime un agent IA. Nécessite des permissions d'administrateur.
    """
    logger.info(f"Admin {current_admin.id} attempting to delete agent ID: {agent_id}")
    deleted_agent = await agent_manager_service.delete_agent(agent_id)
    if not deleted_agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found.")
    logger.info(f"Agent ID {agent_id} deleted successfully.")
    return # No content for 204

# --- Routes pour l'exécution des tâches par les agents ---

@router.post("/{agent_id}/execute-task", response_model=AgentTaskResponse)
async def execute_agent_task(
    agent_id: str,
    task_data: AgentTaskCreate,
    agent_manager_service: MockAgentManagerService = Depends(get_agent_manager_service),
    current_user: Any = Depends(get_current_user) # Ou une dépendance plus spécifique si la tâche est sensible
):
    """
    Demande à un agent d'exécuter une tâche spécifique.
    """
    logger.info(f"User {current_user.id} requesting agent {agent_id} to execute task: {task_data.task_description}")
    
    agent = agent_manager_service.get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found.")
        
    try:
        # Appeler la méthode run de l'agent (asynchrone)
        # La sortie de agent.run() pourrait être plus complexe et devrait être mappée à AgentTaskResponse
        task_result = await agent.run(task_data.task_description)
        logger.info(f"Agent {agent_id} completed task. Result: {task_result}")
        
        return AgentTaskResponse(
            task_id=str(uuid.uuid4()), # ID de la tâche
            agent_id=agent_id,
            status="completed", # Ou "in_progress", "failed"
            result_summary=str(task_result)[:200] + "..." if task_result else "No specific result.", # Résumé du résultat
            full_result=str(task_result) # Le résultat complet de l'agent (pourrait être très long)
        )
    except Exception as e:
        logger.error(f"Error executing task for agent {agent_id}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to execute task: {e}")

# Vous pouvez ajouter d'autres routes spécifiques aux agents ici,
# par exemple pour obtenir l'historique des tâches d'un agent,
# ou pour mettre à jour la configuration d'un agent.