import sqlite3
from pathlib import Path

DB_DIR = Path(__file__).parent
DB_PATH = DB_DIR / "app.db"

SAMPLE = {
    "Toyota": {"Camry": [(2020, "LE"), (2020, "SE")], "Corolla": [(2021, "L")]},
    "Honda": {"Civic": [(2019, "EX"), (2022, "Sport")]},
}


def init_db():
    conn = sqlite3.connect(DB_PATH)
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
    conn.commit()
    conn.close()


if __name__ == "__main__":
    DB_PATH.unlink(missing_ok=True)
    init_db()
    print(f"Created {DB_PATH}")