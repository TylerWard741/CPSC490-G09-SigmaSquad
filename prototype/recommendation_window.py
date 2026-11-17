"""Placeholder recommendation-window calculation.

Task #76 ("wire the three service types into the recommendation engine's
calculation") replaces this with the real calculation, fed by #75's
manufacturer-interval reference data. Until #76 lands there is no reference
data to calculate a real window from, so this returns an obviously-fake
window far in the future: nothing will show as falsely due while it's in use.

#73 depends only on this function's signature (take a service record's type
and last-known mileage, return a (window_start, window_end) pair), not on
the numbers it currently returns, so swapping in the real #76 implementation
is a one-line change in prototype/app.py once it exists.
"""
from __future__ import annotations

# Not a real interval - see #76. Chosen to be obviously a placeholder rather
# than a plausible-looking number, so nobody mistakes it for sourced data.
PLACEHOLDER_INTERVAL_MILES = 999_999


def recommended_window(service_type_name: str, last_service_mileage: int) -> tuple[int, int]:
    """Return (window_start, window_end) for a service's next recommendation.

    TODO(#76): replace with the real calculation using #75's reference
    intervals. For now every service type uses the same placeholder
    interval, and the window's start and end are equal (FR-11's single-
    mileage case), consistent with how #76's real windows will be shaped.
    """
    start = last_service_mileage + PLACEHOLDER_INTERVAL_MILES
    return start, start
