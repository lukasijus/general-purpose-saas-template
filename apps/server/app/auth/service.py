from typing import Any

from fastapi import HTTPException, status
import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.schemas import AuthUser, TokenResponse
from app.core.config import Settings
from app.core.security import create_access_token, hash_password, verify_password
from app.users.models import OAuthAccount, OAuthProvider, User, UserSettings


def to_auth_user(user: User) -> AuthUser:
    return AuthUser(
        uuid=user.uuid,
        email=user.email,
        role=user.role,
        is_active=user.is_active,
        is_verified=user.is_verified,
    )


def register_user(db: Session, settings: Settings, email: str, password: str) -> TokenResponse:
    existing = db.scalar(select(User).where(User.email == email.lower()))
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "Email is already registered")
    user = User(
        email=email.lower(), password_hash=hash_password(password, settings.password_hash_scheme)
    )
    user.settings = UserSettings(theme="system", language="en")
    db.add(user)
    db.commit()
    db.refresh(user)
    return issue_token(user, settings)


def authenticate_user(db: Session, settings: Settings, email: str, password: str) -> TokenResponse:
    user = db.scalar(select(User).where(User.email == email.lower()))
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    if not user.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "User is inactive")
    return issue_token(user, settings)


def issue_token(user: User, settings: Settings) -> TokenResponse:
    token = create_access_token(
        str(user.uuid),
        settings.jwt_access_secret,
        settings.access_token_expire,
    )
    return TokenResponse(access_token=token, user=to_auth_user(user))


def authenticate_google_user(
    db: Session, settings: Settings, code: str, redirect_uri: str
) -> TokenResponse:
    profile = fetch_google_profile(settings, code, redirect_uri)
    provider_user_id = str(profile.get("sub") or "")
    email = str(profile.get("email") or "").lower()
    if not provider_user_id or not email:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Google profile did not include identity")

    account = db.scalar(
        select(OAuthAccount).where(
            OAuthAccount.provider == OAuthProvider.GOOGLE,
            OAuthAccount.provider_user_id == provider_user_id,
        )
    )
    if account is not None:
        user = db.get(User, account.account_uuid)
        if user is None:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Linked user was not found")
        return issue_token(user, settings)

    user = db.scalar(select(User).where(User.email == email))
    if user is None:
        user = User(
            email=email,
            password_hash=None,
            is_verified=bool(profile.get("email_verified")),
        )
        user.settings = UserSettings(theme="system", language="en")
        db.add(user)
        db.flush()
    elif bool(profile.get("email_verified")) and not user.is_verified:
        user.is_verified = True

    db.add(
        OAuthAccount(
            account_uuid=user.uuid,
            provider=OAuthProvider.GOOGLE,
            provider_user_id=provider_user_id,
        )
    )
    db.commit()
    db.refresh(user)
    return issue_token(user, settings)


def fetch_google_profile(settings: Settings, code: str, redirect_uri: str) -> dict[str, Any]:
    try:
        with httpx.Client(timeout=10.0) as client:
            token_response = client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": code,
                    "client_id": settings.google_client_id,
                    "client_secret": settings.google_client_secret,
                    "redirect_uri": redirect_uri,
                    "grant_type": "authorization_code",
                },
            )
            token_response.raise_for_status()
            access_token = token_response.json()["access_token"]
            profile_response = client.get(
                "https://openidconnect.googleapis.com/v1/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            profile_response.raise_for_status()
            return profile_response.json()
    except (httpx.HTTPError, KeyError) as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Google sign in failed") from exc
