"""Seed data for service_intervals (#75): one row per vehicle and service type.

Every row names where its number came from. Per the course AI policy a team
member must open each source page and confirm the quote before this merges.
Honda Civic trims are absent: Honda's Maintenance Minder gives no fixed mileage
we have confirmed yet, so there is no window to store for them.
"""

CAMRY_URL = "https://assets.sia.toyota.com/publications/en/omms-s/T-MMS-20Camry/pdf/T-MMS-20Camry.pdf"
COROLLA_URL = "https://assets.sia.toyota.com/publications/en/omms-s/T-MMS-21Corolla/pdf/T-MMS-21Corolla.pdf"

ROTATE = 'Listed as "Rotate tires" under "5,000 miles or 6 months"'
BRAKES = (
    'Listed as "Visually inspect brake linings/drums and brake pads/discs" '
    'under "5,000 miles or 6 months"'
)


def toyota_rows(url, schedule_page, oil_page, oil_quote):
    """Toyota's normal schedule: rotate and inspect brakes every 5,000 miles,
    change oil every 10,000. Each window is a single mileage (start = end, FR-11)."""
    # (service_type, start, end, repeat_every, source_url, source_page, source_quote)
    return [
        ("Oil change", 10000, 10000, 10000, url, oil_page, oil_quote),
        ("Tire rotation", 5000, 5000, 5000, url, schedule_page, ROTATE),
        ("Brake inspection", 5000, 5000, 5000, url, schedule_page, BRAKES),
    ]


CAMRY_ROWS = toyota_rows(
    CAMRY_URL,
    "PDF p. 39 (printed p. 38)",
    "PDF p. 57",
    '"the oil change interval is 10,000 miles or 12 months IF 0W-16 (A25A-FKS engine only) '
    'or 0W-20 (2GR-FKS engine only) MOTOR OIL IS BEING USED"',
)
COROLLA_ROWS = toyota_rows(
    COROLLA_URL,
    "PDF p. 40 (printed p. 38)",
    "PDF p. 58 (printed p. 56)",
    '"the oil change interval is 10,000 miles or 12 months IF 0W-20 (2ZR-FAE engine only) '
    'or 0W-16 (M20A-FKS engine only) MOTOR OIL IS BEING USED"',
)

# (make, model, year, trim) -> rows. The guide covers the model, not the trim.
SERVICE_INTERVALS = {
    ("Toyota", "Camry", 2020, "LE"): CAMRY_ROWS,
    ("Toyota", "Camry", 2020, "SE"): CAMRY_ROWS,
    ("Toyota", "Corolla", 2021, "L"): COROLLA_ROWS,
}
