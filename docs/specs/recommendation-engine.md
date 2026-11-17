# Specification — Recommendation engine

> Epic: #28 · Stories: #35
> Owner: Ethan Chien · Sprint: 3 · Status: draft

## Overview

The recommendation engine decides, for a vehicle, which of the version-one
service types is due and gives each a status label. This document covers the
service types the engine supports and the reference data it reads. The rules
that turn a mileage into a label are in
`docs/specs/recommendations-and-alerts.md` (FR-1 to FR-5, #36).

## Scope

**In scope.**

- Recommendations for three service types: oil changes, tire rotations, and
  brake inspections.
- A recommended mileage window for each service type, per vehicle. A
  manufacturer's single-mileage interval counts as a window whose start and end
  are equal (`recommendations-and-alerts.md` FR-11).

**Out of scope.**

- The thresholds for each label (#36) and what the dashboard shows (#37).
- Entering the current mileage and the missing-data prompt (#34).
- Service types beyond the three above, notifications, and AI-generated
  recommendations.

## Functional requirements

| ID | Requirement | Story |
|---|---|---|
| FR-1 | When a vehicle has a recommended window for oil changes, service history and a current mileage, the system shall apply a status label ("When Convenient," "Due Soon," "Due Now," or "Overdue") to oil changes. | #35 |
| FR-2 | When a vehicle has a recommended window for tire rotations, service history and a current mileage, the system shall apply a status label ("When Convenient," "Due Soon," "Due Now," or "Overdue") to tire rotations. | #35 |
| FR-3 | When a vehicle has a recommended window for brake inspections, service history and a current mileage, the system shall apply a status label ("When Convenient," "Due Soon," "Due Now," or "Overdue") to brake inspections. | #35 |
| FR-4 | When a vehicle has no recommended window for a service type, the system shall not apply a status label to that service type. | #35 |

## Open questions

- **Which vehicle has a window.** The prototype has windows for some vehicles
  and none for others, because some manufacturers publish no fixed mileage. Which
  vehicles must have all three is not decided.
- **After a service.** The spec does not say when the next window starts once a
  service is done, or what the first window is when a vehicle has no record of
  that service. Tyler (owner of #34) has not confirmed either rule.
- **No service history.** FR-1 to FR-3 apply when a vehicle has service history.
  What the engine does without it is not defined here; the prompt for missing
  data is #34's (`recommendations-and-alerts.md` FR-13).
