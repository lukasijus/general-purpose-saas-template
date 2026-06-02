from uuid import UUID

from pydantic import BaseModel, EmailStr

from app.users.models import UserRole


class UserResponse(BaseModel):
    uuid: UUID
    email: EmailStr
    role: UserRole
    is_active: bool
    is_verified: bool


class UserSettingsResponse(BaseModel):
    user_uuid: UUID
    theme: str
    language: str


class UserSettingsUpdate(BaseModel):
    theme: str | None = None
    language: str | None = None
