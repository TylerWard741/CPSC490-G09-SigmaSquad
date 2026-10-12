# HW4 quotes: Vehicle Maintenance Logger proposal (Tyler Ward)

Working file, not a submission. Everything inside a `> Q#` block is Tyler's own words, verbatim (cuts marked […], nothing added or reworded). Everything outside those blocks is Claude's bookkeeping: status, gaps, flags. Move text into the Word template by hand and revise it there.

Scope: HW4 only (cover page, Abstract, Introduction). Due Sun Oct 4, 2026, 11:59 pm, one Word file per team.
Quote IDs run in the order received. "Msg" numbers count Tyler's messages in the 2026-10-02 session that began with "I need help with HW4".

---

## Cover page

Status: no quotes needed. Tyler fills in by hand: project title, proposal date, team name (Sigma Squad), repo URL, five members with emails.

---

## Abstract (max one page)

Write this last. It summarizes the Introduction, so it draws on quotes placed under the sections below. Required paragraphs: background/motivation, the problem, the proposed solution, significance and why it is non-trivial, goals and outcomes, a 1-2 sentence outline of the document.

Status: **closer, but not ready to assemble.** Background and problem: Q8–Q14, Q24–Q31. Proposed solution: Q8, Q16–Q21, Q36–Q38. Significance (why not a calendar): Q34. Goals and outcomes: only the long-term vision in Q35. Missing: measurable goals, the document outline (Abstract's last paragraph, written once the sections exist). Hold the Abstract until the Introduction is settled.

**UPDATE 2026-10-04:** goals (Q41) and AI choice (Q43) are now captured. Still open: the "this semester" answer (what the Sprint 2 prototype shows; Q42 suggests "a correct due-next answer") and the document outline sentence, written last.

Original prompts (partly answered):
1. **Goals.** You asked me to prompt you. Try finishing these sentences aloud, in your own words: "By the end of CPSC 491, a user will be able to ___." "The app will read ___ and tell the user ___." "I'll know it works when ___." Aim for 2-3 big things. Don't worry whether they're ambitious enough; say the first things that come to mind and we'll sort them.
2. **This semester.** The course expects a proposal now, and a working prototype starts in Sprint 2 (the prototype demo is at the end of Sprint 2, early November). For the prototype, which single thing would most convince you the idea works: logging a service and getting a "due next" answer? Scanning one receipt? Something else?
3. **AI choice.** Reading scanned records, deciding what's due, or both is stated as hope in Q36. For the proposal, which one would you commit to first? (Either satisfies the course's AI requirement, as does documented AI-assisted development.)

---

## Introduction

Required content: field background for a reader with a CS B.S. but no domain knowledge; motivation; the problem and why it matters; what makes this different from existing solutions.

Status: **background, motivation, problem, consequences and the "why not a calendar" argument are covered (Q8–Q15, Q24–Q34). Missing: real existing solutions (Q32 is guesswork), what is different, who exactly the problem is for.** Sub-sections below are in a suggested reading order; the order of the Q numbers is the order you spoke them.

### What the project is

> **Q8** (Msg 6) *also fits Abstract*
> The vehicle maintenance logger is an idea for a web app and/or mobile apps that serves as a sort of journal and reminder and logger for an individuals vehicle maintenance.

Flag, **may need rephrasing**: "web app and/or mobile apps" is undecided; the proposal will need to commit to one platform for the prototype. "journal and reminder and logger" repeats the idea three ways. "individuals" needs an apostrophe.

### Background for a reader who isn't a car person

> **Q24** (Msg 7)
> […] with every vehicle, there are slightly different mechanical configurations to the chassis to the engine and everything in between, like the transmission and the drive shaft and the ways that the wheels are connected and the different types of transmission and different types of brakes, like drums versus [disc brakes], and all sorts of different things like this that require different care instructions, basically for every different vehicle.

Flag, **may need rephrasing**: one long list sentence. The opening is cut ("OK, so").
**Correction log (Tyler's instruction, Msg 8):** the spoken words were "drums versus rotors". Tyler confirmed he meant disc brakes and that the rotor is a part of the disc brake. The bracketed words `[disc brakes]` are his stated correction, entered at his request; the original wording is recorded here.

> **Q25** (Msg 7)
> In the auto world, there are several different companies who manufacture different lines of vehicles. These are referred to as manufacturers. When we discuss vehicles, and we reference who made them, we might refer to it as the “make“. When a manufacturer creates a vehicle, they create a specific “model“. For example, many people know the Toyota Prius. In that case, Toyota is the manufacturer and Prius is the name of the model.

Flag, **may need rephrasing**: "the auto world" and "we might refer to it" are spoken. The quotation marks came out as closing marks on both sides (transcription), left unchanged. Good clear definitions of make and model.

> **Q26** (Msg 7)
> If a manufacturer has a lot of success with a certain model, they’ll usually reproduce it again on some kind of interval, possibly yearly. Each year, the model is updated slightly with new features and improvements. Even with the same model of vehicle from the same manufacturer, differing year productions of it will require different regular maintenance and service from that of its other year models.

Flag, **may need rephrasing**: the third sentence is awkward ("differing year productions of it"). You never state the word "model year", which is the standard term for this. The claim that different years need different maintenance is plausible and matters to your design, but it is a factual claim; a source (such as two real manuals for different years) would back it up.

> **Q27** (Msg 7)
> The manufacturers lay this all out clearly and specifically in a booklet that always comes with a new vehicle that is called the drivers manual or owner’s manual. The information contained in the manuals goes over a wide range of topics, and one of the topics includes suggested regular maintenance. It usually gives a list or table showing the different services that the vehicle needs and it gives you a number of how many miles the vehicle will need to have its service done after. For example, it might recommend that an oil change for a vehicle is done every 3000 miles. The owner of the vehicle is then expected to change the oil and filter, which I forgot to mention, but the oil filter is also mentioned as well as all sorts of other things, but the user is expected to perform that service on the vehicle at or before that mileage interval in order to keep the vehicle in proper working order.

Flag, **may need rephrasing**: the last sentence is a run-on with an aside ("which I forgot to mention"). "drivers manual" needs an apostrophe. "the manuals" should be introduced consistently as "owner's manual". **Fact check, resolved by Tyler (Msg 8):** he said every vehicle is different and he used 3000 miles because it is what he does on his own truck; he is not claiming it is the manufacturer's figure. If the sentence stays, "for example, it might recommend" is already hedged; say it is an illustration if you want to avoid any misreading.

### Motivation: the origin

> **Q9** (Msg 6)
> The idea came from something I wanted to create to solve my own problem. My current vehicle, a 2010 Chevy Silverado, was sold to me by my grandparents. They were the original owners. From the day they bought the truck, they saved a record of basically everything regarding the truck throughout its life before selling it to me. Every oil change, new tires, damage repair, transmission fluid replacement, etc., everything was all saved.

Flag, **may need rephrasing**: "everything was all saved" is redundant. Otherwise this is usable as spoken.

> **Q10** (Msg 6)
> They gave it to me when I bought the truck from them. It was a plastic tote bin full of so many papers. There are plenty of 8 1/2 x 11 sized papers, small receipts, pamphlets, the owners manual, other pink and yellow receipt type papers that are odd sizes, all sorts of documents. This is very useful information to have as the buyer of the vehicle, but it is a little overwhelming at first. I never got around to actually looking through it and using it to determine what sort of service I should do next on the vehicle and at what mileage. There's just too much to go through and it is all from different places laid out in different ways in different formats.

Flag, **may need rephrasing**: "there are" should be past tense to match "was". "owners manual" needs an apostrophe. Strong concrete detail; it is the best evidence that records come in many formats.

> **Q11** (Msg 6)
> For example, I had to replace the entire transmission because the fluid was so incredibly bad and if I had done a transmission fluid check and flush way earlier, then I would've saved myself plenty of money on that transmission replacement.

Flag, **may need rephrasing**: "For example" has no preceding claim once pulled out of its paragraph; "so incredibly bad" is informal; "I would've" is a contraction. This is your cost-of-neglect example. Do you know the actual cost? A real figure beats "plenty of money".

> **Q12** (Msg 6)
> Those oil changes are easy for me to track because it's every 3000 miles and I know that it is super important. Of other things that the truck may need at different mileage intervals and other vehicles that people have probably have different services that they need at different mileage as well.

Flag, **may need rephrasing**: the second sentence is grammatically broken ("Of other things… people have probably have"). It is also unclear what point it makes; probably "different vehicles need different services at different mileages". Say it again aloud, cleanly, if you want to keep it.

### The problem, beyond you

> **Q13** (Msg 6)
> I think this would be valuable for so many people because I think the average person doesn't really keep up with all the regular recommended services of their vehicles to begin with probably for the same reasons because it's hassle some to keep track of and people don't want to consult the user manual that their car came with to determine which service is needed that which mileage and then keep track of which services they have done and they probably don't have any will or desire to memorize the mileage that they need to do the next thing and they aren't going to pay attention to it and they're probably not going to note it down unless it's super easy like this app.

Flag, **may need rephrasing**: one 140-word sentence. "that which mileage" is likely a transcription error for "at which mileage" (not changed). "hassle some" is probably "hassle-some"/"hassle". It is a claim about what "the average person" does; as written it is opinion. A grader may ask for support. I can't invent a statistic. If you want a number, say it as your belief ("I believe") or let me find a real source for you to read and cite.

> **Q14** (Msg 6)
> I think even the average person doesn't even do their oil changes regularly. […] Most people neglect these things on their vehicles.

Flag, **may need rephrasing**: unsupported generalization stated as fact. Same note as Q13. Also repeats Q13.

### Consequences of skipped maintenance

> **Q28** (Msg 7)
> If one doesn't change their tires before the tread gets too shallow, they run the risk of losing traction while driving and can end up injuring themselves and other people. If one doesn't replace their brake pads before they wear too thin, they will lose their stopping power and run the risk of injuring themselves and other people. These sorts of things are more serious and should be taken more seriously.

Flag, **may need rephrasing**: the last sentence is circular ("more serious… taken more seriously"). Otherwise a clear, concrete safety argument. The two examples mirror each other, which works.

> **Q29** (Msg 7)
> Something less serious might be one of the fog lights or other such light that is not fully required for safe operation that may go dead because it burned out the filament and if it is not replaced early or immediately after being burned out, it is not as serious. That sort of thing can be repaired when convenient.

Flag, **may need rephrasing**: the first sentence runs on and never finishes cleanly ("if it is not replaced… it is not as serious"). The idea (severity varies, which matters for how an app prioritizes alerts) is valuable: this is a good seed for a "priority levels" feature. A comment: some jurisdictions require working lights, so "when convenient" may need a qualifier.

> **Q30** (Msg 7)
> Aside from brakes and tires, other things that can go wrong. If maintenance isn't performed include damage to the engine if the oil is not replaced regularly, damage to the gearbox if changing gears while the vehicle is in motion or I guess that's not really maintenance but what else, like the transmission fluid needs to be replaced I already mentioned that.

Flag, **may need rephrasing**: broken grammar in the first two sentences (looks like a transcription merge: "other things that can go wrong. If maintenance isn't performed include…"). In the middle you correct yourself ("not really maintenance"). Suggest cutting the gear-changing clause and keeping engine oil and transmission fluid. I have not made that cut; your call.

> **Q31** (Msg 7)
> […] basically anything that gets skipped causes the vehicle to deteriorate in a way that it is not supposed to if the owner had been following the proper maintenance and that deterioration of the vehicle will result in reduction to their safety and their passengers safety, and the safety of other drivers around them, the resale value of the vehicle will go down because people want to buy vehicle vehicles in good condition and will not pay as much for a vehicle and worse condition, and warranties may be [voided] if regular maintenance that is advised by the manufacturer is not kept up with by the owner.

Flag, **may need rephrasing**: one very long sentence with three consequences (safety, resale, warranty). Likely transcription errors, unchanged: "vehicle vehicles", "and worse condition" (probably "in worse condition"), "warranties may be voided".
**Correction log (Msg 8):** the spoken word was "avoided"; Tyler confirmed he meant "voided", entered as `[voided]`.
**Fact check:** the warranty claim is about legal terms. Research is in "Research notes" at the end of this file: the FTC says a dealer cannot refuse warranty coverage just because someone else did the maintenance, so "voided for not doing the recommended maintenance" needs more careful wording or a source. Good structure to turn into three short points.

### Existing solutions (your honest current knowledge)

> **Q32** (Msg 7)
> I'm not sure what existing solutions people use for this. I'm guessing some people may use spreadsheets like Excel or Google sheets, some people might just use their memory, like memorizing the mileage intervals that they need certain maintenance done. Some people might use the Notes app on their phone, some people might use sticky notes. Maybe they will use their actual owners manual and look at it often and make notes in it, I am not sure.

Flag, **may need rephrasing**: this is guesswork, and it says so. A related-work discussion cannot rest on "I'm guessing". The list of informal methods is useful as the "no tool" baseline, but the Introduction needs real apps. I have not researched anything yet. When you want, I'll find real existing products for you to read and judge.

### Who has the problem

> **Q33** (Msg 7)
> […] I would say the people that have that problem most wouldn't be new owners, but possibly used car, buyers or people who own several vehicles. I'm sure that solution that I want to create here would be useful to all those groups of people, including new owners, but the problem specifically of inheriting records and trying to realize what's next or just yeah I guess my app would be useful to everybody.

Flag, **may need rephrasing**: the sentence trails off ("or just yeah I guess"). More importantly, it shows two different problems mixed together: (A) owners who neglect regular maintenance, and (B) owners who inherit a large pile of mixed records. Decide which is the main problem, or state both separately. The end of the quote ("useful to everybody") is the weakest claim and I'd leave it out.

**Tyler's answer to this (Msg 8), which resolves the mix-up:**

> **Q39** (Msg 8) *also fits Abstract*
> […] I'm envisioning is not specifically for people with an old pile of mixed format service records like me, although that may be a tertiary audience. The main audience is anybody with a vehicle that wants to keep it running long and healthy without having to spend unnecessary money on unnecessary repairs, giving them a convenient and efficient and user-friendly way to ensure that they don't miss the regular maintenance that needs to be done on their vehicles and they don't have to actively think about it and remember that it is coming up soon and needs to be done at whatever interval that they need to remember. This app will allow the user to leave most of that remembering and decision-making to our application.

Flag, **may need rephrasing**: the cut at the start leaves a fragment ("I'm envisioning is…"; the original opening sentence was garbled). The middle sentence is very long. "Tertiary audience" implies a primary and a secondary; you named only the main one. This is a strong statement of the target user and the value; it contradicts nothing, but note that Q9–Q10 (your inherited records) is now the *motivating story*, not the main audience.

### Why it isn't just a calendar reminder

> **Q34** (Msg 7) *also fits Abstract (significance and non-triviality)*
> To critique the idea, someone might ask why this isn't just a calendar reminder. Why don't we just use the calendar applications that we already have to log reminders about upcoming maintenance? There are many problems with this. For one, it requires manual work on the part of the user and attention and focus to not only think to do this in the first place, but then take the action to estimate the dates that they might reach the approximate mileage for the regular maintenance as advised in their owners manual and create the notes on their calendar. This sort of information just also doesn't belong on a calendar in the first place because it is not based on dates, but mileage, which can change depending on all sorts of factors and using a date to plan vehicle maintenance is not accurate. It would be far easier to have one application specific for tracking one's vehicle's "health" essentially.

Flag, **may need rephrasing**: "There are many problems with this" promises many and gives two (manual effort; mileage isn't date-based). The second is your strongest argument: maintenance is triggered by mileage, not dates. "owners manual" needs an apostrophe. The long fourth sentence could be split.

### What is different from existing solutions

> **Q40** (Msg 8) *also fits Abstract*
> What our application will do that a simple spreadsheet or notes at can't, is one that it gives the users and elegance and easy to understand interface for seeing where their vehicle is at maintenance wise at a quick glance, two gives them an easy way to import their existing service records, whether physical or digital, three gives them a timeline showing past service going into the future and recommended service in the future so they get a visual helping them understand where they are at in between services, four it will send them notifications about upcoming services that will be due soon, so as to remind them that it needs to be planned for accordingly, five it provides a central/ultimate service history, journal of their vehicle, which could be come useful to them when they decide to sell the vehicle or transfer ownership or whatever else with it where somebody else might want to know the full service history. It will have other features as well that I may be forgetting at the moment or have not thought of yet.

Flag, **may need rephrasing**: this is a spoken numbered list in one sentence; "notes at" is probably "notes app"; "gives the users and elegance and easy to understand" is garbled; "could be come" is a transcription slip; "central/ultimate" needs one word. Your five points (at-a-glance status, import, timeline, notifications, central history) read as five clear differences once separated. **Caution:** the research below shows existing apps already offer several of these (reminders, service history, and in at least one case recall alerts), so claiming "reminders" as new would be inaccurate. Your real difference is likely points 2 and 3 plus the "assistant that decides what is due" idea in Q42.

> **Q42** (Msg 8) *also fits Abstract and Goals*
> The main functionality of the app is not simply importing users' varied-format service record documents. I would like it to do that still, but that is not the main functionality. The main functionality is that the app basically serves as an assistant for the user, ensuring that the vehicle stays healthy and up-to-date on everything it needs without the user having to think too much about it. The app will obviously have to request some things from the user like past service history and details about the vehicle itself, but aside from only the necessary information it will need to collect from the user, it should be pretty autonomous and just be like an assistant to the user.

Flag, **may need rephrasing**: it repeats "main functionality" three times. This is the clearest statement of the product's core (an assistant that tells you what's due), and it answers "why not a calendar" (Q34).

### Motivation: how it became a team project

> **Q15** (Msg 6) *also see Q1*
> This was initially a solo thing I was gonna do, but figured I would pitch it to the team and it seems that this was the idea they liked most of the three that I pitched.

Flag, **may need rephrasing**: "gonna" is informal. Same note as Q1: this is project history, and it is optional in the Introduction.

> **Q1** (Msg 4)
> [Q1 and its flag removed by the author before archiving in the repo.]

Still needed (answer aloud):
**UPDATE 2026-10-04:** items 2 (main problem), 3 (what's different), and 6 (severity) are answered by Q39–Q44. Item 1 is researched (see Research notes): existing apps DO exist, so you need to read them and say, in your words, what they miss. Still open: item 4 (scope), item 5 (the 3000-mile example is resolved; warranty wording is not).

1. **Existing apps.** You asked what I meant. I mean specific products, apps or services a driver could use today to log service and get reminders, such as a phone app, a dealer's reminder service, or a car brand's own app. If you haven't looked, say so; that is a fine answer, and it tells me to research. Do you want me to start that research now? I'd give you a list of real products and a short note on each, and you'd read them and say what's wrong with them in your words.
2. **Pick the main problem.** Is the project mainly about (A) people who forget or skip regular maintenance, or (B) people who have a pile of old, mixed-format records and can't tell what's next? Or both, and if both, which one comes first in the story?
3. **What's different.** In one or two sentences, what will your app do that a spreadsheet or the notes app can't? (Candidates from your ramble: scan old records in, combine the manual and mileage and history to say what's due, mileage-based alerts.)
4. **Scope.** What will this first version not do?
5. **Terminology.** Brake types (see the Q24 flag) and the oil-change interval (see the Q27 flag): are you willing to check them against a real source?
6. **Severity.** Q28–Q29 say some skipped services matter more than others. Do you want the app to treat them differently (urgent vs. when-convenient alerts)? Say so in your words if yes.

---

## Proposed Approaches and design ideas (later sections; not required for HW4)

Status: **rich raw material.** Captured now so nothing is lost. The Abstract's "proposed solution" paragraph and the Introduction's "what makes it different" will draw on these. Q16 is also the origin of the AI idea.

> **Q16** (Msg 6) *also fits Abstract and Introduction*
> Recently, I had the idea of digitalizing all of these documents as PDF files and saving them on my computer and maybe just using something like notebook LM to store it and then use an AI to kind of like tell me what service should be done next based on the current mileage and past service records and I would use that to just make sure that I didn't damage my truck by missing any sort of service.

Flag, **may need rephrasing**: "notebook LM" is the product NotebookLM. "kind of like" and "just" are filler. "all of these documents" has no antecedent once separated from Q10.

> **Q17** (Msg 6)
> What I'm thinking now is, that this could be similar to how I use the TurboTax application on my phone to do my taxes. TurboTax allows me to use the camera on my phone to scan my tax documents and it uses some sort of algorithm or OCR or who knows what, to convert that image from my camera of my tax documents into text filled out on their forms in the application. I'm thinking that maybe we could do something like this in our app to make it easy for users to scan in their vehicle service records.

Flag, **may need rephrasing**: "or who knows what" admits you don't know how TurboTax does it, so don't present its internals as fact. Describe what you observe (photograph a document, fields get filled in) and leave the technique to your own plan. A comparison to a known app is a good device for a reader.

> **Q18** (Msg 6)
> I'm also thinking that users will need to update their mileage in the application every so often so that it knows what the vehicle's current mileage is at and what's needed based on their other service records, as well as the user manual for the vehicle […]

Flag, **may need rephrasing**: sentence is cut in the middle. The next part is in Q19.

> **Q19** (Msg 6)
> […] a user manual for every vehicle should be available somewhere and the application should like ask the user to enter their vehicle information and it should auto populate the user manual if possible if we can find free PDFs of all of these, but it actually might be too much to save them on-prem so maybe there can be a way to link to public copies available on the Internet somewhere? I'm not too sure about how we will get that done, but we need to make sure that we have the user manuals for the vehicles being referenced by our algorithms or AI if we choose to use AI in the application to determine what services are needed for the users vehicle.

Flag, **may need rephrasing**: very long; contains an open question ("I'm not too sure about how we will get that done") that the proposal cannot leave open. "on-prem" is probably not what you mean (you mean stored in our own system/database). Copyright of manuals is also an open issue: the course requires documenting the origin and license of third-party material and getting instructor consent. Do not assume the manuals can be copied.

> **Q20** (Msg 6)
> That brings me to the next point, which is that we will need some sort of way to determine based on the data about the users vehicle, like the regularly recommended services from the user manual, their history of service, and the current mileage, also maybe the type of weather they have been driving through, but that's probably not as important but taking these things into account, we need some sort of logic to determine whether a service is needed soon and then to alert the user. We might want to incorporate AI into this logic. If so, we will need to find a cost-effective way to do it so we don't have to charge users for the app because this would ideally be a free application but we could also use just coding logic instead of AI to determine what the user needs next.

Flag, **may need rephrasing**: one sentence of ~90 words with an unfinished thought ("but that's probably not as important but"). "That brings me to the next point" needs removing out of context. The AI-or-rules decision is yours and is still open; the quote states both options clearly, which is fine for now.

> **Q21** (Msg 6)
> Thinking of other ideas of how to make it better, instead of the users manually entering their mileage in the application every so often then maybe we can somehow get their location data from their phone? Maybe we can somehow use an ODB reader to get the mileage from their vehicle if they have one of those. Back to the basics, though, we could always just make it a manually entered thing where we may be send them a notification every so often like if they haven't entered the mileage in a week we send them a notification on their phone that says they need to enter their mileage and then they do it and then it's logs it and when they get close enough to needing some service, they start getting notifications reminding them about it.

Flag, **may need rephrasing**: "ODB" is almost certainly "OBD" (on-board diagnostics, e.g. OBD-II); I did not change it. "may be send" and "it's logs it" are typos or transcription errors. The three options (location, OBD reader, manual with reminders) are a good structure; the fallback is a clear baseline design.

> **Q22** (Msg 6)
> So, making this a real, public application for anybody and everybody to use, I can start thinking of how to make it more impressive and add more features and not get too ambitious with the scope, but just think about actual useful features to add that people would want in a sort of application like this.

Flag, **may need rephrasing**: about your thinking process, not the product. Use it only if you want a scope statement ("public application, free to use"); that fact is worth stating directly.

> **Q35** (Msg 7) *also fits Abstract (goals and outcomes)*
> By the end of CPSC 491, this project will achieve a fully built and usable publicly available application, whether web based or mobile on android and/or iOS, and it will achieve the original vision of a vehicle maintenance logging/logger with transparent git history.

Flag, **may need rephrasing**: this is a vision, not yet a measurable goal. "Transparent git history" is a process point, not an outcome. The template wants goals plus measurable objectives; that will need another ramble (see questions below). "logging/logger" is a repeated word.

> **Q36** (Msg 7) *also fits AI Usage*
> If we can get the application to use AI to both read, scanned records and decide what to do, that would be awesome. If we can only get one or the other, then that is OK, but let's shoot for the stars. Regarding how we develop it, yes, we will be using AI to develop it.

Flag, **may need rephrasing**: "shoot for the stars" and "awesome" are spoken. Stated as hopeful ("if we can") rather than committed; the proposal will need to state a plan. "decide what to do" is vague (decide what service is due?). The last sentence ("we will be using AI to develop it") is the first clear AI-assisted-development statement and belongs in AI Usage too.

> **Q37** (Msg 7)
> I would like this to eventually result in a mobile app that is available for android users on the Google play store as well as iOS users on the Apple App Store. It might be good to make a Web app version as well. Maybe that will be the better prototype. If we can get a web app that looks good on mobile. That would be even better because there's a thing I like to do on my iPhone where I open webpages in Safari and use the share option to add it to my home screen and then when I open it from the home screen, it acts like an application like a mobile application pretty much and it is a great user experience.

Flag, **may need rephrasing**: "If we can get a web app that looks good on mobile." is a fragment. The Safari home-screen feature is a real, recognizable thing (people often call such sites progressive web apps), which a CS reader will know; mention that name only if you check it first. "pretty much" and "like an application like a mobile application" repeat.

> **Q38** (Msg 7)
> So maybe we start with the Web app first and once it is working and we have our proof of concept, we can begin on creating the mobile versions of it alongside developing it further.

Flag, **may need rephrasing**: this is your platform plan; "maybe" makes it tentative. If you commit, say it as a decision. Good clear sequencing (web first, then mobile).

> **Q41** (Msg 8) *also fits Abstract and Goals*
> By the end of CPSC491, a user will be able to specify their vehicle make and model and year and trim level and import or note the service history of the vehicle so far up to that point, and the application will determine based on their previous service history and the manufacturers recommendations for that exact vehicle, what service is the user needs to have done on their vehicle next and at what mileages. The app will read the service records provided by the user and tell the user what recommended maintenance/service is recommended next and at what mileage. I'll know it works when I am able to use the app to solve my own original issue. I will know it works when I am able to select my own the exact vehicle in the application, import all of my service records, and have the app tell me the correct services that are needed, and when (what mileage).

Flag, **may need rephrasing**: the first two sentences say the same thing (the second can go). "what service is the user needs" and "select my own the exact vehicle" are likely transcription slips. "manufacturers" needs an apostrophe. This is measurable at the level of one user story ("pick the vehicle, import records, get the correct next service and mileage") and is a good seed for a goal plus objectives. "Correct" needs a test: correct against what? (the manual's schedule applied to the history by hand).

> **Q43** (Msg 8) *also fits Abstract*
> Again, since the reading scanned records, functionality is not the main feature of the app, but deciding what is due next is the main feature, we should commit to deciding what to do next.

Flag, **may need rephrasing**: "Again, since…" refers to a previous message; "deciding what to do next" should read "deciding what service is due next". This is a clear commitment and answers the AI-feature question: **deciding what is due next is the main feature; reading scanned records is secondary.** Still open: is the deciding done by AI, by rules, or both (Q20)?

> **Q44** (Msg 8)
> Yes, the app should treat different services differently than others. Breaking them into two categories like urgent and when-convenient is a great start, but then this makes me wonder if we should create a third and/or fourth category?

Flag, **may need rephrasing**: it ends on an open question. Category design is a scope decision for you. A starting point to think about aloud: what would each category *do* differently (how early the alert fires, how loud, whether it nags)?

---

## AI Usage (not part of HW4's required sections, but the template includes it and the syllabus requires the disclosure)

Status: **workflow quotes captured (Q2–Q6), plus Q36's final sentence ("we will be using AI to develop it"); the rest is needed.** These describe how the proposal text is produced. They may also be useful for the repo note that Tyler has not yet approved.

> **Q2** (Msg 3)
> Almost every time I use Claude code, I put it in remote control mode and then open the iOS app on my phone and use speech to text.

> **Q3** (Msg 3)
> So for things that have to be written in my own words, I would prefer to speak aloud. […] What I mean by this is that all of these words that I sent to you are obviously my own written words, but it’s a lot easier for me to just spill my thoughts out loud this way using my voice instead of having to stare at a word document and think of sentence structures and how to format and the flow of the document and all of that stuff.

> **Q4** (Msg 3)
> So what I want is to still be able to use my own words, but from what I sent to you basically. I want you to be able to take my exact words as I send them to you and parse out whatever is relevant and noteworthy and keep worthy and save them all as quotes in a Markdown file so that all of my own words that will be used in the proposal assignment that I’m submitting will already be there for me in that Markdown file.

> **Q5** (Msg 4)
> Regarding the email to the professor, I don’t believe it’s necessary right now. These are ultimately still my words. I’m just having you organize them for me.

> **Q6** (Msg 4)
> Don’t forget that after you get all those quotes in there for me, I will still be doing my own revisions from the md file to the word document.

Flags, **may need rephrasing**:
- Q2: "Claude code" should be "Claude Code" (product name). "Remote control mode" is a specific feature name, so a reader may not know what it is.
- Q3, Q4: both are spoken and conversational (second person, "keep worthy", "and all of that stuff"). Written for me, not for the instructor.
- Q5 is a reply to me, so "the email to the professor" has no meaning for the instructor. It is a statement of position, not proposal text. Likely best used only as your own reminder.
- Q6 is a note to me ("Don't forget"). Same issue.

Still needed (answer aloud):
1. Which AI tools do you use for the proposal and the repo, and for which tasks?
2. Roughly what fraction of each artifact is AI-assisted? (For the proposal prose, the policy answer is "none generated"; say so in your words.)
3. How do you verify AI output?
4. Do teammates use AI differently from you?

> **Q58** (Msg 12, Response.txt) *AI Usage*
> For this proposal, I used Claude code in terminal to assist me in focusing my thoughts, getting them out of my head and onto the notepad, and then organized in such a way that makes it easier for me to write the proposal using my own words. Nothing in the proposal is AI generated. It is all my own words. I used voice to text on my iPad to get my thoughts written down, then shared them with Claude, who highlighted usable quotes from the things that I said/wrote and categorized and organize them in a way that lined up with the proposal template layout.

Flag, **may need rephrasing**: "Claude code" should be "Claude Code"; the last sentence has a tense slip ("categorized and organize"). **Accuracy check before you submit, because AI Usage must be complete:** beyond highlighting and sorting quotes, Claude also (a) entered two bracketed word corrections you asked for (Q24 `[disc brakes]`, Q31 `[voided]`), (b) wrote flags and questions, and (c) ran web research on warranty rules and competitor apps. Those belong in the disclosure in your words. Also, earlier you said you dictate on your iPhone through the Claude app; here you say iPad. Say whichever is true. Fraction AI-assisted: you described "none generated"; you may also want to state it as a rough percentage for the research and organizing tasks, as the template asks.

Still needed: how you verified the AI's output (for example, you read each source yourself, as you did with the app pages).

---

## Unplaced

Quotes that don't fit a section yet, kept so nothing is lost.

> **Q7** (Msg 2)
> I will say that 25 pages does seem like a hell of a lot though.

Note: logistics only. No proposal use.

> **Q23** (Msg 6)
> I have other ideas about where we can take this, but they're not so concrete in my mind yet, and this is kind of the bulk of what I am thinking.

Note: a note to me. No proposal use. Later ideas ("other ideas about where we can take this") are still to be captured.

---

## Research notes (Claude's findings, not Tyler's words; verify before citing)

Researched 2026-10-04 with web search; I read the pages named below only through search summaries or a fetch, so **you** need to open each source before citing it. None of this is in the proposal yet.

### Do existing solutions exist? Yes.
Several free or low-cost apps already log service and send reminders. Your idea is not an empty market, so "what is different" matters (see Q40 flag).
- **CARFAX Car Care** (free iOS/Android): per its store listings and Carfax's own page, it stores service history, sends service reminders, shows open recall alerts, tracks odometer/fuel, finds shops. Sources: [CARFAX Car Care, Carfax](https://www.carfax.com/Service/), [App Store listing](https://apps.apple.com/us/app/carfax-car-care/id552472249), [Google Play listing](https://play.google.com/store/apps/details?id=com.carfax.mycarfax&hl=en_US&gl=US). I could not fetch the product page directly (404), so details come from search summaries.
- **Drivvo** (free personal tier): its own site says maintenance tracking and automatic reminders are in the free personal plan. It did not mention receipt scanning on the page I read. Source: [drivvo.com](https://www.drivvo.com/en).
- **Simply Auto** (free, plus paid tiers): reminders by days or distance ("whichever comes first"), expense and fuel logs, mileage tracking; store/site listings say Free, Gold ($9.99 once), Platinum ($9.99/yr). Sources: [simplyauto.app](https://simplyauto.app/), [reminders guide](https://simplyauto.app/userguide/reminders.html).
- **Also named by third-party roundups** (not checked at the source): MyAutoLog (claims an AI assistant), OBDeleven (OBD hardware), Vehicle Maintenance Tracker. Roundups such as [carmaintenance.app](https://carmaintenance.app/best-car-maintenance-tracking-apps/) and [getgaragehub.com](https://getgaragehub.com/learn/guides/best-car-maintenance-apps/) look like marketing pages; treat them as leads, not evidence.

**Not yet checked, and your possible gap:** whether any of these (1) pull the *manufacturer's* schedule for the exact make/model/year/trim and apply it to your history to say what is due, or (2) scan and import messy paper records. That is what Q41–Q42 describe. Reading each app's feature list is the way to find out; I'd check the first two on the list above and MyAutoLog's AI claim.

### Can a manufacturer void a warranty for skipped maintenance?
- **Verified at the source:** the FTC says it is against the law for a dealer to refuse to honor a warranty just because someone else did maintenance or repairs. Source: [FTC document on a MINI/BMW settlement](https://www.ftc.gov/node/44739) (this page is about dealer-only service claims; it does *not* address skipped maintenance).
- **Reported by industry and legal sites, not yet confirmed at an FTC or statute page:** the Magnuson-Moss Warranty Act means a warranty is not voided just because you used an independent shop or non-OEM parts; the manufacturer must show that the part or service caused the failure; and owners should follow the maintenance schedule and **keep dated receipts**. Sources: [AutoCare Association](https://www.autocare.org/government-relations/current-issues/Magnuson-Moss-Warranty-Act), [Florida CFO](https://www.myfloridacfo.com/division/consumers/consumerprotections/magnuson-moss-warranty-act).
- **What this means for your sentence (Q31):** I could not confirm that a warranty is "voided" for skipped maintenance. What the sources support is narrower: a claim can be denied if neglect is shown to have caused the failure, and records are what protect an owner. That actually *supports* your app (a central dated history), but the sentence needs your own careful wording, and you should read the FTC's own consumer page (I could not reach it) or your Silverado's warranty booklet to confirm.

### Competitor fast pass (2026-10-04)

**Method and limits.** Public sources only: App Store listings (fetched, US store), developer sites, and web-search summaries of reviews. I did not install or test any app. Review themes come from search summaries of individual reviews, not a systematic count, so they show *kinds* of complaints, not how common they are. Developer marketing pages (VinSnap, MyAutoLog, carmaintenance.app) are claims, not evidence. **You need to open the sources before citing any of this.** Where two sources disagree, I say so.

#### Feature comparison (as stated by the sources)

| | CARFAX Car Care | Drivvo | Simply Auto | My Car (KineApps) | MyAutoLog | VinSnap |
|---|---|---|---|---|---|---|
| Price (iOS listing) | Free | Free w/ ads; Pro $0.99–$49.90 range | Free w/ ads; Gold $9.99 once; Platinum tiers | Free (3 vehicles); Premium $1.49/mo–$10.99/yr | Free (1 vehicle); Pro $3.99/mo, $15.99/yr, $149.99 lifetime | Free (3 vehicles); paid $4.99–$9.99/mo (its own site) |
| Rating (iOS) | 4.8 (128K) | 4.7 (968) | 4.1 (867) | 4.7 (1.2K) | 4.8 (76) | not checked |
| Service reminders | Yes | Yes | Yes, by days or distance | Premium only (per listing) | Yes, by mileage or time | Yes |
| Manufacturer schedule for your exact vehicle | **Conflict:** App Store page doesn't say; a third-party roundup says VIN-based | Not stated | No (user sets intervals) | Not stated | Not stated; "smart presets" and VIN decode | **Claims yes** (VIN → "manufacturer maintenance intervals") |
| Scan / import records | Auto-adds history from CARFAX-affiliated shops; independent shops are manual | Imports from other apps; attach receipts/photos | Receipt capture; CSV import | Imports from Fuelio, Fuelly, Drivvo and others; stores receipts | Docs storage; one search summary says AI receipt scanning, but its App Store page and website don't mention it | **Claims** OCR receipt scanning |
| AI | Not stated | Not stated | No | Not stated | AI assistant chat ("ask about noises, symptoms, repairs") | **Claims** AI predictions |
| Fuel / cost tracking, charts | Fuel efficiency yes; charts not mentioned | Yes | Yes, with graphs (fuel cost, service cost per distance) | Yes, with charts | Yes, with charts | not checked |
| Recall alerts | Yes | Not stated | Not stated | Not stated | Not stated | Not stated |
| Platforms | iOS, Android | iOS, Android | iOS, Android, web dashboard | iOS (Premium adds web app) | iOS, Android | Cloud sync across phone/tablet/computer |

OBDeleven (a hardware-based competitor): needs an OBDeleven 2 or 3 device plugged into the car to read mileage automatically; reminders are date or mileage, with push notifications 30, 7 and 1 day before (OBDeleven's own pages). It's a different category (diagnostic hardware), useful as the "automatic mileage" comparison to your Q21 idea.

#### UPDATE 2026-10-04 evening: primary-source reads (Tyler's pastes + Claude's Chrome reads)

- **CARFAX Car Care, resolved.** Tyler pasted CARFAX's own FAQ. It says you add a vehicle by VIN or license plate and then "you'll be able to see information about its history, its maintenance schedule", and that reminders help you "stick to the manufacturer's recommended service schedule". So CARFAX **does** use a manufacturer schedule per vehicle. It also has a web version (not only iOS/Android), tracks up to 8 vehicles, and offers manual logging for DIY or non-partner shops. The v4.1 note says the new onboarding makes it easier to record services done at home or at non-CARFAX shops. No record scanning is mentioned. (Source: CARFAX Car Care FAQ and App Store/Google Play text, pasted by Tyler.)
- **Drivvo, per its own site (pasted by Tyler):** web (web.drivvo.com), iOS and Android; free personal plan with "Maintenance & reminders"; cost per mile in reports; checklists; routes; income tracking; a fleet product with a 15-day trial; "5M+ downloads". Nothing about manufacturer schedules, scanning or AI appeared on the page he pasted.
- **Simply Auto, per its listings (pasted by Tyler):** reminders by mileage or date; receipt capture; CSV import and export; GPS and Bluetooth trip logging; web access listed as a Pro feature; no manufacturer schedule, scanning or AI mentioned. Pricing is in `simplyautopricing.md` (I have not read that file).
- **GarageHub (read by Claude in Chrome; this is the vendor's own marketing, and its guide says "we make GarageHub"):** [guide](https://getgaragehub.com/learn/guides/best-car-maintenance-apps/), [home page](https://getgaragehub.com/).
  - Runs on iOS, macOS, Android and web.
  - **AI assistant "Rev"** reads your car's records before answering; a free plan has 15 Rev messages a month; Premium is $7.99/mo or $59.99/yr (home page FAQ).
  - **Manufacturer schedule:** "seeds a maintenance schedule for it where it has a checked one" (so for some vehicles, not all).
  - **Importing history:** "Snap a batch of old receipts, or tell Rev what's been done, and it drafts the entries for you to review"; forward receipts to a private email address; CSV import on the web app. The guide says **receipt scanning is a Premium feature**.
  - **"Up Next":** one ordered list that mixes open issues by priority, services by mileage and time, and reminders; overdue work rises to the top.
  - Also: parts inventory, build planner, shareable history report, family sharing, no ads on any plan. Gaps it states about itself: no OBD2 connection yet, no community fuel data, CSV import web-only. Claims 1,500+ drivers.
  - **This overlaps a large part of your original idea** (AI that reads the car's history, batch receipt scanning, ordered "what's next", importing old records). The sources do *not* show: bulk ingestion of a mixed pile of old paper documents of all kinds, or a stated tiering like "urgent vs when convenient" (it has priority ordering).
- **MECH AI (read by Claude in Chrome; the page text was very thin):** the site shows a parts finder with Amazon and eBay prices marked "fits your Camry". GarageHub's guide describes it as an OBD2-scanner companion with AI code explanations, TSB lookup and wiring diagrams, ad-funded free tier, and no service history or reminders. I did not verify those from Mech AI's own pages.
- **Screenshot pass (Claude in Chrome, 2026-10-04): GarageHub and MECH AI viewed as a user would see them.** Only the public marketing pages; I did not sign in or try the apps, and the chat screens are sample/scripted demos.
  - **GarageHub pricing page:** Free = first vehicle with "full history, schedule & Up Next", cost tracking on every job, 15 Rev messages a month, iOS/Android/Web synced. Premium is advertised as "$5.00/month" with $59.99/year or $7.99/month underneath (the $5 is the yearly price spread out). Premium adds unlimited vehicles and Rev, photo diagnosis, **receipt scanning**, report export, family sharing (up to 5). Confirms the earlier read. The home page's "how it works" shows a sample Rev chat that checks the car's own brake history before answering, and an "Up Next" tab in the app's bottom bar. `/features` just loads the home page.
  - **MECH AI** (own site): claims 100K+ downloads, 7 languages, "as featured in The Wall Street Journal" (not verified), iOS/Android/Web, "Free to start. No card required." Its feature page (shown with sample data) lists: AI Mechanic chat, **Digital Garage** (garage + timeline), guided **Diagnostics** trees, **Vehicle Health** score (brakes, tires, fluids shown as percentages), **Parts Finder** (Amazon + eBay, "fits your car"), **TSBs** in plain English, **MECH Vision** (guided camera), vehicle timeline, step-by-step **Repair Guides**. Pricing is Free / DIY ("best for most owners") / Mechanic, plus shop plans (monthly or yearly, "-30% off" yearly); I did not read the prices. **Relevant to you:** its Vehicle Health score, repair guides and parts finder overlap your "health" framing (Q34) and your DIY ideas (Q50, Q54).
- **Not yet read:** Fuelly, OBDeleven's own site, `carmaintenance.app` (it rendered blank for you; my fetch returned limited text), `simplyautopricing.md`.

#### What this means for your idea (honest read)
- **Table stakes, which you will need to match:** service logging, mileage/date reminders, multi-vehicle, fuel and expense tracking, cost-per-distance, charts, receipt/photo attachments, PDF/CSV export, cloud sync, and import from other apps. All of these exist in at least one competitor.
- **Not new:** photo/receipt capture (Simply Auto), OCR receipt scanning (VinSnap claims it, MyAutoLog may), AI chat (MyAutoLog), VIN-based manufacturer schedules (VinSnap claims it, CARFAX may). Your original two ideas are therefore **not unique as stated**.
- **Possible gaps (hypotheses, not findings; verify):**
  1. **Bulk digitizing of a large pile of mixed-format *legacy* records** (your tote bin). Competitors scan one receipt at a time, as far as the sources say; I found no claim of batch import of old multi-format paperwork.
  2. **Reconciling history against the exact schedule** (make/model/year/*trim*) to say what is overdue or was never done, and explaining why. Competitors mostly seem to remind from a template or user-set interval.
  3. **Severity tiers** (urgent vs when-convenient; Q44). I found no competitor describing this.
  4. **Doing all of the above in one free app** instead of paywalled tiers (see complaints).
  Each of these needs a closer look at the apps themselves before you claim it.

#### Complaints found in public reviews (themes only)
- **CARFAX Car Care:** records from dealers missing; manually entered services not recognized, so the app keeps saying a service is overdue; custom intervals and odometer corrections blocked; a shop's wrong mileage entry corrupted warnings; support unresponsive. (Search summary of reviews: [App Store reviews](https://apps.apple.com/us/app/carfax-car-care/id552472249?see-all=reviews&platform=iphone), [ConsumerAffairs](https://www.consumeraffairs.com/automotive/carfax_inacc.html); the ConsumerAffairs complaints are about Carfax reports generally, so treat them with care.)
- **Drivvo:** big, frequent ads; subscription renewal messages that were wrong; prices rising; records locked behind sign-up; data transfer and support problems; recent crashes and data loss. ([reviews](https://apps.apple.com/us/app/drivvo-vehicle-management/id1206041425?see-all=reviews&platform=iphone))
- **Simply Auto:** data loss with cloud backup or sync (one user said eight years of data); sync not showing changes; only one reminder sent when several are due; ads. The developer says it overhauled syncing. ([Progress report](https://www.simplyauto.app/blog/progress-report-and-road-ahead.html), [forum thread](https://bobistheoilguy.com/forums/threads/replacement-for-simply-auto-mileage-logging-app.353003/))
- **My Car:** reviewers' requests, not complaints: dropdowns for recurring entries and family accounts; reminders are behind Premium (per the listing).
- **MyAutoLog:** too few ratings (76) to find themes.

**Recurring theme across apps:** data loss/sync, aggressive ads and subscriptions, **wrong or duplicate reminders caused by bad or missing history**, and good features locked behind paywalls.

#### My suggested ranking of what to examine next (you asked me to pick)
1. How each app decides what is due, and whether it uses the exact vehicle's manufacturer schedule (it is your core claim).
2. Import of old and messy records, batch or one-at-a-time.
3. Reminder logic and severity.
4. AI features (MyAutoLog, VinSnap claims; check at the source).
5. Pricing and ads.
6. Privacy and data export.
7. Platform coverage (web).

#### Prompts to answer aloud for Related Work (once you've looked at the apps)
1. In your own words, what did you notice using or reading about these apps? Which feature impressed you most, and which seemed weakest?
2. Which features do you think every app in this space must have, because users would be disappointed without them? List them.
3. Pick two apps. How do they handle the "what's due next" question, and where does that fall short for someone like you with a big pile of old records?
4. From the complaints (ads, lost data, wrong reminders, paywalls), which ones do you think matter most for your users, and what would your app do differently?
5. Which of your original ideas (scanning old records, the assistant that decides what's due, severity tiers) do you now think is the most valuable difference, and why?
6. What will you not try to compete on, and why?

---

## Round 3 quotes (Response.txt, 2026-10-04 evening)

Your pasted competitor text is **not** quoted here because it is the companies' words, not yours; its facts are in the Research notes update below. Quotes marked "Intro" or "Abstract" go in that section; "Approaches" are for the later Proposed Approaches section but feed the Abstract's solution paragraph.

> **Q45** (Response.txt) *Intro: motivation / what exists*
> After looking at Drivvo, I'm really concerned. They have a web version in addition to the iOS and Android apps. They even have a version for managing fleets of vehicles. They have so many good features. It seems like they beat me to the finish line a long time ago. Hopefully we can still find a way to exist in this space, unless it would just be best to move on to a different project idea entirely, but I hope we don't have to do that.

Flag, **may need rephrasing**: the personal worry ("I'm really concerned", "beat me to the finish line") is not proposal tone. The *facts* (Drivvo has web, iOS, Android and a fleet product) are good Related Work material. See my note in chat about the pivot question.

> **Q46** (Response.txt) *Related Work*
> It seems that Simply Auto doesn't have a web browser version but only the mobile apps. Their UI isn't as modern and nice as Drivvo's. Their iOS app hasn't received an update since March 24 2022. Their Android app hasn't received an update since October 10, 2024.

Flag, **may need rephrasing / fact check**: the text you pasted from Simply Auto's own App Store and Google Play descriptions says you can "access your vehicle database on the web" (a Pro feature) and lists a web dashboard, so "doesn't have a web version" is contradicted by the source you gave me. "Isn't as modern and nice" is opinion (fine if labeled as yours). The update dates are your observation from the store pages; keep the page and the date you looked at it.

> **Q47** (Response.txt) *Intro: what's different*
> I think from all of these, GarageHub seems most in line with what I want to create, but I also like the features of Mech AI that I'm seeing, as well as all the foundational stuff that Drivvo offers. I'd love for our own creation to be a blend of basically all the best parts of these apps and improvements on all of their weak points and elimination of things that users have complained about and might complain about looking forward.

Flag, **may need rephrasing**: "all the best parts of these apps" will read as unbounded to a grader. See the note in chat: say which parts and why. "might complain about looking forward" is garbled ("going forward").

> **Q48** (Response.txt) *Intro: what's different; Abstract: proposed solution*
> Yes, I have read your comparison table and provided my thoughts. Competitors already do reminders, receipt, capture, and in some cases AI chat. What my app will do differently is give the users "The best of both worlds" so to speak (the top competitors - drivvo, garagehub, mech ai). We will also give users a way to bulk upload a stack of different formatted paper records as well like what I have. It will serve as an AI assistant that figures out what is due next from the exact vehicle and its history and make recommendations based upon its understanding of it.

Flag, **may need rephrasing**: the first sentence is a reply to me ("Yes, I have read your comparison table…") and should be cut; "best of both worlds" names no two worlds. **Important:** GarageHub already offers batch receipt photos and email-forwarded receipts (see update below), so "bulk upload" alone is no longer a clean difference; what the sources do not show is bulk ingestion of *old, mixed-format paper* records plus checking them against the exact vehicle's schedule.

> **Q49** (Response.txt) *Approaches (AI cost model)*
> It would be great if we could even have the users connect their own AI subscription like if they already pay for ChatGPT or Claude or some other AI just by simply signing in via a prompt or maybe doing an MCP or whatever we have to do to make it so that the app can be totally free for the users and they won't be annoyed by ads or payment models and they can just have this awesome free totally free app as long as they're able to just connect their own AI subscription to it. If they don't have their own, then we can give them an option to pay to use the AI model we can put in the app ourselves and somehow link it to a live model like Claude or ChatGPT or maybe even use some off-line low weight model. There are so many different ways we could make that happen.

Flag, **may need rephrasing / feasibility check**: the idea is clear but the mechanism is undecided ("or whatever we have to do"). My understanding, which you should verify against the providers' own pages before the proposal relies on it: consumer chat subscriptions are generally billed separately from developer API access, so "sign in with your ChatGPT/Claude subscription" may not be something providers allow third-party apps to do. Stating it as an open design question is honest. "Totally free" also conflicts with "option to pay" in the next sentence.

> **Q50** (Response.txt) *Approaches (urgency tiers; proactive recommendations; DIY help)*
> It will also provide some kind of indication or multiple indicators on which services are more or less urgent, depending on what the service would be, and we can even take it a step further and suggest things that other people might not even suggest things that we can just use the AI model maybe to figure out what people are complaining about with their vehicles like what parts wear out faster and then also make that as a recommendation of like I don't know like replacing the window switches let's say, for example like if the window switches are known to not work quickly, and you may have to take them apart and like scrape the contacts the metal contacts to make it work or just buy a new part and maybe we can even give instructions on how to DIY things and recommendations on whether or not the user will be able to do it and what tools they need and maybe linked to videos or diagrams or instructions elsewhere or even create our own or have the AI create them and have it do like a checklist of what tools are needed and again use the AI to even do research on that part two where it might find Reddit post of people talking about fixing some stuff, DIY and the issues they run into while doing the service themselves, who knows.

Flag, **may need rephrasing**: one ~230-word sentence combining four ideas: (1) urgency indicators (V1 scope), (2) AI mining owner complaints for known weak parts, (3) DIY instructions with tools and difficulty, (4) AI researching forum posts. Ideas 2–4 are not in your V1 scope (Q57); say so if you keep them. Using AI-generated repair instructions raises a safety/accuracy concern a reviewer may ask about; and scraping Reddit may be restricted by its terms. Check both before promising them.

> **Q51** (Response.txt) *Approaches (UX); Intro: what's different*
> Another thing that I think will be a huge selling point is creating an elegant user experience. It should be something similar to how TurboTax walks me through doing my taxes in a very easy way as if it's guided between rails. The app should be friendly and simple and presentable to the user and at First should start asking them basic questions, but not in a chat type interface where they have to type on the keyboard or use voice to text, but just a simple thing where it might tell them to start by scanning the VIN and then it may be ask them a simple yes or no question or multiple-choice question where they just tap the option on the screen instead of having to type things in themselves and just make it super super super easy if that makes sense. Just like how TurboTax walks you through getting started and basically after they get all of that initial set up done and they're past the simple part then they see the dashboard and all the stuff that they would want to see like a normal app, but we should give them that set up process in a way that makes it super easy to get started to the point that when they're done with it, they have all the information they could need in there but also maybe give them the option to skip some steps along the way if they want to just skip for now and then return later and add more service records or whatever.

Flag, **may need rephrasing**: "super super super easy" and "if that makes sense" are spoken. The idea (guided tap-through setup, scan the VIN, skippable steps, then a dashboard) is concrete and not something I saw in the competitor pages; GarageHub's pages mention "first-run setup" with receipt forwarding as an option, so check how guided it is before claiming it as unique.

> **Q52** (Response.txt) *Approaches (mileage)*
> I'm also wondering if we should try to figure out an automatic way for the app to know how much they have driven without them having to manually input their mileage. Maybe the app can get their location data from their phone if they've been with their phone while they're driving and maybe there are different ways to do that in and of itself, or maybe we use a OBD reader with Bluetooth to connect to the app or maybe something else entirely that I'm not thinking of, but it would be cool to make it so that the user doesn't have to manually input their mileage and it's just automatic.

Flag, **may need rephrasing**: it repeats Q21 (location, OBD) and is framed as a question. Per Q57 it is outside V1. Competitors: Simply Auto records trips by GPS/Bluetooth (its own listing) and OBDeleven reads mileage from its device, so this is not new.

> **Q53** (Response.txt) *Approaches (environment factors)*
> I also mentioned whether in the past and to elaborate on that, I mean like in the rust belt area that may be something that the application or AI will need to consider about somebody who's driving a vehicle in that area because their vehicle is more prominent to rust or maybe somebody who's doing a lot of offloading and they chew up their tires quickly or if they're doing like drifting or burnouts or you know basically like other environmental factors that may be at play and how often things will be needing maintenance.

Flag, **may need rephrasing**: "whether in the past" is "weather" (transcription); "more prominent to rust" is "more prone"; "offloading" is probably "off-roading". Keep only if you want to commit to usage- and climate-adjusted schedules, which is outside V1.

> **Q54** (Response.txt) *Approaches (DIY and parts)*
> In thinking of other new features right now, I'm wondering if we could even help the users with DIY maintenance more. Let's say somebody is doing maintenance themselves and they are going to buy some new spark plugs at their local auto shop. First of all, the app should already know that it is time to do that and it should be a suggestion in the homepage when user first opens it up and maybe they can tap on it and there's an option to select. Yes, I'm doing it myself right now, and then maybe it walks them through some other yes or no or multiple-choice questions and eventually can maybe find the lowest price available online or in person and maybe even suggest other things they should purchase while they are at it regarding upcoming maintenance for other things.

Flag, **may need rephrasing**: "and there's an option to select. Yes, I'm doing it myself right now" mixes narration with the user's voice. Outside V1. MECH AI's site shows a "Parts Finder" (Amazon + eBay prices, "fits your car"), so price comparison exists in at least one competitor.

> **Q55** (Response.txt) *Intro: what's different*
> We just needed to determine what is most valuable. I still wanna have the original vision, but basically all the most valuable features as well that everybody else does as well as new features that we are thinking of on the fly like I've mentioned.

Flag, **may need rephrasing**: reads as a note to me ("we just needed to determine…") and "all the most valuable features" is unbounded. Not usable as is; the table-stakes list is better stated as a concrete list.

> **Q56** (Response.txt) *Intro: what's different; Goals*
> Of all the problems you found, I would say the thing that matters most to a driver is reliability. They want the app to work, no matter what they're doing in it every time without having to worry that it won't work. That is the biggest thing in my mind regarding what we are creating here. We need to be open and transparent and accountable and reliable and feature-rich, but not so rich that it becomes overwhelming or just a basic AI catch-all chat bot, or on the other hand, simply an LLM with a custom prompt and fancy wrapper. It has to simply be a great product so that it sells itself, and it has to live up to exactly what it is selling. Basically it has to do exactly what it is said to do and not be buggy or poorly optimized or subversive and manipulative, and trying to siphon money out of users, etc.

Flag, **may need rephrasing**: starts as a reply to me ("Of all the problems you found…"). "Reliability" is a real, evidence-backed theme (data loss, wrong reminders), so this could become a *measurable* objective (for example, no data loss on sync; reminders match the schedule). "Siphon money" is strong language for an academic document. Strong, original point that your app should not be "an LLM with a fancy wrapper"; say what it is instead.

> **Q57** (Response.txt) *Abstract: goals; Goals and Objectives*
> For the scope of version one, I'd like to go with exactly what you suggested. The first version of our app should cover, selecting a vehicle, entering its history, getting a correct "due next" answer with a mileage, and urgency-tier labels as in "urgent" versus "when convenient".

Flag, **may need rephrasing**: begins with "exactly what you suggested" (refers to me). The second sentence stands alone. **This is your scope decision, in your words** (recorded for the Goals-and-Objectives lock on Oct 11). It also means Q49–Q54 are *future* directions, not V1.

---

## Round 4 quotes (pasted answers to the 8 prompts, 2026-10-04 night)

> **Q59** (Round 4, prompt 1) *Intro: what's different; Abstract: solution and significance*
> CARFAX, Drivvo, Simply Auto, GarageHub, and MECH AI already exist in this space. They do a lot really well, including showing a vehicle vehicles maintenance schedule from its VIN, track, fuel, expenses, and cost per mile, reminders and alerts for maintenance, services for vehicle fleets, cross platform functionality between Web, iOS, and android, the ability to capture receipts and import or export CSV files, log trips automatically by GPS or Bluetooth, AI assistance that Reed users vehicle records before answering, and charts and graphs to track these things. Our app is different because it it does all of these things plus more. It will be incredibly feature-rich. In addition to offering the features noted above from competitors, it also allows for the bulk ingestion of a pile of old mixed-format paper records, it labels upcoming service as urgent versus when-convenient, it provides a simple to follow, guided tap-through setup, and it does all of this for free and reliably. Additionally, there will be no payment model whatsoever, and no advertisements. Our app will be reliable as well, and will work on time, every time, error-free.  Basically, the main selling point of our application is that it has all the features a user could want from these other apps, with an elegant user interface and user experience, it is free and has no hidden pricing at all, and it performs exceptionally well on all devices, and will be supported by its developers far into the future.

Flags, **may need rephrasing**, in order of importance:
- **Contradicts your own scope.** "It does all of these things plus more" promises fuel tracking, trip logging, fleets, charts and CSV, but your version 1 (Q57) is vehicle, history, "due next" answer and urgency tiers only. A grader will compare the Introduction with the Goals. Either say the competitor features are long-term goals or narrow the claim to the features you are actually committing to.
- **Absolute promises a reviewer can't verify**: "error-free", "on time, every time", "supported by its developers far into the future", "performs exceptionally well on all devices". Software teams don't promise these. State them as goals you will measure (see prompt 3 below) instead.
- **"No payment model whatsoever"** contradicts Q49, where you suggested an optional paid AI tier and bringing your own AI subscription. Decide which is true.
- **Not accurate as written:** the list of what competitors "do well" is a *union* across five apps, so "they all do these things" is not what the sources show (for example, only some have fleets or GPS trip logs). Say "among them" or name which app does what.
- Transcription slips, unchanged: "vehicle vehicles", "it it does", "Reed users" (probably "reads").
- It is long and repeats ("reliable" appears three times), but the facts are right and it is a good base.

> **Q60** (Round 4, prompt 2) *Abstract: significance and why it is non-trivial*
> There are several reasons why our application is not trivial. Someone may ask why a calendar or reminder app isn't sufficient for solving the problem in question. The reason why a calendar or reminder app or any fixed interval template isn't optimal in this situation is because vehicle maintenance depends on several factors, including mileage, in what conditions the owner is driving it, how hard they are accelerating and braking, as well as other unaccounted for environmental factors like poorly paved or damage roads to name one example. Service schedules also differ by vehicle and year. Each new version of a manufacturers vehicle model will have some differences than previous years' iterations. A correct suggestion or assumption about what service is due next relies on multiple factors as stated, as opposed to estimating a day on a calendar when service might need to be done. This allows users to take action with preventative maintenance, sparing their vehicle any damage caused by negligence. Determining the correct "due next" service relies on three things: the right service schedule, the real service history, and the vehicle's current mileage. A wrong "due next" answer has real costs, in that a missed or late service can end up damaging the vehicle and hurting the owner's wallet when repairs need to be made. Finally, a dedicated application such as ours will make it faster and easier and more accessible for vehicle owners to keep track of their vehicles' maintenance needs and history as opposed to an app that is trivial like a calendar or reminders or notepad.

Flags, **may need rephrasing**: "damage roads" is "damaged"; "manufacturers" needs an apostrophe; "some differences than" is "from". This is your strongest passage: it answers the "isn't it just a calendar" question directly and states the three inputs (schedule, history, mileage). The part about driving conditions (acceleration, braking, road quality) is **outside V1** (Q57 doesn't include climate or driving style); say it as the reason a fixed interval is imprecise, not as something V1 models. It is also long; the three-inputs sentence could open it.

> **Q61** (Round 4, prompt 3) *Goals; Intro: what's different*
> Regarding our app's reliability, we promise to users that they will never experience data loss, including when changing phones or syncing, that reminders will always match the vehicle's schedule and history, any changes they make will appear on every device that they have the app on, everything they can do for free will continue to work with no surprise paywalls ever, and it also tells users the reasoning behind why it's telling them that something is due.

Flag, **may need rephrasing**: "we promise… never… always… ever" are absolute guarantees. A proposal is stronger with measurable objectives (for example, "sync preserves all entries across devices in N test cases"). The five items are good raw objectives: no data loss on phone change or sync; reminders match the schedule and history; changes appear on all devices; free features stay free; the app explains why something is due. Keep the five and reword the promise as a target; that is your own rewording to do.

> **Q62** (Round 4, prompt 4) *AI Usage*
> Here is how I used Claude to help me with the proposal. I dictated by voice on my iPhone or iPad using the Apple Notes application, I then copied it and pasted it into Claude code, running in terminal on my Windows desktop. Claude highlighted worthwhile quotes of things that I said and sorted them under the template headings, and added flags and questions to them. Claude made two word corrections at my request (it changed "rotors"to `[disc brakes]`, and changed "avoided" to`[voided]`). I checked Claude's work by reading the quotes. It noted to ensure that it stayed true to what I initially said. But also helped me by researching competitors. I checked its work by doing my own research on those same competitors from their sources. No sentences in the proposal were written by AI. If I had to assign a percentage of the work done on this assignment to AI, I'll say it did about 10%.

Flags, **may need rephrasing**:
- Backtick marks around `[disc brakes]` and `[voided]` are file formatting, not part of the sentence.
- "It noted to ensure that it stayed true to what I initially said" is unclear (Claude noted what?). The disclosure should say *you* compared the quotes with your own messages, if that is what you did.
- "Claude code" should be "Claude Code".
- **Disclosure gaps, so the section is complete:** it should also say Claude searched the web for the warranty rules and for competitor apps (including reading pages through a browser extension), and that you sometimes dictated on the iPhone and sometimes on the iPad. Also name the AI tools by name, as the template asks (Claude Code, the Claude model; Apple's dictation is a speech tool, not an AI writing tool).
- 10% for the *proposal task* is your call; the template asks about "each artifact". You can split it (research: higher; proposal prose: none).

> **Q63** (Round 4, prompt 5) *Abstract: solution; Approaches*
> In version one, the AI will determine what service is due next for a user's vehicle based on its exact make, model, year, and even trim in addition to its maintenance history. It may also read scanned records. It will not however, act as a general chat bot or an LLM with a custom prompt and fancy wrapper. It will use a combination of logic based rules and AI judgment to conclude which services are due next. It will be free for all users from the beginning.

Flag, **may need rephrasing**: "AI judgment" needs a short example of what the AI decides versus what the rules decide; a reader will ask. "It may also read scanned records" is hedged while Q57 leaves scanning out of V1: say plainly whether V1 reads scanned records. "Free for all users from the beginning" conflicts with Q49's optional paid AI (see Q59 flag). This **settles** the earlier open question: *a mix of rules and AI*.

> **Q64** (Round 4, prompt 6) *Problem Statements; Intro*
> Vehicle owners want their vehicles to last in good health for as long as possible. They want to avoid spending money on unnecessary repairs. To make that happen, they need to preemptively take action to maintain their vehicle by keeping up with its regular service needs as specified by its manufacturer. Missing maintenance can lead to expensive repairs, increased safety risks, diminished resale value, and can potentially cause warranty problems. Existing tools offer great solutions, but our application aims to provide users with a solution that is leagues better than the rest.

Flag, **may need rephrasing**: the first four sentences are a clean problem statement. The last sentence ("leagues better than the rest") is a claim, not a problem, and your own research shows strong competitors. It would read better saying what gap remains (see Q59 differences). "Warranty problems" is appropriately hedged; the FTC research supports "can potentially".

> **Q65** (Round 4, prompt 7) *Abstract: goals; Goals and Objectives*
> By the end of CPSC491, a user will be able to specify their vehicle make, model, year, and trim level, they will be able to import their service history, and the application will use a combination of logic, rules and AI to provide the user with a list of upcoming services that the vehicle needs done and at what mileages. The second goal is to implement other features like automatic mileage tracking, DIY maintenance help, a parts finder, and climate-based recommendations. I'll know it works when I'm able to use the app to import any vehicle's service records and receive the correct recommendations of services the vehicle needs next.

Flag, **may need rephrasing**: "import any vehicle's service records" is an overclaim (every vehicle? every format?). The first goal is clear and measurable-ish ("a user will be able to…"). The second goal is a list of stretch features; "implement other features" is not measurable. Note that Q57 put those features outside V1 while this puts them at the end of CPSC 491; say which semester each belongs to. "CPSC491" has no space.

> **Q66** (Round 4, prompt 8) *not for the document*
> Not sure what you expected me to write here.

Note: nothing to use. See the explanation in chat; the outline sentence is written last.

### Section map for the Word draft (order to follow)

IDs are in the order I would try them; you may reorder or drop.

- **Abstract** (written last; one page max): background and motivation Q9, Q10, Q13; problem Q64; solution Q8, Q63, Q16; significance and why non-trivial Q60, Q34; goals and outcomes Q65, Q57, Q41; document outline: still to be said.
- **Introduction, field background:** Q24, Q25, Q26, Q27.
- **Introduction, motivation and the problem:** Q8, Q9, Q10, Q11; Q28, Q29, Q30, Q31; Q13, Q14; Q64; Q39.
- **Introduction, existing tools:** Q32 (your own earlier guess; probably replace with the facts in the Research notes, which you have since read yourself), Q45, Q46.
- **Introduction, what is different:** Q59, Q47, Q48, Q56, Q42, Q34, Q60.
- **Later (not required for HW4):** Related Work Q45–Q47; Goals Q41, Q57, Q61, Q65; Approaches Q16–Q22, Q49–Q54, Q63; AI Usage Q2–Q6, Q36, Q58, Q62.

---

## Open questions (not for the document)

- Page count: the handout says 25 pages; the template's required sections for HW4 are the Abstract and Introduction. Plan assumes a shorter document. Unconfirmed.
- Teammate split: no sections assigned to others yet. The proposal must say who wrote which section.
