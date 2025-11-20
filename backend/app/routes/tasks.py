from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.database import db
from app.models.task import TaskCreate, TaskUpdate, TaskPublic, TaskInDB, TaskStatus
from app.core.security import decode_access_token

router = APIRouter(prefix="/tasks", tags=["Tasks"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Helper function to get current user from token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    user = await db.users.find_one({"email": payload.get("sub")})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

# Helper function to check HR role
def check_hr_role(user: dict):
    if user["role"] != "hr_manager":
        raise HTTPException(status_code=403, detail="Access denied. HR Manager role required.")

# -------------------
# Task Creation (HR/Manager)
# -------------------
@router.post("/", response_model=TaskPublic)
async def create_task(
    task_data: TaskCreate,
    current_user: dict = Depends(get_current_user)
):
    """HR Manager creates and assigns a task to an employee"""
    
    check_hr_role(current_user)
    
    # Find the employee to assign the task to
    assigned_employee = await db.users.find_one({"email": task_data.assigned_to_email})
    if not assigned_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Create task document
    task_doc = TaskInDB(
        title=task_data.title,
        description=task_data.description,
        assigned_to_email=task_data.assigned_to_email,
        assigned_to_id=str(assigned_employee["_id"]),
        assigned_to_name=assigned_employee["full_name"],
        assigned_by_email=current_user["email"],
        assigned_by_id=str(current_user["_id"]),
        assigned_by_name=current_user["full_name"],
        category=task_data.category,
        priority=task_data.priority,
        due_date=task_data.due_date,
        created_at=datetime.utcnow()
    )
    
    result = await db.tasks.insert_one(task_doc.dict())
    
    # Fetch created task
    created_task = await db.tasks.find_one({"_id": result.inserted_id})
    created_task["id"] = str(created_task["_id"])
    
    return TaskPublic(**created_task)

# -------------------
# Get My Tasks (Employee)
# -------------------
@router.get("/my-tasks", response_model=List[TaskPublic])
async def get_my_tasks(
    status: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Employee views their assigned tasks"""
    
    query = {"assigned_to_email": current_user["email"]}
    
    if status:
        query["status"] = status
    
    tasks = await db.tasks.find(query).sort("due_date", 1).to_list(500)
    
    # Update overdue tasks
    now = datetime.utcnow()
    for task in tasks:
        if task["status"] not in ["completed"] and task["due_date"] < now:
            await db.tasks.update_one(
                {"_id": task["_id"]},
                {"$set": {"status": TaskStatus.overdue}}
            )
            task["status"] = TaskStatus.overdue
        
        task["id"] = str(task["_id"])
    
    return [TaskPublic(**task) for task in tasks]

# -------------------
# Update Task Status/Progress (Employee)
# -------------------
@router.patch("/{task_id}")
async def update_task(
    task_id: str,
    task_update: TaskUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Employee updates task status or submits completion report"""
    
    try:
        obj_id = ObjectId(task_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid task ID")
    
    task = await db.tasks.find_one({"_id": obj_id})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Check if user is assigned to this task
    if task["assigned_to_email"] != current_user["email"]:
        raise HTTPException(status_code=403, detail="You are not assigned to this task")
    
    update_data = {}
    
    if task_update.status:
        update_data["status"] = task_update.status
        
        # If marking as completed, set completed_at
        if task_update.status == TaskStatus.completed:
            update_data["completed_at"] = datetime.utcnow()
    
    if task_update.completion_report:
        update_data["completion_report"] = task_update.completion_report
    
    if update_data:
        await db.tasks.update_one(
            {"_id": obj_id},
            {"$set": update_data}
        )
    
    # Fetch updated task
    updated_task = await db.tasks.find_one({"_id": obj_id})
    updated_task["id"] = str(updated_task["_id"])
    
    return TaskPublic(**updated_task)

# -------------------
# Get All Tasks (HR)
# -------------------
@router.get("/all", response_model=List[TaskPublic])
async def get_all_tasks(
    status: Optional[str] = None,
    category: Optional[str] = None,
    assigned_to_email: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """HR Manager views all tasks with optional filters"""
    
    check_hr_role(current_user)
    
    query = {}
    
    if status:
        query["status"] = status
    if category:
        query["category"] = category
    if assigned_to_email:
        query["assigned_to_email"] = assigned_to_email
    
    tasks = await db.tasks.find(query).sort("due_date", 1).to_list(1000)
    
    # Convert _id to id string
    for task in tasks:
        task["id"] = str(task["_id"])
    
    return [TaskPublic(**task) for task in tasks]

# -------------------
# Get Task Statistics (HR)
# -------------------
@router.get("/statistics")
async def get_task_statistics(
    current_user: dict = Depends(get_current_user)
):
    """HR Manager gets task statistics"""
    
    check_hr_role(current_user)
    
    # Count by status
    pending = await db.tasks.count_documents({"status": TaskStatus.pending})
    in_progress = await db.tasks.count_documents({"status": TaskStatus.in_progress})
    completed = await db.tasks.count_documents({"status": TaskStatus.completed})
    overdue = await db.tasks.count_documents({"status": TaskStatus.overdue})
    
    # Count by priority
    high_priority = await db.tasks.count_documents({"priority": "high"})
    urgent_priority = await db.tasks.count_documents({"priority": "urgent"})
    
    # Tasks due soon (next 7 days)
    from datetime import timedelta
    seven_days_from_now = datetime.utcnow() + timedelta(days=7)
    due_soon = await db.tasks.count_documents({
        "due_date": {"$lte": seven_days_from_now},
        "status": {"$nin": ["completed"]}
    })
    
    # Get category breakdown
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    category_breakdown = await db.tasks.aggregate(pipeline).to_list(50)
    
    return {
        "by_status": {
            "pending": pending,
            "in_progress": in_progress,
            "completed": completed,
            "overdue": overdue
        },
        "high_priority": high_priority,
        "urgent_priority": urgent_priority,
        "due_soon": due_soon,
        "by_category": [{"category": item["_id"], "count": item["count"]} for item in category_breakdown]
    }

# -------------------
# Delete Task (HR)
# -------------------
@router.delete("/{task_id}")
async def delete_task(
    task_id: str,
    current_user: dict = Depends(get_current_user)
):
    """HR Manager deletes a task"""
    
    check_hr_role(current_user)
    
    try:
        obj_id = ObjectId(task_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid task ID")
    
    result = await db.tasks.delete_one({"_id": obj_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return {"message": "Task deleted successfully"}
