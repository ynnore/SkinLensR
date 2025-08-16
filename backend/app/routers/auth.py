import logging
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

# ==============================================================================
# SECTION: Imports Corrigés et Organisés
# ==============================================================================
# La structure d'importation est cruciale pour éviter les erreurs de "dépendance circulaire".

# 1. Import des schémas Pydantic pour la validation des données entrantes et sortantes.
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import Token

# 2. CORRECTION PRINCIPALE : Importation spécifique du module CRUD pour l'utilisateur.
# Au lieu d'importer le package `crud` entier (`from app import crud`), nous importons
# le module `user.py` qui s'y trouve et nous lui donnons un alias clair (`crud_user`).
# CELA RÉSOUT L'ERREUR "TypeError: 'NoneType' object is not callable".
from app.crud import user as crud_user

# 3. Import des fonctions de sécurité (création de token, hashage de mdp).
# Il est recommandé de regrouper ces fonctions dans un module `security.py`.
from app.core import security

# 4. Import des dépendances FastAPI.
from app.database import get_db  # Dépendance pour obtenir une session de base de données.
from app.core.dependencies import get_current_user_dependency  # Dépendance pour protéger les routes.

# ==============================================================================
# Configuration du routeur
# ==============================================================================

# Création d'une instance de APIRouter.
# Tous les endpoints définis dans ce fichier auront le préfixe "/auth"
# et seront regroupés sous le tag "Authentication" dans la documentation Swagger.
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# Configuration du logger pour ce fichier.
logger = logging.getLogger(__name__)

# ==============================================================================
# Schémas Pydantic pour les requêtes de ce routeur
# ==============================================================================

class ForgotPasswordRequest(BaseModel):
    """Schéma pour la demande de réinitialisation de mot de passe."""
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    """Schéma pour la soumission du nouveau mot de passe avec un token."""
    token: str
    new_password: str

# ==============================================================================
# Endpoints (Routes) d'Authentification
# ==============================================================================

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Endpoint pour l'enregistrement d'un nouvel utilisateur.
    """
    logger.info(f"Tentative d'enregistrement pour l'email : {user_data.email}")

    # On utilise maintenant notre alias `crud_user` pour appeler la fonction.
    existing_user = crud_user.get_user_by_email(db, user_data.email)
    if existing_user:
        logger.warning(f"L'email {user_data.email} est déjà enregistré.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un utilisateur avec cet email existe déjà."
        )
    
    # Appel de la fonction de création du CRUD, toujours via l'alias.
    new_user = crud_user.create_user(db=db, user_data=user_data)
    if not new_user:
        logger.error(f"Échec de la création de l'utilisateur {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Une erreur interne est survenue lors de la création de l'utilisateur."
        )

    logger.info(f"Utilisateur {new_user.email} enregistré avec succès.")
    # On utilise model_validate pour s'assurer que la réponse correspond bien au schéma UserResponse.
    return UserResponse.model_validate(new_user)


@router.post("/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Endpoint pour la connexion. Utilise le format standard OAuth2.
    Le "username" est en réalité l'adresse email.
    """
    logger.info(f"Tentative de connexion pour : {form_data.username}")
    
    # La fonction `authenticate_user` du CRUD gère la récupération de l'utilisateur
    # ET la vérification du mot de passe de manière sécurisée.
    user = crud_user.authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        logger.warning(f"Tentative de connexion invalide pour : {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect",
            headers={"WWW-Authenticate": "Bearer"},  # En-tête standard pour les erreurs 401
        )

    # Création du jeton JWT si l'authentification réussit.
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        # Le "subject" du token est l'email. On peut y ajouter d'autres infos (claims).
        data={"sub": user.email, "role": user.role.value}, # .value est plus sûr pour les enums
        expires_delta=access_token_expires
    )

    logger.info(f"Connexion réussie pour {user.email}")
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: UserResponse = Depends(get_current_user_dependency)):
    """
    Endpoint protégé pour récupérer les informations de l'utilisateur actuellement connecté.
    La dépendance `get_current_user_dependency` gère la validation du token JWT.
    """
    logger.info(f"Récupération du profil pour : {current_user.email}")
    return current_user


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Endpoint pour démarrer le processus de réinitialisation de mot de passe.
    """
    # Note de sécurité : On ne révèle jamais si l'email existe ou non.
    user = crud_user.get_user_by_email(db, request.email)
    if user:
        token = security.create_reset_password_token(user.email)
        reset_link = f"https://votre-frontend.com/reset-password?token={token}"
        logger.info(f"Lien de réinitialisation généré pour {user.email}: {reset_link}")
        #
        # ICI, VOUS DEVEZ AJOUTER LE CODE POUR ENVOYER UN EMAIL À L'UTILISATEUR
        # avec le `reset_link`. Utilisez une librairie comme `fastapi-mail`.
        #
    
    # On retourne le même message dans tous les cas pour ne pas fuiter d'information.
    return {
        "message": "Si un compte est associé à cet email, un lien de réinitialisation a été envoyé."
    }


@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Endpoint pour finaliser la réinitialisation avec le token et le nouveau mot de passe.
    """
    email = security.verify_reset_password_token(request.token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Le token de réinitialisation est invalide ou a expiré."
        )

    user = crud_user.get_user_by_email(db, email)
    if not user:
        # Normalement, ne devrait pas arriver si le token est valide, mais c'est une sécurité supplémentaire.
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur introuvable."
        )

    # On utilise la fonction de mise à jour du CRUD pour changer le mot de passe.
    # Il est plus propre de passer par la fonction `update_user` générale.
    crud_user.update_user(db, user=user, updates=UserUpdate(password=request.new_password))
    logger.info(f"Le mot de passe pour {email} a été réinitialisé avec succès.")

    return {"message": "Votre mot de passe a été réinitialisé avec succès."}