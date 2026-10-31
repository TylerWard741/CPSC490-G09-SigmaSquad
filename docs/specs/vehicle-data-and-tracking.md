# Specification — Vehicle Data and Tracking
> Epic: [#27](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/27) ·
	Stories: [#29](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/29), [#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30), [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31), [#32](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/32), [#33](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/33) 
> Owner: 〈name〉 · Sprint: 1 · Status: draft

## Scope

## Functional requirements
| ID | Requirement | Story |
|---|---|---|
| FR-1 | --- | --- | 
| - | "When the user selects the import option for service history, the system shall allow the user to upload existing records in a supported file format." | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
| - | "When the user selects the manual input option for service history, the system shall allow the user to manually input the service date, mileage, service type, and notes." | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
| - | "When the user imports existing records, the system shall validate the required fields before saving." | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
| - | "When the user manually inputs existing records, the system shall validate the required fields before saving." | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
| - | "When an imported record contains invalid or missing required information, the system shall display an error message identifying the problem and prevent the invalid record from being saved." | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
| - | "When a service record passes validation and the user confirms the entry or import, the system shall save the record and associate it with the selected vehicle." | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
| - | "When a user opens the maintenance history for a selected vehicle, the system shall display the previously saved service records." | [#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31) |
## Non-functional requirements

## Acceptable criteria [epic level]
- [ ] A user can select a vehicle by make, model, year, and trim through a dashboard interface
- [ ] There is an API endpoint for each of: create, read, update, and delete for vehicles and service records
- [ ] The user can enter or import validated service history
- [ ] The automated tests from Objective 1.5 are passing in CI.

## Open questions