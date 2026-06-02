from email.message import EmailMessage
from uuid import UUID

from fastapi.testclient import TestClient
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy import inspect

from app.core.config import Settings, get_settings
from app.core.dependencies import current_settings
from app.users.models import OAuthProvider, User, UserRole


def test_register_login_and_me(client: TestClient) -> None:
    register = client.post(
        "/api/auth/register",
        json={"email": "owner@example.com", "password": "strong-pass"},
    )
    assert register.status_code == 201
    register_body = register.json()
    token = register_body["access_token"]
    user_uuid = UUID(register_body["user"]["uuid"])
    assert user_uuid.version == 7

    login = client.post(
        "/api/auth/login",
        json={"email": "owner@example.com", "password": "strong-pass"},
    )
    assert login.status_code == 200
    assert login.json()["user"]["email"] == "owner@example.com"

    me = client.get("/api/users/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200
    assert me.json()["role"] == "user"


def test_identity_tables_use_enum_constraints(db_session) -> None:
    inspector = inspect(db_session.bind)
    users_checks = {item["name"] for item in inspector.get_check_constraints("users")}
    oauth_checks = {item["name"] for item in inspector.get_check_constraints("oauth_accounts")}

    assert "user_role" in users_checks
    assert "oauth_provider" in oauth_checks
    assert [role.value for role in UserRole] == ["user", "admin"]
    assert [provider.value for provider in OAuthProvider] == ["google", "github"]


def test_users_use_native_postgres_uuid_columns() -> None:
    assert isinstance(User.__table__.c.uuid.type, PG_UUID)


def test_duplicate_registration_is_rejected(client: TestClient) -> None:
    payload = {"email": "dupe@example.com", "password": "strong-pass"}
    assert client.post("/api/auth/register", json=payload).status_code == 201
    assert client.post("/api/auth/register", json=payload).status_code == 409


def test_contact_email_uses_smtp_when_configured(client: TestClient, monkeypatch) -> None:
    sent: list[EmailMessage] = []

    class SMTPStub:
        def __init__(self, host: str, port: int, timeout: int) -> None:
            self.host = host
            self.port = port
            self.timeout = timeout

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, tb) -> None:
            return None

        def starttls(self) -> None:
            return None

        def login(self, username: str, password: str) -> None:
            assert username == "smtp-user"
            assert password == "smtp-pass"

        def send_message(self, message: EmailMessage) -> None:
            sent.append(message)

    monkeypatch.setattr("app.email.service.smtplib.SMTP", SMTPStub)

    def settings_override() -> Settings:
        return get_settings().model_copy(
            update={
                "smtp_host": "smtp.example.com",
                "smtp_username": "smtp-user",
                "smtp_password": "smtp-pass",
                "smtp_from_email": "support@example.com",
            }
        )

    client.app.dependency_overrides[current_settings] = settings_override

    response = client.post(
        "/api/contact",
        json={
            "email": "lead@example.com",
            "subject": "Demo request",
            "message": "I want to test SMTP delivery.",
        },
    )

    assert response.status_code == 200
    assert response.json()["dry_run"] is False
    assert sent[0]["Reply-To"] == "lead@example.com"


def test_security_headers_are_set(client: TestClient) -> None:
    response = client.get("/api/healthz")

    assert response.status_code == 200
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert response.headers["X-Frame-Options"] == "DENY"
    assert response.headers["Referrer-Policy"] == "strict-origin-when-cross-origin"
