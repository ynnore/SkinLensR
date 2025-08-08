from fastapi import APIRouter

# Importation des routeurs définis dans chaque module
from app.routers.user import router as user_router
from app.routers.legal import router as legal_router
from app.routers.progress import router as progress_router

# Création d'un routeur principal qui va regrouper tous les sous-routeurs
router = APIRouter()

# Inclusion du routeur utilisateur avec un préfixe d'URL et un tag pour la documentation OpenAPI
router.include_router(user_router, prefix="/users", tags=["users"])

# Inclusion du routeur des documents légaux avec son préfixe et tag
router.include_router(legal_router, prefix="/legal_documents", tags=["legal_documents"])

# Inclusion du routeur de progression avec son préfixe et tag
router.include_router(progress_router, prefix="/progress", tags=["progress"])
