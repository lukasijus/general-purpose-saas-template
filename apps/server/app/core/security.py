from datetime import datetime, timedelta, timezone
import base64
import hashlib
import hmac
import json
from typing import Any

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError
from fastapi import HTTPException, status

argon2_hasher = PasswordHasher()


def hash_password(password: str, scheme: str) -> str:
    if scheme != "argon2":
        raise ValueError(f"Unsupported password hash scheme: {scheme}")
    return argon2_hasher.hash(password)


def verify_password(password: str, encoded: str | None) -> bool:
    if not encoded:
        return False
    try:
        return argon2_hasher.verify(encoded, password)
    except (InvalidHashError, VerificationError, VerifyMismatchError):
        return False


def create_access_token(subject: str, secret: str, expires_seconds: int) -> str:
    payload = {
        "sub": subject,
        "exp": int((datetime.now(timezone.utc) + timedelta(seconds=expires_seconds)).timestamp()),
    }
    body = base64.urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode()).decode()
    signature = hmac.new(secret.encode(), body.encode(), hashlib.sha256).hexdigest()
    return f"{body}.{signature}"


def decode_access_token(token: str, secret: str) -> dict[str, Any]:
    try:
        body, signature = token.rsplit(".", 1)
    except ValueError as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token") from exc
    expected = hmac.new(secret.encode(), body.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(signature, expected):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token")
    payload = json.loads(base64.urlsafe_b64decode(body.encode()))
    if int(payload["exp"]) < int(datetime.now(timezone.utc).timestamp()):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token expired")
    return payload
