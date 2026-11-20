# Sprint 3 review — Nov 3 – Nov 16

> **Corrected Nov 20.** The tables below replace the Nov 15 snapshot that
> merged via #100 (PR for this same file) before Monday Nov 16's merges were
> in. Facts pulled from GitHub and checked against `develop` by Hector
> (TamtungOS) on #98; boundary taken as midnight Pacific, same as
> sprint-2.md. The prose sections below (Proposal moved, Prototype moved,
> Prototype increment, Feedback, What we change next sprint) are still
> blank — Tyler fills these in his own words before this lands.

## Progress this sprint — the substance

**Proposal moved:**
| Section | What changed | Where |
|---|---|---|
| | | |

**Prototype moved:**

## Velocity

| | Story points | Stories |
|---|---|---|
| Planned (#18, #32, #33, #34, #35, #80, #83; inferred from sp labels) | 21 | 7 |
| Completed (merged by midnight Nov 16) | 5 | 3 (#33, #80, #83) |
| Merged in the first hour of Nov 17 (12:21–12:48 AM) | 3 | 1 (#35, via #103, #104, #109) |

## Completed (merged PRs)

| Story/task | Owner | PR | Merged (Pacific) |
|---|---|---|---|
| #33 Objective 1.5: automated tests in CI | @TamtungOS | #89 (#81), #105 | Nov 16 |
| #80 Section 4 Sprint 3 rows | @TylerWard741 | #82 | Nov 16 |
| #83 Board-card reminder in CLAUDE.md | @TylerWard741 | #84 | Nov 16 |
| #72 Label rule (child of #34) | @Mathieu2303 | #93 | Nov 16 |
| #73 Mileage entry and label recalculation (child of #34) | @TylerWard741 | #95 | Nov 16 |
| #74 Missing-data prompt (child of #34) | @TylerWard741 | #96 | Nov 16 |
| #77 Dashboard with service history (child of #32) | @ready2pullallnighters | #90 | Nov 16 |
| #79 Dashboard edit and delete (child of #32) | @ready2pullallnighters | #92 | Nov 16 |
| #85 Service-record entry form (child of #31) | @emilyvlsco | #88 | Nov 15 |
| #86 Service-history import (child of #31) | @emilyvlsco | #94 | Nov 15 |
| #87 Saved service history display (child of #31) | @emilyvlsco | #97 | Nov 16 |

## Merged shortly after the boundary

All of this work was finished and reviewed on Nov 16; the merges landed in
the first hour of Nov 17. Listed separately the same way sprint-2.md lists
#66, so the team can decide how to count them.

| Story/task | Owner | PR | Merged (Pacific) |
|---|---|---|---|
| #78 Responsive dashboard (child of #32) | @ready2pullallnighters | #102 | 12:21 AM Nov 17 |
| #75 Interval reference data (child of #35) | @ready2pullallnighters | #103 | 12:24 AM Nov 17 |
| #32 Dashboard design doc | @ready2pullallnighters | #108 | 12:24 AM Nov 17 |
| #35 Recommendation engine spec | @ready2pullallnighters | #109 | 12:26 AM Nov 17 |
| #56 Sprint 2 review facts | @TylerWard741 | #99 | 12:29 AM Nov 17 |
| #76 Recommendation engine (child of #35) | @ready2pullallnighters | #104 | 12:48 AM Nov 17 |

## Carried over, and why

| Story | Owner | Status at the boundary | Decision |
|---|---|---|---|
| #18 Proposal sections 5 and 6 | @ready2pullallnighters | No PR opened | decision pending (Tyler) |
| #32 Objective 1.4: dashboard | @ready2pullallnighters | #77 and #79 merged; #78 and the design doc merged just after midnight; editing a vehicle's nickname (criterion 7) has no code yet | decision pending (Tyler) |
| #34 Objective 2.1: recommendation engine | @TylerWard741 | All three tasks (#72, #73, #74) merged, but the acceptance criteria are still the blank template, and real windows arrived with #104 just after midnight | decision pending (Tyler) |
| #35 Objective 2.2: three service types | @ready2pullallnighters | #75, #76 and the spec all merged just after midnight | decision pending (Tyler) |
| #98 Sprint 3 review and release PR | @TylerWard741 | Review merged via #100 as the Nov 15 snapshot; release PR #110 open | in progress |

## Carried over from Sprint 2

| Story | Owner | Status |
|---|---|---|
| #31 Objective 1.3 (5 pts) | @emilyvlsco | All three tasks merged in Sprint 3 (#88, #94, #97); issue still open — **decision pending (Tyler): acceptance criteria are still all unchecked despite the merges** |
| #56 Sprint 2 review | @TylerWard741 | Facts merged via #99 after midnight (issue closed Nov 17); prose blank; release to main is in #110, not yet merged |
| #13 development-plan.md | @TylerWard741 | Not started; carried a third time |
| #59 Objective 2.3 labels | @TylerWard741 | Opened as PR #116 (Nov 19), not yet merged; carried a third time |

## Loop health (docs/aidlc/loop-engineering.md §8)

| | This sprint |
|---|---|
| Iterations to green, average per PR | not yet computed |
| Harness rules added (rows in the harness log) | 0 |

## Prototype increment

## Feedback we received, and what we did about it

| Feedback (source) | What we changed | Issue / PR |
|---|---|---|

## Contribution snapshot (Nov 3 – midnight Nov 16)

| Member | Merged PRs | Issues closed | Reviews given (on PRs) |
|---|---|---|---|
| @TylerWard741 | 4 (#82, #84, #95, #96), plus 1 merged shortly after midnight (#99) | 2 (#80, #83) | 6 (4) |
| @Mathieu2303 | 1 (#93) | 1 (#72) | 8 (6) |
| @ready2pullallnighters | 2 (#90, #92), plus 5 merged shortly after midnight (#102, #103, #104, #108, #109) | 1 (#49) | 6 (3), plus 1 from `toodols` on #88 |
| @TamtungOS | 2 (#89, #105) | 1 (#81) | 9 (6) |
| @emilyvlsco | 3 (#88, #94, #97) | 3 (#85, #86, #87) | 1 (1) |

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

-
