import os
from dotenv import load_dotenv

load_dotenv()

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.environ.get("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/callback")

# Scopes Google (exemple : contacts readonly)
SCOPES = ["https://www.googleapis.com/auth/contacts.readonly"]

# Expiration du token en minutes
ACCESS_TOKEN_EXPIRE_MINUTES = 60
