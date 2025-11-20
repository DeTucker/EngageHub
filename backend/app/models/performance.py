from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum

# -------- Enums --------
class PerformanceRating(str, Enum):
    EXCELLENT = "excellent"
    GOOD = "good"
    SATISFACTORY = "satisfactory"
    NEEDS_IMPROVEMENT = "needs_improvement"
    UNSATISFACTORY = "unsatisfactory"

class ReviewType(str, Enum):
    ANNUAL = "annual"
    QUARTERLY = "quarterly"
    PROBATION = "probation"
    PROJECT = "project"

# -------- Pydantic Schemas --------
class PerformanceCreate(BaseModel):
    employee_id: str
    employee_email: str
    review_period: str
    rating: float
    feedback: str
    goals: Optional[str] = ""
    
    class Config:
        json_schema_extra = {
            "example": {
                "employee_id": "507f1f77bcf86cd799439011",
                "employee_email": "employee@example.com",
                "review_period": "Q4 2025",
                "rating": 4.5,
                "feedback": "Strong technical skills and good team player. Needs improvement in time management.",
                "goals": "Complete certification by Q2, Improve project delivery time"
            }
        }

class PerformanceInDB(BaseModel):
    employee_id: str
    employee_email: str
    employee_name: str
    reviewer_id: str
    reviewer_email: str
    reviewer_name: str
    review_type: ReviewType
    rating: PerformanceRating
    strengths: str
    areas_for_improvement: str
    goals: str
    comments: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PerformancePublic(BaseModel):
    id: str
    employee_id: str
    employee_email: str
    employee_name: str
    reviewer_id: str
    reviewer_email: str
    reviewer_name: str
    review_type: ReviewType
    rating: PerformanceRating
    strengths: str
    areas_for_improvement: str
    goals: str
    comments: str
    created_at: datetime
    updated_at: datetime
