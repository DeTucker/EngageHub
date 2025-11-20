from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum

# Task Status Enum
class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    overdue = "overdue"

# Task Priority Enum
class TaskPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"

# -------- Pydantic Schemas --------
class TaskCreate(BaseModel):
    title: str
    description: str
    assigned_to_email: str
    category: str
    priority: TaskPriority = TaskPriority.medium
    due_date: datetime

class TaskUpdate(BaseModel):
    status: Optional[TaskStatus] = None
    completion_report: Optional[str] = None
    completed_at: Optional[datetime] = None

class TaskInDB(BaseModel):
    title: str
    description: str
    assigned_to_email: str
    assigned_to_id: str
    assigned_to_name: str
    assigned_by_email: str
    assigned_by_id: str
    assigned_by_name: str
    category: str
    status: TaskStatus = TaskStatus.pending
    priority: TaskPriority = TaskPriority.medium
    due_date: datetime
    completion_report: Optional[str] = None
    completed_at: Optional[datetime] = None
    created_at: datetime = datetime.utcnow()

class TaskPublic(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    assigned_to_email: str
    assigned_to_name: str
    assigned_by_email: str
    assigned_by_name: str
    category: str
    status: TaskStatus
    priority: TaskPriority
    due_date: datetime
    completion_report: Optional[str] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
