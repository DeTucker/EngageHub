from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from typing import List
from datetime import datetime, date
from bson import ObjectId
from app.database import db
from app.models.leave import LeaveCreate, LeaveUpdate, LeavePublic, LeaveInDB, LeaveStatus
from app.core.security import decode_access_token

router = APIRouter(prefix="/leaves", tags=["Leaves"])
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

# Helper function to calculate business days
def calculate_days(start_date, end_date):
    delta = end_date - start_date
    return delta.days + 1  # inclusive

# -------------------
# Employee Endpoints
# -------------------
@router.post("/", status_code=status.HTTP_201_CREATED)
async def submit_leave_request(leave: LeaveCreate, current_user: dict = Depends(get_current_user)):
    """Employee submits a leave request"""
    
    # Validate dates
    if leave.end_date < leave.start_date:
        raise HTTPException(status_code=400, detail="End date must be after start date")
    
    # Calculate days
    days_count = calculate_days(leave.start_date, leave.end_date)
    
    # Create leave record
    leave_data = LeaveInDB(
        user_id=str(current_user["_id"]),
        user_email=current_user["email"],
        user_name=current_user["full_name"],
        leave_type=leave.leave_type,
        start_date=leave.start_date,
        end_date=leave.end_date,
        reason=leave.reason,
        days_count=days_count
    )
    
    # Convert to dict and handle datetime conversion
    leave_dict = leave_data.dict()
    # Convert date objects to datetime for MongoDB
    if isinstance(leave_dict["start_date"], date) and not isinstance(leave_dict["start_date"], datetime):
        leave_dict["start_date"] = datetime.combine(leave_dict["start_date"], datetime.min.time())
    if isinstance(leave_dict["end_date"], date) and not isinstance(leave_dict["end_date"], datetime):
        leave_dict["end_date"] = datetime.combine(leave_dict["end_date"], datetime.min.time())
    
    result = await db.leaves.insert_one(leave_dict)
    
    return {
        "message": "Leave request submitted successfully",
        "leave_id": str(result.inserted_id)
    }

@router.get("/my-leaves", response_model=List[LeavePublic])
async def get_my_leaves(current_user: dict = Depends(get_current_user)):
    """Get all leave requests for the current employee"""
    
    leaves = await db.leaves.find({"user_id": str(current_user["_id"])}).sort("created_at", -1).to_list(100)
    
    return [
        LeavePublic(
            id=str(leave["_id"]),
            **{k: v for k, v in leave.items() if k != "_id"}
        ) for leave in leaves
    ]

@router.get("/my-balance")
async def get_leave_balance(current_user: dict = Depends(get_current_user)):
    """Get leave balance for current employee"""
    
    # Calculate used leaves for current year
    current_year = datetime.now().year
    pipeline = [
        {
            "$match": {
                "user_id": str(current_user["_id"]),
                "status": "approved",
                "$expr": {
                    "$eq": [{"$year": "$start_date"}, current_year]
                }
            }
        },
        {
            "$group": {
                "_id": "$leave_type",
                "total_days": {"$sum": "$days_count"}
            }
        }
    ]
    
    used_leaves = await db.leaves.aggregate(pipeline).to_list(100)
    
    # Define annual allowances
    allowances = {
        "sick": 10,
        "vacation": 20,
        "personal": 5,
        "unpaid": 999,
        "maternity": 90,
        "paternity": 14
    }
    
    balance = {}
    for leave_type, total in allowances.items():
        used = next((item["total_days"] for item in used_leaves if item["_id"] == leave_type), 0)
        balance[leave_type] = {
            "total": total,
            "used": used,
            "remaining": total - used if leave_type not in ["unpaid"] else "unlimited"
        }
    
    return balance

# -------------------
# HR Manager Endpoints
# -------------------
@router.get("/all", response_model=List[LeavePublic])
async def get_all_leaves(
    status_filter: str = None,
    current_user: dict = Depends(get_current_user)
):
    """HR Manager views all leave requests"""
    
    if current_user["role"] != "hr_manager":
        raise HTTPException(status_code=403, detail="Access denied. HR Manager role required.")
    
    query = {}
    if status_filter:
        query["status"] = status_filter
    
    leaves = await db.leaves.find(query).sort("created_at", -1).to_list(200)
    
    return [
        LeavePublic(
            id=str(leave["_id"]),
            **{k: v for k, v in leave.items() if k != "_id"}
        ) for leave in leaves
    ]

@router.patch("/{leave_id}", response_model=LeavePublic)
async def update_leave_status(
    leave_id: str,
    update: LeaveUpdate,
    current_user: dict = Depends(get_current_user)
):
    """HR Manager approves or rejects a leave request"""
    
    if current_user["role"] != "hr_manager":
        raise HTTPException(status_code=403, detail="Access denied. HR Manager role required.")
    
    # Validate ObjectId
    try:
        obj_id = ObjectId(leave_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid leave ID")
    
    # Find leave
    leave = await db.leaves.find_one({"_id": obj_id})
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
    
    # Update leave
    update_data = {
        "status": update.status,
        "reviewer_id": str(current_user["_id"]),
        "reviewer_comment": update.reviewer_comment,
        "updated_at": datetime.utcnow()
    }
    
    await db.leaves.update_one({"_id": obj_id}, {"$set": update_data})
    
    # Get updated leave
    updated_leave = await db.leaves.find_one({"_id": obj_id})
    
    return LeavePublic(
        id=str(updated_leave["_id"]),
        **{k: v for k, v in updated_leave.items() if k != "_id"}
    )

@router.get("/statistics")
async def get_leave_statistics(current_user: dict = Depends(get_current_user)):
    """HR Manager views leave statistics"""
    
    if current_user["role"] != "hr_manager":
        raise HTTPException(status_code=403, detail="Access denied. HR Manager role required.")
    
    # Count by status
    pending = await db.leaves.count_documents({"status": "pending"})
    approved = await db.leaves.count_documents({"status": "approved"})
    rejected = await db.leaves.count_documents({"status": "rejected"})
    
    # Count by type (current year)
    current_year = datetime.now().year
    pipeline = [
        {
            "$match": {
                "$expr": {
                    "$eq": [{"$year": "$start_date"}, current_year]
                }
            }
        },
        {
            "$group": {
                "_id": "$leave_type",
                "count": {"$sum": 1},
                "total_days": {"$sum": "$days_count"}
            }
        }
    ]
    
    by_type = await db.leaves.aggregate(pipeline).to_list(100)
    
    return {
        "by_status": {
            "pending": pending,
            "approved": approved,
            "rejected": rejected
        },
        "by_type": [{"type": item["_id"], "count": item["count"], "total_days": item["total_days"]} for item in by_type]
    }
