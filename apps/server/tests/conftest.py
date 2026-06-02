from collections.abc import Generator
import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.database import Base
from app.db.sessions import get_db
from app.main import app


def test_database_url() -> str:
    url = os.getenv("TEST_DATABASE_URL") or os.getenv("DATABASE_URL") or ""
    if not url.startswith(("postgresql://", "postgresql+psycopg://")):
        pytest.skip("PostgreSQL test database is not configured")
    return url


@pytest.fixture()
def db_session() -> Generator[Session, None, None]:
    engine = create_engine(test_database_url())
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(engine)
        engine.dispose()


@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def override_db():
        yield db_session

    app.dependency_overrides[get_db] = override_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
