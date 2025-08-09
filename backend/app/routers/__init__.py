# backend/app/routers/__init__.py
from . import auth
from . import progress
from . import scan # <-- Assurez-vous que cette ligne est présente
from . import user

__all__ = [
    "auth",
    "progress",
    "scan", # <-- Assurez-vous que cette ligne est présente
    "user",
]