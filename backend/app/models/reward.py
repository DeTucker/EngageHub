from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum

# -------- Enums --------
class RewardType(str, Enum):
    EMPLOYEE_OF_MONTH = "employee_of_month"
    SPOT_RECOGNITION = "spot_recognition"
    MILESTONE = "milestone"
    INNOVATION = "innovation"
    TEAMWORK = "teamwork"
    CUSTOMER_SERVICE = "customer_service"

# -------- Pydantic Schemas --------
class RewardCreate(BaseModel):
    recipient_id: str
    recipient_email: str
    reward_type: RewardType
    title: str
    description: Optional[str] = ""
    points: int = 100
    
    class Config:
        json_schema_extra = {
            "example": {
                "recipient_id": "507f1f77bcf86cd799439011",
                "recipient_email": "employee@example.com",
                "reward_type": "spot_recognition",
                "title": "Outstanding Project Delivery",
                "description": "Delivered project ahead of schedule",
                "points": 150
            }
        }

class RewardInDB(BaseModel):
    recipient_id: str
    recipient_email: str
    recipient_name: str
    giver_id: str
    giver_email: str
    giver_name: str
    reward_type: RewardType
    title: str
    description: str
    points: int = 100
    created_at: datetime = Field(default_factory=datetime.utcnow)

class RewardPublic(BaseModel):
    id: str
    recipient_id: str
    recipient_email: str
    recipient_name: str
    giver_id: str
    giver_email: str
    giver_name: str
    reward_type: RewardType
    title: str
    description: str
    points: int
    created_at: datetime
