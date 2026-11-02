"""Shared fixtures: every test gets a fresh database from schema.sql + seed."""
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app import create_app  # noqa: E402
from db.init_db import init_db  # noqa: E402


@pytest.fixture
def db_path(tmp_path):
    path = tmp_path / "test.db"
    init_db(path)
    return path


@pytest.fixture
def client(db_path):
    return create_app(db_path).test_client()
