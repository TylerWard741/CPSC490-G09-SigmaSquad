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

The primary purpose of abstract is to help the reader understand the main message of current document (proposal in this case) without reading the entire document. Therefore an abstract should include at least one or two paragraph of background (or motivation) information for the project, a brief description of the problem you are trying to solve in this proposal,  a proposed ideas or solutions, the significance of your proposed idea elaborating why the proposed idea is non-trivial, significant, or beneficial in one or two paragraphs, the project goals and outcomes in one paragraph, and a brief description of what you will discuss in this proposal, giving a brief outline of this document in 1-2 sentences in one paragraph. Abstract should not exceed one page. Any abstract exceeded one-page limit must be shortened.

**Q9** (Msg 6)The idea came from something I wanted to create to solve my own problem. My current vehicle, a 2010 Chevy Silverado, was sold to me by my grandparents. They were the original owners. From the day they bought the truck, they saved a record of basically everything regarding the truck throughout its life before selling it to me. Every oil change, new tires, damage repair, transmission fluid replacement, etc., everything was all saved.
**Q10** (Msg 6)They gave it to me when I bought the truck from them. It was a plastic tote bin full of so many papers. There are plenty of 8 1/2 x 11 sized papers, small receipts, pamphlets, the owners manual, other pink and yellow receipt type papers that are odd sizes, all sorts of documents. This is very useful information to have as the buyer of the vehicle, but it is a little overwhelming at first. I never got around to actually looking through it and using it to determine what sort of service I should do next on the vehicle and at what mileage. There's just too much to go through and it is all from different places laid out in different ways in different formats.
**Q13** (Msg 6)I think this would be valuable for so many people because I think the average person doesn't really keep up with all the regular recommended services of their vehicles to begin with probably for the same reasons because it's hassle some to keep track of and people don't want to consult the user manual that their car came with to determine which service is needed that which mileage and then keep track of which services they have done and they probably don't have any will or desire to memorize the mileage that they need to do the next thing and they aren't going to pay attention to it and they're probably not going to note it down unless it's super easy like this app.

The Problem:
**Q64** (Round 4, prompt 6) *Problem Statements; Intro*Vehicle owners want their vehicles to last in good health for as long as possible. They want to avoid spending money on unnecessary repairs. To make that happen, they need to preemptively take action to maintain their vehicle by keeping up with its regular service needs as specified by its manufacturer. Missing maintenance can lead to expensive repairs, increased safety risks, diminished resale value, and can potentially cause warranty problems. Existing tools offer great solutions, but our application aims to provide users with a solution that is leagues better than the rest.

Our Solution:
**Q8** (Msg 6) *also fits Abstract*The vehicle maintenance logger is an idea for a web app and/or mobile apps that serves as a sort of journal and reminder and logger for an individuals vehicle maintenance.
**Q63** (Round 4, prompt 5) *Abstract: solution; Approaches*In version one, the AI will determine what service is due next for a user's vehicle based on its exact make, model, year, and even trim in addition to its maintenance history. It may also read scanned records. It will not however, act as a general chat bot or an LLM with a custom prompt and fancy wrapper. It will use a combination of logic based rules and AI judgment to conclude which services are due next. It will be free for all users from the beginning.

Why it’s significant and non-trivial:
**Q60** (Round 4, prompt 2) *Abstract: significance and why it is non-trivial*There are several reasons why our application is not trivial. Someone may ask why a calendar or reminder app isn't sufficient for solving the problem in question. The reason why a calendar or reminder app or any fixed interval template isn't optimal in this situation is because vehicle maintenance depends on several factors, including mileage, in what conditions the owner is driving it, how hard they are accelerating and braking, as well as other unaccounted for environmental factors like poorly paved or damage roads to name one example. Service schedules also differ by vehicle and year. Each new version of a manufacturers vehicle model will have some differences than previous years' iterations. A correct suggestion or assumption about what service is due next relies on multiple factors as stated, as opposed to estimating a day on a calendar when service might need to be done. This allows users to take action with preventative maintenance, sparing their vehicle any damage caused by negligence. Determining the correct "due next" service relies on three things: the right service schedule, the real service history, and the vehicle's current mileage. A wrong "due next" answer has real costs, in that a missed or late service can end up damaging the vehicle and hurting the owner's wallet when repairs need to be made. Finally, a dedicated application such as ours will make it faster and easier and more accessible for vehicle owners to keep track of their vehicles' maintenance needs and history as opposed to an app that is trivial like a calendar or reminders or notepad.

Goals and Outcomes:
**Q65** (Round 4, prompt 7) *Abstract: goals; Goals and Objectives*By the end of CPSC491, a user will be able to specify their vehicle make, model, year, and trim level, they will be able to import their service history, and the application will use a combination of logic, rules and AI to provide the user with a list of upcoming services that the vehicle needs done and at what mileages. The second goal is to implement other features like automatic mileage tracking, DIY maintenance help, a parts finder, and climate-based recommendations. I'll know it works when I'm able to use the app to import any vehicle's service records and receive the correct recommendations of services the vehicle needs next.
**Q57** (Response.txt) *Abstract: goals; Goals and Objectives*For the scope of version one, I'd like to go with exactly what you suggested. The first version of our app should cover, selecting a vehicle, entering its history, getting a correct "due next" answer with a mileage, and urgency-tier labels as in "urgent" versus "when convenient".

## 1. Introduction

> Describe the necessary background on the project field to help the reader
> understand the field. Assume the reader has B.S. degree in computer science
> but not necessary knowledgeable in the selected area. You may also briefly
> describe motivation of the project if any.
>
> Specify the problem identified and to be solved in this project, the
> importance or usefulness of the problem solving or project. Further
> describes what makes your proposal different from existing ones.

Background for a non-car person:
With every vehicle, there are slightly different mechanical configurations to the chassis to the engine and everything in between, like the transmission and the drive shaft and the ways that the wheels are connected and the different types of transmission and different types of brakes, like drums versus [disc brakes], and all sorts of different things like this that require different care instructions, basically for every different vehicle.
In the auto world, there are several different companies who manufacture different lines of vehicles. These are referred to as manufacturers. When we discuss vehicles, and we reference who made them, we might refer to it as the “make“. When a manufacturer creates a vehicle, they create a specific “model“. For example, many people know the Toyota Prius. In that case, Toyota is the manufacturer and Prius is the name of the model.
If a manufacturer has a lot of success with a certain model, they’ll usually reproduce it again on some kind of interval, possibly yearly. Each year, the model is updated slightly with new features and improvements. Even with the same model of vehicle from the same manufacturer, differing year productions of it will require different regular maintenance and service from that of its other year models.
The manufacturers lay this all out clearly and specifically in a booklet that always comes with a new vehicle that is called the drivers manual or owner’s manual. The information contained in the manuals goes over a wide range of topics, and one of the topics includes suggested regular maintenance. It usually gives a list or table showing the different services that the vehicle needs and it gives you a number of how many miles the vehicle will need to have its service done after. For example, it might recommend that an oil change for a vehicle is done every 3000 miles. The owner of the vehicle is then expected to change the oil and filter, which I forgot to mention, but the oil filter is also mentioned as well as all sorts of other things, but the user is expected to perform that service on the vehicle at or before that mileage interval in order to keep the vehicle in proper working order.
What this project is and where the idea came from:
**Q8** (Msg 6) *also fits Abstract*The vehicle maintenance logger is an idea for a web app and/or mobile apps that serves as a sort of journal and reminder and logger for an individuals vehicle maintenance.
**Q9** (Msg 6)The idea came from something I wanted to create to solve my own problem. My current vehicle, a 2010 Chevy Silverado, was sold to me by my grandparents. They were the original owners. From the day they bought the truck, they saved a record of basically everything regarding the truck throughout its life before selling it to me. Every oil change, new tires, damage repair, transmission fluid replacement, etc., everything was all saved.
**Q11** (Msg 6)For example, I had to replace the entire transmission because the fluid was so incredibly bad and if I had done a transmission fluid check and flush way earlier, then I would've saved myself plenty of money on that transmission replacement.
Why this matters:
**Q28** (Msg 7)If one doesn't change their tires before the tread gets too shallow, they run the risk of losing traction while driving and can end up injuring themselves and other people. If one doesn't replace their brake pads before they wear too thin, they will lose their stopping power and run the risk of injuring themselves and other people. These sorts of things are more serious and should be taken more seriously.
**Q31** (Msg 7)[…] basically anything that gets skipped causes the vehicle to deteriorate in a way that it is not supposed to if the owner had been following the proper maintenance and that deterioration of the vehicle will result in reduction to their safety and their passengers safety, and the safety of other drivers around them, the resale value of the vehicle will go down because people want to buy vehicle vehicles in good condition and will not pay as much for a vehicle and worse condition, and warranties may be [voided] if regular maintenance that is advised by the manufacturer is not kept up with by the owner.
**Q13** (Msg 6)I think this would be valuable for so many people because I think the average person doesn't really keep up with all the regular recommended services of their vehicles to begin with probably for the same reasons because it's hassle some to keep track of and people don't want to consult the user manual that their car came with to determine which service is needed that which mileage and then keep track of which services they have done and they probably don't have any will or desire to memorize the mileage that they need to do the next thing and they aren't going to pay attention to it and they're probably not going to note it down unless it's super easy like this app.
The problem statement:
**Q64** (Round 4, prompt 6) *Problem Statements; Intro*Vehicle owners want their vehicles to last in good health for as long as possible. They want to avoid spending money on unnecessary repairs. To make that happen, they need to preemptively take action to maintain their vehicle by keeping up with its regular service needs as specified by its manufacturer. Missing maintenance can lead to expensive repairs, increased safety risks, diminished resale value, and can potentially cause warranty problems. Existing tools offer great solutions, but our application aims to provide users with a solution that is leagues better than the rest.
Existing tools:
**Q45** (Response.txt) *Intro: motivation / what exists*After looking at Drivvo, I'm really concerned. They have a web version in addition to the iOS and Android apps. They even have a version for managing fleets of vehicles. They have so many good features. It seems like they beat me to the finish line a long time ago. Hopefully we can still find a way to exist in this space, unless it would just be best to move on to a different project idea entirely, but I hope we don't have to do that.
**Q46** (Response.txt) *Related Work*It seems that Simply Auto doesn't have a web browser version but only the mobile apps. Their UI isn't as modern and nice as Drivvo's. Their iOS app hasn't received an update since March 24 2022. Their Android app hasn't received an update since October 10, 2024.
**Q59** (Round 4, prompt 1) *Intro: what's different; Abstract: solution and significance*CARFAX, Drivvo, Simply Auto, GarageHub, and MECH AI already exist in this space. They do a lot really well, including showing a vehicle vehicles maintenance schedule from its VIN, track, fuel, expenses, and cost per mile, reminders and alerts for maintenance, services for vehicle fleets, cross platform functionality between Web, iOS, and android, the ability to capture receipts and import or export CSV files, log trips automatically by GPS or Bluetooth, AI assistance that Reed users vehicle records before answering, and charts and graphs to track these things. Our app is different because it it does all of these things plus more. It will be incredibly feature-rich. In addition to offering the features noted above from competitors, it also allows for the bulk ingestion of a pile of old mixed-format paper records, it labels upcoming service as urgent versus when-convenient, it provides a simple to follow, guided tap-through setup, and it does all of this for free and reliably. Additionally, there will be no payment model whatsoever, and no advertisements. Our app will be reliable as well, and will work on time, every time, error-free. Basically, the main selling point of our application is that it has all the features a user could want from these other apps, with an elegant user interface and user experience, it is free and has no hidden pricing at all, and it performs exceptionally well on all devices, and will be supported by its developers far into the future.
What’s different:
**Q34** (Msg 7) *also fits Abstract (significance and non-triviality)*To critique the idea, someone might ask why this isn't just a calendar reminder. Why don't we just use the calendar applications that we already have to log reminders about upcoming maintenance? There are many problems with this. For one, it requires manual work on the part of the user and attention and focus to not only think to do this in the first place, but then take the action to estimate the dates that they might reach the approximate mileage for the regular maintenance as advised in their owners manual and create the notes on their calendar. This sort of information just also doesn't belong on a calendar in the first place because it is not based on dates, but mileage, which can change depending on all sorts of factors and using a date to plan vehicle maintenance is not accurate. It would be far easier to have one application specific for tracking one's vehicle's "health" essentially.
**Q60** (Round 4, prompt 2) *Abstract: significance and why it is non-trivial*There are several reasons why our application is not trivial. Someone may ask why a calendar or reminder app isn't sufficient for solving the problem in question. The reason why a calendar or reminder app or any fixed interval template isn't optimal in this situation is because vehicle maintenance depends on several factors, including mileage, in what conditions the owner is driving it, how hard they are accelerating and braking, as well as other unaccounted for environmental factors like poorly paved or damage roads to name one example. Service schedules also differ by vehicle and year. Each new version of a manufacturers vehicle model will have some differences than previous years' iterations. A correct suggestion or assumption about what service is due next relies on multiple factors as stated, as opposed to estimating a day on a calendar when service might need to be done. This allows users to take action with preventative maintenance, sparing their vehicle any damage caused by negligence. Determining the correct "due next" service relies on three things: the right service schedule, the real service history, and the vehicle's current mileage. A wrong "due next" answer has real costs, in that a missed or late service can end up damaging the vehicle and hurting the owner's wallet when repairs need to be made. Finally, a dedicated application such as ours will make it faster and easier and more accessible for vehicle owners to keep track of their vehicles' maintenance needs and history as opposed to an app that is trivial like a calendar or reminders or notepad.
**Q59** (Round 4, prompt 1) *Intro: what's different; Abstract: solution and significance*CARFAX, Drivvo, Simply Auto, GarageHub, and MECH AI already exist in this space. They do a lot really well, including showing a vehicle vehicles maintenance schedule from its VIN, track, fuel, expenses, and cost per mile, reminders and alerts for maintenance, services for vehicle fleets, cross platform functionality between Web, iOS, and android, the ability to capture receipts and import or export CSV files, log trips automatically by GPS or Bluetooth, AI assistance that Reed users vehicle records before answering, and charts and graphs to track these things. Our app is different because it it does all of these things plus more. It will be incredibly feature-rich. In addition to offering the features noted above from competitors, it also allows for the bulk ingestion of a pile of old mixed-format paper records, it labels upcoming service as urgent versus when-convenient, it provides a simple to follow, guided tap-through setup, and it does all of this for free and reliably. Additionally, there will be no payment model whatsoever, and no advertisements. Our app will be reliable as well, and will work on time, every time, error-free. Basically, the main selling point of our application is that it has all the features a user could want from these other apps, with an elegant user interface and user experience, it is free and has no hidden pricing at all, and it performs exceptionally well on all devices, and will be supported by its developers far into the future.
**Q56** (Response.txt) *Intro: what's different; Goals*Of all the problems you found, I would say the thing that matters most to a driver is reliability. They want the app to work, no matter what they're doing in it every time without having to worry that it won't work. That is the biggest thing in my mind regarding what we are creating here. We need to be open and transparent and accountable and reliable and feature-rich, but not so rich that it becomes overwhelming or just a basic AI catch-all chat bot, or on the other hand, simply an LLM with a custom prompt and fancy wrapper. It has to simply be a great product so that it sells itself, and it has to live up to exactly what it is selling. Basically it has to do exactly what it is said to do and not be buggy or poorly optimized or subversive and manipulative, and trying to siphon money out of users, etc.
**Q47** (Response.txt) *Intro: what's different*I think from all of these, GarageHub seems most in line with what I want to create, but I also like the features of Mech AI that I'm seeing, as well as all the foundational stuff that Drivvo offers. I'd love for our own creation to be a blend of basically all the best parts of these apps and improvements on all of their weak points and elimination of things that users have complained about and might complain about looking forward.

### 1.1 Related Work

> Describe the related or existing work in detail. This section is like a
> survey on the selected problem or topic.

〈Your survey. Cite with bracketed numbers matching §8 — every reference must
be a source your team has actually read.〉

**Do a comparative analysis, not a list of summaries.** Find the existing
ideas, products, papers, or tools that attack the same problem and compare
them against each other on the dimensions that matter for your project, with
honest pros and cons. Then say plainly what your project does differently and
why that difference is worth the effort.

| Existing approach | What it does | Pros | Cons | Why ours differs |
|---|---|---|---|---|
| 〈product / paper [1]〉 | 〈…〉 | 〈…〉 | 〈…〉 | 〈…〉 |
| 〈product / paper [2]〉 | 〈…〉 | 〈…〉 | 〈…〉 | 〈…〉 |
| 〈product / paper [3]〉 | 〈…〉 | 〈…〉 | 〈…〉 | 〈…〉 |

〈Discuss the table in prose — the table is evidence, the paragraph is the
argument. "Nothing like this exists" is almost never true and reads as a
missing survey; if a close competitor exists, say so and explain why you are
still building this.〉

### 1.2 Problem Statements

> Briefly state the problem to solve in this project.

〈Your problem statement(s), **concise** — a few sentences each, no
background (that was §1) and no solution (that is §3). Number them P1, P2, …
so later sections can refer back.〉

**Every problem here must connect to the goals and objectives in §2, and
every goal in §2 must trace back to a problem here.** A goal with no problem
behind it is scope you invented; a problem with no goal is a problem you are
not actually solving. Check both directions before you submit — this mapping
is what the final project report is graded against.

| Problem | Addressed by |
|---|---|
| P1 〈one line〉 | 〈Goal 1 (#n)〉 |
| P2 〈one line〉 | 〈Goal 2 (#n)〉 |

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

- **Goal 1: 〈e.g. Secure account management〉** (Epic #〈n〉)
  - Objective 1.1: 〈Implement member registration and login with hashed
    credentials, session expiry, and rejection of malformed input.〉 (#〈n〉)
  - Objective 1.2: 〈Demonstrate the login round-trip in a runnable prototype
    at the Week-8 in-class check.〉 (#〈n〉)
- **Goal 2: 〈your second goal〉** (Epic #〈n〉)
  - Objective 2.1: 〈Action word + what you will complete + how it will be
    measured〉 (#〈n〉)

〈Replace the brackets with your own 2–3 goals and their objectives, and put
the **real issue numbers** in as you file them — gate G8 checks that every
epic and story in your repository is linked from this section. A fully worked
version of this, with live issues and a populated board, is in the course
example repository.〉

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

**Q62** (Round 4, prompt 4) *AI Usage*Here is how I used Claude to help me with the proposal. I dictated by voice on my iPhone or iPad using the Apple Notes application, I then copied it and pasted it into Claude code, running in terminal on my Windows desktop. Claude highlighted worthwhile quotes of things that I said and sorted them under the template headings, and added flags and questions to them. Claude made two word corrections at my request (it changed "rotors"to `[disc brakes]`, and changed "avoided" to`[voided]`). I checked Claude's work by reading the quotes. It noted to ensure that it stayed true to what I initially said. But also helped me by researching competitors. I checked its work by doing my own research on those same competitors from their sources. No sentences in the proposal were written by AI. If I had to assign a percentage of the work done on this assignment to AI, I'll say it did about 10%.

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
