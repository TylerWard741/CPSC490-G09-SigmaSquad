# Sprint 3 review — Nov 3 – Nov 16

> **Corrected Nov 20, prose added Nov 25.** The tables below replace the Nov
> 15 snapshot that merged via #100 (PR for this same file) before Monday Nov
> 16's merges were in. Facts pulled from GitHub and checked against
> `develop` by Hector (TamtungOS) on #98; boundary taken as midnight
> Pacific, same as sprint-2.md. One placeholder remains: the last row of
> the Feedback table, awaiting Tyler's own sentence confirming Ethan's two
> review comments are fixed (they are — see the Carried-over table below).

## Progress this sprint — the substance

**Proposal moved:**
| Section | What changed | Where |
|---|---|---|
| §4 | One new doc for the recommendation engine spec tied to #35 | proposal.md |
| §4 | One new doc for the maintenance dashboard design tied to #32 | proposal.md |
| §4 | Added the late vehicle-data-and-tracking document after missing it from a previous sprint | proposal.md |
| §4 | Fixed issue-index tables; rows and new/rescoped tasks synchronized: #72, #81, #83, #85-87 | proposal.md |

**Prototype moved:**
The biggest thing that actually works now that didn't before is the dashboard. It used to just be a plain vehicle picker to what now is a real functional screen. A user can now enter service history by hand or by import, and that service history can be displayed, which was not possible at the start of the sprint. The recommendation engine also got real status labels and mileage windows instead of placeholders. Finally, CI started actually running tests.

## Velocity

|                                                                      | Story points | Stories                       |
| -------------------------------------------------------------------- | ------------ | ----------------------------- |
| Planned (#18, #32, #33, #34, #35, #80, #83; inferred from sp labels) | 21           | 7                             |
| Completed (merged by midnight Nov 16)                                | 5            | 3 (#33, #80, #83)             |
| Merged in the first hour of Nov 17 (12:21–12:48 AM)                  | 3            | 1 (#35, via #103, #104, #109) |

## Completed (merged PRs)

| Story/task                                               | Owner                  | PR              | Merged (Pacific) |
| -------------------------------------------------------- | ---------------------- | --------------- | ---------------- |
| #33 Objective 1.5: automated tests in CI                 | @TamtungOS             | #89 (#81), #105 | Nov 16           |
| #80 Section 4 Sprint 3 rows                              | @TylerWard741          | #82             | Nov 16           |
| #83 Board-card reminder in CLAUDE.md                     | @TylerWard741          | #84             | Nov 16           |
| #72 Label rule (child of #34)                            | @Mathieu2303           | #93             | Nov 16           |
| #73 Mileage entry and label recalculation (child of #34) | @TylerWard741          | #95             | Nov 16           |
| #74 Missing-data prompt (child of #34)                   | @TylerWard741          | #96             | Nov 16           |
| #77 Dashboard with service history (child of #32)        | @ready2pullallnighters | #90             | Nov 16           |
| #79 Dashboard edit and delete (child of #32)             | @ready2pullallnighters | #92             | Nov 16           |
| #85 Service-record entry form (child of #31)             | @emilyvlsco            | #88             | Nov 15           |
| #86 Service-history import (child of #31)                | @emilyvlsco            | #94             | Nov 15           |
| #87 Saved service history display (child of #31)         | @emilyvlsco            | #97             | Nov 16           |

## Merged shortly after the boundary

All of this work was finished and reviewed on Nov 16; the merges landed in
the first hour of Nov 17. Listed separately the same way sprint-2.md lists
#66, so the team can decide how to count them.

| Story/task                                 | Owner                  | PR   | Merged (Pacific) |
| ------------------------------------------ | ---------------------- | ---- | ---------------- |
| #78 Responsive dashboard (child of #32)    | @ready2pullallnighters | #102 | 12:21 AM Nov 17  |
| #75 Interval reference data (child of #35) | @ready2pullallnighters | #103 | 12:24 AM Nov 17  |
| #32 Dashboard design doc                   | @ready2pullallnighters | #108 | 12:24 AM Nov 17  |
| #35 Recommendation engine spec             | @ready2pullallnighters | #109 | 12:26 AM Nov 17  |
| #56 Sprint 2 review facts                  | @TylerWard741          | #99  | 12:29 AM Nov 17  |
| #76 Recommendation engine (child of #35)   | @ready2pullallnighters | #104 | 12:48 AM Nov 17  |

## Carried over, and why

| Story                                    | Owner                  | Status at the boundary                                                                                                                                   | Decision                 |
| ---------------------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| #18 Proposal sections 5 and 6            | @ready2pullallnighters | No PR opened                                                                                                                                             | decision pending (Tyler) |
| #32 Objective 1.4: dashboard             | @ready2pullallnighters | #77 and #79 merged; #78 and the design doc merged just after midnight; editing a vehicle's nickname (criterion 7) has no code yet                        | decision pending (Tyler) |
| #34 Objective 2.1: recommendation engine | @TylerWard741          | All three tasks (#72, #73, #74) merged, but the acceptance criteria are still the blank template, and real windows arrived with #104 just after midnight | decision pending (Tyler) |
| #98 Sprint 3 review and release PR       | @TylerWard741          | Review doc merged via #100 (#100 itself merged Nov 17, but with facts frozen as of the Nov 15 snapshot, now corrected by this PR); release PR #110 open  | in progress              |

#35 is not listed here: its spec, #75 and #76 merged just after midnight on Nov 17 (already
counted above, under "Merged shortly after the boundary"), and the issue itself is closed. It
is done, not carried over — it was previously listed in both places at once, a double-count
Ethan caught reviewing this PR.

## Carried over from Sprint 2

| Story                     | Owner         | Status                                                                                                                                                              |
| ------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| #31 Objective 1.3 (5 pts) | @emilyvlsco   | All three tasks merged in Sprint 3 (#88, #94, #97); issue still open — **decision pending (Tyler): acceptance criteria are still all unchecked despite the merges** |
| #56 Sprint 2 review       | @TylerWard741 | Facts merged via #99 after midnight (issue closed Nov 17); prose blank; release to main is in #110, not yet merged                                                  |
| #13 development-plan.md   | @TylerWard741 | Not started; carried a third time                                                                                                                                   |
| #59 Objective 2.3 labels  | @TylerWard741 | Opened as PR #116 (Nov 19), not yet merged; carried a third time                                                                                                    |

## Loop health (docs/aidlc/loop-engineering.md §8)

|                                               | This sprint      |
| --------------------------------------------- | ---------------- |
| Iterations to green, average per PR           | not yet computed |
| Harness rules added (rows in the harness log) | 0                |

## Prototype increment

At the start of the sprint, the prototype allowed users to select a vehicle with its make, model, year, and trim, and save it, with a functioning database/API underneath it. That was it. It did not include functionality for anything beyond vehicle selection, like allowing for users to enter or view service history, make recommendations, or any running CI tests. By the end of the sprint, a real dashboard screen existed, along with the functionality for entering service history by hand or by import, displaying that service history, the recommendation engine producing real status labels and mileage windows, and finally, automatic CI tests that actually run. In short, it went from simply a vehicle picker to a working application. The code written for label rules, mileage entries, and the missing-data prompt, all child tasks under #34 are real, merged, and they work, however #34 isn't actually finished because nobody wrote out the acceptance criteria checklist for it. The acceptance criteria checklist still only contains template text, so there's nothing to actually verify the recommendation engine feature against. Similarly, #32 isn't fully complete because the nickname editing feature was never built. Its written criteria includes one that says a user should be able to edit a vehicle's nickname or mileage from the dashboard. The mileage editing got built, but nickname editing was forgotten. This was caught and called out by Ethan after the sprint ended. He also filed #125 to fix this. Also, #31 was overlooked before the sprint ended. All three of its child tasks (manual entry, import, and display) were merged during this sprint, but the issue itself remained open as our team forgot to check its boxes and close it.

## Feedback we received, and what we did about it

| Feedback (source)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | What we changed                                                                                                                                                                                                                             | Issue / PR                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| In our professor's November 18 grading email, it was brought to our attention that we weren't moving our sprint board cards as the work happened. Specifically, we were told that "#73 and #74 show In Progress on Nov 15 then In Review the same night, closed after merge; #83 went Backlog to In Review and sat five days, #80 skipped In Progress; #98 and story #34 still open at the cutoff and the Sprint 3 review is a snapshot marked not final; 2 of 2 closed cards in the last 48h." (instructor, Nov 18 email) | In response, we filed and merged #83, a board-card-movement reminder to our shared CLAUDE.md file, and the board cards for #59/#112/#115/#120/#122 were moved to 'In Review' right when their PRs were opened, instead of waiting until later. | #83                             |
| In our professor's November 18 grading email, it was brought to our attention that some of our work landed late, and almost all of it was rushed. Specifically, we were told that "7 of the 15 closed Sprint 3 cards closed after the sprint boundary; 4 of 5 members closed every one of their cards in the last 48 hours." (instructor, Nov 18 email)                                                                                                                                                                 | In response, we've all agreed to get our work done earlier going forward so that nothing is late or rushed. We don't have any concrete response other than our own verbal agreement about it in-person.                                        | N/A |
| In our professor's November 18 grading email, it was brought to our attention that sections 3 and 4 are still missing our own prose. Specifically, we were told that "sections 3 and 4 are still mostly an index of documents; the one thing to fix next is turning the specs, design decisions and the implemented slice into prose." (instructor, Nov 18 email)                                                                                                                                                       | In response to this, we filed issue #122 to scope the prose work, and PR #123 to track it. The actual prose has yet to be written, but it will be done soon.                                                                                   | #123                            |
| While reviewing PR #124, our teammate Ethan found that #35 was being counted twice, one being "carried over" and one in Sprint 3's velocity. He also found that #100's merge date was wrong, in that it initially stated Nov 15 when it should've been Nov 17. (instructor, Nov 18 email)                                                                                                                                                                                                                              | [Tyler: both of Ethan's points are now fixed above (#35 removed from the carried-over table; the #100 line now says #100 itself merged Nov 17, carrying a Nov 15 data snapshot) — write your own sentence here saying so before this merges]                                                                                                                                          | #124                            |

## Contribution snapshot (Nov 3 – midnight Nov 16)

| Member                 | Merged PRs                                                                        | Issues closed     | Reviews given (on PRs)              |
| ---------------------- | --------------------------------------------------------------------------------- | ----------------- | ----------------------------------- |
| @TylerWard741          | 4 (#82, #84, #95, #96), plus 1 merged shortly after midnight (#99)                | 2 (#80, #83)      | 6 (4)                               |
| @Mathieu2303           | 1 (#93)                                                                           | 1 (#72)           | 8 (6)                               |
| @ready2pullallnighters | 2 (#90, #92), plus 5 merged shortly after midnight (#102, #103, #104, #108, #109) | 1 (#49)           | 6 (3), plus 1 from `toodols` on #88 |
| @TamtungOS             | 2 (#89, #105)                                                                     | 1 (#81)           | 9 (6)                               |
| @emilyvlsco            | 3 (#88, #94, #97)                                                                 | 3 (#85, #86, #87) | 1 (1)                               |

Reviews counted are submitted reviews (approve, request changes or
comment), including ones later dismissed. Plain PR comments are not
counted.

**Note:** PR #88 was approved by both `toodols` (Ethan's old account) and
`ready2pullallnighters` (his current one) a minute apart — the same
account-hygiene issue flagged after Sprint 1 (only `ready2pullallnighters`
should be used going forward).

## Issues to close by hand (work merged, issue still open)

- #31: all three of its tasks merged (#88, #94, #97) — acceptance criteria
  still unchecked; Tyler's call whether it's done.

## What we change next sprint

Next sprint, we're going to pace ourselves on work differently. We will no longer be doing any last-minute crunches, cards will be appropriately moved on the sprint board as work happens, and known carry-over work such as #13, #18, #31, #32, #34, #35, and #59 will be completed.
