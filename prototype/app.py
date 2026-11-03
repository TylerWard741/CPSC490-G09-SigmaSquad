"""Vehicle selection API and page for story #29.

A small Flask app over the SQLite database in db/. The routes return plain
JSON and know nothing about the page in static/, so a React front end can
replace that page without changing them. See docs/specs/vehicle-selection.md.

Auth is out of scope: callers name the user in the URL, and the page uses the
demo user seeded by db/init_db.py.
"""
from __future__ import annotations

import sqlite3
from pathlib import Path

from flask import Flask, g, jsonify, request
from werkzeug.exceptions import HTTPException

DEFAULT_DB_PATH = Path(__file__).parent / "db" / "app.db"
NICKNAME_MAX_LENGTH = 100

DB_UNAVAILABLE_MESSAGE = "The vehicle database can't be reached. Please try again."

SAVED_VEHICLE_SQL = """
    SELECT uv.id, uv.trim_id, ma.name AS make, mo.name AS model, t.year,
           t.trim, uv.nickname, uv.saved_at
    FROM user_vehicles uv
    JOIN vehicle_trims t ON t.id = uv.trim_id
    JOIN models mo ON mo.id = t.model_id
    JOIN makes ma ON ma.id = mo.make_id
"""


def _like_pattern(text: str) -> str:
    """Build a contains-match LIKE pattern that treats % and _ as literals."""
    escaped = text.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
    return f"%{escaped}%"


def _rows(cursor: sqlite3.Cursor) -> list[dict]:
    return [dict(row) for row in cursor.fetchall()]


def _error(message: str, status: int):
    return jsonify({"error": message}), status


def create_app(db_path=DEFAULT_DB_PATH) -> Flask:
    app = Flask(__name__, static_folder="static", static_url_path="/static")

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

    return app


if __name__ == "__main__":  # pragma: no cover - manual run
    create_app().run(host="127.0.0.1", port=5000)
