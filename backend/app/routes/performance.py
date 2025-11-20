from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import List
from datetime import datetime
from bson import ObjectId
from jose import JWTError, jwt

from ..database import db
from ..config import settings

router = APIRouter(prefix="/performance", tags=["performance"])
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


# Get employee's performance reviews
@router.get("/my-reviews")
async def get_my_reviews(current_user: dict = Depends(get_current_user)):
    """Get current user's performance reviews"""
    reviews = await db.performance.find(
        {"employee_id": ObjectId(current_user["id"])}
    ).sort("review_date", -1).to_list(100)
    
    # Convert ObjectId to string
    for review in reviews:
        review["id"] = str(review.pop("_id"))
        review["employee_id"] = str(review["employee_id"])
    
    return {"data": reviews}


# Get all performance reviews (HR only)
@router.get("/all")
async def get_all_reviews(current_user: dict = Depends(get_current_user)):
    """Get all performance reviews (HR Manager only)"""
    if current_user.get("role") != "hr_manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR managers can access all performance reviews"
        )
    
    reviews = await db.performance.aggregate([
        {
            "$lookup": {
                "from": "users",
                "localField": "employee_id",
                "foreignField": "_id",
                "as": "employee"
            }
        },
        {"$unwind": "$employee"},
        {
            "$project": {
                "_id": 1,
                "employee_id": 1,
                "employee_name": "$employee.full_name",
                "employee_email": "$employee.email",
                "review_period": 1,
                "rating": 1,
                "feedback": 1,
                "goals": 1,
                "reviewer_name": 1,
                "review_date": 1,
                "created_at": 1
            }
        },
        {"$sort": {"review_date": -1}}
    ]).to_list(1000)
    
    # Convert ObjectId to string
    for review in reviews:
        review["id"] = str(review.pop("_id"))
        review["employee_id"] = str(review["employee_id"])
    
    return {"data": reviews}


# Get performance statistics (HR only)
@router.get("/statistics")
async def get_performance_statistics(current_user: dict = Depends(get_current_user)):
    """Get performance statistics overview (HR Manager only)"""
    if current_user.get("role") != "hr_manager":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only HR managers can access performance statistics"
        )
    
    # Get average rating
    pipeline = [
        {
            "$group": {
                "_id": None,
                "average_rating": {"$avg": "$rating"},
                "total_reviews": {"$sum": 1}
            }
        }
    ]
    
    result = await db.performance.aggregate(pipeline).to_list(1)
    
    if result:
        stats = {
            "average_rating": round(result[0]["average_rating"], 2) if result[0]["average_rating"] else 0,
            "total_reviews": result[0]["total_reviews"]
        }
    else:
        stats = {"average_rating": 0, "total_reviews": 0}
    
    # Get top performers (rating >= 4.5)
    top_performers = await db.performance.aggregate([
        {"$match": {"rating": {"$gte": 4.5}}},
        {
            "$lookup": {
                "from": "users",
                "localField": "employee_id",
                "foreignField": "_id",
                "as": "employee"
            }
        },
        {"$unwind": "$employee"},
        {
            "$group": {
                "_id": "$employee_id",
                "name": {"$first": "$employee.full_name"},
                "department": {"$first": "$employee.department"},
                "average_rating": {"$avg": "$rating"}
            }
        },
        {"$sort": {"average_rating": -1}},
        {"$limit": 5}
    ]).to_list(5)
    
    for performer in top_performers:
        performer["id"] = str(performer.pop("_id"))
        performer["average_rating"] = round(performer["average_rating"], 2)
    
    stats["top_performers"] = top_performers
    
    return stats
