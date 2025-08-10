from sqlalchemy.orm import Session
from typing import List
from app.models.agent_document import AgentDocument  # Assure-toi que ce modèle existe bien
from app.schemas.agent_document import AgentDocumentCreate

def get_agent_documents(db: Session) -> List[AgentDocument]:
    return db.query(AgentDocument).all()

def create_agent_document(db: Session, agent_document_data: AgentDocumentCreate) -> AgentDocument:
    new_doc = AgentDocument(**agent_document_data.dict())
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc
