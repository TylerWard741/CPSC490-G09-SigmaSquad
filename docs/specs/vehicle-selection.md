# Specification — Vehicle selection

> Epic: #27 · Stories: #29
> Owner: Mathieu Partain-Martinez · Sprint: 2 · Status: draft

## Overview

Users can pick their car (make, model, year, trim) and save it. Maintenance
schedules and recommendations depend on the exact vehicle. The Flask API
provides and saves the data, the HTML page handles the user interface, and
SQLite stores the cars and the saved vehicles. Login is not part of this story so
a seeded demo user stands in for the signed-in user. The page is plain HTML
because the React skeleton (#54) hasn't been merged yet. That's fine because
the page only talks to the API, so React can replace it later.

## UI Flow

The make list and saved cars load right away, while the model, year, and trim
dropdowns are locked. Each pick fills in and unlocks the next dropdown. Filter
boxes narrow will down the make and model lists, with the model filter unlocking
once a make is picked, and they never change a pick you've already made. If you
go back and change an earlier pick, everything after it clears and locks again.
Save becomes available once all four fields are picked. Saving shows a
confirmation and adds the car to your saved list. Saving a duplicate car shows
an "already saved" message without creating a copy. If a request
fails, an error message and a Retry button appear, and your current picks stay
the same.

## Data model

Defined in `prototype/db/schema.sql` and seeded by `prototype/db/init_db.py`.

| Table | Columns | Constraints |
|---|---|---|
| `makes` | `id`, `name` | `name` unique |
| `models` | `id`, `make_id`, `name` | `make_id` references `makes`; `(make_id, name)` unique |
| `vehicle_trims` | `id`, `model_id`, `year`, `trim` | `model_id` references `models`; `(model_id, year, trim)` unique |
| `users` | `id`, `email` | `email` unique |
| `user_vehicles` | `id`, `user_id`, `trim_id`, `nickname`, `saved_at` | `user_id` references `users`; `trim_id` references `vehicle_trims`; `(user_id, trim_id)` unique |

A saved vehicle stores only `trim_id`, which identifies the make, model and year
through the joins above. The `(user_id, trim_id)` constraint is what prevents
duplicates; the API turns the constraint error into a 409.

The demo user is `id` 1, `demo@example.com`.

## Endpoints

All responses are JSON, except `GET /`, which returns the page. Errors have the
shape `{"error": "message"}`.

| Method and path | Purpose | Success | Errors |
|---|---|---|---|
| `GET /` | The selection page | 200 | |
| `GET /makes?q=` | List makes, optionally filtered | 200 | 503 |
| `GET /makes/{id}/models?q=` | List a make's models, optionally filtered | 200 | 404 unknown make, 503 |
| `GET /models/{id}/years` | List a model's years, newest first | 200 | 404 unknown model, 503 |
| `GET /models/{id}/years/{year}/trims` | List trims for a model and year | 200 | 404 unknown model or no trims that year, 503 |
| `POST /users/{id}/vehicles` | Save a trim to a user's account | 201 | 400 bad body, 404 unknown user or trim, 409 already saved, 503 |
| `GET /users/{id}/vehicles` | List a user's saved vehicles, newest first | 200 | 404 unknown user, 503 |

`q` is a case-insensitive "contains" match. `%` and `_` in it are treated as
ordinary characters. All SQL uses bound parameters.

### Examples

These use a freshly seeded database, where Toyota is make 1, Camry is model 1
and Camry 2020 SE is trim 2.

```http
GET /makes
200 OK
{"makes": [{"id": 2, "name": "Honda"}, {"id": 1, "name": "Toyota"}]}
```

```http
GET /makes?q=toy
200 OK
{"makes": [{"id": 1, "name": "Toyota"}]}
```

```http
GET /makes/1/models
200 OK
{"models": [{"id": 1, "name": "Camry"}, {"id": 2, "name": "Corolla"}]}
```

```http
GET /models/1/years
200 OK
{"years": [2020]}
```

```http
GET /models/1/years/2020/trims
200 OK
{"trims": [{"id": 1, "trim": "LE"}, {"id": 2, "trim": "SE"}]}
```

```http
POST /users/1/vehicles
Content-Type: application/json

{"trim_id": 2}

201 Created
{"vehicle": {"id": 1, "trim_id": 2, "make": "Toyota", "model": "Camry", "year": 2020,
             "trim": "SE", "nickname": null, "saved_at": "2026-11-02 05:06:31"}}
```

`nickname` is an optional request field of at most 100 characters. The page does
not offer it yet.

```http
POST /users/1/vehicles
Content-Type: application/json

{"trim_id": 2}

409 Conflict
{"error": "This vehicle is already saved on your account."}
```

```http
GET /users/1/vehicles
200 OK
{"vehicles": [{"id": 1, "trim_id": 2, "make": "Toyota", "model": "Camry", "year": 2020,
               "trim": "SE", "nickname": null, "saved_at": "2026-11-02 05:06:31"}]}
```

```http
GET /makes
503 Service Unavailable
{"error": "The vehicle database can't be reached. Please try again."}
```

## Acceptance criteria and tests

The criteria are quoted from #29. API tests are in
`prototype/tests/test_vehicle_api.py`; page tests are in
`prototype/tests/ui/vehicle-select.test.js`.

| # | Criterion | API tests | Page tests |
|---|---|---|---|
| 1 | When the user opens the vehicle selection screen, the system shall show a list of available makes from the vehicle database. | `test_ac1_page_is_served_and_makes_come_from_the_database` | `AC1: opening the screen lists the makes from the API` |
| 2 | When the user selects a make, the system shall show only the models for that make. | `test_ac2_models_are_only_those_of_the_make` | `AC2: selecting a make shows only its models` |
| 3 | When the user selects a model, the system shall show only the years that model was produced. | `test_ac3_years_are_only_those_of_the_model` | `AC3: selecting a model shows only its years` |
| 4 | When the user selects a year, the system shall show only the trims available for that make, model, and year. | `test_ac4_trims_match_the_make_model_and_year` | `AC4: selecting a year shows only the matching trims` |
| 5 | When the user changes an earlier selection (make, model, or year), the system shall clear any later selections that no longer apply. | none (page behaviour) | the four `AC5:` tests |
| 6 | While any of make, model, year, or trim is not selected, the system shall keep the "Save vehicle" action disabled. | none (page behaviour) | the two `AC6:` tests |
| 7 | When a signed-in user saves a complete selection, the system shall store the vehicle (by its trim ID) on the user's account and show a confirmation. | `test_ac7_save_stores_the_trim_id_on_the_account` | `AC7: saving posts the trim ID and shows a confirmation` |
| 8 | When the user returns to the app after saving, the system shall show the saved vehicle on their account. | `test_ac8_saved_vehicle_is_listed_after_returning` | the two `AC8:` tests |
| 9 | If the user tries to save a vehicle that is already on their account, the system shall not create a duplicate and shall tell the user it's already saved. | `test_ac9_duplicate_save_returns_409_and_adds_no_row`, `test_ac9_the_database_itself_rejects_duplicates` | `AC9: a duplicate save says it's already saved and adds nothing` |
| 10 | If the vehicle database can't be reached, the system shall show an error message and keep the user's current selections. | `test_ac10_missing_database_returns_503_json`, `test_ac10_broken_database_returns_503` | the six `AC10:` tests |
| 11 | When the user searches or filters the make or model list, the system shall return matching results within 1 second for the seeded dataset. | `test_ac11_make_filter_returns_matches_within_one_second`, `test_ac11_model_filter_returns_matches_within_one_second` | the two `AC11:` tests |

## Known limitations

- **No authentication.** Criterion 7 says "a signed-in user", but sign-in is out of scope: the page always acts as the seeded demo user, and the API trusts the user ID in the URL. Anyone who can reach the API can read or change any user's saved vehicles, so this must not be deployed as it is.
- **Page tests use a fake server.** They run the real page in jsdom, which is not a browser, against a stand-in for the API that could drift from the real one.
- **The 1-second checks are narrow.** They use the five-trim seeded dataset. The API tests run in-process with no network, and the page tests use the fake server. They say nothing about larger datasets.
- **Plain HTML/JS page.** This differs from the team's planned React front end (#54), so the page will need to be rebuilt in React. The API should not need to change.
- **Saved vehicles can't be removed.** The API and page only add and list them.
- **Existing databases aren't migrated.** The new unique constraint only takes effect when `db/app.db` is rebuilt with `python db/init_db.py`, which deletes saved vehicles.
- **Development server only.** `python app.py` uses Flask's built-in server.

## Run instructions

See [`prototype/README.md`](../../prototype/README.md) for Windows and Linux
setup. In short, from `prototype/`, with the dependencies installed:

```bash
python db/init_db.py    # build and seed db/app.db (deletes any existing one)
python app.py           # serve http://127.0.0.1:5000/
python -m pytest -q     # API tests
npm install             # once
npm test                # page tests
```
