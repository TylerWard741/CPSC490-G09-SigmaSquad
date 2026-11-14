"""Status-label rule for task #72 (story #36).

A pure function: given a vehicle's current mileage and a service's recommended
mileage window, return one of the four status labels. No database or page
code, so the recommendation engine (#34, #76) and the mileage entry (#73) can
call it. See docs/specs/recommendations-and-alerts.md FR-1, FR-3, FR-4, FR-5.

A single recommended mileage is passed as a window whose start and end are
equal (FR-11).
"""
from __future__ import annotations

WHEN_CONVENIENT = "When Convenient"
DUE_SOON = "Due Soon"
DUE_NOW = "Due Now"
OVERDUE = "Overdue"

# How far before a window's start a service becomes "Due Soon" (FR-1, FR-3).
DUE_SOON_THRESHOLD_MILES = 500


def label(current_mileage: int, window_start: int, window_end: int) -> str:
    """Return the status label for one service. Both window ends are inside."""
    if window_end < window_start:
        raise ValueError("window_end must not be less than window_start.")

    if current_mileage > window_end:
        return OVERDUE
    if current_mileage >= window_start:
        return DUE_NOW
    if window_start - current_mileage <= DUE_SOON_THRESHOLD_MILES:
        return DUE_SOON
    return WHEN_CONVENIENT
