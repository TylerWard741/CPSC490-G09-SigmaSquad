"""Tests for task #76, named by definition of done and by requirement.

Definition of done: "Given a vehicle with service history and current
mileage, the engine returns a label for each of the three service types."
FR numbers are from docs/specs/recommendations-and-alerts.md. Trim 1 is the
2020 Camry LE and trim 4 the 2019 Civic EX (db/init_db.py); the Camry's
intervals are 5,000 miles for tire rotation and brake inspection and 10,000
for oil changes (db/service_interval_data.py).
"""
import sqlite3

import pytest

from label_rule import DUE_NOW, DUE_SOON, OVERDUE, WHEN_CONVENIENT
from recommendation_engine import recommend
from recommendation_window import recommended_window

CAMRY_LE = 1
CIVIC_EX = 4
THREE_TYPES = {"Oil change", "Tire rotation", "Brake inspection"}


@pytest.fixture
def conn(db_path):
    connection = sqlite3.connect(db_path)
    yield connection
    connection.close()


def rec(service_type, mileage):
    return {"service_type": service_type, "mileage": mileage}


def test_dod_a_vehicle_with_history_and_mileage_gets_a_label_for_each_of_the_three_types(conn):
    history = [rec("Oil change", 10000), rec("Tire rotation", 8000), rec("Brake inspection", 8000)]
    result = recommend(conn, CAMRY_LE, 12000, history)
    assert set(result) == THREE_TYPES
    assert all(result[kind]["label"] is not None for kind in THREE_TYPES)


def test_next_window_is_the_last_service_plus_the_interval(conn):
    """A rotation at 8,000 miles is next due at 13,000, not at 10,000."""
    result = recommend(conn, CAMRY_LE, 9000, [rec("Tire rotation", 8000)])
    rotation = result["Tire rotation"]
    assert (rotation["window_start"], rotation["window_end"]) == (13000, 13000)


def test_fr1_to_fr5_labels_around_the_next_window(conn):
    history = [rec("Tire rotation", 8000)]  # next due at 13,000
    labels = {
        miles: recommend(conn, CAMRY_LE, miles, history)["Tire rotation"]["label"]
        for miles in (12499, 12500, 13000, 13001)
    }
    assert labels == {
        12499: WHEN_CONVENIENT,
        12500: DUE_SOON,
        13000: DUE_NOW,
        13001: OVERDUE,
    }


def test_fr11_a_single_mileage_is_a_window_with_equal_start_and_end(conn):
    result = recommend(conn, CAMRY_LE, 0, [])
    for kind in THREE_TYPES:
        assert result[kind]["window_start"] == result[kind]["window_end"]


def test_no_history_for_a_type_uses_the_first_window_from_an_odometer_of_zero(conn):
    result = recommend(conn, CAMRY_LE, 100, [])
    assert result["Tire rotation"]["window_start"] == 5000
    assert result["Brake inspection"]["window_start"] == 5000
    assert result["Oil change"]["window_start"] == 10000


def test_each_type_is_judged_from_its_own_most_recent_record(conn):
    history = [
        rec("Tire rotation", 5000),
        rec("Tire rotation", 15000),  # most recent: next due at 20,000
        rec("Oil change", 10000),
    ]
    result = recommend(conn, CAMRY_LE, 16000, history)
    assert result["Tire rotation"]["window_start"] == 20000
    assert result["Oil change"]["window_start"] == 20000
    # No brake inspection on record: first window, so long overdue at 16,000.
    assert result["Brake inspection"]["window_start"] == 5000
    assert result["Brake inspection"]["label"] == OVERDUE


def test_fr13_no_current_mileage_gives_no_labels(conn):
    result = recommend(conn, CAMRY_LE, None, [rec("Oil change", 10000)])
    assert set(result) == THREE_TYPES
    assert all(value["label"] is None for value in result.values())


def test_a_trim_with_no_interval_data_gets_no_labels_for_any_type(conn):
    """Honda publishes no mileage interval, so the Civic has no rows (#75)."""
    result = recommend(conn, CIVIC_EX, 30000, [rec("Oil change", 20000)])
    assert set(result) == THREE_TYPES
    assert all(
        value == {"label": None, "window_start": None, "window_end": None}
        for value in result.values()
    )


def test_a_one_time_service_that_has_been_done_has_no_next_window(conn):
    conn.execute(
        "INSERT INTO service_intervals (trim_id, service_type_id, window_start_miles, "
        "window_end_miles, repeat_every_miles, source_url, source_page, source_quote) "
        "VALUES (?, (SELECT id FROM service_types WHERE name = 'Oil change'), 1000, 1500, NULL, 'u', 'p', 'q')",
        (CIVIC_EX,),
    )
    assert recommended_window(conn, CIVIC_EX, "Oil change") == (1000, 1500)
    assert recommended_window(conn, CIVIC_EX, "Oil change", 1200) is None


def test_the_window_keeps_the_manufacturers_width_when_it_repeats(conn):
    conn.execute(
        "INSERT INTO service_intervals (trim_id, service_type_id, window_start_miles, "
        "window_end_miles, repeat_every_miles, source_url, source_page, source_quote) "
        "VALUES (?, (SELECT id FROM service_types WHERE name = 'Tire rotation'), 5000, 7500, 5000, 'u', 'p', 'q')",
        (CIVIC_EX,),
    )
    assert recommended_window(conn, CIVIC_EX, "Tire rotation", 8000) == (13000, 15500)


def test_the_records_api_gives_a_civic_no_label_and_a_camry_a_real_one(client):
    def service_type_id(name):
        types = client.get("/service-types").get_json()["service_types"]
        return next(row["id"] for row in types if row["name"] == name)

    def label_of(trim_id):
        vehicle = client.post("/users/1/vehicles", json={"trim_id": trim_id}).get_json()["vehicle"]
        client.post(
            f"/vehicles/{vehicle['id']}/service-records",
            json={"service_type_id": service_type_id("Oil change"),
                  "service_date": "2026-10-15", "mileage": 40000, "notes": None},
        )
        records = client.get(f"/vehicles/{vehicle['id']}/service-records").get_json()
        return records["service_records"][0]["label"]

    assert label_of(CAMRY_LE) == WHEN_CONVENIENT
    assert label_of(CIVIC_EX) is None
