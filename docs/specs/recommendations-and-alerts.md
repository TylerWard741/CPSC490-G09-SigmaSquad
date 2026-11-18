# Specification — Recommendations and alerts

> Epic: #28 · Stories: #34, #35, #36, #37, #38
> Owner: Tyler Ward · Sprint: 2 · Status: draft

## Scope

**In scope.**

This spec covers status labels for suggested services so that the user can see at a glance the statuses of recommended services. The app will use four status labels, which are “Overdue” (in red), “Due Now” (in orange), "Due Soon" (in yellow), and “When Convenient” (in green). For version one, user's current mileage will be entered into the app manually. They will need to log their mileage when it's convenient for them to do so. The app will calculate the mileage numbers at which all recommended services are due, using plain code-based logic. Version one will support three service types: oil changes, tire rotations and brake inspections. A service will be labeled "When Convenient" when the vehicle's current mileage is more than 500 miles before the start of the recommended service window. A service will be labeled "Due Soon" when the vehicle's current mileage is less than or equal to 500 miles before the start of the recommended service window. A service will be labeled "Due Now" when the vehicle's current mileage is inside the recommended service window. A service will be labeled "Overdue" when the vehicle's current mileage is past the end of the recommended service window. The start and end mileages of the service windows will be considered inside the windows. Cases in which manufacturers recommend a single mileage as opposed to mileage windows will be treated as windows in the app with the start and end mileage being the same. For services with status labels "Due Soon" and "Due Now," the dashboard will show the names of those specific services, their status label, the mileage window in which they're due, and the number of remaining miles until the end of the window. Version one of the app will still calculate the "When Convenient" services, but they will not be displayed on the dashboard. For services that are overdue, instead of showing the number of remaining miles until the end of the window, the dashboard will show the number of miles past the end of each window. The recommended intervals come from the vehicle's owner's manual, and/or the manufacturer's website.

**Out of scope.**

Version one of this spec does not cover notifications, AI-generated recommendations, automatic mileage, multiple drivers, or additional services beyond the three primary service types (oil changes, tire rotations and brake inspections). Notifications may be implemented during a later version, since version one focuses only on the web-based app, and mobile apps may be implemented during later versions. AI-generated recommendations are not necessary for version one, so we will consider adding them as a stretch goal for a later version. Automatic mileage tracking may also be implemented during a later version using GPS or an OBD reader. Having the option to add multiple drivers for a vehicle will also remain as a stretch goal.

## Functional requirements

| ID    | Requirement                                                                                                                                                                                                                                                         | Story |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| FR-1  | When a service's recommended window starts more than 500 miles beyond the vehicle's current mileage, the system shall label it as "When Convenient."                                                                                                                | #36   |
| FR-2  | When a service is labeled "When Convenient," the system shall not show it on the dashboard.                                                                                                                                                                         | #37   |
| FR-3  | When a service's recommended window starts more than 0 miles and no more than 500 miles beyond the vehicle's current mileage, the system shall label it as "Due Soon."                                                                                              | #36   |
| FR-4  | When the vehicle's current mileage is equal to or greater than the start of a service's recommended window and the vehicle's current mileage is equal to or less than the end of that same service's recommended window, the system shall label it as "Due Now."    | #36   |
| FR-5  | When the vehicle's current mileage is greater than the end of a service's recommended window, the system shall label it as "Overdue."                                                                                                                               | #36   |
| FR-6  | When a service is labeled "Due Soon," "Due Now," or "Overdue," the system shall show the service's name and its status label on the dashboard.                                                                                                                      | #37   |
| FR-7  | When a service is labeled "Due Soon" or "Due Now," the system shall show the service's mileage window on the dashboard.                                                                                                                                             | #37   |
| FR-8  | When a service is labeled "Due Soon" or "Due Now," the system shall show the number of miles remaining until the end of the service's mileage window on the dashboard.                                                                                              | #37   |
| FR-9  | When a service is labeled "Overdue," the system shall show the number of miles past the end of the service's mileage window on the dashboard.                                                                                                                       | #37   |
| FR-10 | When the user enters the vehicle's current mileage, the system shall recalculate and apply the "When Convenient," "Due Soon," "Due Now," or "Overdue" labels to all services that meet their criteria, using the rules in FR-1 to FR-5. | #34   |
| FR-11 | When a manufacturer's service recommendation is a single-mileage interval as opposed to a mileage window, the system shall treat it as a window whose start and end are equal.                                                                                      | #34   |
| FR-12 | The system shall calculate recommendations for and apply labels to three service types: oil changes, tire rotations, and brake inspections.                                                                                                                         | #35   |
| FR-13 | When the user attempts to view the dashboard without having provided sufficient data, such as a vehicle not being chosen, no service history, or no mileage entered, the system shall prompt the user to enter the missing data.                                    | #34   |
| FR-14 | When the user enters a new current mileage, the system shall replace the previous current mileage value.                                                                                                                                                            | #34   |

## Non-functional requirements

| ID    | Requirement | Why it matters here |
| ----- | ----------- | ------------------- |
| NFR-1 | A status label must always show the status label as a word, so that users unable to see color still understand the status of different services. | This matters for our users because they might not be able to see the color of the status label in certain situations |
| NFR-2 | The system's labels must be reliable, which means that the five simulated scenarios mentioned in Objective 2.5 shall pass tests and checks. | This matters because if a label is wrong, it could lead to users performing recommended services too late or too early, potentially causing damage to their vehicle and/or wasting money. |
| NFR-3 | On a phone screen, the dashboard shall fit the screen width and scroll only vertically. | This matters because we intended for our app to perform well on mobile devices since the inception of this project. |
| NFR-4 | On a phone screen, text shall be easily readable and buttons should be big enough to tap easily. | This matters because users will have a difficult time using our app if they can't read its text and click its buttons. |

## Acceptance criteria (epic level)

- [ ] The spec is satisfied when someone can input vehicle information, service history, and current mileage, and see the status labels on recommended services on the dashboard.
- [ ] The spec is also satisfied when five simulated scenarios with different vehicles all produce the correct status labels.
- [ ] The spec is also satisfied when a user who tries to view the dashboard with insufficient data is prompted to provide sufficient data.

## Open questions

| Question | Owner | Needed by |
| -------- | ----- | --------- |
| How does the system determine whether there is sufficient data to produce an accurate status label? | Tyler Ward | Before story #34 starts |
| How shall we determine what counts as a reliable source of information regarding different vehicles and their recommended services? | Tyler Ward | Before story #35 starts |
| What is the best way to update #36 and #37 to be fully in line with our now four status labels and what may be shown on the app's dashboard? | Tyler Ward | Before story #36 starts |
