# Specification — Vehicle Data and Tracking
> Epic: [#27](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/27) ·
	Stories: [#29](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/29), [#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30), [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31), [#32](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/32), [#33](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/33) 
> Owner: [Ethan Chien](https://github.com/ready2pullallnighters) · Sprint: 2 · Status: draft

## Scope
**In scope** Upload valid vehicles with a make, model, year, and trim, their service records, and access them later on a dashboard, 
**Out of scope** Account creation, authentication for API.

# Definitions
**Service records** are information about a specific vehicle: service date, mileage, service type, and user-inputted notes

## Functional requirements
| ID | Requirement | Story |
|---|---|---|
| FR-1 | When the user selects the make option, the system shall allow the user to select from a list of the names of supported automotive manufacturers. | [#29](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/29) | 
| FR-2 | While a make is selected, when the user selects the model option, the system shall allow the user to select from a list of vehicle models from that manufacturer | [#29](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/29) |
| FR-3 | While a make and model is selected, when the user selects the year option, the system shall allow the user to select from a list of vehicle production years for that model | [#29](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/29) |
| FR-4 | While a make, model, and year is selected, when the user selects the trim option, the system shall allow the user to select from a list of automotive trim levels for that model | [#29](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/29) |
| FR-5 | When the user saves a vehicle, the system validates that the configuration is a valid vehicle entry in database | [#29](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/29) |
| FR-6 | When the user saves a vehicle, the system shall store the make, model, year, and trim in database | [#29](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/29) |
| FR-7 | The system shall allow a client to create a vehicle through API | [#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30) |
| FR-8 | The system shall allow the client to view a list of all vehicle IDs created by the client | [#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30) |
| FR-9 | The system shall allow the client to retrieve service records about that vehicle given a vehicle ID | [#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30) |
| FR-10 | The system shall allow the client to delete a vehicle and its associated records, given a vehicle ID |  [#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30) |
| FR-11 | Each service record shall be assigned to exactly one vehicle. | [#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30) |
| FR-12 | When the user selects the import option for service history, the system shall allow the user to upload existing records in a supported file format. | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
| FR-13 | When the user selects the manual input option for service history, the system shall allow the user to manually input the service date, mileage, service type, and notes. | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
| FR-14 | When the user imports existing records, the system shall validate the required fields before saving. | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
| FR-15 | "When the user manually inputs existing records, the system shall validate the required fields before saving. | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
| FR-16 | When an imported record contains invalid or missing required information, the system shall display an error message identifying the problem and prevent the invalid record from being saved. | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
| FR-17 | When a service record passes validation and the user confirms the entry or import, the system shall save the record and associate it with the selected vehicle. | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
| FR-18 | When a user opens the maintenance history for a selected vehicle, the system shall display the previously saved service records. | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |

## Non-functional requirements
| ID | Requirement | Story |
| --- | --- | ---|

## Acceptance criteria [epic level]
- [ ] A user can select a vehicle by make, model, year, and trim through a dashboard interface
- [ ] There is an API endpoint for each of: create, read, update, and delete for vehicles and service records
- [ ] The user can enter or import validated service history
- [ ] The automated tests from Objective 1.5 are passing in CI.

## Open questions
| Question | Owner | Needed by |
|---|---|---|
| What platform will we use for hosting? | @TylerWard741 | Sprint 2 |
