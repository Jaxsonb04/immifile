# Filing output: deep-link into myUSCIS online filing where feasible, fall back to a pre-filled PDF

The app's "file" action first tries to route the user into myUSCIS online filing via a deep-link where a viable entry point exists; where it does not — or the user prefers paper — it generates the current-edition official USCIS PDF pre-filled from the applicant profile (via `pdf-lib`) for the user to review, sign, print, and mail. True programmatic e-filing is infeasible because USCIS exposes no public third-party submission API for I-90/I-765.

## Important constraint

A myUSCIS deep-link can **open** the online-filing page but **cannot pre-populate** the user's USCIS account with our data (no public pre-fill/submission API). So the "near one-tap second filing" value proposition is delivered by the **PDF path**, not the deep-link — the deep-link is a routing convenience for users who want to file online. This makes the pre-filled PDF the de-facto primary path for autofill value, with the deep-link as an optional shortcut.

## Considered Options

Deep-link to myUSCIS (opens, no pre-fill); pre-filled PDF for print-and-mail (chosen as the autofill-bearing path); programmatic e-file (infeasible — no public API).

## Consequences

Build the `pdf-lib` field maps and current-edition templates regardless. The user signs the form themselves and the preparer section is left blank or clearly disclosed, per [ADR-0004](./0004-information-only-no-legal-advice.md).

## Amended (2026-07-01)

Deep-link/PDF mechanics unchanged. Data source corrected per [ADR-0014](./0014-draft-only-answers-promote-at-review.md): the PDF is filled from the **application's own draft** plus the vault — not from the shared applicant profile. The profile's role is seeding a *new* application's draft (autofill at creation), after which the draft is the render source. Language: Application is the unit noun per docs/internal/CONTEXT.md.
