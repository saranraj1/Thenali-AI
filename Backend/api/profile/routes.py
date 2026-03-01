"""
Profile and Settings API routes.
"""
import logging
import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

from config import settings
from database import get_dynamodb_resource
from models.schemas import (
    ProfileUpdateRequest, LanguageSettingRequest,
    NotificationSettingRequest, SecuritySettingRequest
)
from utils.auth import get_current_user, hash_password, verify_password
from services.aws.s3 import s3_service

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Profile & Settings"])

# ─── Constants ────────────────────────────────────────────────────────────────

ALLOWED_IMAGE_TYPES = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
}
MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024  # 2 MB


def get_users_table():
    return get_dynamodb_resource().Table(settings.DYNAMODB_USERS_TABLE)


# ─── Avatar Upload ────────────────────────────────────────────────────────────

@router.post(
    "/profile/avatar",
    summary="Upload profile avatar",
    description=(
        "Upload a profile picture (PNG / JPG / JPEG / WEBP, max 2 MB). "
        "The image is stored in S3 under `profile-pictures/{user_id}.{ext}` "
        "and the public URL is saved to the DynamoDB users table as `avatar_url`."
    ),
)
async def upload_avatar(
    file: UploadFile = File(..., description="Image file to upload (png/jpg/jpeg/webp, ≤ 2 MB)"),
    current_user: dict = Depends(get_current_user),
):
    """Upload or replace a user's profile picture."""
    user_id = current_user["sub"]

    # ── 1. Validate content type ──────────────────────────────────────────────
    content_type = (file.content_type or "").lower()
    if content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=415,
            detail=(
                f"Unsupported file type '{content_type}'. "
                "Allowed types: image/png, image/jpeg, image/jpg, image/webp."
            ),
        )
    ext = ALLOWED_IMAGE_TYPES[content_type]

    # ── 2. Read & validate size ───────────────────────────────────────────────
    image_bytes = await file.read()
    if len(image_bytes) > MAX_AVATAR_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({len(image_bytes) / 1024 / 1024:.1f} MB). Maximum allowed size is 2 MB.",
        )
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # ── 3. Determine S3 bucket ────────────────────────────────────────────────
    # Prefer the dedicated avatar bucket; fall back to S3_BUCKET_NAME if set
    bucket = settings.S3_AVATAR_BUCKET or settings.S3_BUCKET_NAME

    # ── 4. Upload to S3 (always overwrite path for this user) ─────────────────
    s3_key = f"profile-pictures/{user_id}.{ext}"
    try:
        s3_service.ensure_bucket_exists(bucket)
        s3_service.upload_bytes(
            bucket=bucket,
            key=s3_key,
            data=image_bytes,
            content_type=content_type,
        )
    except Exception as e:
        logger.error(f"S3 avatar upload failed for user {user_id}: {e}")
        raise HTTPException(status_code=502, detail=f"S3 upload failed: {e}")

    # ── 5. Build public URL ───────────────────────────────────────────────────
    region = settings.AWS_REGION
    avatar_url = f"https://{bucket}.s3.{region}.amazonaws.com/{s3_key}"

    # ── 6. Persist URL to DynamoDB users table ────────────────────────────────
    try:
        get_users_table().update_item(
            Key={"user_id": user_id},
            UpdateExpression="SET avatar_url = :url",
            ExpressionAttributeValues={":url": avatar_url},
        )
    except Exception as e:
        logger.error(f"DynamoDB avatar_url update failed for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save avatar URL: {e}")

    logger.info(f"Avatar uploaded for user {user_id}: {avatar_url}")
    return {
        "success": True,
        "user_id": user_id,
        "avatar_url": avatar_url,
        "s3_key": s3_key,
        "bucket": bucket,
    }


# ─── Profile ─────────────────────────────────────────────────────────────────

@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get the authenticated user's full profile."""
    try:
        resp = get_users_table().get_item(Key={"user_id": current_user["sub"]})
        user = resp.get("Item")
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user.pop("password_hash", None)
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/profile")
async def update_profile(
    body: ProfileUpdateRequest,
    current_user: dict = Depends(get_current_user),
):
    """Update user profile fields."""
    user_id = current_user["sub"]
    try:
        updates = []
        values = {}
        names = {}

        if body.username:
            updates.append("username = :u")
            values[":u"] = body.username
        if body.email:
            updates.append("email = :e")
            values[":e"] = body.email
        if body.language:
            updates.append("#lang = :l")
            values[":l"] = body.language
            names["#lang"] = "language"

        if not updates:
            return {"success": True, "message": "Nothing to update"}

        kwargs = {
            "Key": {"user_id": user_id},
            "UpdateExpression": "SET " + ", ".join(updates),
            "ExpressionAttributeValues": values,
        }
        if names:
            kwargs["ExpressionAttributeNames"] = names

        get_users_table().update_item(**kwargs)
        return {"success": True, "message": "Profile updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─── Settings ─────────────────────────────────────────────────────────────────

@router.put("/settings/language")
async def update_language(
    body: LanguageSettingRequest,
    current_user: dict = Depends(get_current_user),
):
    """Update the user's preferred language."""
    user_id = current_user["sub"]
    try:
        get_users_table().update_item(
            Key={"user_id": user_id},
            UpdateExpression="SET #lang = :lang",
            ExpressionAttributeValues={":lang": body.language},
            ExpressionAttributeNames={"#lang": "language"},
        )
        return {"success": True, "language": body.language}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/settings/notifications")
async def update_notifications(
    body: NotificationSettingRequest,
    current_user: dict = Depends(get_current_user),
):
    """Update notification preferences."""
    user_id = current_user["sub"]
    try:
        get_users_table().update_item(
            Key={"user_id": user_id},
            UpdateExpression="SET notification_settings = :ns",
            ExpressionAttributeValues={":ns": body.dict()},
        )
        return {"success": True, "settings": body.dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/settings/security")
async def update_security(
    body: SecuritySettingRequest,
    current_user: dict = Depends(get_current_user),
):
    """Change user password."""
    user_id = current_user["sub"]
    try:
        resp = get_users_table().get_item(Key={"user_id": user_id})
        user = resp.get("Item")
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if not verify_password(body.current_password, user.get("password_hash", "")):
            raise HTTPException(status_code=401, detail="Current password is incorrect")

        new_hash = hash_password(body.new_password)
        get_users_table().update_item(
            Key={"user_id": user_id},
            UpdateExpression="SET password_hash = :ph",
            ExpressionAttributeValues={":ph": new_hash},
        )
        return {"success": True, "message": "Password updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
