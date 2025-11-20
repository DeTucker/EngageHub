from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# -------- Pydantic Schemas --------
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserInDB(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "employee"
    created_at: datetime = datetime.utcnow()

class UserPublic(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    full_name: str
    role: str
    department: Optional[str] = None
    phone: Optional[str] = None
    date_of_joining: Optional[datetime] = None
    created_at: Optional[datetime]
