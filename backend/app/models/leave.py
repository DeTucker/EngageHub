from pydantic import BaseModel, Field
from datetime import datetime, date
from typing import Optional
from enum import Enum

# -------- Enums --------
class LeaveType(str, Enum):
    SICK = "sick"
    VACATION = "vacation"
    PERSONAL = "personal"
    UNPAID = "unpaid"
    MATERNITY = "maternity"
    PATERNITY = "paternity"

class LeaveStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"

# -------- Pydantic Schemas --------
class LeaveCreate(BaseModel):
    leave_type: LeaveType
    start_date: date
    end_date: date
    reason: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "leave_type": "vacation",
                "start_date": "2025-12-01",
                "end_date": "2025-12-05",
                "reason": "Family vacation"
            }
        }

class LeaveUpdate(BaseModel):
    status: LeaveStatus
    reviewer_comment: Optional[str] = None

class LeaveInDB(BaseModel):
    user_id: str
    user_email: str
    user_name: str
    leave_type: LeaveType
    start_date: date
    end_date: date
    reason: str
    status: LeaveStatus = LeaveStatus.PENDING
    days_count: int
    reviewer_id: Optional[str] = None
    reviewer_comment: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class LeavePublic(BaseModel):
    id: str
    user_id: str
    user_email: str
    user_name: str
    leave_type: LeaveType
    start_date: date
    end_date: date
    reason: str
    status: LeaveStatus
    days_count: int
    reviewer_id: Optional[str] = None
    reviewer_comment: Optional[str] = None
    created_at: datetime
    updated_at: datetime
