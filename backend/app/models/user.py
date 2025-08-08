# app/models/user.py
# Modèle User représentant les utilisateurs de l'application,
# avec relations vers Progress et UserLegalAgreement

from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.models.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)

    # Relation avec Progress, uselist=False car 1 seul progrès par utilisateur (exemple)
    progress = relationship("Progress", back_populates="user", uselist=False)

    # Relation avec UserLegalAgreement pour les accords juridiques signés par l'utilisateur
    legal_agreements = relationship(
        "app.models.user_legal_agreement.UserLegalAgreement",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', role='{self.role}')>"

# Exemple de fonction pour récupérer un utilisateur par email dans la DB
def get_user_by_email(db, email: str):
    from app.models.user import User
    return db.query(User).filter(User.email == email).first()
