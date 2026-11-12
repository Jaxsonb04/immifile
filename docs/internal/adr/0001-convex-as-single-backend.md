# Use Convex as the single backend (superseding the Railway/Hono monorepo)

We use Convex — an online-first, reactive document database with integrated auth, file storage, and scheduled functions — as the sole backend, replacing the monorepo + Railway/Hono REST API bootstrapped in commit `c19f9f4` and abandoned one commit later (`b742c9d` "new arch"). This buys reactive data, integrated identity, file storage, and cron/scheduling on one operational surface, at the cost of an online-first model (no native offline mode) and a document store with no relational joins or JSONB type.

## Considered Options

Railway + Hono REST monorepo (abandoned after one commit); Convex single app (chosen).

## Consequences

Variable per-form data must use typed validators, not JSONB (see [ADR-0005](./0005-structured-per-form-data-not-jsonb.md)); the filing wizard must autosave server-side because there is no full offline mode.

## Amended (2026-07-01)

The autosave clause is superseded: there is **no autosave**. Every **Next** action validates the current step and persists it via an idempotent `saveApplicationStep` mutation (see docs/internal/REARCHITECTURE.md "Save Semantics"). The online-first consequence stands.
