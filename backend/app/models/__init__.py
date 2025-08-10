# /home/manik/skinlensr/SkinLensR/backend/app/models/__init__.py
"""
Ce package centralise tous les modèles SQLAlchemy du projet.
Il assure que tous les modules de modèles sont connus par SQLAlchemy.
"""

# --- Importation de la Base Déclarative ---
# Ceci est le seul import absolument nécessaire ici pour que SQLAlchemy
# puisse ensuite trouver et mapper tous les modèles définis dans les sous-modules.
from .base import Base

# --- Liste des Modèles Publics ---
# Normalement, vous n'avez pas besoin de ré-exposer les modèles ici si vous
# les importez dans les fichiers spécifiques (user.py, agent.py, etc.).
# L'acte d'importer `from .user import User` dans app/models/__init__.py
# (ce qui causait l'erreur) est suffisant pour enregistrer le modèle avec Base.
# Si vos modèles s'importent correctement les uns les autres sans aide externe,
# et que app/models/__init__.py n'a pas besoin d'importer les modèles,
# alors ce fichier peut être vide.

# --- Simplification ---
# L'import de `from .user_legal_agreement import UserLegalAgreement` dans app/models/__init__.py
# était probablement ce qui causait le circular import, car user_legal_agreement.py
# importe aussi des choses d'autres modèles.

# Il est généralement suffisant d'avoir le `__init__.py` pour que le répertoire soit reconnu comme un package.
# SQLAlchemy enregistrera les modèles dès qu'ils seront définis dans leurs fichiers respectifs
# (qui eux-mêmes importent `Base`).

# Si vous avez besoin d'importer quelque chose ici pour une raison spécifique,
# assurez-vous que l'importation n'est pas circulaire.
# Si le problème vient de la façon dont `user_legal_agreement` importe les autres,
# il faudrait ajuster les imports DANS `user_legal_agreement.py` pour qu'ils soient absolus
# (ex: `from app.models.user import User`) ou pour casser le cycle.

# Pour l'instant, essayons le contenu le plus simple et le plus propre possible :

# Si la seule chose nécessaire est que le package soit reconnu, un fichier vide suffit.
# Cependant, pour s'assurer que Base est disponible :
# (Le contenu précédent importait Base, donc gardons cela si c'est la façon dont vous structurez)

# Si votre `app.models.base` ne gère pas toutes les initialisations,
# alors l'import de `Base` ici est pertinent.

# Si vous aviez des imports de modèles dans __init__.py qui cause le problème,
# il faut les enlever. Laissez seulement les imports nécessaires à l'initialisation du package.
# L'import de Base est généralement suffisant.

# Le problème semble venir de l'import de `UserLegalAgreement` DANS __init__.py,
# qui à son tour importe d'autres modèles, créant le cycle.
# Si vous supprimez cet import et le `__all__` de UserLegalAgreement de __init__.py,
# et que les modèles eux-mêmes importent correctement Base, cela devrait résoudre le circular import.

# Donc, le contenu le plus propre pour __init__.py, en supposant que les modèles
# importent correctement Base et que __all__ n'est pas strictement nécessaire ici
# pour la création des tables (car c'est Base.metadata.create_all qui le fait), serait :

# Fichier __init__.py vide ou avec juste le logger/Base importé:
# from .base import Base # Important si d'autres fichiers du package importent Base via app.models

# Ou si vous avez besoin d'exposer des choses :
# from .user import User # Si vous voulez que User soit accessible directement via app.models.User
# etc. MAIS si cela crée un cycle, il faut éviter ces imports ici.

# SOLUTION POUR LE CIRCULAR IMPORT SPÉCIFIQUE DE USER_LEGAL_AGREEMENT:
# L'erreur vient de user_legal_agreement.py qui importe d'autres modèles.
# Si app/models/__init__.py importe UserLegalAgreement, et que user_legal_agreement.py
# importe User et LegalDocument, et que ces derniers importent potentiellement d'autres choses
# qui ramènent à user_legal_agreement, cela crée un cycle.

# La meilleure approche est que :
# 1. app/models/__init__.py importe seulement les choses nécessaires à l'initialisation du package (comme Base).
# 2. Les fichiers de modèles individuels (user.py, legal_document.py, user_legal_agreement.py) importent
#    DIRECTEMENT ce dont ils ont besoin, sans passer par __init__.py. Par exemple :
#    Dans user_legal_agreement.py :
#    from app.models.user import User
#    from app.models.legal_document import LegalDocument
#    Et dans user.py :
#    from app.models.user_legal_agreement import UserLegalAgreement # si nécessaire

# Corrigeons app/models/__init__.py et suppressons l'import qui pose problème.

# Supprimer la ligne qui cause le problème:
# from .user_legal_agreement import UserLegalAgreement # Supprimez cette ligne !

# Si vous voulez toujours exposer UserLegalAgreement publiquement via app.models
# alors vous devrez gérer le cycle d'importation. L'idéal est de le garder
# dans son propre fichier et d'importer ce dont il a besoin directement.

# Recommandation : Gardez l'import de Base et essayez de supprimer
# tous les autres imports de modèles ici s'ils ne sont pas absolument nécessaires
# pour que SQLAlchemy connaisse les tables. Si un routeur ou service a besoin de User,
# il importera `from app.models.user import User` directement.

# Version simplifiée et plus sûre :
# from .base import Base # Assurez-vous que Base est bien disponible

# __all__ = ["Base"] # Et seulement Base si c'est la seule chose publiquement exposée

# Si vous voulez toujours que les modèles soient accessibles via app.models.User, etc.,
# alors la gestion des imports dans les fichiers modèles eux-mêmes est la clé.
# Si user_legal_agreement.py importe `app.models.user`, et `user.py` importe `app.models.user_legal_agreement`,
# le cycle existe.

# Pour casser le cycle en gardant les imports dans __init__.py:
# 1. Dans app/models/__init__.py, supprimez `from .user_legal_agreement import UserLegalAgreement` et `UserLegalAgreement` de `__all__`.
# 2. Dans app/models/user_legal_agreement.py, remplacez `from app.models.user import User` par `from app.models.user import User` (si User est directement importable sans cycle)
#    et `from app.models.legal_document import LegalDocument`.
#    Si user.py ou legal_document.py importent des choses de user_legal_agreement, le cycle persiste.
#    Il faut casser le cycle en utilisant des imports absolus (`from app.models.user import User` partout)
#    et en retirant les imports réflexifs dans __init__.py.


# --- Tentative de correction pour casser le cycle ---
# On enlève l'import de user_legal_agreement de ici, car c'est souvent ce qui crée le cycle.
# Les modèles devraient être importés directement par les fichiers qui en ont besoin (services, crud).

# Si vous avez besoin d'exposer les modèles via __all__ pour une raison spécifique,
# alors la gestion des imports dans les fichiers modèles individuels devient encore plus critique.

# Content final de app/models/__init__.py pour la sécurité et la clarté :
from .base import Base

# Importez seulement ce qui est absolument nécessaire ici, ou rien si Base est suffisant.
# Si les modèles s'importent entre eux et que cela cause un problème,
# la meilleure pratique est de ne rien importer dans __init__.py sauf Base.
# Les fichiers qui ont besoin des modèles importeront directement depuis leurs fichiers.
# Ex: from app.models.user import User

# Si vous voulez quand même exposer les modèles pour un accès facile :
# from .user import User
# from .legal_document import LegalDocument
# from .progress import Progress
# from .agent import Agent
# from .drive import DriveFile
# from .scan import ScanRequestModel # Si vous en avez créé un

# __all__ = [
#     "Base",
#     "User",
#     "LegalDocument",
#     "Progress",
#     "Agent",
#     "DriveFile",
#     "ScanRequestModel",
# ]

# Étant donné l'erreur de circular import, la meilleure approche est de laisser ce fichier aussi vide que possible,
# sauf pour l'import de Base, et de s'assurer que les imports dans les fichiers modèles individuels
# sont corrects (sans s'importer mutuellement de manière réflexive dans __init__.py).

# Donc, le contenu le plus sûr et le plus probable :
# (Le code que vous avez fourni avait déjà l'import de Base et un __all__)
# Il faut donc retirer les imports qui posent problème de __all__ et des imports ici.

# En supposant que User, LegalDocument, Progress, Agent, DriveFile, ScanRequestModel
# sont correctement importés dans leurs fichiers respectifs et utilisent `from app.models.base import Base`.
# Et qu'ils n'ont pas besoin d'être importés ici pour que SQLAlchemy les trouve.
# Alors, ce fichier peut être minimal.

# Si vous AVAIENT les imports comme dans votre exemple précédent, et que le problème est le circular import :
# from .user import User
# from .legal_document import LegalDocument
# from .progress import Progress
# from .agent import Agent
# from .drive import DriveFile
# from .scan import ScanRequestModel # Si vous en avez créé un
# from .user_legal_agreement import UserLegalAgreement # Ceci est probablement la cause du problème

# Si le circular import vient de user_legal_agreement.py qui importe user.py et legal_document.py,
# et que user.py ou legal_document.py importent user_legal_agreement.py (ce qui est peu probable),
# ou si __init__.py tente d'importer tout le monde et crée le cycle :
# La meilleure pratique est de retirer les imports ici et de laisser les fichiers
# importer directement ce dont ils ont besoin depuis app.models.xxx.

# Donc, pour le contexte actuel, en supposant que Base est importé correctement :
# Il n'y a peut-être rien d'autre à ajouter ici, sauf si vous voulez explicitement exposer les modèles pour un accès direct.

# Si vous souhaitez exposer les modèles directement via app.models.User, etc.
# Vous DEVEZ gérer les circular imports en déplaçant les imports des modèles
# qui sont importés mutuellement (ex: User et UserLegalAgreement) à l'intérieur des fonctions
# qui en ont besoin, ou en utilisant des imports absolus dans les fichiers modèles.

# Le plus simple est de ne rien importer ici, sauf Base.
# Si vous avez besoin d'importer des modèles pour le `__all__` :
# from .user import User
# from .legal_document import LegalDocument
# from .progress import Progress
# from .agent import Agent
# from .drive import DriveFile
# from .scan import ScanRequestModel
# from .user_legal_agreement import UserLegalAgreement # Si ce modèle est créé

# __all__ = [
#     "Base",
#     "User",
#     "LegalDocument",
#     "Progress",
#     "Agent",
#     "DriveFile",
#     "ScanRequestModel",
#     "UserLegalAgreement",
# ]

# Dans le contexte du circular import que vous avez eu :
# L'import `from .user_legal_agreement import UserLegalAgreement` dans __init__.py
# était probablement la cause. Si vous l'avez retiré de __init__.py, c'est bien.
# Les fichiers modèles individuels devraient importer directement depuis app.models.xxx.

# Donc, le contenu le plus propre et le plus sûr pour app/models/__init__.py est souvent :

# from .base import Base

# __all__ = ["Base"]

# Si vous souhaitez que les modèles soient accessibles directement via app.models.User, etc.
# il faut s'assurer que les imports internes fonctionnent sans créer de cycle.
# Si c'est le cas, vous gardez les imports et le __all__ comme dans ma première proposition.
# Si vous avez des problèmes de circular import comme celui que vous avez eu,
# la meilleure solution est de retirer les imports ici.

# Étant donné que vous avez eu le problème de circular import avec user_legal_agreement :
# Il est plus sûr de ne pas importer les modèles eux-mêmes ici, sauf Base.
# Les routeurs et services importeront directement le modèle dont ils ont besoin.

# Donc, pour une fois, la version la plus simple est la meilleure si elle fonctionne :
# (Si les fichiers modèles importent bien `app.models.base.Base`)