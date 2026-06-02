from urllib.parse import urlencode

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.auth.schemas import LoginRequest, RegisterRequest, TokenResponse
from app.auth.service import (
    authenticate_google_user,
    authenticate_user,
    register_user,
    to_auth_user,
)
from app.core.config import Settings
from app.core.dependencies import current_settings, get_current_user
from app.core.security import create_access_token, decode_access_token
from app.db.sessions import get_db
from app.users.models import User

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(
    payload: RegisterRequest,
    db: Session = Depends(get_db),
    settings: Settings = Depends(current_settings),
) -> TokenResponse:
    return register_user(db, settings, payload.email, payload.password)


@router.post("/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
    settings: Settings = Depends(current_settings),
) -> TokenResponse:
    return authenticate_user(db, settings, payload.email, payload.password)


@router.get("/me")
def me(user: User = Depends(get_current_user)):
    return to_auth_user(user)


@router.get("/sso/google/start")
def google_sso_start(
    request: Request,
    settings: Settings = Depends(current_settings),
) -> RedirectResponse:
    if not settings.google_client_id or not settings.google_client_secret:
        raise HTTPException(status.HTTP_503_SERVICE_UNAVAILABLE, "Google SSO is not configured")

    redirect_uri = str(request.url_for("google_sso_callback"))
    state = create_access_token("google", settings.jwt_access_secret, 600)
    query = urlencode(
        {
            "client_id": settings.google_client_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "state": state,
            "access_type": "offline",
            "prompt": "select_account",
        }
    )
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{query}")


@router.get("/sso/google/callback")
def google_sso_callback(
    request: Request,
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
    db: Session = Depends(get_db),
    settings: Settings = Depends(current_settings),
) -> RedirectResponse:
    if error:
        return redirect_gui(settings, f"/auth/callback#{urlencode({'error': error})}")
    if not code or not state:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Missing Google callback parameters")
    payload = decode_access_token(state, settings.jwt_access_secret)
    if payload.get("sub") != "google":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid Google callback state")

    token = authenticate_google_user(
        db, settings, code, str(request.url_for("google_sso_callback"))
    )
    fragment = urlencode({"access_token": token.access_token, "token_type": token.token_type})
    return redirect_gui(settings, f"/auth/callback#{fragment}")


@router.get("/sso/github/start")
def github_sso_start() -> None:
    raise HTTPException(status.HTTP_501_NOT_IMPLEMENTED, "GitHub SSO is not implemented yet")


def redirect_gui(settings: Settings, path: str) -> RedirectResponse:
    return RedirectResponse(f"{settings.gui_app_url.rstrip('/')}{path}")
