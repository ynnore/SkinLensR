from fastapi import APIRouter, Depends, HTTPException, status
from app.auth.dependencies import get_current_active_user

router = APIRouter()

@router.get("/protected-route")
async def protected_route(current_user: dict = Depends(get_current_active_user)):
    # Ici tu peux utiliser current_user qui est l'utilisateur authentifié
    return {"message": f"Hello {current_user['username']}! You accessed a protected route."}
