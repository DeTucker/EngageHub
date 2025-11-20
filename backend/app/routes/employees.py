from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.database import db
from app.models.user import UserPublic
from app.core.security import decode_access_token, hash_password

router = APIRouter(prefix="/employees", tags=["Employees"])
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
# Employee Profile Endpoints
# -------------------
@router.get("/me", response_model=UserPublic)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    """Get current user's profile"""
    return UserPublic(**current_user)

@router.put("/me")
async def update_my_profile(
    full_name: Optional[str] = None,
    department: Optional[str] = None,
    phone: Optional[str] = None,
    date_of_joining: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Update current user's profile"""
    
    update_data = {"updated_at": datetime.utcnow()}
    
    if full_name:
        update_data["full_name"] = full_name
    if department:
        update_data["department"] = department
    if phone:
        update_data["phone"] = phone
    if date_of_joining:
        try:
            # Parse date string to datetime
            update_data["date_of_joining"] = datetime.fromisoformat(date_of_joining.replace('Z', '+00:00'))
        except:
            pass
    
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": update_data}
    )
    
    updated_user = await db.users.find_one({"_id": current_user["_id"]})
    updated_user["id"] = str(updated_user["_id"])
    
    return {
        "message": "Profile updated successfully",
        "user": UserPublic(**updated_user)
    }

@router.post("/change-password")
async def change_password(
    current_password: str,
    new_password: str,
    current_user: dict = Depends(get_current_user)
):
    """Change password for current user"""
    
    from app.core.security import verify_password
    
    # Verify current password
    if not verify_password(current_password, current_user["password"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Validate new password
    if len(new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")
    
    # Update password
    hashed_password = hash_password(new_password)
    await db.users.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"password": hashed_password, "updated_at": datetime.utcnow()}}
    )
    
    return {"message": "Password changed successfully"}

# -------------------
# HR Manager Endpoints
# -------------------
@router.get("/", response_model=List[UserPublic])
async def get_all_employees(
    role: Optional[str] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """HR Manager views all employees"""
    
    check_hr_role(current_user)
    
    query = {}
    
    if role:
        query["role"] = role
    
    if search:
        query["$or"] = [
            {"email": {"$regex": search, "$options": "i"}},
            {"full_name": {"$regex": search, "$options": "i"}}
        ]
    
    employees = await db.users.find(query).sort("created_at", -1).to_list(500)
    
    # Convert _id to id string
    for emp in employees:
        emp["id"] = str(emp["_id"])
    
    return [UserPublic(**emp) for emp in employees]

@router.get("/{employee_id}", response_model=UserPublic)
async def get_employee_details(
    employee_id: str,
    current_user: dict = Depends(get_current_user)
):
    """HR Manager views employee details"""
    
    check_hr_role(current_user)
    
    try:
        obj_id = ObjectId(employee_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid employee ID")
    
    employee = await db.users.find_one({"_id": obj_id})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return UserPublic(**employee)

@router.put("/{employee_id}")
async def update_employee(
    employee_id: str,
    full_name: Optional[str] = None,
    role: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """HR Manager updates employee information"""
    
    check_hr_role(current_user)
    
    try:
        obj_id = ObjectId(employee_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid employee ID")
    
    employee = await db.users.find_one({"_id": obj_id})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    update_data = {"updated_at": datetime.utcnow()}
    
    if full_name:
        update_data["full_name"] = full_name
    
    if role and role in ["employee", "hr_manager"]:
        update_data["role"] = role
    
    await db.users.update_one({"_id": obj_id}, {"$set": update_data})
    
    updated_employee = await db.users.find_one({"_id": obj_id})
    
    return {
        "message": "Employee updated successfully",
        "employee": UserPublic(**updated_employee)
    }

@router.get("/statistics/overview")
async def get_employee_statistics(current_user: dict = Depends(get_current_user)):
    """HR Manager views employee statistics"""
    
    check_hr_role(current_user)
    
    # Total employees
    total_employees = await db.users.count_documents({"role": "employee"})
    total_hr = await db.users.count_documents({"role": "hr_manager"})
    
    # Recent employees (last 30 days)
    from datetime import timedelta
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_employees = await db.users.count_documents({
        "role": "employee",
        "created_at": {"$gte": thirty_days_ago}
    })
    
    # Pending leaves
    pending_leaves = await db.leaves.count_documents({"status": "pending"})
    
    # Recent performance reviews (last 90 days)
    ninety_days_ago = datetime.utcnow() - timedelta(days=90)
    recent_reviews = await db.performance.count_documents({
        "created_at": {"$gte": ninety_days_ago}
    })
    
    return {
        "total_employees": total_employees,
        "total_hr": total_hr,
        "recent_employees": recent_employees,
        "pending_leaves": pending_leaves,
        "recent_reviews": recent_reviews
    }

@router.get("/{employee_id}/summary")
async def get_employee_summary(
    employee_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get employee summary with leaves, performance, and rewards"""
    
    check_hr_role(current_user)
    
    try:
        obj_id = ObjectId(employee_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid employee ID")
    
    employee = await db.users.find_one({"_id": obj_id})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Get leave statistics
    leaves = await db.leaves.find({"user_id": employee_id}).to_list(100)
    leave_summary = {
        "total": len(leaves),
        "pending": len([l for l in leaves if l["status"] == "pending"]),
        "approved": len([l for l in leaves if l["status"] == "approved"]),
        "rejected": len([l for l in leaves if l["status"] == "rejected"])
    }
    
    # Get performance reviews
    reviews = await db.performance.find({"employee_id": employee_id}).to_list(50)
    performance_summary = {
        "total_reviews": len(reviews),
        "latest_rating": reviews[0]["rating"] if reviews else None
    }
    
    # Get rewards
    rewards = await db.rewards.find({"recipient_id": employee_id}).to_list(100)
    total_points = sum(r.get("points", 0) for r in rewards)
    rewards_summary = {
        "total_rewards": len(rewards),
        "total_points": total_points
    }
    
    return {
        "employee": UserPublic(**employee),
        "leaves": leave_summary,
        "performance": performance_summary,
        "rewards": rewards_summary
    }
