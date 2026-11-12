# Store variable per-form data as typed Convex validators, not "JSONB"

Per-form-type application data is modeled as a discriminated union of typed Convex validators keyed by form type (I-90 vs I-765), reserving `v.any()` only for genuinely open fields. This **supersedes** the PRD Decisions Log entry "Dynamic form storage = JSONB on `applications`," which does not apply because Convex is a document database with no JSONB type. The typed approach preserves the "server-driven types" goal (inferring client types from server validators) at the cost of explicit migrations whenever a form's fields change.

## Considered Options

Discriminated union of typed `v.object` validators keyed by `formType` (chosen); a single `v.any()` blob (defeats type inference); a separate table per form type (duplicates shared fields).

## Consequences

Adopt `@convex-dev/migrations` early given expected schema churn (form models, profile, statuses). Update the PRD Decisions Log to remove the "JSONB" line.

## Amended (2026-07-01)

- **Type direction reversed by the Zod single-source decision:** shared Zod shapes are authored once and Convex validators derive from them via `zodToConvex` — types flow Zod → storage *and* form validation. "Inferring client types from server validators" no longer describes the mechanism; the typed-not-JSONB substance stands.
- **Migrations deferred until there is data to preserve:** the factory reset (docs/internal/REARCHITECTURE.md) plus the walkthrough phase's seed/reset mutations make `@convex-dev/migrations` moot pre-launch; adopt it when production data exists. "Profile" now means the applicant row — there is no user-profile table.
