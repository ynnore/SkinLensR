import os
import jwt
from datetime import datetime, timedelta
from fastapi import APIRouter, Request, HTTPException
from starlette.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth

router = APIRouter()
oauth = OAuth()

# --- Tes clés OAuth, à configurer en variables d'environnement ---
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "ton_google_client_id")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "ton_google_client_secret")
MICROSOFT_CLIENT_ID = os.getenv("MICROSOFT_CLIENT_ID", "ton_microsoft_client_id")
MICROSOFT_CLIENT_SECRET = os.getenv("MICROSOFT_CLIENT_SECRET", "ton_microsoft_client_secret")
INSTAGRAM_CLIENT_ID = os.getenv("INSTAGRAM_CLIENT_ID", "ton_instagram_client_id")
INSTAGRAM_CLIENT_SECRET = os.getenv("INSTAGRAM_CLIENT_SECRET", "ton_instagram_client_secret")
LINKEDIN_CLIENT_ID = os.getenv("LINKEDIN_CLIENT_ID", "ton_linkedin_client_id")
LINKEDIN_CLIENT_SECRET = os.getenv("LINKEDIN_CLIENT_SECRET", "ton_linkedin_client_secret")

# Clé secrète pour JWT (à stocker en variable d'environnement)
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "une_clef_secrete_pour_jwt")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60 * 24 * 7  # 7 jours

# Enregistrement des providers OAuth
oauth.register(
    name='google',
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'},
)

oauth.register(
    name='microsoft',
    client_id=MICROSOFT_CLIENT_ID,
    client_secret=MICROSOFT_CLIENT_SECRET,
    server_metadata_url='https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile User.Read'},
)

oauth.register(
    name='instagram',
    client_id=INSTAGRAM_CLIENT_ID,
    client_secret=INSTAGRAM_CLIENT_SECRET,
    access_token_url='https://api.instagram.com/oauth/access_token',
    authorize_url='https://api.instagram.com/oauth/authorize',
    api_base_url='https://graph.instagram.com/',
    client_kwargs={'scope': 'user_profile user_media'},
)

oauth.register(
    name='linkedin',
    client_id=LINKEDIN_CLIENT_ID,
    client_secret=LINKEDIN_CLIENT_SECRET,
    access_token_url='https://www.linkedin.com/oauth/v2/accessToken',
    authorize_url='https://www.linkedin.com/oauth/v2/authorization',
    api_base_url='https://api.linkedin.com/v2/',
    client_kwargs={'scope': 'r_liteprofile r_emailaddress'},
)

# Construction de l'URL de callback dynamique
def get_redirect_uri(request: Request, provider: str) -> str:
    host = request.url.hostname
    scheme = request.url.scheme
    # Adaptation possible vers ton frontend si besoin
    return f"{scheme}://{host}/auth/{provider}/callback"

# Création du JWT
def create_jwt_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt

# Route pour démarrer le login OAuth (redirige vers le provider)
@router.get("/login/{provider}")
async def login(request: Request, provider: str):
    try:
        client = oauth.create_client(provider)
    except Exception:
        raise HTTPException(status_code=404, detail=f"Provider inconnu ou non configuré: {provider}")
    redirect_uri = get_redirect_uri(request, provider)
    return await client.authorize_redirect(request, redirect_uri)

# Callback OAuth, gestion après authentification sur le provider
@router.get("/auth/{provider}/callback")
async def auth_callback(request: Request, provider: str):
    try:
        client = oauth.create_client(provider)
    except Exception:
        raise HTTPException(status_code=404, detail=f"Provider inconnu ou non configuré: {provider}")

    token = await client.authorize_access_token(request)

    if provider == "google":
        user_info = await client.parse_id_token(request, token)
    elif provider == "microsoft":
        user_info = await client.parse_id_token(request, token)
    elif provider == "instagram":
        resp = await client.get('me?fields=id,username,account_type')
        user_info = resp.json()
    elif provider == "linkedin":
        profile_resp = await client.get('me')
        email_resp = await client.get('emailAddress?q=members&projection=(elements*(handle~))')
        user_info = {
            "profile": profile_resp.json(),
            "email": email_resp.json(),
        }
    else:
        user_info = {}

    # Exemple simple: créer un JWT minimaliste avec quelques infos
    payload = {
        "sub": user_info.get("email") or user_info.get("profile", {}).get("emailAddress") or user_info.get("id") or "unknown",
        "name": user_info.get("name") or user_info.get("profile", {}).get("localizedFirstName") or "unknown",
        "provider": provider,
    }
    jwt_token = create_jwt_token(payload)

    # Redirige vers frontend (à adapter selon ton front)
    frontend_url = "https://kiwi-ops.com/dashboard"
    redirect_url = f"{frontend_url}?token={jwt_token}"

    return RedirectResponse(url=redirect_url)
