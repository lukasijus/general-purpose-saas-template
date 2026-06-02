from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.core.security import decode_access_token
from app.db.sessions import get_db
from app.users.models import User

bearer_scheme = HTTPBearer(auto_error=False)


def current_settings() -> Settings:
    return get_settings()


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
    settings: Settings = Depends(current_settings),
) -> User:
    if credentials is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing bearer token")
    payload = decode_access_token(credentials.credentials, settings.jwt_access_secret)
    user = db.get(User, UUID(payload["sub"]))
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found")
    return user
