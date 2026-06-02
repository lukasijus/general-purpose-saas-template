from uuid import UUID

from enum import StrEnum

from sqlalchemy import Boolean, ForeignKey, String, UniqueConstraint
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from sqlalchemy.dialects.postgresql import UUID as PG_UUID

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class UserRole(StrEnum):
    USER = "user"
    ADMIN = "admin"


class OAuthProvider(StrEnum):
    GOOGLE = "google"
    GITHUB = "github"


class User(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    role: Mapped[UserRole] = mapped_column(
        SqlEnum(
            UserRole,
            values_callable=lambda enum: [item.value for item in enum],
            native_enum=False,
            create_constraint=True,
            validate_strings=True,
            name="user_role",
        ),
        default=UserRole.USER,
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    oauth_accounts: Mapped[list["OAuthAccount"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", lazy="raise"
    )
    settings: Mapped["UserSettings"] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        uselist=False,
        lazy="raise",
    )


class OAuthAccount(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "oauth_accounts"
    __table_args__ = (
        UniqueConstraint("account_uuid", "provider", name="uq_oauth_account_provider"),
        UniqueConstraint("provider", "provider_user_id", name="uq_oauth_provider_user"),
    )

    account_uuid: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.uuid", ondelete="CASCADE"), nullable=False
    )
    provider: Mapped[OAuthProvider] = mapped_column(
        SqlEnum(
            OAuthProvider,
            values_callable=lambda enum: [item.value for item in enum],
            native_enum=False,
            create_constraint=True,
            validate_strings=True,
            name="oauth_provider",
        ),
        nullable=False,
    )
    provider_user_id: Mapped[str] = mapped_column(String(255), nullable=False)

    user: Mapped[User] = relationship(back_populates="oauth_accounts", lazy="raise")


class UserSettings(TimestampMixin, Base):
    __tablename__ = "user_settings"

    user_uuid: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.uuid", ondelete="CASCADE"), primary_key=True
    )
    theme: Mapped[str] = mapped_column(String(20), default="system", nullable=False)
    language: Mapped[str] = mapped_column(String(12), default="en", nullable=False)

    user: Mapped[User] = relationship(back_populates="settings", lazy="raise")
