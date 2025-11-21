from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from bson import ObjectId
from typing import List
from ..database import db
from ..models.notification import NotificationInDB, NotificationPublic
from ..models.user import UserPublic
from ..utils.auth_helpers import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/", response_model=List[NotificationPublic])
async def get_notifications(
    skip: int = 0,
    limit: int = 50,
    current_user: dict = Depends(get_current_user)
):
    """Get all notifications for the current user"""
    notifications = await db.notifications.find(
        {"user_id": str(current_user["_id"])}
    ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    return [
        NotificationPublic(
            id=str(notification["_id"]),
            user_id=notification["user_id"],
            type=notification["type"],
            title=notification["title"],
            message=notification["message"],
            link=notification.get("link"),
            is_read=notification["is_read"],
            created_at=notification["created_at"].isoformat() if isinstance(notification["created_at"], datetime) else notification["created_at"]
        )
        for notification in notifications
    ]

@router.get("/unread-count")
async def get_unread_count(current_user: dict = Depends(get_current_user)):
    """Get count of unread notifications"""
    count = await db.notifications.count_documents({
        "user_id": str(current_user["_id"]),
        "is_read": False
    })
    return {"unread_count": count}

@router.patch("/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Mark a notification as read"""
    if not ObjectId.is_valid(notification_id):
        raise HTTPException(status_code=400, detail="Invalid notification ID")
    
    result = await db.notifications.update_one(
        {
            "_id": ObjectId(notification_id),
            "user_id": str(current_user["_id"])
        },
        {"$set": {"is_read": True}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return {"message": "Notification marked as read"}

@router.patch("/mark-all-read")
async def mark_all_as_read(current_user: dict = Depends(get_current_user)):
    """Mark all notifications as read for the current user"""
    result = await db.notifications.update_many(
        {
            "user_id": str(current_user["_id"]),
            "is_read": False
        },
        {"$set": {"is_read": True}}
    )
    
    return {"message": f"Marked {result.modified_count} notifications as read"}

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a notification"""
    if not ObjectId.is_valid(notification_id):
        raise HTTPException(status_code=400, detail="Invalid notification ID")
    
    result = await db.notifications.delete_one({
        "_id": ObjectId(notification_id),
        "user_id": str(current_user["_id"])
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return {"message": "Notification deleted"}

# Helper function to create notifications (used by other routes)
async def create_notification(
    user_id: str,
    notification_type: str,
    title: str,
    message: str,
    link: str = None
):
    """Helper function to create a notification"""
    notification = NotificationInDB(
        user_id=user_id,
        type=notification_type,
        title=title,
        message=message,
        link=link,
        is_read=False,
        created_at=datetime.utcnow()
    )
    
    notification_dict = notification.model_dump(by_alias=True, exclude={"id"})
    await db.notifications.insert_one(notification_dict)
