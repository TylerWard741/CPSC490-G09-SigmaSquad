"""API tests for story #29, named by acceptance criterion (AC1-AC11).

The criteria that are purely page behaviour (AC5, AC6) and the on-screen half
of the others are in tests/ui/vehicle-select.test.js.
"""
import sqlite3
import time

import pytest

from app import create_app
from db.init_db import DEMO_USER_ID

VEHICLES_URL = f"/users/{DEMO_USER_ID}/vehicles"


def lookup_id(client, url, key, name):
    return next(row["id"] for row in client.get(url).get_json()[key] if row["name"] == name)


def make_id(client, name):
    return lookup_id(client, "/makes", "makes", name)


def model_id(client, make, name):
    return lookup_id(client, f"/makes/{make_id(client, make)}/models", "models", name)


def trim_id(client, make, model, year, trim):
    url = f"/models/{model_id(client, make, model)}/years/{year}/trims"
    return next(row["id"] for row in client.get(url).get_json()["trims"] if row["trim"] == trim)


def names(response, key):
    return [row["name"] for row in response.get_json()[key]]


def trim_names(client, model, year):
    response = client.get(f"/models/{model}/years/{year}/trims")
    return [row["trim"] for row in response.get_json()["trims"]]


def saved_row_count(db_path):
    conn = sqlite3.connect(db_path)
    try:
        return conn.execute("SELECT COUNT(*) FROM user_vehicles").fetchone()[0]
    finally:
        conn.close()


def test_ac1_page_is_served_and_makes_come_from_the_database(client, db_path):
    assert b'id="make"' in client.get("/").data
    assert names(client.get("/makes"), "makes") == ["Honda", "Toyota"]

    # Reads the database, not a list in the code.
    conn = sqlite3.connect(db_path)
    conn.execute("INSERT INTO makes (name) VALUES ('Ford')")
    conn.commit()
    conn.close()
    assert names(client.get("/makes"), "makes") == ["Ford", "Honda", "Toyota"]


def test_ac2_models_are_only_those_of_the_make(client):
    toyota = client.get(f"/makes/{make_id(client, 'Toyota')}/models")
    honda = client.get(f"/makes/{make_id(client, 'Honda')}/models")
    assert names(toyota, "models") == ["Camry", "Corolla"]
    assert names(honda, "models") == ["Civic"]


def test_ac3_years_are_only_those_of_the_model(client):
    civic = client.get(f"/models/{model_id(client, 'Honda', 'Civic')}/years")
    camry = client.get(f"/models/{model_id(client, 'Toyota', 'Camry')}/years")
    assert civic.get_json() == {"years": [2022, 2019]}
    # Two 2020 trims still mean one year.
    assert camry.get_json() == {"years": [2020]}


def test_ac4_trims_match_the_make_model_and_year(client):
    civic = model_id(client, "Honda", "Civic")
    camry = model_id(client, "Toyota", "Camry")
    assert trim_names(client, camry, 2020) == ["LE", "SE"]
    assert trim_names(client, civic, 2019) == ["EX"]
    assert trim_names(client, civic, 2022) == ["Sport"]


def test_ac7_save_stores_the_trim_id_on_the_account(client, db_path):
    expected_trim = trim_id(client, "Toyota", "Camry", 2020, "SE")

    response = client.post(VEHICLES_URL, json={"trim_id": expected_trim})

    assert response.status_code == 201
    vehicle = response.get_json()["vehicle"]
    assert (vehicle["make"], vehicle["model"], vehicle["year"], vehicle["trim"]) == (
        "Toyota", "Camry", 2020, "SE",
    )
    conn = sqlite3.connect(db_path)
    rows = conn.execute("SELECT user_id, trim_id FROM user_vehicles").fetchall()
    conn.close()
    assert rows == [(DEMO_USER_ID, expected_trim)]


def test_ac8_saved_vehicle_is_listed_after_returning(client, db_path):
    client.post(VEHICLES_URL, json={"trim_id": trim_id(client, "Honda", "Civic", 2022, "Sport")})

    # A new app instance shares nothing with the first except the database file.
    returning = create_app(db_path).test_client()
    vehicles = returning.get(VEHICLES_URL).get_json()["vehicles"]

    assert [(v["make"], v["model"], v["year"], v["trim"]) for v in vehicles] == [
        ("Honda", "Civic", 2022, "Sport")
    ]


def test_ac9_duplicate_save_returns_409_and_adds_no_row(client, db_path):
    payload = {"trim_id": trim_id(client, "Toyota", "Corolla", 2021, "L")}
    assert client.post(VEHICLES_URL, json=payload).status_code == 201

    response = client.post(VEHICLES_URL, json=payload)

    assert response.status_code == 409
    assert "already saved" in response.get_json()["error"]
    assert saved_row_count(db_path) == 1


def test_ac9_the_database_itself_rejects_duplicates(db_path):
    """Fails if the UNIQUE constraint is removed, whatever the app code does."""
    conn = sqlite3.connect(db_path)
    insert = "INSERT INTO user_vehicles (user_id, trim_id) VALUES (?, 1)"
    conn.execute(insert, (DEMO_USER_ID,))
    with pytest.raises(sqlite3.IntegrityError):
        conn.execute(insert, (DEMO_USER_ID,))
    conn.close()


@pytest.mark.parametrize("method,url", [
    ("get", "/makes"),
    ("get", "/makes/1/models"),
    ("get", "/models/1/years"),
    ("get", "/models/1/years/2020/trims"),
    ("get", VEHICLES_URL),
    ("post", VEHICLES_URL),
])
def test_ac10_missing_database_returns_503_json(db_path, method, url):
    client = create_app(db_path).test_client()
    db_path.unlink()

    response = getattr(client, method)(url, json={"trim_id": 1} if method == "post" else None)

    assert response.status_code == 503
    assert "can't be reached" in response.get_json()["error"]
    # mode=rw: the outage must not be hidden by creating a new empty file.
    assert not db_path.exists()


def test_ac10_broken_database_returns_503(tmp_path):
    empty = tmp_path / "empty.db"
    sqlite3.connect(empty).close()
    assert create_app(empty).test_client().get("/makes").status_code == 503


def test_ac11_make_filter_returns_matches_within_one_second(client):
    start = time.perf_counter()
    response = client.get("/makes", query_string={"q": "toy"})
    elapsed = time.perf_counter() - start

    assert names(response, "makes") == ["Toyota"]
    assert elapsed < 1.0


def test_ac11_model_filter_returns_matches_within_one_second(client):
    url = f"/makes/{make_id(client, 'Toyota')}/models"

    start = time.perf_counter()
    response = client.get(url, query_string={"q": "cor"})
    elapsed = time.perf_counter() - start

    assert names(response, "models") == ["Corolla"]
    assert elapsed < 1.0


def test_filter_stays_within_the_selected_make(client):
    url = f"/makes/{make_id(client, 'Honda')}/models"
    assert names(client.get(url, query_string={"q": "camry"}), "models") == []


@pytest.mark.parametrize("wildcard", ["%", "_", "\\"])
def test_filter_treats_like_wildcards_as_literal_text(client, wildcard):
    assert names(client.get("/makes", query_string={"q": wildcard}), "makes") == []


def test_filter_input_cannot_inject_sql(client):
    attack = "'; DROP TABLE makes; --"
    assert names(client.get("/makes", query_string={"q": attack}), "makes") == []
    assert names(client.get("/makes"), "makes") == ["Honda", "Toyota"]


@pytest.mark.parametrize("url", [
    "/makes/999/models",
    "/models/999/years",
    "/models/999/years/2020/trims",
    "/models/1/years/1900/trims",
    "/users/999/vehicles",
    "/makes/not-a-number/models",
])
def test_unknown_ids_return_404_json(client, url):
    response = client.get(url)
    assert response.status_code == 404
    assert "error" in response.get_json()


def test_save_rejects_unknown_user_and_trim_without_inserting(client, db_path):
    assert client.post("/users/999/vehicles", json={"trim_id": 1}).status_code == 404
    assert client.post(VEHICLES_URL, json={"trim_id": 999}).status_code == 404
    assert saved_row_count(db_path) == 0


@pytest.mark.parametrize("payload", [
    [],
    {},
    {"trim_id": None},
    {"trim_id": "1"},
    {"trim_id": True},
    {"trim_id": 0},
    {"trim_id": 1, "nickname": 5},
    {"trim_id": 1, "nickname": "x" * 101},
])
def test_save_rejects_bad_bodies_with_400(client, db_path, payload):
    assert client.post(VEHICLES_URL, json=payload).status_code == 400
    assert saved_row_count(db_path) == 0


def test_save_rejects_non_json_body_with_400(client):
    response = client.post(VEHICLES_URL, data="trim_id=1")
    assert response.status_code == 400


def test_save_stores_an_optional_nickname(client):
    response = client.post(VEHICLES_URL, json={"trim_id": 1, "nickname": "Daily driver"})
    assert response.get_json()["vehicle"]["nickname"] == "Daily driver"
