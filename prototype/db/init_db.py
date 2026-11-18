import sqlite3
from pathlib import Path

try:  # imported by the app and tests as db.init_db
    from db.service_interval_data import SERVICE_INTERVALS
except ModuleNotFoundError:  # run as `python db/init_db.py`
    from service_interval_data import SERVICE_INTERVALS

DB_DIR = Path(__file__).parent
DB_PATH = DB_DIR / "app.db"

SAMPLE = {
    "Toyota": {"Camry": [(2020, "LE"), (2020, "SE")], "Corolla": [(2021, "L")]},
    "Honda": {"Civic": [(2019, "EX"), (2022, "Sport")]},
}

# The three version-one service types (#35).
SERVICE_TYPES = ["Oil change", "Tire rotation", "Brake inspection"]

# Auth is out of scope for #29: this seeded user stands in for a signed-in one.
DEMO_USER_ID = 1
DEMO_USER_EMAIL = "demo@example.com"


def init_db(db_path=DB_PATH):
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys = ON")
    conn.executescript((DB_DIR / "schema.sql").read_text())
    for make, models in SAMPLE.items():
        make_id = conn.execute(
            "INSERT INTO makes (name) VALUES (?)", (make,)
        ).lastrowid
        for model, trims in models.items():
            model_id = conn.execute(
                "INSERT INTO models (make_id, name) VALUES (?, ?)", (make_id, model)
            ).lastrowid
            conn.executemany(
                "INSERT INTO vehicle_trims (model_id, year, trim) VALUES (?, ?, ?)",
                [(model_id, y, t) for y, t in trims],
            )
    conn.executemany(
        "INSERT INTO service_types (name) VALUES (?)",
        [(name,) for name in SERVICE_TYPES],
    )
    service_type_ids = dict(conn.execute("SELECT name, id FROM service_types"))
    for (make, model, year, trim), rows in SERVICE_INTERVALS.items():
        trim_id = conn.execute(
            "SELECT t.id FROM vehicle_trims t JOIN models m ON m.id = t.model_id "
            "JOIN makes k ON k.id = m.make_id "
            "WHERE k.name = ? AND m.name = ? AND t.year = ? AND t.trim = ?",
            (make, model, year, trim),
        ).fetchone()[0]
        conn.executemany(
            "INSERT INTO service_intervals (trim_id, service_type_id, window_start_miles, "
            "window_end_miles, repeat_every_miles, source_url, source_page, source_quote) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [(trim_id, service_type_ids[row[0]], *row[1:]) for row in rows],
        )
    conn.execute(
        "INSERT INTO users (id, email) VALUES (?, ?)", (DEMO_USER_ID, DEMO_USER_EMAIL)
    )
    conn.commit()
    conn.close()


if __name__ == "__main__":
    DB_PATH.unlink(missing_ok=True)
    init_db()
    print(f"Created {DB_PATH}")