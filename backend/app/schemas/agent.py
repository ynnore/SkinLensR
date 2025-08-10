# /home/manik/skinlensr/SkinLensR/backend/app/schemas/agent.py

import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field, validator

# --- Schémas pour la gestion des Agents ---

class AgentBase(BaseModel):
    """Modèle de base pour les données d'agent."""
    name: str = Field(..., example="KiwiAgent")
    role: str = Field(..., example="AI Assistant for productivity")
    description: Optional[str] = Field(None, example="Helps users manage tasks and find information.")
    # Vous pourriez ajouter d'autres configurations ici : modèle LLM à utiliser, outils disponibles, etc.
    # llm_model_name: Optional[str] = None
    # tools_config: Optional[List[Dict[str, Any]]] = None

class AgentCreate(AgentBase):
    """Schéma pour la création d'un nouvel agent."""
    # Pas de champs supplémentaires requis pour la création par défaut, tout est dans AgentBase.
    # Si le type d'agent doit être spécifié à la création :
    # agent_type: str = Field(..., example="general_assistant")
    pass

class AgentUpdate(BaseModel):
    """Schéma pour la mise à jour des données d'un agent."""
    name: Optional[str] = Field(None, example="Updated KiwiAgent Name")
    role: Optional[str] = Field(None, example="Productivity enhancer")
    description: Optional[str] = Field(None, example="Improved productivity assistant.")
    # Potentiellement d'autres champs configurables
    # llm_model_name: Optional[str] = None
    # tools_config: Optional[List[Dict[str, Any]]] = None

    # Validateur pour s'assurer qu'au moins un champ est fourni pour la mise à jour
    @validator('name', 'role', 'description', 'llm_model_name', 'tools_config', pre=True, always=True)
    def check_at_least_one_field(cls, v, values, **kwargs):
        if not any(values.values()):
            raise ValueError("At least one field must be provided for update.")
        return v

class AgentResponse(AgentBase):
    """Schéma pour la réponse API lors de la récupération d'un agent."""
    id: str = Field(..., example="a1b2c3d4-e5f6-7890-abcd-ef1234567890")
    status: str = Field(..., example="active") # Statut de l'agent (ex: 'active', 'inactive', 'training')
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        orm_mode = True # Permet de mapper directement à partir des modèles SQLAlchemy si vous en avez

# --- Schémas pour la gestion des Tâches d'Agent ---

class AgentTaskBase(BaseModel):
    """Modèle de base pour une tâche d'agent."""
    task_description: str = Field(..., example="Analyze the user's latest message and provide a summary.")
    params: Optional[Dict[str, Any]] = Field(None, example={"temperature": 0.7, "max_tokens": 150})
    status: str = Field("pending", example="pending") # Statut de la tâche (pending, in_progress, completed, failed)

class AgentTaskCreate(AgentTaskBase):
    """Schéma pour la création d'une tâche d'agent."""
    # Pas de champs supplémentaires requis pour la création par défaut.
    pass

class AgentTaskResponse(AgentTaskBase):
    """Schéma pour la réponse API lors de la gestion des tâches d'agent."""
    task_id: str = Field(default_factory=lambda: str(uuid.uuid4()), example="t1a2b3c4-d5e6-7890-f1a2-b3c4d5e6f7a8")
    agent_id: str = Field(..., example="a1b2c3d4-e5f6-7890-abcd-ef1234567890")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    result_summary: Optional[str] = Field(None, example="Task successfully completed, summary of the output.")
    full_result: Optional[str] = Field(None, example="The detailed output or result of the agent's task.")

    # Si vous utilisez un modèle SQLAlchemy, vous pourriez vouloir une configuration orm_mode
    class Config:
        orm_mode = True
        # Permet d'utiliser des générateurs de UUID pour les task_id par défaut
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }