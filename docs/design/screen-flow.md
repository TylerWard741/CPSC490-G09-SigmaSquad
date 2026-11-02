# Dashboard and Service Entry Screen Flow

**Epic:** #27 – Centralized Vehicle Data & Maintenance Tracking  
**Related User Stories:** #29, #31, #32  
**Task:** #53 – Draw Dashboard and Entry Screen Flow

## Purpose

The purpose of the screen-flow diagram is to demonstrate how users can navigate between the dashboard and service-history entry screens to manage their vehicle's maintenance records.  It shows the process of accessing the dashboard, selecting or adding a vehicle, and managing maintenance records through manual entry or importing existing data.  It also illustrates the process of data validation, error handling, and saving. 

## Screen Flow

![Dashboard and service-entry screen flow showing navigation,
validation, and saving](diagrams/screen-flow.png)

*Figure 1 — Dashboard and service-entry screen flow.*

## Screen Descriptions


### Sign In / Create Account
Entry point to the application.  Users must sign in or login to existing account to access the dashboard.

### Dashboard
Main page of the application that displays the selected vehicle, service history, and alerts for upcoming maintenance.  Users can navigate to other screens from the dashboard and access the systems features, such as adding or editing a vehicle.

### Vehicle Select
Allows users to manage and view vehicles.  Users may choose an existing vehicle or add/edit vehicle information.  Selecting a vehicle will display that vehicle's associated maintenance records.

### Enter Specifications
Allows users to enter vehicle details (make, model, year, trim).  The system will validate input before saving.

### Service History
Displays service records associated with selected vehicle.  Users can view existing records and add new service information manually or by importing.

### Manual Entry
Allows users to enter service date, mileage, service type, and notes.  The system will validate input before saving.

### Import Records
Allows users to select existing files of service history records.  The system will validate input before saving. 

## Validation and Navigation

[Explain successful and unsuccessful paths.]

### Vehicle Validation

After entering vehicle specifications, the system checks whether the information entered is valid.  If the validation succeeds, the vehicle will be saved.  If the validation fails, an error message appears and the user returns to the specifications screen. 

After successful validation, users may also choose to add another vehicle or return to dashboard.

### Service History Validation

The system validates all records, whether entered manually or imported.  If the validation succeeds, the record is saved and associated with the corresponding vehicle.  If the validation fails, an error message is shown and the user returns to the service history screen.  

Users may add another vehicle or return to dashboard after successful validation. 

## Related Requirements

This diagram supports the following project objectives:

- **Objective 1.1 (#29):** Vehicle selection and identification using make, model, year, and trim.
- **Objective 1.3 (#31):** Manual service-history entry, importing existing records, and validating records before saving.
- **Objective 1.4 (#32):** Dashboard navigation and access to vehicle maintenance history.

## Design Status

This diagram represents the proposed user interface and navigation flow for the Vehicle Maintenance Logger. The screens and validation processes are planned functionality and do not represent completed application features.
