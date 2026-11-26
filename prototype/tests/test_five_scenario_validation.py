"""End-to-end five-scenario validation for task #119 (story #38).

Objective 2.5 / NFR-2 (docs/specs/recommendations-and-alerts.md) call for at
least five simulated vehicle-data scenarios, each validated end to end --
vehicle selection, service-history processing, due-mileage calculation, and
status labeling -- with every scenario producing the expected result.

Each scenario goes through the real API to select a vehicle (trim_id) and
log its service history (POST /users/<id>/vehicles, POST
.../service-records), the same path the frontend uses, then reads that
persisted state back through recommendation_engine.recommend() -- the
per-service-type aggregator that #37's child tasks (#117, #118) will wire
into the dashboard -- to check the due-mileage window and status label it
produces for all three version-one service types at once.

Existing tests already cover these pieces individually: test_recommendation_
engine.py (label/window math at the engine level), test_label_recalculation.
py (the API's own per-record label), test_service_intervals.py (the interval
data itself). This file is the first to bundle them into named, end-to-end
scenarios, per #119's own definition of done.
"""
import sqlite3

import pytest

from label_rule import DUE_NOW, DUE_SOON, OVERDUE, WHEN_CONVENIENT
from recommendation_engine import recommend

CAMRY_LE = 1
CAMRY_SE = 2
COROLLA_L = 3
CIVIC_EX = 4

OIL = "Oil change"
ROTATION = "Tire rotation"
BRAKES = "Brake inspection"

NO_LABEL = {"label": None, "window_start": None, "window_end": None}


@pytest.fixture
def conn(db_path):
    connection = sqlite3.connect(db_path)
    yield connection
    connection.close()


def type_id(client, name):
    types = client.get("/service-types").get_json()["service_types"]
    return next(row["id"] for row in types if row["name"] == name)


def add_vehicle(client, trim_id):
    response = client.post("/users/1/vehicles", json={"trim_id": trim_id})
    assert response.status_code == 201
    return response.get_json()["vehicle"]["id"]


def log_service(client, vehicle_id, service_type, mileage):
    body = {
        "service_type_id": type_id(client, service_type),
        "service_date": "2026-11-01",
        "mileage": mileage,
        "notes": None,
    }
    response = client.post(f"/vehicles/{vehicle_id}/service-records", json=body)
    assert response.status_code == 201


def set_mileage(client, vehicle_id, mileage):
    response = client.patch(f"/vehicles/{vehicle_id}", json={"current_mileage": mileage})
    assert response.status_code == 200


def history(client, vehicle_id):
    """The vehicle's persisted service history, in the shape recommend() wants."""
    records = client.get(
        f"/vehicles/{vehicle_id}/service-records"
    ).get_json()["service_records"]
    return [{"service_type": r["service_type"], "mileage": r["mileage"]} for r in records]


def test_scenario_1_brand_new_camry_le_with_no_service_history_yet(client, conn):
    """Just bought, nothing serviced yet, 4,600 miles on the odometer.

    Both 5,000-mile services (rotation, brakes) are close enough to count as
    Due Soon; the 10,000-mile oil change is still far off (FR-1, FR-3)."""
    vehicle_id = add_vehicle(client, CAMRY_LE)
    set_mileage(client, vehicle_id, 4600)
    result = recommend(conn, CAMRY_LE, 4600, history(client, vehicle_id))
    assert result[OIL]["label"] == WHEN_CONVENIENT
    assert result[ROTATION]["label"] == DUE_SOON
    assert result[BRAKES]["label"] == DUE_SOON


def test_scenario_2_camry_se_fully_serviced_right_on_schedule(client, conn):
    """Oil, rotation and brakes all logged on schedule; the odometer now
    sits exactly on the rotation/brake window's start (FR-4, Due Now) while
    the next oil change is still 7,000 miles out."""
    vehicle_id = add_vehicle(client, CAMRY_SE)
    log_service(client, vehicle_id, OIL, 10000)
    log_service(client, vehicle_id, ROTATION, 8000)
    log_service(client, vehicle_id, BRAKES, 8000)
    set_mileage(client, vehicle_id, 13000)
    result = recommend(conn, CAMRY_SE, 13000, history(client, vehicle_id))
    assert result[OIL]["label"] == WHEN_CONVENIENT
    assert result[ROTATION]["label"] == DUE_NOW
    assert result[BRAKES]["label"] == DUE_NOW


def test_scenario_3_corolla_l_overdue_on_everything(client, conn):
    """One oil change logged long ago; rotation and brakes never logged at
    all. 16,000 miles later, every service type is overdue (FR-5) --
    including the two with no history, whose first window is still counted
    from an odometer of 0 (recommendation_window.py)."""
    vehicle_id = add_vehicle(client, COROLLA_L)
    log_service(client, vehicle_id, OIL, 5000)
    set_mileage(client, vehicle_id, 16000)
    result = recommend(conn, COROLLA_L, 16000, history(client, vehicle_id))
    assert result[OIL]["label"] == OVERDUE
    assert result[ROTATION]["label"] == OVERDUE
    assert result[BRAKES]["label"] == OVERDUE


def test_scenario_4_civic_ex_has_no_manufacturer_interval_data(client, conn):
    """Honda publishes no fixed-mileage schedule we have confirmed yet
    (db/service_interval_data.py), so even a serviced, high-mileage Civic
    has nothing to label (FR-13's "no interval data" branch)."""
    vehicle_id = add_vehicle(client, CIVIC_EX)
    log_service(client, vehicle_id, OIL, 20000)
    set_mileage(client, vehicle_id, 25000)
    result = recommend(conn, CIVIC_EX, 25000, history(client, vehicle_id))
    for service_type in (OIL, ROTATION, BRAKES):
        assert result[service_type] == NO_LABEL


def test_scenario_5_camry_le_saved_but_no_mileage_logged_yet(client, conn):
    """Vehicle is saved and one service is already on record, but the
    owner hasn't entered a current mileage yet -- nothing to label either
    (FR-13's other branch: current_mileage is None)."""
    vehicle_id = add_vehicle(client, CAMRY_LE)
    log_service(client, vehicle_id, OIL, 5000)
    result = recommend(conn, CAMRY_LE, None, history(client, vehicle_id))
    for service_type in (OIL, ROTATION, BRAKES):
        assert result[service_type] == NO_LABEL
