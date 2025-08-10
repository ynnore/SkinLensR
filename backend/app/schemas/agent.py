# /home/manik/skinlensr/SkinLensR/backend/app/schemas/agent.py
"""
Ce module contient les schémas Pydantic pour les agents IA.
Ils sont utilisés pour la validation des données entrantes et la structuration des réponses sortantes.
"""

import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional # Assurez-vous que Optional est bien importé ici
from pydantic import BaseModel, Field, validator # Assurez-vous que validator est bien importé

# --- Schémas pour la gestion des Agents ---

class AgentBase(BaseModel):
    """Modèle de base pour les données d'agent."""
    name: str = Field(..., example="KiwiAgent")
    role: str = Field(..., example="AI Assistant for productivity")
    description: Optional[str] = Field(None, example="Helps users manage tasks and find information.")
    # Potentiellement d'autres configurations ici :
    # llm_model_name: Optional[str] = Field(None, example="gpt-3.5-turbo")
    # tools_config: Optional[List[Dict[str, Any]]] = Field(None, example=[{"name": "search_web", "description": "Search the web"}])

class AgentCreate(AgentBase):
    """Schéma pour la création d'un nouvel agent."""
    # Si vous avez des champs spécifiques à la création (ex: mot de passe pour un agent, s'il y en a)
    pass # Hérite de AgentBase

class AgentUpdate(BaseModel):
    """Schéma pour la mise à jour des données d'un agent."""
    # Tous les champs sont optionnels car on peut vouloir ne mettre à jour qu'un seul champ.
    name: Optional[str] = Field(None, example="Updated Agent Name")
    role: Optional[str] = Field(None, example="Productivity enhancer")
    description: Optional[str] = Field(None, example="Improved productivity assistant.")
    # Ajoutez ici d'autres champs modifiables comme llm_model_name, tools_config, etc.

    # --- Validateur pour s'assurer qu'au moins un champ modifiable est fourni ---
    # Il est important de spécifier les champs sur lesquels ce validateur s'applique.
    # Pydantic V1 : le décorateur @validator peut être appliqué à plusieurs champs.
    # Pydantic V2 utilise @field_validator et @model_validator.
    # Pour Pydantic V1, le décorateur s'applique à chacun des champs listés.
    # La logique interne doit vérifier que parmi les champs fournis, il y en a au moins un.
    
    @validator('name', 'role', 'description', # Listez ici TOUS les champs qui peuvent être mis à jour
               pre=True, # Exécuter avant la validation Pydantic standard des champs
               always=True # Toujours exécuter, même si le champ n'est pas présent
    )
    def check_at_least_one_field(cls, v, values, **kwargs):
        """
        Valide qu'au moins un des champs modifiables (name, role, description) est fourni.
        'v' est la valeur du champ sur lequel le validateur est appliqué (ex: 'name').
        'values' est le dictionnaire de toutes les valeurs fournies pour ce modèle.
        """
        # Liste des champs qui peuvent être mis à jour. Adaptez cette liste.
        updatable_fields = ['name', 'role', 'description'] 
        
        # On vérifie que PARMI les données fournies (dans 'values'), il y a au moins un champ non-None.
        # `values.get(field)` récupère la valeur du champ, ou None s'il n'est pas présent.
        # `is not None` s'assure qu'on ne considère pas les champs présents mais avec une valeur None comme étant fournis.
        # `any(...)` retourne True si au moins une des conditions est vraie.
        if not any(values.get(field) is not None for field in updatable_fields):
            raise ValueError("At least one field (name, role, or description) must be provided for update.")
        
        # Retourne la valeur actuelle du champ 'v' pour que Pydantic continue la validation normale.
        return v

class AgentResponse(AgentBase):
    """Schéma pour la réponse API lors de la récupération d'un agent."""
    id: str = Field(..., example="a1b2c3d4-e5f6-7890-abcd-ef1234567890")
    status: str = Field(..., example="active") # Statut de l'agent (ex: 'active', 'inactive', 'training')
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        # Si vous utilisez Pydantic V1, orm_mode est utilisé pour mapper à partir de modèles SQLAlchemy.
        # Si vous passez à Pydantic V2, ceci deviendra `from_attributes = True`.
        orm_mode = True 
        json_encoders = {
            datetime: lambda v: v.isoformat() # Convertit datetime en string ISO pour JSON
        }

# --- Schémas pour la gestion des Tâches d'Agent ---

class AgentTaskBase(BaseModel):
    """Modèle de base pour une tâche d'agent."""
    task_description: str = Field(..., example="Analyze the user's latest message and provide a summary.")
    params: Optional[Dict[str, Any]] = Field(None, example={"temperature": 0.7, "max_tokens": 150})
    status: str = Field("pending", example="pending") # Statut de la tâche (pending, processing, completed, failed)

class AgentTaskCreate(AgentTaskBase):
    """Schéma pour la création d'une tâche d'agent."""
    pass # Hérite de AgentTaskBase

class AgentTaskResponse(AgentTaskBase):
    """Schéma pour la réponse API lors de la gestion des tâches d'agent."""
    task_id: str = Field(default_factory=lambda: str(uuid.uuid4()), example="t1a2b3c4-d5e6-7890-f1a2-b3c4d5e6f7a8")
    agent_id: str = Field(..., example="a1b2c3d4-e5f6-7890-abcd-ef1234567890")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    result_summary: Optional[str] = Field(None, example="Task successfully completed, summary of the output.")
    full_result: Optional[str] = Field(None, example="Detailed output or result of the agent's task.")

    class Config:
        orm_mode = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }