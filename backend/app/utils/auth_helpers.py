from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_access_token
from app.database import db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current user from JWT token"""
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = await db.users.find_one({"email": payload.get("sub")})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

def check_hr_role(user: dict):
    """Check if user has HR manager role"""
    if user["role"] != "hr_manager":
        raise HTTPException(status_code=403, detail="Access denied. HR Manager role required.")
