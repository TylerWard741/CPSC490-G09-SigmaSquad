# Specification — Recommendations and alerts

> Epic: #28 · Stories: #34, #35, #36, #37, #38
> Owner: Tyler Ward · Sprint: 2 · Status: draft

The `> Q#` blocks below are Tyler's own words, placed here unchanged as raw material. They are to be rewritten into the tables in place before this goes up for review.

## Scope

**In scope.**

> **Q4.** The reason we show these labels instead of just a due date is because it allows the user to better prepare and understand what is due soon versus what is not due soon with a quick glance instead of having to look at the mileage numbers and do mathematical subtraction to find out how close they are.

> **Q7.** I think the app should show three labels, and they are “Overdue” ( in red), “Due Soon” (in orange), and “When Convenient” (in yellow).

> **Q14.** For version one, user's current mileage gets into the app by manual entry. They will need to log their mileage whenever is convenient for them. In later versions of the product, we will implement a way to make this automatic so that the users don’t have to manually enter their mileage.

> **Q15.** The spec is satisfied when someone can input their vehicle information, service history, and current mileage, and see which services are “Overdue,” “Due Soon,” and “When Convenient.”  we will use multiple simulated scenarios with different vehicles and mileages and service histories to test this.



This spec covers status labels for suggested services so that the user can see at a glance the statuses of recommended services. The app will use four status labels, which are “Overdue” (in red), “Due Now” (in orange), "Due Soon" (in yellow), and “When Convenient” (in green). For version one, user's current mileage will be entered into the app manually. They will need to log their mileage when it's convenient for them to do so. The app will calculate the mileage numbers at which all recommended services are due, using plain code-based logic. Version one will support three service types: oil changes, tire rotations and brake inspections. A service will be labeled "When Convenient" when the vehicle's current mileage is more than 500 miles before the start of the recommended service window. A service will be labeled "Due Soon" when the vehicle's current mileage is less than or equal to 500 miles before the start of the recommended service window. A service will be labeled "Due Now" when the vehicle's current mileage is inside the recommended service window. A service will be labeled "Overdue" when the vehicle's current mileage is past the end of the recommended service window. The start and end mileages of the service windows will be considered inside the windows. Cases in which manufacturers recommend a single mileage as opposed to mileage windows will be treated as windows in the app with the start and end mileage being the same. For services with status labels "Due Soon" and "Due Now," the dashboard will show the names of those specific services, their status label, the mileage window in which they're due, and the number of remaining miles until the end of the window. Version one of the app will still calculate the "When Convenient" services, but they will not be displayed on the dashboard. For services that are overdue, instead of showing the number of remaining miles until the end of the window, the dashboard will show the number of miles past the end of each window. The recommended intervals come from the vehicle's owner's manual, and/or the manufacturer's website.



**Out of scope.**

> **Q8.** In version one, notifications won’t be used because version one will just be a web app with mobile apps to come later. Those mobile apps later will use the notification system.

> **Q13.** Beside those, version one of the app will not include features for multiple drivers, it will not automatically calculate the vehicle’s current mileage, and it will not implement AI to assist in calculating recommendations. I want to say this so that nobody builds these features by accident.

> **Q12.** Version one will use code-based logic to make recommendations on upcoming services. Later, as a stretch goal, we will try to implement artificial intelligence to make those recommendations. The course requires an AI-powered feature or documented AI-assisted development, and we are using AI to assist in our development, so that is how we are meeting that requirement for version one.



Version one of this spec does not cover notifications, AI-generated recommendations, automatic mileage, multiple drivers, or additional services beyond the three primary service types (oil changes, tire rotations and brake inspections). Notifications may be implemented during a later version, since version one focuses only on the web-based app, and mobile apps may be implemented during later versions. AI-generated recommendations are not necessary for version one, so we will consider adding them as a stretch goal for a later version. Automatic mileage tracking may also be implemented during a later version using GPS or an OBD reader. Having the option to add multiple drivers for a vehicle will also remain as a stretch goal.



## Functional requirements

> **Q1.** When a service is overdue, the app should tell the user that it is overdue with an indicator on the item itself shown in the list, which looks like a red pill shape outline and background with the word “overdue” on it. It should not be large, but a rather small indicator. Placed on probably the top left corner of the item in the list. Notifications should also periodically be sent to the user that said service is overdue once it is overdue. Those notifications should be sent to their device once per day.

> **Q2.** When a service is coming due soon, the app should tell the user it is such with an indicator on the item itself shown in the list, which looks like an orange pill shape outline and background with the words “Due Soon” on it. It should not be large, but a rather small indicator. Placed on probably the top left corner of the item in the list. Notifications should also periodically be sent to the user that said service is due soon once their mileage is within 1,000 miles of the official mileage window. Those notifications should be sent to their device once per week.

> **Q3.** When a service is a long way off, the app should tell the user it is such with an indicator on the item itself shown in the list, which looks like a yellow pill shape outline and background with the words “When Convenient” on it or something similar with different phrasing perhaps. It should not be large, but a rather small indicator. Placed on probably the top left corner of the item in the list. Notifications do not need to be sent for these.

> **Q6.** Regarding the labels and alerts, “Due Soon” starts at 500 miles before the due mileage because it is not too far off, or not too soon. It is a sweet spot for when we should let the user know that their service is due soon.

> **Q9.** When I said 'the official mileage window', I meant the recommended mileage window as specified by the manufacturer.

> **Q10.** The label “Urgent” will no longer be used because we think it will be better to use three labels instead, which are “Overdue” (red), “Due Soon” (orange), “When Convenient” (yellow). These labels are clearer and simpler to understand.

> **Q14.** For version one, user's current mileage gets into the app by manual entry. They will need to log their mileage whenever is convenient for them. In later versions of the product, we will implement a way to make this automatic so that the users don’t have to manually enter their mileage.

> **Q16.** The recommendations must be reliable because suggesting maintenance or service later than is appropriate could lead to damage to the user’s vehicle and suggesting maintenance or service earlier than is appropriate could lead to users distrusting and no longer using the application. To ensure this, we must conduct multiple varied test scenarios, all passing with flying colors, in that they will recommend the appropriate services at the appropriate millages and have the correct labels indicating the level of urgency. If the data needed to calculate whether a recommendation is has not been made or the noted mileage is outdated, the app should prompt the user for the correct data instead of guessing. This is important because a wrong label could lead to the user unknowingly neglecting needed service, leading to possible damage to their vehicle.

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

> **Q16.** The recommendations must be reliable because suggesting maintenance or service later than is appropriate could lead to damage to the user’s vehicle and suggesting maintenance or service earlier than is appropriate could lead to users distrusting and no longer using the application. To ensure this, we must conduct multiple varied test scenarios, all passing with flying colors, in that they will recommend the appropriate services at the appropriate millages and have the correct labels indicating the level of urgency. If the data needed to calculate whether a recommendation is has not been made or the noted mileage is outdated, the app should prompt the user for the correct data instead of guessing. This is important because a wrong label could lead to the user unknowingly neglecting needed service, leading to possible damage to their vehicle.

> **Q17.** A user should be able to tell what is due and how urgent it is at a glance with the help of our three urgency labels. This is important because it makes things easier and more efficient for the user. This is simply a decision based on good UX. The labels must not rely only on color, but the word or phrase as well. The list works on a phone screen because they can scroll through it and see things at a glance conveniently.

| ID    | Requirement | Why it matters here |
| ----- | ----------- | ------------------- |
| NFR-1 |             |                     |

## Acceptance criteria (epic level)

> **Q15.** The spec is satisfied when someone can input their vehicle information, service history, and current mileage, and see which services are “Overdue,” “Due Soon,” and “When Convenient.”  we will use multiple simulated scenarios with different vehicles and mileages and service histories to test this.

> **Q16.** The recommendations must be reliable because suggesting maintenance or service later than is appropriate could lead to damage to the user’s vehicle and suggesting maintenance or service earlier than is appropriate could lead to users distrusting and no longer using the application. To ensure this, we must conduct multiple varied test scenarios, all passing with flying colors, in that they will recommend the appropriate services at the appropriate millages and have the correct labels indicating the level of urgency. If the data needed to calculate whether a recommendation is has not been made or the noted mileage is outdated, the app should prompt the user for the correct data instead of guessing. This is important because a wrong label could lead to the user unknowingly neglecting needed service, leading to possible damage to their vehicle.

- [ ] 

## Open questions

> **Q5.** I’m not sure yet whether these would be the best labels to use, or if we might want to tweak them slightly, and I would want to check anecdotes on the Internet to see when the most handy callouts would be, and what people would prefer most or find most helpful.

> **Q11.** For version one, the manufacturer’s intervals will come from any official sources from the manufacturer, including but not limited to owner’s manuals, their official website, and verified claims by users on the internet.

> **Q12.** Version one will use code-based logic to make recommendations on upcoming services. Later, as a stretch goal, we will try to implement artificial intelligence to make those recommendations. The course requires an AI-powered feature or documented AI-assisted development, and we are using AI to assist in our development, so that is how we are meeting that requirement for version one.

| Question | Owner | Needed by |
| -------- | ----- | --------- |
|          |       |           |
