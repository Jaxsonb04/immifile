# Baseline — M0-T1 Foundation

Recorded 2026-07-05 at commit `039442f` (branch `main`), before any milestone
implementation work. This is the green baseline every subsequent milestone must
preserve.

## Checks

| Check       | Command                                | Result                     |
|-------------|----------------------------------------|----------------------------|
| Typecheck   | `bun run typecheck` (`tsc --noEmit`)   | ✅ pass (exit 0)            |
| Lint        | `bun run lint` (`eslint .`)            | ✅ pass (exit 0)            |
| Unit tests  | `bun run test:once` (`vitest run`)     | ✅ 85 passed / 85 (4 files) |

## Test files at baseline

- `src/screens/interview/interview.form.test.ts` — 17 tests
- `convex/foundation.test.ts` — 7 tests
- `convex/applications.test.ts` — 12 tests
- `src/screens/applications/journey-hub/pdf/pdf.fill.test.ts` — 49 tests

Total: **85 tests, all passing.**

## Notes

- `docs/internal/MASTER_PLAN.md` and `apps/` were untracked at baseline capture.
- Amended in the same task: ADR-0003 now brings the Community forum (M4) and
  Recent news (M5-T2) into v1 scope, and reconciles the stale "monetization"
  exclusion against ADR-0011. See
  `docs/internal/adr/0003-v1-scope-i90-i765.md` (Amended 2026-07-05).
- The ADR amendment was reviewed by a 3-lens adversarial panel
  (ADR-consistency, UPL/scope-boundary, factual-wording) — all approved with
  only low-severity wording polish, which was incorporated.
