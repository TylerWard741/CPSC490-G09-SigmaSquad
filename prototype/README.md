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
| `label_rule.py`, `tests/test_label_rule.py` | Status-label rule for [#72](../../../issues/72) and its tests |
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

### What the tests cover

| Area | Test files | Runs with |
|---|---|---|
| Vehicle selection | `tests/test_vehicle_api.py`, `tests/ui/vehicle-select.test.js` | pytest, npm test |
| Service-record entry | `tests/ui/service-record-form.test.js` | npm test |
| Service-history display | `tests/ui/service-history.test.js` | npm test |
| Service-history import | `tests/ui/service-import.test.js` | npm test |
| Service-record and vehicle API | `tests/test_service_records_api.py` | pytest |
| Status-label rule | `tests/test_label_rule.py` | pytest |

pytest finds new test files on its own. A new page-test file must be added to
the `test` line in `package.json`, or `npm test` will not run it.

## Running the repository harness locally

`check_repo.py` only skips a `node_modules` folder at the repository root, so it
reports failures from third-party READMEs in `prototype/node_modules` and
`prototype/web/node_modules`. CI is not affected, because its harness job never
installs Node packages.

Run the wrapper instead (#101). It copies the repository to a temporary folder
without `node_modules`, `.venv` or build output, runs the unchanged
`check_repo.py` there with the same arguments, prints its output, exits with its
exit code, and deletes the copy. Nothing in your working tree is touched, so
there is nothing to reinstall afterwards.

```bash
python .github/scripts/check_repo_clean.py            # from anywhere; add --strict to pass it through
```

Set `GITHUB_TOKEN` and `GITHUB_REPOSITORY` first if you want the GitHub-backed
gates (G3, G8, G10) to run the way they do in CI.

## What it proves

That the vehicle data can drive a cascading selection through a JSON API, and
that the database itself prevents an account from saving the same vehicle twice.

## Status

| Sprint | Increment |
|---|---|
| v0 (Sep 27) | Login check + 4 tests (the course's example) |
| Sprint 2 | Vehicle database (#63), vehicle selection API and page (#29) |
| Sprint 3 | Service types, service records, and vehicle read, update and delete API (#81) |
