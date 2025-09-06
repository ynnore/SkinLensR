# backend/app/routers/google_auth.py

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
import os
import google.auth.oauthlib.flow
import google.auth.transport.requests
import google.oauth2.id_token
import requests # Pour les appels API
import logging
from datetime import timedelta
from typing import Dict, Any

# --- Imports de votre projet ---
from app.core.security import create_access_token # Pour générer le JWT
from app.crud import user as crud_user
from app.schemas.user import UserCreate, UserResponse # Adaptez UserCreate si nécessaire pour Google ID
from app.database import get_db
from app.core.config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, SCOPES, ACCESS_TOKEN_EXPIRE_MINUTES # Assurez-vous que ces variables sont chargées

logger = logging.getLogger(__name__)

# Schéma pour le callback (réception du code)
class GoogleAuthCallback(BaseModel):
    code: str
    state: str

# Schéma pour la réponse d'URL d'authentification
class AuthUrlResponse(BaseModel):
    url: str

router = APIRouter(
    prefix="/auth", # Le préfixe /auth sera appliqué à toutes les routes de ce fichier s'il est inclus dans main.py avec ce préfixe
    tags=["Authentication - Google"]
)

# --- Fonctions d'aide pour Google OAuth ---

# Cette fonction devra être appelée pour obtenir le flux et l'URL d'autorisation
def get_google_oauth_flow():
    """Crée et retourne un objet Flow pour Google OAuth."""
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Google OAuth configuration is missing.")

    flow = google.oauth2.oauthlib.flow.Flow.from_client_config(
        {
            "installed": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uris": [GOOGLE_REDIRECT_URI], # Devrait être l'URL de votre callback backend
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "scopes": SCOPES,
            }
        },
        state=os.urandom(32) # State pour la sécurité CSRF
    )
    return flow

# --- Routes ---

@router.get("/google/login", response_model=AuthUrlResponse) # ou RedirectResponse si le backend redirige directement
async def google_login(request: Request):
    """
    Déclenche le flux OAuth Google en fournissant l'URL d'autorisation.
    """
    try:
        flow = get_google_oauth_flow()
        
        # Stocker l'état dans la session (nécessite que la session soit configurée dans FastAPI)
        # Pour FastAPI, vous pourriez utiliser une dépendance de session ou un cookie.
        # Ici, on simule le stockage et le renvoi direct de l'URL.
        authorization_url, state = flow.authorization_url(prompt='consent', access_type='offline')
        
        # En production, vous devez stocker cet état (ex: dans une base de données liée à la session ou au token temporaire)
        # pour pouvoir le vérifier au callback. Pour l'instant, nous allons le renvoyer
        # et le front-end devra le gérer.
        
        logger.info(f"Redirection vers Google pour authentification: {authorization_url}")
        return {"url": authorization_url, "state": state} # Le front-end utilisera cette URL pour rediriger

    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Erreur lors de la génération de l'URL Google OAuth: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Impossible de démarrer le flux Google.")

@router.post("/google/callback") # Ou GET si Google redirige directement avec le code
async def google_callback(request: Request, db: Session = Depends(get_db)):
    """
    Callback après que l'utilisateur ait autorisé l'accès.
    Reçoit le code et le state, échange le code contre des tokens, récupère les infos utilisateur,
    crée/associe l'utilisateur et génère un JWT.
    """
    # Récupérer le code et le state de la requête
    # Si Google redirige avec le code dans les paramètres de l'URL (méthode la plus courante pour le callback)
    code = request.query_params.get('code')
    state = request.query_params.get('state')

    if not code or not state:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Code d'autorisation ou état manquant.")

    # Récupérer l'état stocké lors de la demande initiale (doit être géré via la session Flask/FastAPI)
    # Ceci est une simulation, vous devrez utiliser une vraie gestion de session ici.
    stored_state = request.state.oauth_state if hasattr(request.state, 'oauth_state') else None 
    if not stored_state or state != stored_state:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid state parameter.")

    try:
        flow = get_google_oauth_flow() # Recréez le flux
        flow.fetch_token(authorization_response=str(request.url)) # Le callback reçoit l'URL complète

        credentials = flow.credentials
        
        # Vérification du token d'identité pour obtenir les infos utilisateur
        id_info = google.oauth2.id_token.verify_oauth2_token(
            credentials.id_token,
            google.auth.transport.requests.Request(),
            audience=GOOGLE_CLIENT_ID # Assurez-vous que GOOGLE_CLIENT_ID est correct
        )
        
        user_email = id_info.get("email")
        user_name = id_info.get("name")
        user_picture = id_info.get("picture")

        if not user_email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Impossible de récupérer l'email de l'utilisateur.")

        # --- Gestion utilisateur dans votre DB ---
        # Chercher l'utilisateur par email Google
        user = crud_user.get_user_by_email(db, user_email)
        
        if not user:
            # Créer un nouvel utilisateur (adaptez UserCreate ou créez un schéma spécifique si besoin)
            logger.info(f"Nouvel utilisateur Google détecté : {user_email}. Création du compte.")
            # Il faut une façon de gérer le mot de passe pour les utilisateurs Google, ou un flag spécifique.
            # On pourrait générer un mot de passe aléatoire et le marquer comme 'google_user'.
            user_data_google = UserCreate(
                email=user_email,
                name=user_name,
                password="GOOGLE_SIGNIN_PLACEHOLDER_PASSWORD", # Mot de passe non utilisé pour la connexion Google
                google_id=id_info.get("sub"), # L'ID unique de l'utilisateur Google
                profile_picture=user_picture,
                is_google_user=True # Flag pour indiquer que l'authentification principale est Google
            )
            user = crud_user.create_user(db=db, user_data=user_data_google)
            if not user:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erreur lors de la création de l'utilisateur Google.")
        else:
            # Si l'utilisateur existe, on peut associer son compte Google
            logger.info(f"Utilisateur Google existant trouvé : {user_email}. Association du compte.")
            if not user.google_id: # Si l'utilisateur s'était inscrit par email auparavant
                user.google_id = id_info.get("sub")
                user.profile_picture = user_picture
                # Assurez-vous que votre modèle User et votre fonction update_user supportent ces champs
                # Il faudra peut-être une fonction spécifique pour mettre à jour avec les données Google
                crud_user.update_user(db, user=user, updates={"google_id": user.google_id, "profile_picture": user.profile_picture}) # Exemple

        # --- Génération du Token JWT ---
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        # Créez une fonction dans security.py pour gérer la génération de token
        access_token = security.create_access_token(
            data={"sub": user.email, "role": user.role.value if user.role else "user"}, # Ajustez 'role' selon votre modèle
            expires_delta=access_token_expires
        )

        # Retourner le token au front-end ou rediriger
        # Pour une SPA, retourner le token en JSON est préférable
        return {"access_token": access_token, "token_type": "bearer"}

    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Erreur lors du traitement du callback Google: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Erreur lors de l'authentification Google.")