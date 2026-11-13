# Specification — Vehicle and service-record API

> Epic: [#27](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/27) · Stories: [#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30)
> Owner: Hector · Sprint: 3 · Status: draft
> Design: [PR #67](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/pull/67) (Figure 4 in proposal §4)

This spec will cover how the API will let a client Create, Read, Update, and Delete vehicles as well as their service records. This spec aligns with Objective 1.2 where we implement the database schema that would hold the data that our dashboard and next-service calculation depend on.

## Scope

**In scope.**

REST API and database schema support Creating, Reading, Updating, and Deleting operations for vehicles and service records. The service records 
include service date, mileage, service type, and notes.

**Out of scope.**

Any features from other issues such as: sign-in/auth, any vehicle selection screens, record importing, dashboard view, next-service calculations, status labels, and any schedule rules.


## Data model

Builds on `prototype/db/schema.sql` (PR #48, plus `UNIQUE (user_id, trim_id)` from PR #64).
Rows marked **new** are what this story adds.

| Table | Columns | Constraints |
|---|---|---|
| `user_vehicles` | existing columns, plus **new** `current_mileage` | `current_mileage` INTEGER, nullable, `>= 0` |
| `service_types` **new** | `id`, `name` | `name` NOT NULL, unique; Seeded with Oil change, Tire rotation, Brake inspection |
| `service_records` **new** | `id`, `vehicle_id`, `service_type_id`, `service_date`, `mileage`, `notes` | `vehicle_id` NOT NULL references `user_vehicles(id)` ON DELETE CASCADE; `service_type_id` NOT NULL references `service_types(id)`; `service_date` NOT NULL, `YYYY-MM-DD`; `mileage` NOT NULL, `>= 0`; `notes` nullable |

## Endpoints

Same conventions as the #29 API (`prototype/app.py`): JSON in and out, errors shaped
`{"error": "message"}`, bound SQL parameters only, 503 when the database can't be reached.
Existing #29 endpoints are listed for completeness.

### Vehicles

| Method and path | Purpose | Success | Errors |
|---|---|---|---|
| `POST /users/{user_id}/vehicles` | Create (existing, #29) | 201 | 400, 404, 409, 503 |
| `GET /users/{user_id}/vehicles` | List a user's vehicles (existing, #29) | 200 | 404, 503 |
| `GET /vehicles/{vehicle_id}` | Read one vehicle **new** | 200 | 404, 503 |
| `PATCH /vehicles/{vehicle_id}` | Update `nickname` and/or `current_mileage` **new** | 200 | 400, 404, 503 |
| `DELETE /vehicles/{vehicle_id}` | Delete a vehicle and its service records **new** | 204 | 404, 503 |

### Service types

| Method and path | Purpose | Success | Errors |
|---|---|---|---|
| `GET /service-types` | List service types for the entry form **new** | 200 | 503 |

### Service records

| Method and path | Purpose | Success | Errors |
|---|---|---|---|
| `POST /vehicles/{vehicle_id}/service-records` | Create a record **new** | 201 | 400, 404 unknown vehicle or service type, 503 |
| `GET /vehicles/{vehicle_id}/service-records` | List a vehicle's records, newest `service_date` first **new** | 200 | 404, 503 |
| `GET /service-records/{record_id}` | Read one record **new** | 200 | 404, 503 |
| `PATCH /service-records/{record_id}` | Update any of the four fields **new** | 200 | 400, 404, 503 |
| `DELETE /service-records/{record_id}` | Delete a record **new** | 204 | 404, 503 |

### Validation (400 responses)

| Field | Rule |
|---|---|
| `service_date` | Required on create; a real calendar date in `YYYY-MM-DD`; not in the future |
| `mileage` | Required on create; integer `>= 0`; `true`/`false` rejected (bool is an int in Python) |
| `service_type_id` | Required on create; positive integer; must exist (else 404) |
| `notes` | Optional; text of at most 1000 characters |
| `current_mileage` | Optional on `PATCH /vehicles`; integer `>= 0` |
| `nickname` | Optional; text of at most 100 characters (same limit as #29) |
| Body | Must be a JSON object; unknown fields rejected; PATCH must include at least one field |

### Examples

```http
POST /vehicles/1/service-records
{"service_type_id": 1, "service_date": "2026-10-15", "mileage": 42150, "notes": "Synthetic 0W-20"}

201 Created
{"service_record": {"id": 1, "vehicle_id": 1, "service_type_id": 1, "service_type": "Oil change",
                    "service_date": "2026-10-15", "mileage": 42150, "notes": "Synthetic 0W-20"}}
```

```http
POST /vehicles/1/service-records
{"service_type_id": 1, "service_date": "2026-13-40", "mileage": -5}

400 Bad Request
{"error": "service_date must be a valid date in YYYY-MM-DD format."}
```

```http
DELETE /vehicles/1
204 No Content
```

## Functional requirements

| ID | Requirement | Story |
|---|---|---|
| FR-1 | When the client submits a service record with date, mileage, service type, and optional notes for a vehicle, the system shall return 201 and store the service record. | #30 |
| FR-2 | When the client requests a vehicle's service records, the system shall return 200 and list their service records sorted by newest date first. | #30 |
| FR-3 | When the client updates a vehicle's service record, the system shall return 200 and save the changes. | #30 |
| FR-4 | When the client deletes a vehicle, the system shall return 204 and remove the vehicle and all its service records. | #30 |
| FR-5 | When the client deletes a service record, the system shall return 204 and remove the service record. | #30 |
| FR-6 | If the client submits a record that has a missing or invalid input type, then the system shall return 400, save nothing, and respond with a message stating the invalid field. | #30 |
| FR-7 | If the client requests a vehicle or service record that does not exist, then the system shall return 404 with a message that vehicle or service record could not be found. | #30 |
| FR-8 | If the database can't be reached, then the system shall return 503 and a message that "The vehicle database can't be reached. Please try again." | #30 |
| FR-9 | When the client requests a vehicle by id, the system shall return 200 and the requested vehicle's details: make, model, year, trim, nickname, current mileage. | #30 |
| FR-10 | When the client updates a vehicle's nickname or current mileage, the system shall return 200 and save the changes to the vehicle record. | #30 |
| FR-11 | When the client requests a service record by id, the system shall return 200 and the service record's fields. | #30 |
| FR-12 | When the client requests a list of vehicle service types, the system shall return 200 and the requested service types sorted by name. | #30 |
| FR-13 | When a record is saved or updated with a mileage higher than the vehicle's current mileage, or the vehicle has none yet, the system shall return 201 for a new record, 200 for an update, and set `current_mileage` to that mileage. A lower mileage never lowers `current_mileage`. | #30, #81 | 

## Non-functional requirements

| ID | Requirement | Why it matters here |
|---|---|---|
| NFR-1 | SQL will use bound parameters | Prevents SQL injection from user-entered notes |

## Acceptance criteria

- [ ] When the client submits a service record with date, mileage, service type, and optional notes for a vehicle, the system shall return 201 and store the service record.
- [ ] When the client requests a vehicle's service records, the system shall return 200 and list their service records sorted by newest date first.
- [ ] When the client updates a vehicle's service record, the system shall return 200 and save the changes.
- [ ] When the client deletes a vehicle, the system shall return 204 and remove the vehicle and all its service records.
- [ ] When the client deletes a service record, the system shall return 204 and remove the service record.
- [ ] If the client submits a record that has a missing or invalid input type, then the system shall return 400, save nothing, and respond with a message stating the invalid field.
- [ ] If the client requests a vehicle or service record that does not exist, then the system shall return 404 with a message that vehicle or service record could not be found.
- [ ] If the database can't be reached, then the system shall return 503 and a message that "The vehicle database can't be reached. Please try again."

## Open questions

| Question | Owner | Needed by |
|---|---|---|
| `UNIQUE (user_id, trim_id)` (PR #64) stops one user tracking two cars of the same trim. Keep it as a known limitation, or relax it (e.g. include `nickname`)? | @TamtungOS, @Mathieu2303 | Before the dashboard (#32) lists more than one vehicle |
| Auth is out of scope, so the API does not check that a vehicle belongs to the caller. Acceptable for the prototype? | Team | Before the app is hosted |
