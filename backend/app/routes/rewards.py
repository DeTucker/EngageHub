from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordBearer
from typing import List
from datetime import datetime
from bson import ObjectId
from jose import JWTError, jwt

from ..database import db
from ..config import settings
from ..models.reward import RewardCreate

router = APIRouter(prefix="/rewards", tags=["rewards"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Decode JWT token and return current user"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )

        # Fetch user from database by email
        user = await db.users.find_one({"email": email})
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "id": str(user["_id"]),
            "email": user["email"],
            "full_name": user.get("full_name", ""),
            "role": user.get("role", "employee"),
        }
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )


# Get employee's rewards
@router.get("/my-rewards")
async def get_my_rewards(current_user: dict = Depends(get_current_user)):
    """Get current user's rewards"""
    rewards = await db.rewards.find(
        {"recipient_id": ObjectId(current_user["id"])}
    ).sort("date_awarded", -1).to_list(100)
    
    # Convert ObjectId to string
    for reward in rewards:
        reward["id"] = str(reward.pop("_id"))
        reward["recipient_id"] = str(reward["recipient_id"])
        if reward.get("awarded_by"):
            reward["awarded_by"] = str(reward["awarded_by"])
    
    # Calculate total points
    total_points = sum(r.get("points", 0) for r in rewards)
    
    return {"data": rewards, "total_points": total_points}


# Get all rewards (HR only)
@router.get("/all")
async def get_all_rewards(current_user: dict = Depends(get_current_user)):
    """Get all rewards (HR Manager only)"""
    if current_user.get("role") != "hr_manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR managers can access all rewards"
        )
    
    rewards = await db.rewards.aggregate([
        {
            "$lookup": {
                "from": "users",
                "localField": "recipient_id",
                "foreignField": "_id",
                "as": "recipient"
            }
        },
        {"$unwind": "$recipient"},
        {
            "$project": {
                "_id": 1,
                "recipient_id": 1,
                "recipient_name": "$recipient.full_name",
                "recipient_email": "$recipient.email",
                "reward_type": 1,
                "title": 1,
                "description": 1,
                "points": 1,
                "date_awarded": 1,
                "awarded_by": 1,
                "created_at": 1
            }
        },
        {"$sort": {"date_awarded": -1}}
    ]).to_list(1000)
    
    # Convert ObjectId to string
    for reward in rewards:
        reward["id"] = str(reward.pop("_id"))
        reward["recipient_id"] = str(reward["recipient_id"])
        if reward.get("awarded_by"):
            reward["awarded_by"] = str(reward["awarded_by"])
    
    return {"data": rewards}


# Create reward (HR only)
@router.post("/")
async def create_reward(
    reward_data: RewardCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new reward (HR Manager only)"""
    if current_user.get("role") != "hr_manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR managers can create rewards"
        )
    
    # Verify recipient exists
    recipient = await db.users.find_one({"_id": ObjectId(reward_data.recipient_id)})
    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient not found"
        )
    
    reward_dict = reward_data.model_dump()
    reward_dict["recipient_id"] = ObjectId(reward_data.recipient_id)
    reward_dict["awarded_by"] = current_user["id"]
    reward_dict["date_awarded"] = datetime.utcnow()
    reward_dict["created_at"] = datetime.utcnow()
    
    result = await db.rewards.insert_one(reward_dict)
    
    # Return created reward
    created_reward = await db.rewards.find_one({"_id": result.inserted_id})
    created_reward["id"] = str(created_reward.pop("_id"))
    created_reward["recipient_id"] = str(created_reward["recipient_id"])
    created_reward["awarded_by"] = str(created_reward["awarded_by"])
    
    return {"message": "Reward created successfully", "data": created_reward}


# Delete reward (HR only)
@router.delete("/{reward_id}")
async def delete_reward(
    reward_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a reward (HR Manager only)"""
    if current_user.get("role") != "hr_manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR managers can delete rewards"
        )
    
    try:
        result = await db.rewards.delete_one({"_id": ObjectId(reward_id)})
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reward ID"
        )
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reward not found"
        )
    
    return {"message": "Reward deleted successfully"}


# Get rewards statistics (HR only)
@router.get("/statistics")
async def get_rewards_statistics(current_user: dict = Depends(get_current_user)):
    """Get rewards statistics overview (HR Manager only)"""
    if current_user.get("role") != "hr_manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR managers can access rewards statistics"
        )
    
    # Total rewards and points
    pipeline = [
        {
            "$group": {
                "_id": None,
                "total_rewards": {"$sum": 1},
                "total_points_awarded": {"$sum": "$points"}
            }
        }
    ]
    
    result = await db.rewards.aggregate(pipeline).to_list(1)
    
    if result:
        stats = {
            "total_rewards": result[0]["total_rewards"],
            "total_points_awarded": result[0]["total_points_awarded"]
        }
    else:
        stats = {"total_rewards": 0, "total_points_awarded": 0}
    
    # Rewards by type
    by_type = await db.rewards.aggregate([
        {
            "$group": {
                "_id": "$reward_type",
                "count": {"$sum": 1}
            }
        }
    ]).to_list(100)
    
    stats["by_type"] = [{"type": item["_id"], "count": item["count"]} for item in by_type]
    
    # Top recipients
    top_recipients = await db.rewards.aggregate([
        {
            "$group": {
                "_id": "$recipient_id",
                "total_points": {"$sum": "$points"},
                "reward_count": {"$sum": 1}
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "_id",
                "foreignField": "_id",
                "as": "user"
            }
        },
        {"$unwind": "$user"},
        {
            "$project": {
                "name": "$user.full_name",
                "total_points": 1,
                "reward_count": 1
            }
        },
        {"$sort": {"total_points": -1}},
        {"$limit": 5}
    ]).to_list(5)
    
    for recipient in top_recipients:
        recipient["id"] = str(recipient.pop("_id"))
    
    stats["top_recipients"] = top_recipients
    
    return stats
