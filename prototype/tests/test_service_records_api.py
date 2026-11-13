"""API tests for task #81, named by the requirement they cover.

FR numbers are from docs/specs/vehicle-service-api.md.
"""
import sqlite3
from datetime import date, timedelta

import pytest

from app import create_app
from db.init_db import DEMO_USER_ID, SERVICE_TYPES

VEHICLES_URL = f"/users/{DEMO_USER_ID}/vehicles"
UNAVAILABLE = "The vehicle database can't be reached. Please try again."


@pytest.fixture
def vehicle_id(client):
    return client.post(VEHICLES_URL, json={"trim_id": 1}).get_json()["vehicle"]["id"]


def type_id(client, name):
    types = client.get("/service-types").get_json()["service_types"]
    return next(row["id"] for row in types if row["name"] == name)


def records_url(vehicle_id):
    return f"/vehicles/{vehicle_id}/service-records"


def valid_body(client, **changes):
    body = {
        "service_type_id": type_id(client, "Oil change"),
        "service_date": "2026-10-15",
        "mileage": 42150,
        "notes": "Synthetic 0W-20",
    }
    body.update(changes)
    return body


def create_record(client, vehicle_id, **changes):
    response = client.post(records_url(vehicle_id), json=valid_body(client, **changes))
    assert response.status_code == 201
    return response.get_json()["service_record"]


def query(db_path, sql, *params):
    conn = sqlite3.connect(db_path)
    try:
        return conn.execute(sql, params).fetchall()
    finally:
        conn.close()


def record_count(db_path):
    return query(db_path, "SELECT COUNT(*) FROM service_records")[0][0]


def current_mileage(db_path, vehicle_id):
    return query(
        db_path, "SELECT current_mileage FROM user_vehicles WHERE id = ?", vehicle_id
    )[0][0]


def test_fr1_create_returns_201_and_stores_the_record(client, db_path, vehicle_id):
    oil_change = type_id(client, "Oil change")

    response = client.post(records_url(vehicle_id), json=valid_body(client))

    assert response.status_code == 201
    record = response.get_json()["service_record"]
    assert record == {
        "id": record["id"],
        "vehicle_id": vehicle_id,
        "service_type_id": oil_change,
        "service_type": "Oil change",
        "service_date": "2026-10-15",
        "mileage": 42150,
        "notes": "Synthetic 0W-20",
    }
    assert query(
        db_path,
        "SELECT vehicle_id, service_type_id, service_date, mileage, notes FROM service_records",
    ) == [(vehicle_id, oil_change, "2026-10-15", 42150, "Synthetic 0W-20")]


def test_fr1_notes_are_optional(client, vehicle_id):
    body = valid_body(client)
    del body["notes"]

    response = client.post(records_url(vehicle_id), json=body)

    assert response.status_code == 201
    assert response.get_json()["service_record"]["notes"] is None


def test_fr1_today_is_accepted_as_a_service_date(client, vehicle_id):
    today = date.today().isoformat()
    assert create_record(client, vehicle_id, service_date=today)["service_date"] == today


def test_fr2_list_returns_200_newest_date_first(client, vehicle_id):
    for service_date in ["2026-03-01", "2026-10-15", "2025-12-31"]:
        create_record(client, vehicle_id, service_date=service_date)

    response = client.get(records_url(vehicle_id))

    assert response.status_code == 200
    dates = [row["service_date"] for row in response.get_json()["service_records"]]
    assert dates == ["2026-10-15", "2026-03-01", "2025-12-31"]


def test_fr2_list_only_has_the_records_of_that_vehicle(client, vehicle_id):
    other = client.post(VEHICLES_URL, json={"trim_id": 2}).get_json()["vehicle"]["id"]
    mine = create_record(client, vehicle_id)
    create_record(client, other)

    records = client.get(records_url(vehicle_id)).get_json()["service_records"]

    assert [row["id"] for row in records] == [mine["id"]]


def test_fr2_list_is_empty_for_a_vehicle_without_records(client, vehicle_id):
    assert client.get(records_url(vehicle_id)).get_json() == {"service_records": []}


def test_fr3_update_returns_200_and_saves_the_changes(client, db_path, vehicle_id):
    record = create_record(client, vehicle_id)
    rotation = type_id(client, "Tire rotation")
    changes = {
        "service_type_id": rotation,
        "service_date": "2026-09-01",
        "mileage": 41000,
        "notes": None,
    }

    response = client.patch(f"/service-records/{record['id']}", json=changes)

    assert response.status_code == 200
    updated = response.get_json()["service_record"]
    assert updated == {**record, **changes, "service_type": "Tire rotation"}
    assert query(
        db_path, "SELECT service_type_id, service_date, mileage, notes FROM service_records"
    ) == [(rotation, "2026-09-01", 41000, None)]


def test_fr3_update_of_one_field_leaves_the_others(client, vehicle_id):
    record = create_record(client, vehicle_id)

    response = client.patch(f"/service-records/{record['id']}", json={"notes": "Edited"})

    assert response.get_json()["service_record"] == {**record, "notes": "Edited"}


def test_fr4_delete_vehicle_returns_204_and_removes_it_and_its_records(
    client, db_path, vehicle_id
):
    other = client.post(VEHICLES_URL, json={"trim_id": 2}).get_json()["vehicle"]["id"]
    create_record(client, vehicle_id)
    create_record(client, vehicle_id, service_date="2026-03-01")
    kept = create_record(client, other)

    response = client.delete(f"/vehicles/{vehicle_id}")

    assert response.status_code == 204
    assert response.data == b""
    assert query(db_path, "SELECT id FROM user_vehicles") == [(other,)]
    assert query(db_path, "SELECT id FROM service_records") == [(kept["id"],)]
    assert client.get(f"/vehicles/{vehicle_id}").status_code == 404
    assert client.get(records_url(vehicle_id)).status_code == 404


def test_fr4_deleted_vehicle_can_be_saved_again(client, vehicle_id):
    client.delete(f"/vehicles/{vehicle_id}")
    assert client.post(VEHICLES_URL, json={"trim_id": 1}).status_code == 201


def test_fr5_delete_returns_204_and_removes_the_record(client, db_path, vehicle_id):
    record = create_record(client, vehicle_id)
    kept = create_record(client, vehicle_id)

    response = client.delete(f"/service-records/{record['id']}")

    assert response.status_code == 204
    assert response.data == b""
    assert query(db_path, "SELECT id FROM service_records") == [(kept["id"],)]


@pytest.mark.parametrize("changes,field", [
    ({"service_date": None}, "service_date"),
    ({"service_date": 20261015}, "service_date"),
    ({"service_date": "20261015"}, "service_date"),
    ({"service_date": "10/15/2026"}, "service_date"),
    ({"service_date": "2026-13-40"}, "service_date"),
    ({"service_date": "2026-02-30"}, "service_date"),
    ({"service_date": "2026-10-15T08:00"}, "service_date"),
    ({"mileage": None}, "mileage"),
    ({"mileage": "42150"}, "mileage"),
    ({"mileage": 42150.5}, "mileage"),
    ({"mileage": True}, "mileage"),
    ({"mileage": -1}, "mileage"),
    ({"service_type_id": None}, "service_type_id"),
    ({"service_type_id": "1"}, "service_type_id"),
    ({"service_type_id": True}, "service_type_id"),
    ({"service_type_id": 0}, "service_type_id"),
    ({"notes": 5}, "notes"),
    ({"notes": "x" * 1001}, "notes"),
    ({"cost": 59.99}, "cost"),
])
def test_fr6_invalid_input_returns_400_names_the_field_and_saves_nothing(
    client, db_path, vehicle_id, changes, field
):
    record = create_record(client, vehicle_id)

    created = client.post(records_url(vehicle_id), json=valid_body(client, **changes))
    updated = client.patch(f"/service-records/{record['id']}", json=changes)

    for response in (created, updated):
        assert response.status_code == 400
        assert field in response.get_json()["error"]
    assert record_count(db_path) == 1
    assert client.get(f"/service-records/{record['id']}").get_json()["service_record"] == record


@pytest.mark.parametrize("field", ["service_date", "mileage", "service_type_id"])
def test_fr6_missing_required_field_returns_400_and_saves_nothing(
    client, db_path, vehicle_id, field
):
    body = valid_body(client)
    del body[field]

    response = client.post(records_url(vehicle_id), json=body)

    assert response.status_code == 400
    assert field in response.get_json()["error"]
    assert record_count(db_path) == 0


def test_fr6_future_service_date_returns_400(client, db_path, vehicle_id):
    tomorrow = (date.today() + timedelta(days=1)).isoformat()

    response = client.post(
        records_url(vehicle_id), json=valid_body(client, service_date=tomorrow)
    )

    assert response.status_code == 400
    assert "service_date" in response.get_json()["error"]
    assert record_count(db_path) == 0


def test_fr6_the_spec_example_reports_the_date_first(client, vehicle_id):
    body = {"service_type_id": 1, "service_date": "2026-13-40", "mileage": -5}

    response = client.post(records_url(vehicle_id), json=body)

    assert response.status_code == 400
    assert response.get_json() == {
        "error": "service_date must be a valid date in YYYY-MM-DD format."
    }


@pytest.mark.parametrize("payload", [[], "text", 5, None])
def test_fr6_body_that_is_not_an_object_returns_400(client, db_path, vehicle_id, payload):
    record = create_record(client, vehicle_id)

    assert client.post(records_url(vehicle_id), json=payload).status_code == 400
    assert client.patch(f"/service-records/{record['id']}", json=payload).status_code == 400
    assert record_count(db_path) == 1


def test_fr6_non_json_body_returns_400(client, vehicle_id):
    response = client.post(records_url(vehicle_id), data="mileage=42150")
    assert response.status_code == 400


def test_fr6_update_with_no_fields_returns_400(client, vehicle_id):
    record = create_record(client, vehicle_id)
    assert client.patch(f"/service-records/{record['id']}", json={}).status_code == 400


def test_fr6_notes_of_exactly_1000_characters_are_accepted(client, vehicle_id):
    assert len(create_record(client, vehicle_id, notes="x" * 1000)["notes"]) == 1000


def test_fr6_the_database_itself_rejects_negative_mileage(db_path):
    """Fails if the CHECK constraint is removed, whatever the app code does."""
    conn = sqlite3.connect(db_path)
    conn.execute(
        "INSERT INTO user_vehicles (user_id, trim_id) VALUES (?, 1)", (DEMO_USER_ID,)
    )
    with pytest.raises(sqlite3.IntegrityError):
        conn.execute(
            "INSERT INTO service_records (vehicle_id, service_type_id, service_date, mileage) "
            "VALUES (1, 1, '2026-10-15', -1)"
        )
    conn.close()


@pytest.mark.parametrize("method,url", [
    ("get", "/vehicles/999/service-records"),
    ("post", "/vehicles/999/service-records"),
    ("get", "/service-records/999"),
    ("patch", "/service-records/999"),
    ("delete", "/service-records/999"),
    ("get", "/service-records/not-a-number"),
    ("get", "/vehicles/999"),
    ("patch", "/vehicles/999"),
    ("delete", "/vehicles/999"),
    ("get", "/vehicles/not-a-number"),
])
def test_fr7_unknown_vehicle_or_record_returns_404_json(client, db_path, method, url):
    if url.startswith("/vehicles/999") and method == "patch":
        body = {"nickname": "Daily driver"}
    else:
        body = valid_body(client) if method in ("post", "patch") else None

    response = getattr(client, method)(url, json=body)

    assert response.status_code == 404
    assert "error" in response.get_json()
    assert record_count(db_path) == 0


def test_fr7_unknown_service_type_returns_404_and_saves_nothing(client, db_path, vehicle_id):
    record = create_record(client, vehicle_id)
    unknown = {"service_type_id": 999}

    created = client.post(records_url(vehicle_id), json=valid_body(client, **unknown))
    updated = client.patch(f"/service-records/{record['id']}", json=unknown)

    assert created.status_code == 404
    assert updated.status_code == 404
    assert record_count(db_path) == 1
    assert client.get(f"/service-records/{record['id']}").get_json()["service_record"] == record


def test_fr7_deleted_record_is_no_longer_found(client, vehicle_id):
    record = create_record(client, vehicle_id)
    client.delete(f"/service-records/{record['id']}")
    assert client.get(f"/service-records/{record['id']}").status_code == 404


@pytest.mark.parametrize("method,url", [
    ("get", "/service-types"),
    ("get", "/vehicles/1/service-records"),
    ("post", "/vehicles/1/service-records"),
    ("get", "/service-records/1"),
    ("patch", "/service-records/1"),
    ("delete", "/service-records/1"),
    ("get", "/vehicles/1"),
    ("patch", "/vehicles/1"),
    ("delete", "/vehicles/1"),
])
def test_fr8_missing_database_returns_503_with_the_message(db_path, method, url):
    client = create_app(db_path).test_client()
    if url == "/vehicles/1":
        body = {"current_mileage": 42150}
    else:
        body = {"service_type_id": 1, "service_date": "2026-10-15", "mileage": 42150}
    db_path.unlink()

    response = getattr(client, method)(url, json=body if method in ("post", "patch") else None)

    assert response.status_code == 503
    assert response.get_json() == {"error": UNAVAILABLE}
    # mode=rw: the outage must not be hidden by creating a new empty file.
    assert not db_path.exists()


def test_fr9_read_vehicle_returns_200_and_its_details(client):
    saved = client.post(
        VEHICLES_URL, json={"trim_id": 1, "nickname": "Daily driver"}
    ).get_json()["vehicle"]

    response = client.get(f"/vehicles/{saved['id']}")

    assert response.status_code == 200
    vehicle = response.get_json()["vehicle"]
    assert vehicle == {**saved, "current_mileage": None}
    assert (
        vehicle["make"], vehicle["model"], vehicle["year"], vehicle["trim"],
        vehicle["nickname"], vehicle["current_mileage"],
    ) == ("Toyota", "Camry", 2020, "LE", "Daily driver", None)


def test_fr9_read_vehicle_shows_the_mileage_a_record_set(client, vehicle_id):
    create_record(client, vehicle_id, mileage=42150)
    vehicle = client.get(f"/vehicles/{vehicle_id}").get_json()["vehicle"]
    assert vehicle["current_mileage"] == 42150


def test_fr10_update_vehicle_returns_200_and_saves_the_changes(client, db_path, vehicle_id):
    before = client.get(f"/vehicles/{vehicle_id}").get_json()["vehicle"]
    changes = {"nickname": "Road trip car", "current_mileage": 43000}

    response = client.patch(f"/vehicles/{vehicle_id}", json=changes)

    assert response.status_code == 200
    assert response.get_json()["vehicle"] == {**before, **changes}
    assert query(
        db_path, "SELECT nickname, current_mileage FROM user_vehicles WHERE id = ?", vehicle_id
    ) == [("Road trip car", 43000)]


def test_fr10_update_of_one_field_leaves_the_other(client, vehicle_id):
    client.patch(f"/vehicles/{vehicle_id}", json={"nickname": "Daily driver"})

    response = client.patch(f"/vehicles/{vehicle_id}", json={"current_mileage": 500})

    vehicle = response.get_json()["vehicle"]
    assert (vehicle["nickname"], vehicle["current_mileage"]) == ("Daily driver", 500)


def test_fr10_nickname_can_be_cleared_with_null(client, vehicle_id):
    client.patch(f"/vehicles/{vehicle_id}", json={"nickname": "Daily driver"})

    response = client.patch(f"/vehicles/{vehicle_id}", json={"nickname": None})

    assert response.get_json()["vehicle"]["nickname"] is None


def test_fr10_owner_can_lower_current_mileage_to_fix_a_mistake(client, db_path, vehicle_id):
    """Records only raise current_mileage; a direct update is the way to correct it."""
    create_record(client, vehicle_id, mileage=420000)

    response = client.patch(f"/vehicles/{vehicle_id}", json={"current_mileage": 42000})

    assert response.status_code == 200
    assert current_mileage(db_path, vehicle_id) == 42000


@pytest.mark.parametrize("payload,field", [
    ({"nickname": 5}, "nickname"),
    ({"nickname": "x" * 101}, "nickname"),
    ({"current_mileage": None}, "current_mileage"),
    ({"current_mileage": "43000"}, "current_mileage"),
    ({"current_mileage": 43000.5}, "current_mileage"),
    ({"current_mileage": True}, "current_mileage"),
    ({"current_mileage": -1}, "current_mileage"),
    ({"trim_id": 2}, "trim_id"),
    ({"user_id": 2}, "user_id"),
])
def test_fr6_invalid_vehicle_update_returns_400_and_saves_nothing(
    client, vehicle_id, payload, field
):
    client.patch(f"/vehicles/{vehicle_id}", json={"nickname": "Daily driver", "current_mileage": 100})
    before = client.get(f"/vehicles/{vehicle_id}").get_json()["vehicle"]

    response = client.patch(f"/vehicles/{vehicle_id}", json=payload)

    assert response.status_code == 400
    assert field in response.get_json()["error"]
    assert client.get(f"/vehicles/{vehicle_id}").get_json()["vehicle"] == before


@pytest.mark.parametrize("payload", [[], {}, "text", None])
def test_fr6_vehicle_update_without_a_usable_body_returns_400(client, vehicle_id, payload):
    assert client.patch(f"/vehicles/{vehicle_id}", json=payload).status_code == 400


def test_fr6_the_database_itself_rejects_negative_current_mileage(db_path):
    """Fails if the CHECK constraint is removed, whatever the app code does."""
    conn = sqlite3.connect(db_path)
    with pytest.raises(sqlite3.IntegrityError):
        conn.execute(
            "INSERT INTO user_vehicles (user_id, trim_id, current_mileage) VALUES (?, 1, -1)",
            (DEMO_USER_ID,),
        )
    conn.close()


def test_fr11_read_returns_200_and_the_record_fields(client, vehicle_id):
    record = create_record(client, vehicle_id)

    response = client.get(f"/service-records/{record['id']}")

    assert response.status_code == 200
    assert response.get_json() == {"service_record": record}


def test_fr12_service_types_return_200_sorted_by_name(client):
    response = client.get("/service-types")

    assert response.status_code == 200
    types = response.get_json()["service_types"]
    assert [row["name"] for row in types] == sorted(SERVICE_TYPES)
    assert all(isinstance(row["id"], int) for row in types)


def test_fr12_service_types_come_from_the_database(client, db_path):
    conn = sqlite3.connect(db_path)
    conn.execute("INSERT INTO service_types (name) VALUES ('Air filter')")
    conn.commit()
    conn.close()

    names = [row["name"] for row in client.get("/service-types").get_json()["service_types"]]

    assert names == sorted([*SERVICE_TYPES, "Air filter"])


# Decision on #81: a record with a higher mileage moves current_mileage forward.

def test_new_vehicle_has_no_current_mileage(db_path, vehicle_id):
    assert current_mileage(db_path, vehicle_id) is None


def test_record_sets_then_raises_current_mileage(client, db_path, vehicle_id):
    create_record(client, vehicle_id, mileage=40000)
    assert current_mileage(db_path, vehicle_id) == 40000

    create_record(client, vehicle_id, mileage=42150)
    assert current_mileage(db_path, vehicle_id) == 42150


def test_record_with_lower_mileage_does_not_lower_current_mileage(client, db_path, vehicle_id):
    create_record(client, vehicle_id, mileage=42150)

    create_record(client, vehicle_id, mileage=30000, service_date="2025-01-10")

    assert current_mileage(db_path, vehicle_id) == 42150


def test_update_to_a_higher_mileage_raises_current_mileage(client, db_path, vehicle_id):
    record = create_record(client, vehicle_id, mileage=42150)

    client.patch(f"/service-records/{record['id']}", json={"mileage": 43000})
    assert current_mileage(db_path, vehicle_id) == 43000

    client.patch(f"/service-records/{record['id']}", json={"mileage": 100})
    assert current_mileage(db_path, vehicle_id) == 43000


def test_rejected_record_does_not_change_current_mileage(client, db_path, vehicle_id):
    client.post(records_url(vehicle_id), json=valid_body(client, mileage=-1))
    client.post(records_url(vehicle_id), json=valid_body(client, service_type_id=999))
    assert current_mileage(db_path, vehicle_id) is None


def test_notes_cannot_inject_sql(client, db_path, vehicle_id):
    attack = "'); DROP TABLE service_records; --"

    record = create_record(client, vehicle_id, notes=attack)

    assert record["notes"] == attack
    assert record_count(db_path) == 1


def test_fr4_the_database_itself_removes_the_records_of_a_deleted_vehicle(
    client, db_path, vehicle_id
):
    """Fails if ON DELETE CASCADE is removed, whatever the app code does."""
    create_record(client, vehicle_id)
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("DELETE FROM user_vehicles WHERE id = ?", (vehicle_id,))
    conn.commit()
    conn.close()

    assert record_count(db_path) == 0
