from sqlalchemy.orm import Session
from app.models.memory import Memory

def create_memory(db: Session, user_id: int, role: str, content: str) -> Memory:
    db_memory = Memory(user_id=user_id, role=role, content=content)
    db.add(db_memory)
    db.commit()
    db.refresh(db_memory)
    return db_memory

def get_memories_for_user(db: Session, user_id: int, limit: int = 20):
    return (
        db.query(Memory)
        .filter(Memory.user_id == user_id)
        .order_by(Memory.created_at.desc())
        .limit(limit)
        .all()
    )
