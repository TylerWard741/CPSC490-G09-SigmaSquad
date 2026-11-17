"""Next-service recommendations for a vehicle (task #76, objectives #34/#35).

Given a vehicle's trim, current mileage and service history, return a status
label for each of the three version-one service types (FR-12): oil changes,
tire rotations and brake inspections. Combines the window calculation in
recommendation_window.py with the label rule in label_rule.py (#72).
"""
from __future__ import annotations

import sqlite3

from db.init_db import SERVICE_TYPES
from label_rule import label
from recommendation_window import recommended_window


def recommend(
    conn: sqlite3.Connection,
    trim_id: int,
    current_mileage: int | None,
    records: list[dict],
) -> dict[str, dict]:
    """Return {service type: {label, window_start, window_end}} for all three.

    records are the vehicle's service records; each needs "service_type" and
    "mileage". Each service type is judged from its most recent record.

    label, window_start and window_end are all None when there is nothing to
    say: no current mileage yet (FR-13), or no interval data for this trim.
    """
    last_mileage: dict[str, int] = {}
    for record in records:
        kind = record["service_type"]
        last_mileage[kind] = max(last_mileage.get(kind, 0), record["mileage"])

    result = {}
    for service_type in SERVICE_TYPES:
        window = recommended_window(
            conn, trim_id, service_type, last_mileage.get(service_type)
        )
        if window is None or current_mileage is None:
            result[service_type] = {
                "label": None, "window_start": None, "window_end": None,
            }
            continue
        start, end = window
        result[service_type] = {
            "label": label(current_mileage, start, end),
            "window_start": start,
            "window_end": end,
        }
    return result
