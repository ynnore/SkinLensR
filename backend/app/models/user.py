from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship, Session
from app.models.base import Base
# Ajout dans /home/manik/skinlensr/SkinLensR/backend/app/models/user.py

from sqlalchemy.orm import relationship
from app.models.progress import Progress

class User(Base):
    __tablename__ = "users"

    # ... autres champs

    progress = relationship("Progress", back_populates="user", uselist=False)  # Relation avec Progress

# Fonction pour récupérer un utilisateur par son email
def get_user_by_email(db: Session, email: str):
    # Importation locale pour éviter une boucle circulaire
    from app.models.user import User
    return db.query(User).filter(User.email == email).first()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)  # Email ne peut pas être NULL
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user", nullable=False)  # Valeur par défaut "user" et non NULL

    # Utilisation du chemin complet vers le modèle lié pour la relation
    legal_agreements = relationship(
        "app.models.user_legal_agreement.UserLegalAgreement",  # Chemin complet pour éviter l'erreur
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', role='{self.role}')>"
