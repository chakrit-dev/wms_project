from fastapi import Depends, HTTPException, status
from app.utils.jwt_token import get_current_user

def permission_required(permission_code: str):
    def wrapper(user = Depends(get_current_user)):
        if permission_code not in user.get("permissions", []):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Permission denied"
            )
    return wrapper