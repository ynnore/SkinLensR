# app/models/user.py
# Modèle User représentant les utilisateurs de l'application,
# avec relations vers Progress et UserLegalAgreement

from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.models.base import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    # autres colonnes...

    files = relationship("File", back_populates="user")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)  # Nouveau champ

    # Relation avec Progress : un utilisateur peut avoir un seul "progress"
    progress = relationship(
        "Progress",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )

    # Relation avec UserLegalAgreement : un utilisateur peut avoir plusieurs accords
    legal_agreements = relationship(
        "UserLegalAgreement",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return (
            f"<User(id={self.id}, username='{self.username}', "
            f"role='{self.role}', active={self.is_active})>"
        )


# Exemple de fonction utilitaire
def get_user_by_email(db, email: str):
    """Retourne un utilisateur depuis son email"""
    return db.query(User).filter(User.email == email).first()
