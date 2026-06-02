from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.dependencies import get_current_user
from app.db.sessions import get_db
from app.users.models import User
from app.users.schemas import UserResponse, UserSettingsResponse, UserSettingsUpdate

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def read_me(user: User = Depends(get_current_user)) -> User:
    return user


@router.get("/me/settings", response_model=UserSettingsResponse)
def read_my_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = db.scalar(
        select(User).options(selectinload(User.settings)).where(User.uuid == current_user.uuid)
    )
    if user is None or user.settings is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User settings not found")
    return user.settings


@router.patch("/me/settings", response_model=UserSettingsResponse)
def update_my_settings(
    payload: UserSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = db.scalar(
        select(User).options(selectinload(User.settings)).where(User.uuid == current_user.uuid)
    )
    if user is None or user.settings is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User settings not found")
    settings = user.settings
    if payload.theme is not None:
        if payload.theme not in {"light", "dark", "system"}:
            raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Invalid theme")
        settings.theme = payload.theme
    if payload.language is not None:
        settings.language = payload.language
    db.commit()
    db.refresh(settings)
    return settings
