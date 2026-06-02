from functools import lru_cache
from enum import StrEnum

from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(StrEnum):
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", ".env.development", "../../.env.development"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str
    app_env: Environment
    debug: bool

    database_url: str
    upload_storage_path: str

    jwt_access_secret: str
    jwt_refresh_secret: str
    access_token_expire: int
    refresh_token_expire: int

    google_client_id: str
    google_client_secret: str
    github_client_id: str
    github_client_secret: str

    gui_app_url: str

    password_hash_scheme: str
    cors_allowed_origins: str

    smtp_host: str
    smtp_port: int
    smtp_username: str
    smtp_password: str
    smtp_from_email: str
    smtp_use_tls: bool

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.cors_allowed_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
