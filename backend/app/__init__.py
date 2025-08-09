"""
Package `app`

Ce dossier contient le code backend principal de l'application SkinLensR :
- **models/** : Définitions des modèles SQLAlchemy (structure des tables en base de données).
- **schemas/** : Définitions des schémas Pydantic pour la validation et la sérialisation.
- **routers/** : Endpoints FastAPI organisés par domaine.
- **routes/** : Autre organisation de routes ou API spécifiques.
- **core/** (si présent) : Configuration centrale, sécurité, dépendances globales.

Ce fichier rend `app` utilisable comme un package Python et peut exposer certains objets
au niveau du package si nécessaire.
"""

# Exemple : Importer ici des éléments utiles pour un accès direct depuis `app`
# from .main import app  # <- si tu veux rendre l'application FastAPI disponible depuis app

# On pourrait aussi exposer des constantes ou paramètres globaux
# VERSION = "1.0.0"
