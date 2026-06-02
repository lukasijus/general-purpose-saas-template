import pytest

from app.core.security import hash_password, verify_password


def test_hash_password_uses_argon2() -> None:
    encoded = hash_password("correct horse battery staple", "argon2")

    assert encoded.startswith("$argon2")
    assert verify_password("correct horse battery staple", encoded)
    assert not verify_password("wrong", encoded)


def test_hash_password_rejects_unknown_scheme() -> None:
    with pytest.raises(ValueError):
        hash_password("password", "pbkdf2_sha256")
