# Project Proposal — 〈Project Title〉

**Department of Computer Science**
**CPSC 490 Undergraduate Seminar in Computer Science — Proposal for Capstone Project**

**Group 〈N〉 — 〈Group Name〉** · Sponsor: 〈RTX-3 / EL-1 / SNX-n / independent〉
Authors: 〈Last, First (GitHub username)〉, 〈…〉
Date: 〈YYYY-MM-DD〉

> **This file is the proposal document, not a README.** Its section numbers,
> titles, and guidance are copied from the course Word template, so it
> converts cleanly for Canvas submission. Write continuous academic prose —
> no task lists, no emoji, no repo jargon.
>
> Each section below opens with the template's own guidance in a quote block.
> **Delete the quote blocks and every 〈bracket〉 before submitting.**
>
> **Getting this into the Word template for Canvas.** The template numbers
> its headings **automatically** (a multilevel list: top-level sections at
> level 1, *Related Work* and *Problem Statements* at level 2). The numbers
> typed below exist so the repo copy is readable and checkable — so when you
> move the text into Word, do not end up with both sets.
>
> The reliable route, and the one most teams should use: **open the course
> template and paste your prose section by section**, leaving Word's own
> numbering to do the numbering. Ten minutes, no surprises.
>
> If you prefer to convert, `pandoc` can do it (install with
> `winget install pandoc`):
>
>     pandoc proposal/proposal.md -o proposal.docx --reference-doc="CPSC 490 Project Proposal Template Fall 2026.docx"
>
> Then in Word: delete the typed `0.` / `1.` / `1.1` prefixes (Word re-adds
> them from the list), and set *Related Work* and *Problem Statements* to the
> template's level-2 heading so they number as 1.1 and 1.2. Check figure
> placement, then submit.
>
> **Formatting requirements — the submitted Word document is graded against
> these, explicitly:**
>
> - **Cover page: use the template's cover page, unchanged in layout.** Fill
>   in only its fields — project title, group number and name, sponsor,
>   authors, date — and keep the template's own placement, fonts and spacing
>   for it. The header block at the top of this file carries the same fields
>   so the paste is a transcription, not a redesign.
> - **Font: Times New Roman, 11-point.** Body text, headings and captions
>   take their size and style from the template's own styles — do not
>   restyle anything by hand.
> - **Line spacing: 1.5.** **Margins: 1.0 inch** on all four sides.
> - **Section format, numbering and indentation must match the Word template
>   exactly** — the multilevel-list numbering, heading levels, and paragraph
>   indentation are the template's, not yours. If your document's §1.1 looks
>   different from the template's §1.1, fix yours.
> - **Length: the Final Project Proposal Paper (due Sun Dec 20) must exceed
>   50 pages** under exactly this formatting — font, spacing and margins are
>   fixed above precisely so page count means the same thing for every team.
>   The Preview paper (due Sun Nov 29) is the same document part-way; it has
>   no minimum, but it is graded on the same formatting.
>
> A paste into the template inherits all of this automatically **if you paste
> as text and let Word's styles apply** (Home → Paste → *Keep Text Only*, or
> apply the template's styles after pasting). A pandoc conversion with
> `--reference-doc` inherits it too — but verify font, spacing and margins
> afterward rather than assuming.
>
> Either way, keep this Markdown copy current — it is what peer review and CI
> can actually read. If your team writes in Word instead, commit the `.docx`
> here as well.

---

## 0. Abstract

## 1. Introduction

Background for a non-car person:
With every vehicle, there are slightly different mechanical configurations to the chassis to the engine and everything in between, like the transmission and the drive shaft and the ways that the wheels are connected and the different types of transmission and different types of brakes, like drums versus disc brakes. Every vehicle has a different configuration, and different configurations like this require different care instructions.
In the automotive world, there are several different companies who manufacture different lines of vehicles. These are referred to as manufacturers. When we discuss vehicles, and we reference who made them, we might refer to it as the “make“. When a manufacturer creates a vehicle, they create a specific “model“. For example, many people know the Toyota Prius. In that case, Toyota is the manufacturer and Prius is the name of the model.
If a manufacturer has a lot of success with a certain model, they will usually reproduce it again on some kind of interval, possibly yearly. Each year, the model is updated slightly with new features and improvements. Even with the same model of vehicle from the same manufacturer, differing year productions of it will require different regular maintenance and service from that of its other year models.
The manufacturers lay this all out clearly and specifically in a booklet that always comes with a new vehicle that is called the drivers manual or owner’s manual. The information contained in the manuals goes over a wide range of topics, and one of the topics includes suggested regular maintenance. It usually gives a list or table showing the different services that the vehicle needs and it gives you a number of how many miles the vehicle will need to have its service done after. It might recommend that an oil or oil filter change for a vehicle is done every 3000 miles. The user is expected to perform that service on the vehicle at or before that mileage interval in order to keep the vehicle in proper working order.
The vehicle maintenance logger is an idea for a web app and/or mobile apps that serves as a sort of journal and reminder and logger for an individuals vehicle maintenance.
One of the team member’s current vehicle, a 2010 Chevy Silverado, was sold to him by his grandparents. They were the original owners and from the day they bought the truck, they saved a record of basically everything regarding the truck throughout its life. Every oil change, new tires, damage repair, transmission fluid replacement, etc., everything was all saved.
It was plastic tote bin full of many papers. There are plenty of 8 1/2×11 sized papers, small receipts, pamphlets, the owners manual, other pink and yellow receipt type papers that are odd sizes, all sorts of documents. This is very useful information to have as the buyer of the vehicle, but the amount of documentation is overwhelming. It would take a lot of dedication to sit down and read through it and use it to determine what sort of service to do next on the vehicle and at what mileage. An app that can process these records with minimal human overhead can save a lot of time.
Not having the information to make the appropriate judgment on the vehicle has its consequences. The Chevy’s entire transmission had to be replaced because the fluid was so incredibly bad. If I had transmission fluid check done and flushed way earlier, then I would've saved myself plenty of money on that transmission replacement.
Why this matters:
**Q28** If one does not change their tires before the tread gets too shallow, they run the risk of losing traction while driving and can end up injuring themselves and other people. If one does not replace their brake pads before they wear too thin, they will lose their stopping power and run the risk of injuring themselves and other people. These sorts of things are more serious and should be taken more seriously.
**Q31** Anything that gets skipped causes the vehicle to deteriorate in a way that it is not supposed to if the owner had been following the proper maintenance and that deterioration of the vehicle will result in reduction to their safety and their passengers safety, and the safety of other drivers around them, the resale value of the vehicle will go down because people want to buy vehicle vehicles in good condition and will not pay as much for a vehicle and worse condition, and warranties may be voided if regular maintenance that is advised by the manufacturer is not kept up with by the owner.
**Q13** This would be valuable for so many people because the average person does not keep up with all the regular recommended services of their vehicles to begin with. It's hassle some to keep track of and people don't want to consult the user manual that their car came with to determine which service is needed that which mileage and then keep track of which services they have done and they do not have have any will or desire to memorize the mileage, unless there was a convenient app that did it for them.

### 1.1 Related Work
CARFAX, Drivvo, Simply Auto, GarageHub, and MECH AI already exist in this space. They do a lot really well, including showing a vehicle vehicles maintenance schedule from its VIN, track, fuel, expenses, and cost per mile, reminders and alerts for maintenance, services for vehicle fleets, cross platform functionality between Web, iOS, and android, the ability to capture receipts and import or export CSV files, log trips automatically by GPS or Bluetooth, AI assistance that reads users’ vehicle records before answering, and charts and graphs to track these things.
After looking at Drivvo, I'm really concerned. They have a web version in addition to the iOS and Android apps. They even have a version for managing fleets of vehicles. They have so many good features. It seems like they beat me to the finish line a long time ago. Hopefully we can still find a way to exist in this space, unless it would just be best to move on to a different project idea entirely, but I hope we don't have to do that.
It seems that Simply Auto doesn't have a web browser version but only the mobile apps. Their UI isn't as modern and nice as Drivvo's. Their iOS app hasn't received an update since March 24 2022. Their Android app hasn't received an update since October 10, 2024.
Of the competitors, GarageHub seems most in line with what I want to create, but I also like the features of Mech AI that I'm seeing, as well as all the foundational stuff that Drivvo offers. Our creation will ideally be a blend of the best parts of these apps, while improving on their weak points.
What’s different:
**Q34** One possible critique is that a calendar or reminder app is enough to keep track of vehicle maintenance. These solutions involves manual work on the part of the user and attention and focus to not only think to do this in the first place, but then take the action to estimate the dates that they might reach the approximate mileage for the regular maintenance as advised in their owners manual and create the notes on their calendar. A calendar or reminder app or any fixed interval template is not optimal in this situation is because vehicle maintenance depends on several factors, including mileage, in what conditions the owner is driving it, how hard they are accelerating and braking, as well as other unaccounted for environmental factors like poorly paved or damage roads to name one example. Using a date to plan vehicle maintenance is not accurate. Our proposed application will be tailored for tracking one's vehicle's "health" by automatically aggregating vehicle information.
**Q59** Our app is different because it it does all of these things plus more. In addition to offering the features noted above from competitors, it also allows for the bulk ingestion of a pile of old mixed-format paper records, it labels upcoming service as urgent versus when-convenient, it provides a simple to follow, guided tap-through setup, and it does all of this for free and reliably. Additionally, there will be no payment model whatsoever, and no advertisements. Our app will be reliable as well, and will work on time, every time, error-free. Basically, the main selling point of our application is that it has all the features a user could want from these other apps, with an elegant user interface and user experience, it is free and has no hidden pricing at all, and it performs exceptionally well on all devices, and will be supported by its developers far into the future.

〈Your survey. Cite with bracketed numbers matching §8 — every reference must
be a source your team has actually read.〉


### 1.2 Problem Statements

> Briefly state the problem to solve in this project.

A user should be able to specify their vehicle make, model, year, and trim level. They will be able to import their service history, and the application will use a combination of logic, rules and AI to provide the user with a list of upcoming services that the vehicle needs done and at what mileages. The second goal is to implement other features like automatic mileage tracking, DIY maintenance help, a parts finder, and climate-based recommendations. A complete app should be able to import any vehicle's service records and receive the correct recommendations of services the vehicle needs next.
Vehicle owners want their vehicles to last in good health for as long as possible. They want to avoid spending money on unnecessary repairs. To make that happen, they need to preemptively take action to maintain their vehicle by keeping up with its regular service needs as specified by its manufacturer. Missing maintenance can lead to expensive repairs, increased safety risks, diminished resale value, and can potentially cause warranty problems. Existing tools offer great solutions, but our application aims to provide users with a solution that is leagues better than the rest.
The thing that matters most to a driver is reliability. They want the app to work, no matter what they're doing in it every time without having to worry that it won't work. That is the biggest thing in my mind regarding what we are creating here. We need to be open and transparent and accountable and reliable and feature-rich. Having a catch all app that does everything or just a basic AI catch-all chat bot is a non-goal. It has to simply be a great product so that it sells itself, and it has to live up to exactly what it is selling. It should stick to its purpose while not being buggy, poorly optimized, subversive, or manipulative.

## 2. Goals and Objectives

The use of AI tools was used in the proposal. Requirements were dictated by voice on iPhone using the Apple Notes application, which was copied and pasted into Claude Code. Claude highlighted worthwhile quotes of things relevant to the proposal, and sorted them under the template headings. Claude made two word corrections, changing "rotors" to “disc brakes,” and changed "avoided" to “voided”. Claude was not responsible for writing any other text in the proposal. Claude was also used for research on competitor apps. Its work was independently checked with human research on competitors from the given sources. If we had to assign a percentage of the work done on this assignment to AI, it would be 10%.

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
| 〈#n〉 | 〈task〉 | 〈stand up the prototype login endpoint〉 | 〈#story〉 | 〈owner〉 | 〈Sprint 1〉 |
| 〈#n〉 | 〈feature/enhancement/bug/task/sub-task〉 | 〈…〉 | 〈#story〉 | 〈…〉 | 〈…〉 |

〈Replace these rows with your own, and keep the table current as you file new
issues — with §2 it gives a reader every planned activity in one place, each
traceable to the objective it serves.〉

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

> Per the course AI policy (see the syllabus, Use of AI Tools), disclose the
> AI tools used in preparing this proposal and the prototype: which tools,
> for what tasks (e.g., code generation, test writing, debugging,
> diagramming), and approximately what fraction of each artifact was
> AI-assisted.
>
> Reminder: the prose of this proposal must be your own writing. You remain
> fully responsible for the correctness of all AI-assisted work, including
> the prototype code.

The use of AI tools was used in the proposal. Requirements were dictated by voice on iPhone using the Apple Notes application, which was copied and pasted into Claude Code. Claude highlighted worthwhile quotes of things relevant to the proposal, and sorted them under the template headings. Claude made two word corrections, changing "rotors" to “disc brakes,” and changed "avoided" to “voided”. Claude was not responsible for writing any other text in the proposal. Claude was also used for research on competitor apps. Its work was independently checked with human research on competitors from the given sources. If we had to assign a percentage of the work done on this assignment to AI, it would be 10%.

## 8. References

> [1] Burges, C. J. C. Tutorial on Support Vector Machines for Pattern
> Recognition. Kluwer Academic Publishers, 1998.
> [2] Chen, P., Fan, R., and Lin, C. A study on SMO-type decomposition
> methods for support vector machines. IEEE Transactions on Neural Networks,
> 2006.
> [3] For Wikipedia, specify the URL here
> [4] For a web source, specify the URL here plus date accessed

〈Number references in the order first cited and cite them in the text as
[1], [2]. Every entry must be a source a team member has actually read and
can produce on request.〉
