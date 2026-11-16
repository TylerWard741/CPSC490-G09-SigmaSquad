"""Recommended mileage window for one service on one vehicle (task #76).

Reads the manufacturer intervals in the service_intervals table (#75) and
works out where a vehicle's next window for a service is. Replaces the
placeholder #73 used while there was no reference data.

Rules (docs/specs/recommendations-and-alerts.md; the repeat rule is the #76
assignee's decision, since the spec does not define it):
- After a service at mileage M, the next window starts at M + repeat_every
  and is as wide as the manufacturer's window (FR-11: a single mileage is a
  window whose start and end are equal).
- With no service of that type on record, the first window is the
  manufacturer's own, counted from an odometer of 0.
- With no interval data for the vehicle's trim (e.g. Honda, which publishes
  none), there is no window: the function returns None.
"""
from __future__ import annotations

import sqlite3


def recommended_window(
    conn: sqlite3.Connection,
    trim_id: int,
    service_type: str,
    last_service_mileage: int | None = None,
) -> tuple[int, int] | None:
    """Return (window_start, window_end), or None if no window can be given."""
    row = conn.execute(
        "SELECT window_start_miles, window_end_miles, repeat_every_miles "
        "FROM service_intervals WHERE trim_id = ? AND service_type = ?",
        (trim_id, service_type),
    ).fetchone()
    if row is None:
        return None
    start, end, repeat_every = row
    if last_service_mileage is None:
        return start, end
    if repeat_every is None:
        # A one-time service that has been done has no next window.
        return None
    next_start = last_service_mileage + repeat_every
    return next_start, next_start + (end - start)
