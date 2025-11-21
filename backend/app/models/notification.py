from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

class NotificationBase(BaseModel):
    user_id: str
    type: str  # task_assigned, leave_approved, leave_rejected, employee_approved, task_updated, etc.
    title: str
    message: str
    link: Optional[str] = None  # Optional link to redirect user to relevant page
    is_read: bool = False

class NotificationInDB(NotificationBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: str}

class NotificationPublic(BaseModel):
    id: str
    user_id: str
    type: str
    title: str
    message: str
    link: Optional[str] = None
    is_read: bool
    created_at: str  # Return as ISO string for frontend

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}
