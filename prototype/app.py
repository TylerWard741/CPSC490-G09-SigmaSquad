"""Vehicle selection (#29) and service-record (#81) API, and the page.

A small Flask app over the SQLite database in db/. The routes return plain
JSON and know nothing about the page in static/, so a React front end can
replace that page without changing them. See docs/specs/vehicle-selection.md
and docs/specs/vehicle-service-api.md.

Auth is out of scope: callers name the user in the URL, and the page uses the
demo user seeded by db/init_db.py.
"""
from __future__ import annotations

import re
import sqlite3
from datetime import date
from pathlib import Path

from flask import Flask, g, jsonify, request
from werkzeug.exceptions import HTTPException

from db.init_db import init_db

DEFAULT_DB_PATH = Path(__file__).parent / "db" / "app.db"
NICKNAME_MAX_LENGTH = 100
NOTES_MAX_LENGTH = 1000
SERVICE_DATE_FORMAT = re.compile(r"\d{4}-\d{2}-\d{2}")
# Order matters: it is the order fields are checked and reported in.
SERVICE_RECORD_FIELDS = ("service_date", "mileage", "service_type_id", "notes")
SERVICE_RECORD_REQUIRED = ("service_date", "mileage", "service_type_id")

DB_UNAVAILABLE_MESSAGE = "The vehicle database can't be reached. Please try again."

SAVED_VEHICLE_SQL = """
    SELECT uv.id, uv.trim_id, ma.name AS make, mo.name AS model, t.year,
           t.trim, uv.nickname, uv.saved_at
    FROM user_vehicles uv
    JOIN vehicle_trims t ON t.id = uv.trim_id
    JOIN models mo ON mo.id = t.model_id
    JOIN makes ma ON ma.id = mo.make_id
"""

SERVICE_RECORD_SQL = """
    SELECT sr.id, sr.vehicle_id, sr.service_type_id, st.name AS service_type,
           sr.service_date, sr.mileage, sr.notes
    FROM service_records sr
    JOIN service_types st ON st.id = sr.service_type_id
"""


def _is_int(value) -> bool:
    # bool is a subclass of int, so true would otherwise pass as 1.
    return isinstance(value, int) and not isinstance(value, bool)


def _service_date_problem(value) -> str | None:
    invalid = "service_date must be a valid date in YYYY-MM-DD format."
    # fromisoformat alone also accepts forms such as 20261015.
    if not isinstance(value, str) or not SERVICE_DATE_FORMAT.fullmatch(value):
        return invalid
    try:
        parsed = date.fromisoformat(value)
    except ValueError:
        return invalid
    if parsed > date.today():
        return "service_date can't be in the future."
    return None


def _service_record_problem(body, partial: bool) -> str | None:
    """Return the first validation message for a record body, or None.

    partial=True is a PATCH: no field is required, but one must be sent.
    """
    if not isinstance(body, dict):
        return "The request body must be a JSON object."
    unknown = sorted(set(body) - set(SERVICE_RECORD_FIELDS))
    if unknown:
        return f"Unknown field: {unknown[0]}."
    if partial and not body:
        return "Send at least one field to update."
    if not partial:
        for field in SERVICE_RECORD_REQUIRED:
            if field not in body:
                return f"{field} is required."

    if "service_date" in body:
        problem = _service_date_problem(body["service_date"])
        if problem:
            return problem
    if "mileage" in body and (not _is_int(body["mileage"]) or body["mileage"] < 0):
        return "mileage must be an integer of 0 or more."
    if "service_type_id" in body and (
        not _is_int(body["service_type_id"]) or body["service_type_id"] < 1
    ):
        return "service_type_id must be a positive integer."
    notes = body.get("notes")
    if notes is not None and (
        not isinstance(notes, str) or len(notes) > NOTES_MAX_LENGTH
    ):
        return f"notes must be text of at most {NOTES_MAX_LENGTH} characters."
    return None


def _like_pattern(text: str) -> str:
    """Build a contains-match LIKE pattern that treats % and _ as literals."""
    escaped = text.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
    return f"%{escaped}%"


def _rows(cursor: sqlite3.Cursor) -> list[dict]:
    return [dict(row) for row in cursor.fetchall()]


def _error(message: str, status: int):
    return jsonify({"error": message}), status


def create_app(db_path=DEFAULT_DB_PATH) -> Flask:
    app = Flask(__name__, static_folder="web/dist", static_url_path="/")

    def get_db() -> sqlite3.Connection:
        if "db" not in g:
            # mode=rw: a missing file must be an error. By default SQLite would
            # silently create an empty database and hide the outage.
            uri = f"{Path(db_path).resolve().as_uri()}?mode=rw"
            g.db = sqlite3.connect(uri, uri=True)
            g.db.row_factory = sqlite3.Row
            g.db.execute("PRAGMA foreign_keys = ON")
        return g.db

    def exists(query: str, row_id: int) -> bool:
        return get_db().execute(query, (row_id,)).fetchone() is not None

    def make_exists(make_id: int) -> bool:
        return exists("SELECT 1 FROM makes WHERE id = ?", make_id)

    def model_exists(model_id: int) -> bool:
        return exists("SELECT 1 FROM models WHERE id = ?", model_id)

    def user_exists(user_id: int) -> bool:
        return exists("SELECT 1 FROM users WHERE id = ?", user_id)

    def trim_exists(trim_id: int) -> bool:
        return exists("SELECT 1 FROM vehicle_trims WHERE id = ?", trim_id)

    def vehicle_exists(vehicle_id: int) -> bool:
        return exists("SELECT 1 FROM user_vehicles WHERE id = ?", vehicle_id)

    def service_type_exists(service_type_id: int) -> bool:
        return exists("SELECT 1 FROM service_types WHERE id = ?", service_type_id)

    def fetch_service_record(record_id: int) -> dict | None:
        row = get_db().execute(
            SERVICE_RECORD_SQL + " WHERE sr.id = ?", (record_id,)
        ).fetchone()
        return dict(row) if row else None

    def raise_current_mileage(vehicle_id: int, mileage: int) -> None:
        # A record can only move the odometer reading forward, never back.
        get_db().execute(
            "UPDATE user_vehicles SET current_mileage = ? "
            "WHERE id = ? AND (current_mileage IS NULL OR current_mileage < ?)",
            (mileage, vehicle_id, mileage),
        )

    @app.teardown_appcontext
    def close_db(_exception):
        db = g.pop("db", None)
        if db is not None:
            db.close()

    @app.errorhandler(sqlite3.Error)
    def database_unavailable(_error_value):
        return _error(DB_UNAVAILABLE_MESSAGE, 503)

    @app.errorhandler(HTTPException)
    def http_error(error):
        return _error(error.description, error.code)

    @app.get("/")
    def index():
        return app.send_static_file("index.html")

    @app.get("/makes")
    def list_makes():
        query = request.args.get("q", "").strip()
        rows = get_db().execute(
            "SELECT id, name FROM makes WHERE name LIKE ? ESCAPE '\\' ORDER BY name",
            (_like_pattern(query),),
        )
        return jsonify({"makes": _rows(rows)})

    @app.get("/makes/<int:make_id>/models")
    def list_models(make_id):
        if not make_exists(make_id):
            return _error(f"Make {make_id} was not found.", 404)
        query = request.args.get("q", "").strip()
        rows = get_db().execute(
            "SELECT id, name FROM models "
            "WHERE make_id = ? AND name LIKE ? ESCAPE '\\' ORDER BY name",
            (make_id, _like_pattern(query)),
        )
        return jsonify({"models": _rows(rows)})

    @app.get("/models/<int:model_id>/years")
    def list_years(model_id):
        if not model_exists(model_id):
            return _error(f"Model {model_id} was not found.", 404)
        rows = get_db().execute(
            "SELECT DISTINCT year FROM vehicle_trims WHERE model_id = ? ORDER BY year DESC",
            (model_id,),
        )
        return jsonify({"years": [row["year"] for row in rows]})

    @app.get("/models/<int:model_id>/years/<int:year>/trims")
    def list_trims(model_id, year):
        if not model_exists(model_id):
            return _error(f"Model {model_id} was not found.", 404)
        rows = _rows(get_db().execute(
            "SELECT id, trim FROM vehicle_trims WHERE model_id = ? AND year = ? ORDER BY trim",
            (model_id, year),
        ))
        if not rows:
            return _error(f"Model {model_id} has no trims for {year}.", 404)
        return jsonify({"trims": rows})

    @app.get("/users/<int:user_id>/vehicles")
    def list_saved_vehicles(user_id):
        if not user_exists(user_id):
            return _error(f"User {user_id} was not found.", 404)
        rows = get_db().execute(
            SAVED_VEHICLE_SQL + " WHERE uv.user_id = ? ORDER BY uv.id DESC",
            (user_id,),
        )
        return jsonify({"vehicles": _rows(rows)})

    @app.post("/users/<int:user_id>/vehicles")
    def save_vehicle(user_id):
        body = request.get_json(silent=True)
        if not isinstance(body, dict):
            return _error("The request body must be a JSON object.", 400)

        trim_id = body.get("trim_id")
        # bool is a subclass of int, so true would otherwise pass as trim 1.
        if not isinstance(trim_id, int) or isinstance(trim_id, bool) or trim_id < 1:
            return _error("trim_id must be a positive integer.", 400)

        nickname = body.get("nickname")
        if nickname is not None and (
            not isinstance(nickname, str) or len(nickname) > NICKNAME_MAX_LENGTH
        ):
            return _error(
                f"nickname must be text of at most {NICKNAME_MAX_LENGTH} characters.", 400
            )

        if not user_exists(user_id):
            return _error(f"User {user_id} was not found.", 404)
        if not trim_exists(trim_id):
            return _error(f"Trim {trim_id} was not found.", 404)

        db = get_db()
        try:
            cursor = db.execute(
                "INSERT INTO user_vehicles (user_id, trim_id, nickname) VALUES (?, ?, ?)",
                (user_id, trim_id, nickname),
            )
        except sqlite3.IntegrityError:
            # The IDs were checked above, so the UNIQUE (user_id, trim_id)
            # constraint is what fired. It, not this code, prevents duplicates.
            return _error("This vehicle is already saved on your account.", 409)
        db.commit()
        saved = db.execute(
            SAVED_VEHICLE_SQL + " WHERE uv.id = ?", (cursor.lastrowid,)
        ).fetchone()
        return jsonify({"vehicle": dict(saved)}), 201

    @app.get("/service-types")
    def list_service_types():
        rows = get_db().execute("SELECT id, name FROM service_types ORDER BY name")
        return jsonify({"service_types": _rows(rows)})

    @app.get("/vehicles/<int:vehicle_id>/service-records")
    def list_service_records(vehicle_id):
        if not vehicle_exists(vehicle_id):
            return _error(f"Vehicle {vehicle_id} was not found.", 404)
        rows = get_db().execute(
            SERVICE_RECORD_SQL
            + " WHERE sr.vehicle_id = ? ORDER BY sr.service_date DESC, sr.id DESC",
            (vehicle_id,),
        )
        return jsonify({"service_records": _rows(rows)})

    @app.post("/vehicles/<int:vehicle_id>/service-records")
    def create_service_record(vehicle_id):
        body = request.get_json(silent=True)
        problem = _service_record_problem(body, partial=False)
        if problem:
            return _error(problem, 400)
        if not vehicle_exists(vehicle_id):
            return _error(f"Vehicle {vehicle_id} was not found.", 404)
        if not service_type_exists(body["service_type_id"]):
            return _error(f"Service type {body['service_type_id']} was not found.", 404)

        db = get_db()
        cursor = db.execute(
            "INSERT INTO service_records "
            "(vehicle_id, service_type_id, service_date, mileage, notes) "
            "VALUES (?, ?, ?, ?, ?)",
            (vehicle_id, body["service_type_id"], body["service_date"],
             body["mileage"], body.get("notes")),
        )
        raise_current_mileage(vehicle_id, body["mileage"])
        db.commit()
        return jsonify({"service_record": fetch_service_record(cursor.lastrowid)}), 201

    @app.get("/service-records/<int:record_id>")
    def read_service_record(record_id):
        record = fetch_service_record(record_id)
        if record is None:
            return _error(f"Service record {record_id} was not found.", 404)
        return jsonify({"service_record": record})

    @app.patch("/service-records/<int:record_id>")
    def update_service_record(record_id):
        body = request.get_json(silent=True)
        problem = _service_record_problem(body, partial=True)
        if problem:
            return _error(problem, 400)
        record = fetch_service_record(record_id)
        if record is None:
            return _error(f"Service record {record_id} was not found.", 404)
        if "service_type_id" in body and not service_type_exists(body["service_type_id"]):
            return _error(f"Service type {body['service_type_id']} was not found.", 404)

        # Column names come from the fixed tuple, never from the request.
        fields = [field for field in SERVICE_RECORD_FIELDS if field in body]
        db = get_db()
        db.execute(
            f"UPDATE service_records SET {', '.join(f'{field} = ?' for field in fields)} "
            "WHERE id = ?",
            (*(body[field] for field in fields), record_id),
        )
        if "mileage" in body:
            raise_current_mileage(record["vehicle_id"], body["mileage"])
        db.commit()
        return jsonify({"service_record": fetch_service_record(record_id)})

    @app.delete("/service-records/<int:record_id>")
    def delete_service_record(record_id):
        db = get_db()
        cursor = db.execute("DELETE FROM service_records WHERE id = ?", (record_id,))
        if cursor.rowcount == 0:
            return _error(f"Service record {record_id} was not found.", 404)
        db.commit()
        return "", 204

    return app


def main(db_path=DEFAULT_DB_PATH, port=5000):
    # Seed on first run so the page works without `python db/init_db.py`.
    # Requests still open the file with mode=rw, so a database that goes
    # missing while the server runs is reported, not silently recreated.
    # A 0-byte file counts as missing: sqlite3.connect leaves one behind.
    path = Path(db_path)
    if not path.exists() or path.stat().st_size == 0:
        init_db(path)
    create_app(db_path).run(host="127.0.0.1", port=port)


if __name__ == "__main__":  # pragma: no cover - manual run
    main()
