from sqlalchemy.orm import Session
from app.models.legal_document import LegalDocument
from app.models.agent import Agent  # Assurez-vous que l'Agent est bien importé

def get_agent_document(db: Session, agent_id: int, document_type: str):
    """
    Récupère un document juridique spécifique pour un agent donné son ID et le type de document.
    """
    return db.query(LegalDocument).filter(
        LegalDocument.type == document_type, 
        LegalDocument.agents.any(id=agent_id)
    ).first()

def create_agent_document(
    db: Session,
    agent_id: int,
    document_type: str,
    content: str
) -> LegalDocument:
    """
    Crée un document juridique pour un agent donné son ID et le type de document.
    """
    # Crée le document
    document = LegalDocument(
        type=document_type,
        content=content,
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    # Lier le document à l'agent
    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if agent:
        document.agents.append(agent)  # Ajoute l'agent à la relation many-to-many
        db.commit()
    
    return document
