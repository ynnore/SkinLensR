# app/routes/__init__.py

# Import des routeurs depuis les modules
from .legal import router as legal_router
from .user import router as user_router

# Ici, tu peux importer d'autres routeurs si tu en as
# from .other_module import router as other_router

# Ensuite, dans ton main.py, tu pourras inclure tous ces routeurs au FastAPI app :
# from app.routes import legal_router, user_router
# app.include_router(legal_router)
# app.include_router(user_router)
