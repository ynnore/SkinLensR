# app/crud/settings.py
from typing import Optional
from app.schemas.settings import UserSettings, UserSettingsUpdate

# Stub ou implémentation selon ta DB
def get_user_settings(user_id: int) -> Optional[UserSettings]:
    # Ici, tu récupères les paramètres utilisateur depuis ta DB
    # Exemple de retour fictif :
    return UserSettings(theme="dark", notifications_enabled=True)

def update_user_settings(user_id: int, settings_update: UserSettingsUpdate) -> UserSettings:
    # Ici, tu mets à jour la DB avec les nouveaux paramètres
    # Puis tu retournes les paramètres mis à jour
    # Exemple fictif, juste pour test :
    return UserSettings(
        theme=settings_update.theme or "light",
        notifications_enabled=settings_update.notifications_enabled if settings_update.notifications_enabled is not None else True,
    )
