# Repository Unification — 2026-07-01

`main` now contains every line of work from this repo and the partner fork
(https://github.com/fluid-design-io/expo-immigration-app). All commits from all
branches are reachable from `main`; no history was rewritten or force-pushed.

## What was merged

| Line | Tip | Commits | Status in unified tree |
|------|-----|---------|------------------------|
| `origin/main` | `0d458fd` | base | Adopted the new architecture via PR #1 |
| Partner fork `main` (fluid-design-io) | `6c9e2b4` | 48 | **Working tree = this line.** Convex backend, TanStack Form, ADRs 0001–0013, 07-01 foundation reset |
| `codex/stage-6-handoff` / `codex/stage-7-harden` | `efda423` (identical tips) | 22 | History merged (`-s ours`); tree superseded by the rearchitecture. Browse the old app at `git checkout efda423` |

The codex line and the partner line are **two different architectures**
(old: Expo monorepo `apps/` + `packages/` + Railway/Better Auth backend;
new: flat `src/` + `convex/`). They could not be textually combined into one
working app, so the newest deliberate direction (the Convex rearchitecture,
see `docs/internal/REARCHITECTURE.md` and the ADRs) is the working tree, and the old line
is preserved in history.

## What the partner fork line contributed (in the working tree now)

- Convex backend: 7-table schema, deletion contract, dev seed, TDD suite (vitest)
- TanStack Form suite: Select, RadioGroup, Number, Date, Switch field components; Address field group
- Question-first Interview wizard on a single TanStack form (ADR-0012/0013)
- Applications core + Home/Documents shell (post-reset walkthrough phase)
- Compound component namespaces with provider-led context for all screens
- Domain docs: `docs/internal/CONTEXT.md` glossary, ADRs 0001–0013, PRD updates, 2026-07-01 domain-modeling decisions
- In pre-reset history (reachable, not in tree): document vault on Convex storage,
  I-765 wizard tracer, I-90 wizard + I-751 guardrail, watermarked USCIS PDF preview,
  manual case tracker, anonymous→credentialed account upgrade

## What the codex line contributed (in history at `efda423`, NOT in the working tree)

Candidates to port onto the Convex architecture:

- **Full I-765 form coverage + on-device PDF preview/print/save** (`efda423`) —
  **PORTED (2026-07-01)** to `src/screens/applications/journey-hub/pdf/` as the
  free watermarked Preview via the OS share sheet for I-765 + I-90; print/save
  happen through the share sheet; the paid clean Filing Package is still stubbed
- **Address autocomplete** on the mailing-address step (`bcaf863`)
- **Better Auth email/password accounts + Railway deploy** (`c1bf3b0`) — superseded
  by Convex auth direction, but the account-creation UX flows may be worth reusing
- **Liquid Glass design system** — full-app glass conversion (`2247b3a`, `91e82e6`, `d8793c5`)
- **Calendar deadlines/reminders** with visible grid markers (`73ff01d`, `bbc7a7d`, `5bb951c`)
- **Forum / community** with report-reason flow (`f90d08d`, `4f38558`)
- **News source shell** (`05d8a33`)
- **Manual case tracker + Check-live-on-USCIS.gov deep link** (`4298e2d`, `7f2f8b6`)
- **5-tab navigation** with Community segment + Profile modal (`61af0eb`)
- Reminder dispatch batch plan + protected loop API contract docs (`ee91762`, `91dc017`, `b1b86bc`)

## Housekeeping

- Branches `codex/stage-6-handoff` and `codex/stage-7-harden` are fully merged
  into `main` and were deleted from origin. Recover any time: both pointed at `efda423`.
- Local-only branch `wip/old-arch-prebuild-scaffold` (`ed7dee2`) on the build Mac
  holds the root-level expo-deps hack + `app.json` stub used for old-arch iOS prebuilds.
- The partner remote is configured as `partner` in the build Mac checkout for future syncs.
