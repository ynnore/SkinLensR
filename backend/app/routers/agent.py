# /home/manik/skinlensr/SkinLensR/backend/app/routers/agent.py

import logging
from typing import List, Dict, Any, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

# Importez vos schémas Pydantic pour les agents
# Assurez-vous qu'ils sont bien définis dans app/schemas/agent.py
from app.schemas.agent import (
    AgentCreate, AgentResponse, AgentUpdate,
    AgentTaskCreate, AgentTaskResponse
)

# Importez votre service de gestion d'agents (ou la classe Agent si c'est une gestion directe)
# Nous avons utilisé un mock AgentManagerService dans la proposition du routeur,
# vous devrez l'implémenter correctement dans app/services/agent_manager_service.py
from app.services.agent_manager_service import AgentManagerService # Supposons que vous créez ce service

# Importez vos fonctions de dépendance
from app.database import get_db
from app.core.dependencies import (
    get_current_user,
    get_current_admin_user, # Pour les opérations sensibles sur les agents
    get_openai_compatible_llm, # Pour injecter le LLM aux agents
    get_memory_manager # Pour injecter la mémoire aux agents
)

router = APIRouter(
    prefix="/agents", # Préfixe pour toutes les routes liées aux agents
    tags=["AI Agents"],
    dependencies=[Depends(get_current_user)] # Toutes les routes nécessitent un utilisateur authentifié
)

logger = logging.getLogger(__name__)

# --- Dépendance pour le Service de Gestion des Agents ---
# Ceci est une fonction de dépendance qui fournira une instance de votre service de gestion d'agents.
# Vous devrez avoir implémenté ce service (ex: AgentManagerService) dans app/services/.
# Ce service sera responsable de la création, de la persistance, et de la récupération des agents.
def get_agent_manager_service(
    db: Session = Depends(get_db),
    llm_client: Any = Depends(get_openai_compatible_llm),
    memory_manager: Any = Depends(get_memory_manager)
) -> AgentManagerService:
    """
    Fournit une instance du service de gestion des agents.
    """
    # Instanciez votre vrai AgentManagerService ici, en lui passant les dépendances nécessaires.
    # Si vous avez une instance globale de LLM ou MemoryManager, utilisez-les.
    # return AgentManagerService(db_session=db, llm_client=llm_client, memory_manager=memory_manager)
    # Pour l'instant, on utilise un placeholder pour que le routeur compile :
    raise NotImplementedError("AgentManagerService dependency not fully implemented.")


# --- Routes pour la gestion des Agents ---

@router.post("/", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
async def create_agent_route(
    agent_data: AgentCreate,
    agent_manager: AgentManagerService = Depends(get_agent_manager_service),
    current_admin: Any = Depends(get_current_admin_user) # Seuls les admins peuvent créer des agents
):
    """
    Crée un nouvel agent IA. Nécessite des permissions d'administrateur.
    """
    logger.info(f"Admin {current_admin.email} creating new agent: '{agent_data.name}'.")
    
    try:
        # Appeler le service pour créer l'agent.
        # Le service devrait retourner une instance d'agent (potentiellement persistée)
        # et la mapper en AgentResponse.
        new_agent = await agent_manager.create_agent(agent_data)
        
        if not new_agent: # Si le service a échoué à créer l'agent
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create agent.")
            
        logger.info(f"Agent '{new_agent.name}' created with ID: {new_agent.id}.")
        # Mapper l'agent créé au schéma de réponse
        return AgentResponse(
            id=new_agent.id,
            name=new_agent.name,
            role=new_agent.role,
            description=new_agent.description,
            status="active" # Statut par défaut ou récupéré du service
        )
        
    except HTTPException as http_exc: # Relayer les HTTPErrors (ex: permissions)
        raise http_exc
    except Exception as e:
        logger.error(f"Error creating agent '{agent_data.name}': {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to create agent: {e}")

@router.get("/{agent_id}", response_model=AgentResponse)
async def get_agent_details_route(
    agent_id: str,
    agent_manager: AgentManagerService = Depends(get_agent_manager_service),
    current_user: Any = Depends(get_current_user) # N'importe quel utilisateur authentifié peut voir les détails
):
    """
    Récupère les détails d'un agent spécifique.
    """
    logger.info(f"Fetching details for agent ID: {agent_id} by user {current_user.email}.")
    
    # Récupérer l'agent via le service
    agent = agent_manager.get_agent(agent_id)
    
    if not agent:
        logger.warning(f"Agent not found for ID: {agent_id}.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found.")
        
    logger.info(f"Found agent ID {agent_id}: '{agent.name}'.")
    # Mapper l'agent au schéma de réponse
    return AgentResponse(
        id=agent.id,
        name=agent.name,
        role=agent.role,
        description=agent.description,
        status="active" # Statut par défaut ou récupéré du service
    )

@router.get("/", response_model=List[AgentResponse])
async def list_all_agents_route(
    agent_manager: AgentManagerService = Depends(get_agent_manager_service),
    current_user: Any = Depends(get_current_user) # Peut-être seulement pour admins ?
):
    """
    Liste tous les agents disponibles.
    (Peut être restreint aux admins si nécessaire).
    """
    logger.info(f"Fetching all agents by user {current_user.email}.")
    
    agents = agent_manager.get_all_agents()
    
    # Mapper les agents (potentiellement des modèles SQLAlchemy ou des objets AgenticAgent)
    # aux schémas Pydantic AgentResponse
    return [
        AgentResponse(
            id=agent.id,
            name=agent.name,
            role=agent.role,
            description=agent.description,
            status="active" # Statut par défaut ou récupéré du service
        )
        for agent in agents
    ]

@router.put("/{agent_id}", response_model=AgentResponse)
async def update_agent_route(
    agent_id: str,
    agent_update_data: AgentUpdate,
    agent_manager: AgentManagerService = Depends(get_agent_manager_service),
    current_admin: Any = Depends(get_current_admin_user) # Nécessite un admin pour la mise à jour
):
    """
    Met à jour un agent existant. Nécessite des permissions d'administrateur.
    """
    logger.info(f"Admin {current_admin.email} attempting to update agent ID: {agent_id}.")
    
    # Récupérer l'agent pour vérifier son existence et potentiellement ses attributs avant mise à jour
    existing_agent = agent_manager.get_agent(agent_id)
    if not existing_agent:
        logger.warning(f"Agent not found for update ID: {agent_id}.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found.")
        
    # Appeler le service pour mettre à jour l'agent
    # Le service update_agent devrait prendre l'ID, les données de mise à jour, et potentiellement les dépendances.
    # updated_agent = await agent_manager.update_agent(agent_id, agent_update_data) # Si update est async
    updated_agent = agent_manager.update_agent(agent_id, agent_update_data) # Si update est synchrone
    
    if not updated_agent:
        logger.error(f"Failed to update agent ID {agent_id}.")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update agent.")
        
    logger.info(f"Agent ID {agent_id} updated successfully.")
    return AgentResponse(
        id=updated_agent.id,
        name=updated_agent.name,
        role=updated_agent.role,
        description=updated_agent.description,
        status="active" # Statut par défaut ou récupéré du service
    )

@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agent_route(
    agent_id: str,
    agent_manager: AgentManagerService = Depends(get_agent_manager_service),
    current_admin: Any = Depends(get_current_admin_user) # Nécessite un admin pour la suppression
):
    """
    Supprime un agent IA. Nécessite des permissions d'administrateur.
    """
    logger.info(f"Admin {current_admin.email} attempting to delete agent ID: {agent_id}.")
    
    # Appeler le service pour supprimer l'agent
    deleted_agent = await agent_manager.delete_agent(agent_id) # Assumant que delete est async
    
    if not deleted_agent:
        logger.warning(f"Agent not found for deletion ID: {agent_id}.")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found.")
        
    logger.info(f"Agent ID {agent_id} deleted successfully.")
    return None # Pas de contenu pour le code 204

# --- Routes pour l'exécution des tâches par les agents ---
# Ces routes sont pour interagir directement avec les agents pour exécuter des actions.
# Elles pourraient être dans ce routeur ou dans un routeur spécifique "/agent-tasks".

@router.post("/{agent_id}/tasks", response_model=AgentTaskResponse, status_code=status.HTTP_202_ACCEPTED)
async def create_agent_task_route(
    agent_id: str,
    task_data: AgentTaskCreate,
    agent_manager: AgentManagerService = Depends(get_agent_manager_service),
    current_user: Any = Depends(get_current_user)
):
    """
    Crée et lance une tâche pour un agent spécifique.
    Retourne un ID de tâche pour suivre son statut.
    """
    logger.info(f"User {current_user.email} requesting to create task for agent {agent_id}: '{task_data.task_description[:50]}...'")
    
    agent = agent_manager.get_agent(agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found.")
        
    try:
        # Le service devrait prendre en charge la création de la tâche et son envoi à l'agent
        # Assurez-vous que votre AgentManagerService a une méthode comme `create_and_run_task`
        # qui utilise la logique de `agent.run()` que nous avons vue dans agentic.py
        
        # Placeholder pour la réponse de création de tâche
        # La création de tâche peut être asynchrone. Le retour indique le succès de la création.
        # Le statut réel de la tâche sera récupéré via une autre route (ex: GET /agents/{agent_id}/tasks/{task_id})
        
        # Si votre service gère la création de tâches et leur lancement :
        # task_info = await agent_manager.create_and_run_task(agent_id=agent_id, task_description=task_data.task_description, params=task_data.params)
        
        # Placeholder pour la réponse
        task_info = {
            "task_id": str(uuid.uuid4()),
            "agent_id": agent_id,
            "status": "pending",
            "task_description": task_data.task_description,
            "created_at": datetime.utcnow()
        }
        
        logger.info(f"Task created for agent {agent_id}, task ID: {task_info['task_id']}.")
        
        return AgentTaskResponse(**task_info)
        
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.error(f"Error creating task for agent {agent_id}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to create task: {e}")

@router.get("/{agent_id}/tasks/{task_id}", response_model=AgentTaskResponse)
async def get_agent_task_status(
    agent_id: str,
    task_id: str,
    agent_manager: AgentManagerService = Depends(get_agent_manager_service),
    current_user: Any = Depends(get_current_user)
):
    """
    Récupère le statut et le résultat d'une tâche d'agent spécifique.
    """
    logger.info(f"Fetching status for task {task_id} of agent {agent_id} by user {current_user.email}.")
    
    # Le service devrait avoir une méthode pour récupérer le statut d'une tâche
    # task_status = await agent_manager.get_task_status(agent_id=agent_id, task_id=task_id)
    
    # Placeholder pour la réponse
    task_status = {
        "task_id": task_id,
        "agent_id": agent_id,
        "status": "completed", # Ou "in_progress", "failed"
        "task_description": "Example task description",
        "created_at": datetime.utcnow(),
        "completed_at": datetime.utcnow(),
        "result_summary": "Task completed successfully. Here is a brief summary...",
        "full_result": "Detailed result of the task execution."
    }
    
    if not task_status: # Si la tâche n'est pas trouvée ou n'appartient pas à cet agent/user
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found.")
        
    return AgentTaskResponse(**task_status)