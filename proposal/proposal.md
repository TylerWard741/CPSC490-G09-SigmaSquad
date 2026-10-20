# Project Proposal — Vehicle Maintenance Logger

**Department of Computer Science**
**CPSC 490 Undergraduate Seminar in Computer Science — Proposal for Capstone Project**

**Group 09 — Sigma Squad** · Sponsor: independent

**Authors**:
| Name | Username |
| -- | -- |
|Ward, Tyler|@TylerWard741|
|Partain-Martinez, Mathieu|@Mathieu2303|
|Mojica Arevalo, Hector Samuel|@TamtungOS|
|Chien, Ethan|@ready2pullallnighters|
|Velasco, Emily|@emilyvlsco|
Date: 2026-10-09

---

## 0. Abstract

> The primary purpose of abstract is to help the reader understand the main
> message of current document (proposal in this case) without reading the
> entire document. Therefore an abstract should include at least one or two
> paragraph of background (or motivation) information for the project, a
> brief description of the problem you are trying to solve in this proposal,
> a proposed ideas or solutions, the significance of your proposed idea
> elaborating why the proposed idea is non-trivial, significant, or
> beneficial in one or two paragraphs, the project goals and outcomes in one
> paragraph, and a brief description of what you will discuss in this
> proposal, giving a brief outline of this document in 1-2 sentences in one
> paragraph. Abstract should not exceed one page. Any abstract exceeded
> one-page limit must be shortened.

〈Your abstract. Write it last.〉

## 1. Introduction

> Describe the necessary background on the project field to help the reader
> understand the field. Assume the reader has B.S. degree in computer science
> but not necessary knowledgeable in the selected area. You may also briefly
> describe motivation of the project if any.
>
> Specify the problem identified and to be solved in this project, the
> importance or usefulness of the problem solving or project. Further
> describes what makes your proposal different from existing ones.

〈Your introduction.〉

### 1.1 Related Work


Vehicle maintenance tracking is a crowded space. We surveyed five currently active products as well as the calendar app that many users use to keep track of maintenance. We compared them on the feature set that applies to our project such as: record keeping with support for import/export, how reminders are triggered and prioritized, AI assistance, platform coverage, and what users get with the free tier.

| Existing approach | What it does | Pros | Cons | Why ours differs |
|---|---|---|---|---|
| CARFAX Car Care [1] - [3] | Using a vehicle's VIN or plate, shows the maintenance schedule recommended by the manufacturer, displays service history by CARFAX network shops, and sends alerts for service or recalls. | Free. Almost no data entry. History can include work done by previous owners | History only populates with CARFAX partnered shop reports. | Ours will allow owners to import records including physical reports and rank upcoming service by urgency. |
| Drivvo [4],[5] | Logs fuel, expenses, income, services, and routes, sends reminders, renders reports and charts, even allows fleet management. Web, iOS, and Android support. | All three major platforms with sync features. Widespread usage. | Free tier has ads. Additional features require a paid plan. Fleet plans are subscription based. Aimed towards fleets and for-hire drivers. | No ads or paid tier. Narrower scope, created for the individual owner rather than fleets. |
| Simply Auto [6]-[8] | Logs fill ups, services, expenses, and trips. Sends reminders based on mileage or date. Automatic trip logging with GPS or Bluetooth. Receipt capture. Cloud sync. | Mileage based reminders in free tier. Automatic trip logging. Low price. | Web access, PDF receipts, ad removal with paid tier. iOS app last updated March 24, 2022. Android app last updated October 10, 2024. Legacy interface. Automatic trip logging limited to 15 trips/month. | Ours will have web access for every user regardless of paid tier status, actively maintained app on all three platforms with support for bulk import of old records. |
| GarageHub [9]-[11], [13], [14] | Maintenance log with photos and costs, parts inventory, to-fix lists, mileage based reminders, and an AI assistant that reads the user's records before replying. Batch receipt scanning with CSV import with a ranked "Up Next" list. Web, iOS, and Android. | AI answers use user's history for context. Mileage based reminders. Bulk history import with reminders ordered by urgency. | Subscription with a limited free tier of 1 vehicle, 50 service logs, and 15 AI messages/month with a 10-entry import cap. Targeted towards hobby mechanics and project cars. | Closest competitor. Our focus is everyday owners, no paid tiers. |
| MECH AI [12] | AI Repair assistant. Vehicle specific chat, OBD2 reading, repair guides, wiring diagrams, and parts search. Saves garage and maintenance history | Most diagnostic potential with repair help. Web, iOS, and Android. | Free tier is limited to 3 AI messages/day. Targeted for just fixing a problem rather than vehicle maintenance. | Our project will use AI to answer questions about owner's records and schedule, supports record-keeping from repairs. |
| Calendar App | Owner estimates a date for every service and reminder. | Free, pre-installed on devices. | Owner must manually log mileage intervals to their calendar by each respective trip date. No service history. | Reminders follow tracked mileage, history lives alongside it. |

Surveying the aforementioned competing products, we primarily focused on two, Drivvo and GarageHub. Drivvo's feature set includes logging, reminders, reports, as well as support for Web, iOS, and Android [4]. GarageHub includes importing old receipts, ranking upcoming service by urgency, even answering service questions from the owner’s own service history, as well as support for Web, iOS, and Android [9], [13], [14]. With multiple competitors already in circulation, our Vehicle Maintenance Logger project isn't unique with GarageHub being the closest competitor. 

Building off of our inspiration to create our own vehicle maintenance logger, our starting point is importing old records into a usable vehicle history. GarageHub offers this, but only the first 10 imported entries are free [13], which a vehicle with a long service history would use up quickly. GarageHub also caps its AI messages [10] with MECH AI having its maintenance schedule locked behind a paid tier [12]. Simply Auto does provide automatic trip detection, however it is limited to 15 trips a month with more locked behind a paid tier [6], and Drivvo shows ads without a subscription [4]. Our application is intended to be the most accessible by vehicle owners wanting to take the initiative of properly maintaining their investment by being free from ads and paid tiers.

MECH AI is another platform for vehicle maintenance, however their focus is for people who work on their own vehicles, similar to GarageHub. GarageHub supports parts inventories and build logs, and MECH AI provides wiring diagrams. As described in Section 1, our users should not have to read the manual cover to cover. They need a guided setup and straightforward answers on what is urgent and what can wait. Another implementation we look for is to provide climate-based recommendations, meaning that our platform would adjust service recommendations to the climate the vehicle is driven in. 

Finally, we seek to provide a platform that would act as a central hub for vehicle owners where record keeping, automatic mileage tracking, DIY service help, and finding parts live in one place. This could be seen as a consolidated platform combining at least two of the products above.

### 1.2 Problem Statements

> Briefly state the problem to solve in this project.

**P1: Maintenance Record Management**

Vehicle maintenance records can be lengthy, disorganized, and spread across various documents. Manually accessing these records can make it difficult to determine a vehicle's maintenance history. Vehicles of different makes, models, years, and trims require different services at different times. 

**P2: Determining Maintenance Requirements and Urgency**

Future vehicle services depend on previous services, a vehicle's specifications, and current mileage. Vehicle owners may have difficulty recognizing which services require immediate action and which services can wait. 

| Problem | Addressed by |
|---|---|
| P1: Maintenance Record Management | G1: Centralized Vehicle Data & Maintenance Tracking ([#27](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/27)) |
| P2: Determining Maintenance Requirements and Urgency | G2: Scheduled Maintenance Recommendations & Alerts ([#28](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/28)) |

## 2. Goals and Objectives

> Describe goals and objectives. Goals are general statements of what you are
> trying to accomplish with the project or problems to solve. Objectives are
> specific, measurable statements of what you want to complete to reach the
> project goals. Most projects have 2-3 goals.
>
> List the objectives for each goal. To write objectives, look at the goal
> statement and list what you need to complete using action words like use
> case names in order to meet the goal.
>
> Note that the goals and objectives in a proposal will be an important
> metric to evaluate whether or not you successfully finished your project
> when you turn in your final project report.

Each **goal** is tracked as an **Epic** issue and each **objective** as a
**User Story** issue in the team repository (see the setup guide's *Epics and user stories* section).
**Every epic and user story in the repository is linked from this section** —
CI gate G8 fails if one exists that this section does not link. That is what
keeps the goals in this document and the work on the board from drifting
apart.

Write each objective the way the guidance above asks — **an action word plus
the measure that says it is done**, not a role-play sentence:

**Goal 1: Centralized Vehicle Data & Maintenance Tracking** (Epic [#27](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/27))

Enable users to identify their exact vehicle, enter or import its service history, and access accurate maintenance records across desktop and mobile browsers.

**Objectives**

**1.1.** Implement a vehicle database and selection interface that allows users to identify a vehicle by make, model, year, and trim, and save the selected vehicle to their account. ([#29](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/29))

**1.2.** Implement a database schema and REST API supporting create, read, update, and delete (CRUD) operations for vehicles and service records, including service date, mileage, service type, and notes. ([#30](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/30))

**1.3.** Develop an interface that allows users to enter service history manually or import existing service-history data, with imported records validated before being saved. ([#31](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/31))

**1.4.** Build a responsive dashboard that displays each vehicle's maintenance history and supports vehicle and service-record management on desktop and mobile browsers. ([#32](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/32))

**1.5.** Create automated tests covering vehicle selection, service-history entry and import, and maintenance-record API endpoints, with all tests passing in continuous integration (CI). ([#33](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/33))

**Goal 2: Scheduled Maintenance Recommendations & Alerts** (Epic [#28](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/28))

Provide accurate, mileage-based maintenance recommendations and clearly communicate when maintenance is urgent versus when it can be completed at the user's convenience.

**Objectives**

**2.1.** Develop a recommendation engine that uses the selected vehicle's make, model, year, trim, current mileage, and service history to calculate the next recommended service and its due mileage. ([#34](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/34))

**2.2.** Support next-service recommendations for at least three common service types: oil changes, tire rotations, and brake inspections. ([#35](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/35))

**2.3.** Assign and display an urgency label of either "Urgent" or "When convenient" for each applicable maintenance recommendation, using documented mileage-based rules. ([#36](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/36))

**2.4.** Display dashboard alerts for services that are overdue or within 500 miles of their recommended due mileage, applying the appropriate urgency label. ([#37](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/37))

**2.5.** Validate vehicle selection, service-history processing, due-mileage calculations, and urgency labels against at least five simulated vehicle-data scenarios, with every scenario producing the expected result. ([#38](https://github.com/TylerWard741/CPSC490-G09-SigmaSquad/issues/38))

## 3. Proposed Approaches

> Describe your proposed approach to solve the problem, specifying how you
> will achieve the stated goals. List some possible strategies.

〈Your approach — **clear and concise**. State the strategy you chose, the
alternatives you considered, and the reasoning that decided between them.
Think of this as the argument, not the manual: a reader should finish this
section understanding *what* you will do and *why that* rather than the
alternatives.〉

**Keep the details out of this section.** Tooling, platforms, frameworks,
DBMS choices, environment setup, diagrams, and the work breakdown all belong
in §4 (Required Environment, Resources, and Planned Activities). If a
sentence here names a version number, a library, or a configuration, it
probably belongs in §4 — leave a pointer instead ("the implementation stack
is detailed in §4").

〈A few paragraphs, or a short list of candidate strategies with one line of
trade-off each. If it runs past a page, you are writing §4.〉

## 4. Required Environment, Resources, and Planned Activities

> Review the required and available resources and environment to complete
> your project. For example, server, platform, software tools, operating
> systems, DBMS, or any required skills.
>
> Describe the expected activities to achieve the stated goals, e.g.,
> software development process.

〈Your environment, resources, and planned activities.〉

**Diagrams belong in this section.** Include at minimum a high-level
architecture diagram and a system (context) diagram; add the ER/EER model and
a data-flow diagram where they help the reader understand what you are
building and what it depends on. Draw them with any graphical tool
(Lucidchart, draw.io, Miro, Mermaid, ERDPlus, Figma), keep the authoritative
copies in `docs/design/` with both editable source and exported image, and
reference them here.

〈Number every figure, caption it, and point at it from the prose — "Figure 1
shows the three deployment tiers and the trust boundary between them." A
figure the text never mentions is decoration. See `docs/design/DIAGRAMS.md`
for tools, conventions, and the rule that every box and arrow must be
verified against reality.〉

### Specification and design documents

**Every specification and design document the team writes is listed here**
with the objective it serves. This section is the index of the project's
technical detail: §3 holds the argument, §4 holds the documents that make it
buildable. CI gate G9 fails if a document exists in `docs/specs/` or
`docs/design/` that this section does not link.

| Document | Kind | Covers | Issues |
|---|---|---|---|
| 〈docs/specs/account-management.md〉 | specification | 〈account management requirements〉 | 〈#n, #n〉 |
| 〈docs/design/architecture.md〉 | design | 〈system architecture + data model〉 | 〈#n〉 |

〈The scaffold ships `docs/specs/example-spec.md` and
`docs/design/example-design.md` as worked examples — read them, then delete
them once you have your own, and list yours here.〉

〈Replace these rows with your own. Each document names its epic and stories
in its own first lines too (gate G2), so the trail runs both ways.〉

### Planned activities — the work items

The goals and objectives live in §2 as epics and user stories. **This section
links every *other* work item: features, enhancements, bugs, tasks, and
sub-tasks** — the concrete activities that deliver those objectives. CI gate
G8 fails if such an issue exists that this section does not link.

| Issue | Type | Activity | Parent | Owner | Sprint |
|---|---|---|---|---|---|
| #5 | Task | Write proposal section 2 Goals and Objectives | -- | @Mathieu2303 | Sprint 1 |
| #6 | Task | Write proposal section 1.1 Related Work as a comparative table plus argument | -- | @TamtungOS | Sprint 1 |
| #7 | Task | Write proposal section 1.2 Problem Statements (P1..Pn) mapped to the goals | -- | @emilyvlsco | Sprint 1 |
| #8 | Task | Rework proposal Abstract and Introduction to match the skeleton and fix known problems | -- | @ready2pullallnighters | Sprint 1 |
| #9 | Task | Fix proposal section 7 AI Usage and section 8 References | -- | @TamtungOS | Sprint 1 |
| #10 | Task | Fill proposal.md header fields and list every Sprint 1 issue in section 4 | -- | @ready2pullallnighters | Sprint 1 |
| #11 | Task | Replace develop's template README with the real project README | -- | @Mathieu2303 | Sprint 1 |
| #12 | Task | Review and merge the instructor's open PRs #2 and #4 into develop | -- | @emilyvlsco | Sprint 1 |
| #13 | Task | Fill docs/development-plan.md (team charter, QA rotation, AI rules, risk register) | -- | -- | Sprint 1 |
| #14 | Task | Add the three board views and put every issue on the project board | -- | @TylerWard741 | Sprint 1 |
| #15 | Task | Write the Sprint 1 review (docs/sprint-reviews/sprint-1.md) at the sprint boundary | -- | @TylerWard741 | Sprint 1 |
| #19 | Task | Write the initial HW4 proposal draft and archive it in the repo for the team to refine | -- | @TylerWard741 | Sprint 1 |

## 5. Project Outcomes

> Describe the outcomes or deliverables, e.g., final project report, user
> manuals, source code, data or database files, etc.
>
> Note: the deliverables always include the team GitHub repository, which
> must already contain prototype v0 (a thin end-to-end proof-of-concept,
> however small, running when this proposal is submitted). Briefly describe
> what your v0 demonstrates and how to run it.

〈**One or two paragraphs** explaining the project outcome overall — what will
exist when the project is finished, and what it will let someone do. Keep it
prose, not a checklist; name the deliverables inside the paragraphs, and say
briefly what prototype v0 demonstrates today and how to run it.〉

## 6. Project Timeline

> Identifies tasks (project objectives) to be performed, milestones to be
> met, and the estimated number of hours for each task.

〈**This is the plan for CPSC 491 next semester — the implementation timeline,
not this semester's proposal work.** Identify the tasks (your objectives from
§2), the milestones, and the estimated hours for each, in the order they will
be built. State the assumptions it rests on (sponsor availability, data
access, hardware).〉

| Task (objective) | Milestone | Owner | Est. hours | Spring phase |
|---|---|---|---|---|
| 〈…〉 | 〈…〉 | 〈…〉 | 〈…〉 | 〈…〉 |
| 〈…〉 | 〈…〉 | 〈…〉 | 〈…〉 | 〈…〉 |

〈Do **not** put this fall's four proposal sprints here — those live on the
project board and in `docs/sprint-reviews/`. This section answers "how does
the system actually get built next semester?"〉

## 7. AI Usage

AI tools were used in the proposal. Requirements were dictated by voice-to-text on iPhone using the Apple Notes application, which was copied then pasted into Claude Code. Claude highlighted worthwhile quotes of things relevant to the proposal, and sorted them under the template headings. Claude made two word corrections, changing "rotors" to “disc brakes,” and changed "avoided" to “voided”. Claude was not responsible for writing any other text in the proposal. Claude was also used for research on competitor apps. Its work was independently checked with human research on competitors from the given sources.

Additionally, after writing the original proposal draft, Grammarly was used to verify grammar while Claude was used to verify proper citations were used in writing. For example, when referencing GarageHub's feature set including its receipt importing and platform support, Claude was used to cross-check if our initial citations of [9], [13], and [14] were accurate. If we had to assign a percentage of the work done on this assignment to AI, it would be 10%.

ChatGPT was used to review grammar and clarity in Section 1.2, and to verify that the problem statements aligned with the project goals.  The problem statements were not generated by AI.

## 8. References

[1] CARFAX. CARFAX Car Care (website and FAQ). https://www.carfax.com/Service/ (accessed Oct. 4, 2026).

[2] CARFAX. CARFAX Car Care (App Store listing). https://apps.apple.com/us/app/carfax-car-care/id552472249 (accessed Oct. 4, 2026).

[3] CARFAX. CARFAX Car Care (Google Play listing). https://play.google.com/store/apps/details?id=com.carfax.mycarfax (accessed Oct. 4, 2026).

[4] Drivvo. Drivvo: vehicle and fleet management. https://www.drivvo.com/en (accessed Oct. 4, 2026).

[5] Drivvo. Drivvo - Car Expense Tracker (App Store listing). https://apps.apple.com/us/app/drivvo-car-expense-tracker/id1206041425 (accessed Oct. 4, 2026).

[6] Simply Auto. Simply Auto: Car maintenance and mileage tracker. https://simplyauto.app/ (accessed Oct. 4, 2026).

[7] Simply Auto. Simply Auto: Mileage Tracker (App Store listing). https://apps.apple.com/us/app/simply-auto-mileage-tracker/id893278325 (accessed Oct. 4, 2026).

[8] Simply Auto. Simply Auto: Car Maintenance (Google Play listing). https://play.google.com/store/apps/details?id=mrigapps.andriod.fuelcons (accessed Oct. 4, 2026).

[9] GarageHub. GarageHub (home page). https://getgaragehub.com/ (accessed Oct. 4, 2026).

[10] GarageHub. Pricing. https://getgaragehub.com/pricing (accessed Oct. 4, 2026).

[11] GarageHub. Best Car Maintenance Apps 2026: 6 Compared. https://getgaragehub.com/learn/guides/best-car-maintenance-apps/ (accessed Oct. 4, 2026).

[12] MECH AI. MECH AI (home, features, and pricing pages). https://mechai.app/ (accessed Oct. 4, 2026).

[13] GarageHub. History Import. https://getgaragehub.com/features/history-import/ (accessed Oct. 9, 2026).

[14] GarageHub. Car Maintenance Reminders. https://getgaragehub.com/features/maintenance-reminders/ (accessed Oct. 9, 2026).
