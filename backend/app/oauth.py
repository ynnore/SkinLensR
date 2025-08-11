from fastapi import APIRouter, Request, HTTPException
from starlette.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth

router = APIRouter()
oauth = OAuth()

# TODO : remplacer par tes vraies clés dans un fichier config / variables d'environnement
GOOGLE_CLIENT_ID = "ton_google_client_id"
GOOGLE_CLIENT_SECRET = "ton_google_client_secret"

MICROSOFT_CLIENT_ID = "ton_microsoft_client_id"
MICROSOFT_CLIENT_SECRET = "ton_microsoft_client_secret"

INSTAGRAM_CLIENT_ID = "ton_instagram_client_id"
INSTAGRAM_CLIENT_SECRET = "ton_instagram_client_secret"

LINKEDIN_CLIENT_ID = "ton_linkedin_client_id"
LINKEDIN_CLIENT_SECRET = "ton_linkedin_client_secret"

# Register providers

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

# Helper to build redirect URI dynamically
def get_redirect_uri(request: Request, provider: str) -> str:
    host = request.url.hostname
    scheme = request.url.scheme
    # Tu peux modifier le domaine ou ajouter ton frontend ici
    return f"{scheme}://{host}/auth/{provider}/callback"

# Routes login (redirige vers le provider)

@router.get("/login/{provider}")
async def login(request: Request, provider: str):
    if provider not in oauth:
        raise HTTPException(status_code=404, detail="Provider inconnu")
    redirect_uri = get_redirect_uri(request, provider)
    return await oauth.create_client(provider).authorize_redirect(request, redirect_uri)

# Callback OAuth

@router.get("/auth/{provider}/callback")
async def auth_callback(request: Request, provider: str):
    if provider not in oauth:
        raise HTTPException(status_code=404, detail="Provider inconnu")

    client = oauth.create_client(provider)
    token = await client.authorize_access_token(request)

    # Récupérer user info selon provider
    if provider == "google":
        user_info = await client.parse_id_token(request, token)
    elif provider == "microsoft":
        user_info = await client.parse_id_token(request, token)
    elif provider == "instagram":
        user_info = await client.get('me?fields=id,username,account_type')
        user_info = user_info.json()
    elif provider == "linkedin":
        # Exemple basique : récupérer profil et email
        profile = await client.get('me')
        email_resp = await client.get('emailAddress?q=members&projection=(elements*(handle~))')
        user_info = {
            "profile": profile.json(),
            "email": email_resp.json(),
        }
    else:
        user_info = {}

    # Ici : gérer création / connexion user dans ta base, renvoyer JWT, etc.
    return user_info
