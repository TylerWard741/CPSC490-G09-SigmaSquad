# Prototype

Proof-of-concept code for the Vehicle Maintenance Logger. The first real slice
is vehicle selection, story [#29](../../../issues/29): pick a make, model, year
and trim, then save the vehicle to an account. Details are in
[`docs/specs/vehicle-selection.md`](../docs/specs/vehicle-selection.md).

| Path | What it is |
|---|---|
| `app.py` | Flask JSON API, which also serves the page |
| `db/` | SQLite schema and seed script; builds `db/app.db` (not committed) |
| `tests/test_vehicle_api.py` | API tests for vehicle selection (pytest) |
| `tests/test_service_records_api.py` | API tests for service types, service records and the vehicle read, update and delete endpoints (pytest) |
| `tests/ui/` | Page tests (`node --test` with jsdom) |
| `login.py`, `tests/test_login.py` | The course's example, to be removed by #54 |

You need Python 3.12 and, for the page tests only, Node 20 or newer.

## First time installation (Windows, Linux)
```bash
cd prototype/web
npm install
npm run build
```

## How to run

**Windows (PowerShell), from the repository root:**

```powershell
cd prototype
py -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python db/init_db.py
python app.py
```

**Linux / macOS, from the repository root:**

```bash
cd prototype
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python db/init_db.py
python app.py
```

Then open <http://127.0.0.1:5000/>. Press Ctrl+C to stop the server.

`python db/init_db.py` deletes `db/app.db` and rebuilds it, including any saved
vehicles. Run it the first time, after a schema change, or to start over. There
is no sign-in: the page always acts as the seeded demo user.

If PowerShell refuses to run `Activate.ps1`, allow it for this window with
`Set-ExecutionPolicy -Scope Process RemoteSigned`, then try again.

## How to test

With the virtual environment active, from `prototype/`, on either system:

```bash
python -m pytest -q     # API tests and the course's login example
npm install             # once
npm test                # page tests
```

Tests build a fresh temporary database, so they never touch `db/app.db`. CI runs
both suites on every pull request (job **Prototype build & tests**).

## Running the repository harness locally

`check_repo.py` only skips a `node_modules` folder at the repository root, so it
reports failures from third-party READMEs in `prototype/node_modules`. Delete
that folder before running the harness. CI is not affected, because its harness
job never installs Node packages.

```powershell
Remove-Item -Recurse -Force prototype\node_modules   # Windows, from the repository root
```

```bash
rm -rf prototype/node_modules                        # Linux / macOS, from the repository root
```

## What it proves

That the vehicle data can drive a cascading selection through a JSON API, and
that the database itself prevents an account from saving the same vehicle twice.

## Status

| Sprint | Increment |
|---|---|
| v0 (Sep 27) | Login check + 4 tests (the course's example) |
| Sprint 2 | Vehicle database (#63), vehicle selection API and page (#29) |
| Sprint 3 | Service types, service records, and vehicle read, update and delete API (#81) |
