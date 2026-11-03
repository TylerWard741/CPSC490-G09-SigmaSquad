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
| FR-1 | When the user opens the vehicle selection screen, the system shall show a list of available makes from the vehicle database. | [#29](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/29) | 
| FR-2 | When the user selects a make, the system shall show only the models for that make. | [#29](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/29) | 
| FR-3 | When the user selects a model, the system shall show only the years that model was produced. | [#29](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/29) | 
| FR-4 | When the user selects a year, the system shall show only the trims available for that make, model, and year.
 | [#29](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/29) | 
| FR-5 | When the user changes an earlier selection (make, model, or year), the system shall clear any later selections that no longer apply. | [#29](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/29) | 
| FR-6 | While any of make, model, year, or trim is not selected, the system shall keep the "Save vehicle" action disabled. | [#29](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/29) | 
| FR-7 | When a signed-in user saves a complete selection, the system shall store the vehicle (by its trim ID) on the user's account and show a confirmation. | [#29](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/29) | 
| FR-8 | When the user returns to the app after saving, the system shall show the saved vehicle on their account. | [#29](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/29) | 
| FR-9 | When the client submits a service record with date, mileage, service type, and optional notes for a vehicle, the system shall return 201 and store the service record. | [#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30) |
| FR-10 | If the user tries to save a vehicle that is already on their account, the system shall not create a duplicate and shall tell the user it's already saved. | [#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30) |
| FR-11 |  If the vehicle database can't be reached, the system shall show an error message and keep the user's current selections. | [#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30) |
| FR-12 | When the client updates a vehicle's service record, the system shall return 200 and save the changes. | [#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30) |
| FR-13 | When the client submits a service record with date, mileage, service type, and optional notes for a vehicle, the system shall return 201 and store the service record.| [#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30) |
| FR-14 |  When the client deletes a vehicle, the system shall return 204 and remove a vehicle and all its service records. | [#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30) |
| FR-15 | When the client deletes a service record, the system shall return 204 and remove the service record. | [#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30) |
| FR-16 | If the client submits a record that has a missing or invalid input type, then the system shall return 400, save nothing, and respond with a message stating the invalid field.
 | [#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30) |
| FR-17 | If the client requests a vehicle or service record that does not exist, then the system shall return 404 with a message that vehicle or service record could not be found. | [#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30) |
| FR-18 | If the database can't be reached, then the system shall return 503 and a message that "The vehicle database can't be reached. Please try again."
 | [#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30) |
| FR-19 | When the user selects the import option for service history, the system shall allow the user to upload existing records in a supported file format. | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
| FR-20 | When the user selects the manual input option for service history, the system shall allow the user to manually input the service date, mileage, service type, and notes. | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
| FR-21 | When the user imports existing records, the system shall validate the required fields before saving. | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
| FR-22 | "When the user manually inputs existing records, the system shall validate the required fields before saving. | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
| FR-23 | When an imported record contains invalid or missing required information, the system shall display an error message identifying the problem and prevent the invalid record from being saved. | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
| FR-24 | When a service record passes validation and the user confirms the entry or import, the system shall save the record and associate it with the selected vehicle. | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
| FR-25 | When a user opens the maintenance history for a selected vehicle, the system shall display the previously saved service records. | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |

## Non-functional requirements
| ID | Requirement | Why it matters here |
| --- | --- | --- |
| NFR-1 | When the user searches or filters the make or model list, the system shall return matching results within 1 second for the seeded dataset. | A search that takes longer than 1 second is a noticeable wall in the user's experience |

## Acceptance criteria [epic level]
- [ ] A user can select a vehicle by make, model, year, and trim through a dashboard interface
- [ ] There is an API endpoint for each of: create, read, update, and delete for vehicles and service records
- [ ] The user can enter or import validated service history
- [ ] The automated tests from Objective 1.5 are passing in CI.

## Open questions
| Question | Owner | Needed by |
|---|---|---|
| What platform will we use for hosting? | @TylerWard741 | Sprint 2 |
