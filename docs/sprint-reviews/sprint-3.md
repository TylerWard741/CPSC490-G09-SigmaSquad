# Sprint 3 review — Nov 3 – Nov 16

> **Facts below are final** as of the Nov 16→17 overnight push (everything
> merged before the instructor's ~8–8:30am Nov 17 check). The Progress,
> Feedback, and What-we-change sections still need Tyler's own words.

## Progress this sprint — the substance

**Proposal moved:**
| Section | What changed | Where |
|---|---|---|
| | | |

**Prototype moved:**

## Velocity

| | Story points | Stories |
|---|---|---|
| Planned | 21 | 7 |
| Completed (merged, confirmed) | 3 | 1 |
| Pending your close decision (merged, deliverable-only) | up to 13 | up to 3 |

**Confirmed:** #33 (Objective 1.5, CI test coverage, sp 3) closed via #105.

**Pending your decision, not closed by me** — each PR's own deliverable is
a spec/design doc that "quotes the acceptance criteria as written" rather
than the full feature, so whether that satisfies "done" is your call, not
mine (shared CLAUDE.md: a human judges acceptance criteria):
- #32 (Objective 1.4, responsive dashboard, sp 5) — PR #108 added
  `docs/design/maintenance-dashboard.md`. All three child tasks (#77, #78,
  #79) are done in the prototype.
- #35 (Objective 2.2, three service types, sp 3) — PR #109 added
  `docs/specs/recommendation-engine.md`. Both child tasks (#75, #76) are
  done in the prototype.
- #34 (Objective 2.1, recommendation engine, sp 5) — all five children
  (#72–#76) are closed, but #34's own acceptance criteria are still the
  **unfilled template placeholders** (`- [ ] When ..., the system shall
  ...`) — nobody ever wrote them. Worth fixing before judging this one
  done either way.

## Completed (merged PRs) — final

| Story/task | Owner | PR | Merged |
|---|---|---|---|
| #85 Manual service-record entry form (child of #31) | @emilyvlsco | #88 | Nov 15 |
| #86 Service-history import/upload interface (child of #31) | @emilyvlsco | #94 | Nov 15/16 |
| #87 Display saved service history (child of #31) | @emilyvlsco | #97 | Nov 16 |
| #72 Label rule (child of #34) | @Mathieu2303 | #93 | Nov 16 |
| #81 Service-record schema/CRUD API (child of #33) | @TamtungOS | #89 | Nov 16 |
| #80 Section 4 Sprint 3 rows | @TylerWard741 | #82 | Nov 17 |
| #83 Board-card-movement reminder in shared CLAUDE.md | @TylerWard741 | #84 | Nov 17 |
| #33 Objective 1.5: CI test coverage (sp 3) | @TamtungOS | #105 | Nov 17 |
| #77 Dashboard with service history (child of #32) | @ready2pullallnighters | #90 | Nov 17 |
| #79 Dashboard edit/delete controls (child of #32) | @ready2pullallnighters | #92 | Nov 17 |
| #73 Mileage entry + label recalculation (child of #34) | @TylerWard741 | #95 | Nov 17 |
| #74 Missing-data prompt (child of #34) | @TylerWard741 | #96 | Nov 17 |
| #78 Responsive dashboard for mobile (child of #32) | @ready2pullallnighters | #102 | Nov 17 |
| #32 Objective 1.4 deliverable doc (sp 5, pending close) | @ready2pullallnighters | #108 | Nov 17 |
| #75 Recommended-interval reference data (child of #34) | @ready2pullallnighters | #103 | Nov 17 |
| #35 Objective 2.2 deliverable doc (sp 3, pending close) | @ready2pullallnighters | #109 | Nov 17 |
| #56 Sprint 2 review facts (carried over) | @TylerWard741 | #99 | Nov 17 |
| #76 Wire service types into the recommendation calculation (child of #34) | @ready2pullallnighters | #104 | Nov 17 |

## Still open at the boundary

| Story/task | Owner | Status |
|---|---|---|
| #98 This review + the release PR | @TylerWard741 | PR #100 open, reviewer requested (Mathieu2303); your prose still needed below |
| #18 Proposal sections 5+6 | @ready2pullallnighters | No branch/PR yet — Ethan said in Discord this can't land this sprint |
| #32, #34, #35 | mixed | See the Velocity table above — pending your close decision |

## Carried over from Sprint 2 — still open

| Story | Owner | Status |
|---|---|---|
| #13 Fill docs/development-plan.md | @TylerWard741 | Not started; carried a third time |
| #59 Change Objective 2.3 from two labels to four | @TylerWard741 | Not opened; carried a third time |
| develop → main release | @TylerWard741 | `develop` is 120 commits ahead of `main`; no release since Sprint 1 (#47). Still needed before the Word export/final submission. |

## Loop health (docs/aidlc/loop-engineering.md §8)

| | This sprint |
|---|---|
| Iterations to green, average per PR | not yet computed — fill after the boundary |
| Harness rules added (rows in the harness log) | 0 |

## Prototype increment

## Feedback we received, and what we did about it

| Feedback (source) | What we changed | Issue / PR |
|---|---|---|
| | | |

## Contribution snapshot — final

| Member | Merged PRs this sprint | Reviews given since Nov 3 |
|---|---|---|
| @TylerWard741 | 5 (#82, #84, #95, #96, #99) | 11 |
| @Mathieu2303 | 1 (#93) | 8 |
| @ready2pullallnighters | 7 (#90, #92, #102, #103, #104, #108, #109) | 4 (also 1 from the old `toodols` account on PR #88 — see note below) |
| @TamtungOS | 2 (#89, #105) | 14 |
| @emilyvlsco | 3 (#88, #94, #97) | 3 |

**Note:** PR #88 was approved by both `toodols` (Ethan's old account) and
`ready2pullallnighters` (his current one) a minute apart on Nov 13 — the
same account-hygiene issue flagged after Sprint 1 (only
`ready2pullallnighters` should be used going forward).

## What we change next sprint

-
