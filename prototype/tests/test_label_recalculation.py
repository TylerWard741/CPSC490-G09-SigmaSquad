"""API tests for task #73, named by the requirement they cover.

FR numbers are from docs/specs/recommendations-and-alerts.md. The window
each record is labeled against comes from recommendation_window.py (#76),
read from the service_intervals table (#75). The vehicle used is trim 1, the
2020 Camry LE, whose oil change is every 10,000 miles on Toyota's normal
schedule (db/service_interval_data.py).
"""
import pytest

OIL_INTERVAL_MILES = 10_000


def type_id(client, name):
    types = client.get("/service-types").get_json()["service_types"]
    return next(row["id"] for row in types if row["name"] == name)


def records_url(vehicle_id):
    return f"/vehicles/{vehicle_id}/service-records"


def create_record(client, vehicle_id, mileage, service_type="Oil change"):
    body = {
        "service_type_id": type_id(client, service_type),
        "service_date": "2026-10-15",
        "mileage": mileage,
        "notes": None,
    }
    response = client.post(records_url(vehicle_id), json=body)
    assert response.status_code == 201
    return response.get_json()["service_record"]


def set_mileage(client, vehicle_id, mileage):
    response = client.patch(f"/vehicles/{vehicle_id}", json={"current_mileage": mileage})
    assert response.status_code == 200


def labels_for(client, vehicle_id):
    records = client.get(records_url(vehicle_id)).get_json()["service_records"]
    return {record["id"]: record["label"] for record in records}


@pytest.fixture
def vehicle_id(client):
    return client.post("/users/1/vehicles", json={"trim_id": 1}).get_json()["vehicle"]["id"]


def test_fr13_no_records_and_no_mileage_means_no_labels_to_show(client, vehicle_id):
    """FR-13: a freshly saved vehicle has no mileage and nothing to label.

    #81's own create-record logic sets current_mileage from the first
    record (see test_new_vehicle_has_no_current_mileage and
    test_record_sets_then_raises_current_mileage in test_service_records_api.py),
    so "a record exists but current_mileage is still unset" cannot happen
    through the API; with_label()'s None branch only matters while the
    vehicle has zero records, where there is nothing to label anyway.
    """
    records = client.get(records_url(vehicle_id)).get_json()["service_records"]
    assert records == []


def test_fr11_the_window_has_equal_start_and_end(client, vehicle_id):
    """FR-11: a single recommended mileage is a window with equal ends."""
    record = create_record(client, vehicle_id, mileage=40000)
    set_mileage(client, vehicle_id, 40500)
    records = client.get(records_url(vehicle_id)).get_json()["service_records"]
    found = next(r for r in records if r["id"] == record["id"])
    assert found["window_start"] == found["window_end"]
    assert found["window_start"] == record["mileage"] + OIL_INTERVAL_MILES


def test_fr10_creating_the_first_record_already_labels_it(client, vehicle_id):
    """FR-10 interacting with #81: the auto-raised mileage is enough to label."""
    record = create_record(client, vehicle_id, mileage=40000)
    assert labels_for(client, vehicle_id)[record["id"]] == "When Convenient"


def test_fr10_a_later_mileage_entry_recalculates_the_label(client, vehicle_id):
    """FR-10: the label is recalculated, not cached from the first entry."""
    record = create_record(client, vehicle_id, mileage=40000)
    window_start = record["mileage"] + OIL_INTERVAL_MILES

    set_mileage(client, vehicle_id, window_start - OIL_INTERVAL_MILES)
    assert labels_for(client, vehicle_id)[record["id"]] == "When Convenient"

    set_mileage(client, vehicle_id, window_start)
    assert labels_for(client, vehicle_id)[record["id"]] == "Due Now"

    set_mileage(client, vehicle_id, window_start + 1)
    assert labels_for(client, vehicle_id)[record["id"]] == "Overdue"
