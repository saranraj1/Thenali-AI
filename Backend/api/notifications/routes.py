from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
import os
from database import get_dynamodb_resource
from utils.auth import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])

def get_notifications_table():
    db = get_dynamodb_resource()
    table_name = os.environ.get("DYNAMODB_ACTIVITY_LOGS_TABLE", "bharat_ai_activity_logs")
    return db.Table(table_name)

@router.get("")
async def get_notifications(current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    try:
        table = get_notifications_table()
        # Scan or Query based on table indexes. Because we may only have a simple table, we use scan.
        # In a real production system, this should query a GSI on user_id.
        response = table.scan(
            FilterExpression="user_id = :uid",
            ExpressionAttributeValues={":uid": user_id}
        )
        items = response.get("Items", [])
        
        # Sort by created_at descending
        items.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        
        unread_count = sum(1 for item in items if not item.get("read", False))
        
        # Normalize for frontend map
        normalized = []
        for item in items:
            normalized.append({
                "id": item.get("log_id"),
                "type": item.get("type"),
                "repo_id": item.get("repo_id"),
                "repo_name": item.get("repo_name"),
                "message": item.get("message"),
                "read": item.get("read", False),
                "created_at": item.get("created_at", "")
            })
            
        return {
            "notifications": normalized,
            "unread_count": unread_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{notification_id}/read")
async def mark_read(notification_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    try:
        table = get_notifications_table()
        table.update_item(
            Key={"log_id": notification_id},
            UpdateExpression="SET #read = :r",
            ExpressionAttributeValues={":r": True},
            ExpressionAttributeNames={"#read": "read"}
        )
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/read-all")
async def mark_all_read(current_user: dict = Depends(get_current_user)):
    user_id = current_user["sub"]
    try:
        table = get_notifications_table()
        response = table.scan(
            FilterExpression="user_id = :uid AND #read = :r",
            ExpressionAttributeValues={":uid": user_id, ":r": False},
            ExpressionAttributeNames={"#read": "read"}
        )
        items = response.get("Items", [])
        
        for item in items:
            table.update_item(
                Key={"log_id": item["log_id"]},
                UpdateExpression="SET #read = :r",
                ExpressionAttributeValues={":r": True},
                ExpressionAttributeNames={"#read": "read"}
            )
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
