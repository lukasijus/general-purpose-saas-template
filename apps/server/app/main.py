from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.routes import router as auth_router
from app.email.routes import router as email_router
from app.users.routes import router as users_router
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix="/api",
    tags=["auth"],
)

app.include_router(
    users_router,
    prefix="/api",
    tags=["users"],
)

app.include_router(
    email_router,
    prefix="/api",
    tags=["contact"],
)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "environment": settings.app_env,
    }
