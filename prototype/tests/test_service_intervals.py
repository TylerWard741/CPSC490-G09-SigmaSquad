"""Tests for task #75, named by definition of done.

Reference data for oil changes, tire rotations and brake inspections, queryable
by vehicle and service type (docs/specs/recommendations-and-alerts.md FR-12).
"""
import sqlite3

import pytest

from db.init_db import DEMO_USER_ID, SAMPLE

SERVICE_TYPES = ("Oil change", "Tire rotation", "Brake inspection")

# Trims whose manufacturer source has been found. Honda Civics are not here yet.
COVERED = [("Toyota", "Camry", 2020, "LE"), ("Toyota", "Camry", 2020, "SE"), ("Toyota", "Corolla", 2021, "L")]


@pytest.fixture
def conn(db_path):
    connection = sqlite3.connect(db_path)
    connection.row_factory = sqlite3.Row
    yield connection
    connection.close()


def get_interval(conn, tid, service_type):
    """The window for one trim and service type, queried with plain SQL."""
    return conn.execute(
        "SELECT * FROM service_intervals WHERE trim_id = ? AND service_type = ?",
        (tid, service_type),
    ).fetchone()


def trim_id(conn, make, model, year, trim):
    return conn.execute(
        "SELECT t.id FROM vehicle_trims t JOIN models m ON m.id = t.model_id "
        "JOIN makes k ON k.id = m.make_id "
        "WHERE k.name = ? AND m.name = ? AND t.year = ? AND t.trim = ?",
        (make, model, year, trim),
    ).fetchone()[0]


@pytest.mark.parametrize("vehicle", COVERED)
def test_each_covered_vehicle_has_a_window_for_all_three_service_types(conn, vehicle):
    tid = trim_id(conn, *vehicle)
    for service_type in SERVICE_TYPES:
        interval = get_interval(conn, tid, service_type)
        assert interval is not None, f"{vehicle} has no {service_type}"
        assert interval["window_end_miles"] >= interval["window_start_miles"]


@pytest.mark.parametrize("vehicle", COVERED)
def test_every_window_names_its_source(conn, vehicle):
    tid = trim_id(conn, *vehicle)
    for service_type in SERVICE_TYPES:
        interval = get_interval(conn, tid, service_type)
        assert interval["source_url"].startswith("https://")
        assert interval["source_page"]
        assert interval["source_quote"]


def test_query_by_trim_and_service_type_returns_that_window(conn):
    tid = trim_id(conn, "Toyota", "Corolla", 2021, "L")
    assert get_interval(conn, tid, "Tire rotation")["window_start_miles"] == 5000
    assert get_interval(conn, tid, "Oil change")["window_start_miles"] == 10000


def test_single_mileage_is_stored_as_a_window_with_equal_start_and_end(conn):
    # FR-11
    tid = trim_id(conn, "Toyota", "Camry", 2020, "LE")
    interval = get_interval(conn, tid, "Brake inspection")
    assert interval["window_start_miles"] == interval["window_end_miles"]


def test_query_by_saved_vehicle_returns_all_three_service_types(conn):
    tid = trim_id(conn, "Toyota", "Camry", 2020, "SE")
    conn.execute("INSERT INTO user_vehicles (user_id, trim_id) VALUES (?, ?)", (DEMO_USER_ID, tid))
    vehicle_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
    rows = conn.execute(
        "SELECT i.service_type FROM service_intervals i "
        "JOIN user_vehicles v ON v.trim_id = i.trim_id WHERE v.id = ?",
        (vehicle_id,),
    ).fetchall()
    assert {row["service_type"] for row in rows} == set(SERVICE_TYPES)


def test_a_vehicle_with_no_recorded_window_returns_nothing(conn):
    tid = trim_id(conn, "Honda", "Civic", 2022, "Sport")
    assert get_interval(conn, tid, "Oil change") is None


def test_only_the_three_v1_service_types_are_accepted(conn):
    tid = trim_id(conn, "Honda", "Civic", 2022, "Sport")
    with pytest.raises(sqlite3.IntegrityError):
        conn.execute(
            "INSERT INTO service_intervals (trim_id, service_type, window_start_miles, "
            "window_end_miles, source_url, source_page, source_quote) "
            "VALUES (?, 'Wiper blades', 1, 1, 'u', 'p', 'q')",
            (tid,),
        )


def test_the_seed_only_covers_seeded_vehicles():
    seeded = {(make, model, year, trim) for make, models in SAMPLE.items()
              for model, trims in models.items() for year, trim in trims}
    assert set(COVERED) <= seeded
