# Re-Architecture Context

This document is context for the ground-up rebuild. It is not an implementation
plan and it is not a migration plan.

`PLAN.md` was stale and has been removed. Future agents should treat this file as
the current source of rebuild context until the ADRs and glossary are updated.

## Hard Decisions

- Build a brand new app on top of the preserved shell. Do not migrate legacy
  schema, functions, routes, or feature modules.
- No production environment is set up. Existing data is disposable.
- Expo 57 is the baseline.
- Convex remains the backend. Better Auth remains the auth foundation.
- V1 supports dedicated, in-house flows for Form I-765 and Form I-90 only.
- Use **Application** as the main product unit. Avoid **Filing** as the primary
  UI noun except where legal/form language requires it.
- Use RevenueCat for IAP/paywall infrastructure.
- No autosave. Every **Next** action validates and saves the current step.
- No financial records survive account deletion in our app-owned data.
- The provided dashboard mockup is direction for hierarchy and tone, not a
  literal implementation spec.

## Current Repo Boundary

The legacy feature logic has been aggressively removed so future agents can build
from a cleaner foundation.

Preserved:

- App shell and auth entry points under `src/app/`.
- Reusable UI foundations such as `src/components/core`,
  `src/components/form`, `src/components/account`, styled icons, and hooks.
- Better Auth client/server shell.
- Convex generated files and auth/http shell.
- Placeholder Home and Documents tab routes.

Removed:

- Old applicant, case, deadline, document, filing, and todo feature modules.
- Old Convex tables, validators, queries, mutations, tests, and model helpers for
  those features.
- Old wizard routes and proof-of-concept modal flows.
- Stale `PLAN.md`.

Do not resurrect old APIs or route names unless the new architecture explicitly
reintroduces them.

## Product Scope

The app is an information-only self-help tool for non-technical immigrants who
need to prepare, preview, pay for, and track USCIS renewal or replacement
applications.

V1 form families:

- I-765: Work Permit / Employment Authorization Document.
- I-90: Green Card / Permanent Resident Card.

Supported application situations should be explicit:

- Work Permit initial application.
- Work Permit renewal.
- Work Permit replacement.
- Green Card renewal.
- Green Card replacement.

The user prepares and reviews their own information. The product must not claim
to file on the user's behalf, guarantee approval, provide legal advice, or imply
USCIS/government affiliation. The Service Fee must be presented separately from
any USCIS Filing Fee.

## Terminology

Use plain labels first and technical labels second.

Preferred pattern:

- Primary label: `Work Permit renewal`, `Green Card replacement`.
- Secondary label: `Form I-765`, `Form I-90`, or `EAD` only where helpful.
- Data shape: store `formType` and `applicationKind` separately; compose display
  labels from those fields.

Avoid:

- Using `I-765`, `I-90`, `filing`, `case`, or `petition` as the primary label for
  ordinary user-facing navigation.
- Copy that says or implies "we file for you", "guaranteed approval", or
  "USCIS approved partner".

## Information Architecture Direction

Target shell:

- Home.
- Documents.
- Account, settings, and upgrade surfaces should be accessed from header actions
  or modals, not as primary tabs unless a later product decision changes this.

Home should carry the main application workflow:

- Summary headline based on expiring documents and active applications.
- Active applications rail.
- Needs-attention list.
- Recent activity.
- Start/resume application actions.

Documents should carry the reusable vault:

- Uploaded documents.
- Expiry metadata.
- Needed-document slots for active applications.
- Unified capture sheet with Files, Photos, Scan, and Use existing.

Application detail should use a Journey Hub spine:

- Prepare.
- Documents.
- Review & Pay.
- Track.

The deadline/reminder value remains the first free wedge, but it must be framed
as informational and not as legal advice.

## Data Model Direction

Use a clean Convex schema. Do not preserve legacy table names just to reduce diff
size.

Expected app-owned tables:

- `applicants`: people managed by the signed-in or anonymous owner.
- `applications`: the durable product object for one applicant, form type, and
  application kind.
- `applicationDrafts`: high-churn interview answers and step progress, separated
  from stable application metadata.
- `documents`: user-owned vault files and metadata.
- `documentRequirements` or `applicationDocuments`: explicit requirement slots and
  attachments. Do not rely only on "absence of a row" to represent needed docs.
- `cases`: post-submission tracking records, optionally linked one-way to an
  application.
- `entitlements`: app-owned mirror of RevenueCat authorization state.
- Deletion/export bookkeeping only if needed by implementation.

Core rules:

- Every table must be scoped by a server-derived owner id.
- Never trust client-supplied owner ids.
- `applications.status` should be durable and small: `draft`, `filed`, `closed`.
- Readiness and journey stage are derived from draft completeness, required
  documents, entitlement, and case state.
- `formType` and `applicationKind` are required at application creation.
- Draft data must be typed per supported form family. Avoid unstructured blobs for
  core form answers.
- Cases link to applications with `cases.applicationId`; applications should not
  store mutable case snapshots.
- Build indexes from the target reads first: owner home summary, owner documents,
  applicant hub, application detail, case lookup, entitlement lookup, and RevenueCat
  transaction/webhook dedupe.

## Save Semantics

There is no autosave.

Every **Next** action should:

- Validate the current step.
- Save the step payload by `applicationId` and `stepKey`.
- Update step completion/progress metadata.
- Return the next route or next step.

The mutation must be idempotent for repeated taps, retries, and offline replay.
Prefer stable step keys and monotonic `updatedAt` values over client-generated
status transitions.

## RevenueCat And Entitlements

RevenueCat is the purchase provider. Convex owns the app authorization mirror.

Required behavior:

- Client purchase state is never trusted alone.
- RevenueCat webhooks or server validation update Convex entitlements.
- Entitlement writes are idempotent by provider event id and/or transaction id.
- Refunds, revocations, and subscription-like provider states must remove access
  to paid output where policy requires it.
- Account deletion deletes app-owned entitlement rows and any app-owned purchase
  metadata. Do not retain financial records in Convex after deletion.

Payment copy must keep the Service Fee separate from the USCIS Filing Fee.

## Composition & UI Design

Composition & UI Design | HeroUI Native/Pro for the app. Follow the
`/heroui-pro-design-taste` skill. Use the `/react-composition-structure` skill
for component, file, and folder structure.

Practical rules for agents:

- Use HeroUI Native/Pro components for production UI when available.
- Before using a HeroUI Native/Pro component, look up the current API through the
  available MCP/tooling instead of guessing props.
- Prefer semantic variants and design-system tokens over one-off styling.
- Use restrained, utility-focused mobile UI. This is an operational product, not a
  marketing site.
- Use real icons from the established icon system. Do not use emojis as labels,
  headings, buttons, status markers, or empty-state art.
- Keep icon-only actions accessible with labels/tooltips where the platform
  supports them.
- Avoid nested cards and decorative gradients/orbs. Use full-width surfaces,
  lists, segmented controls, sheets, and dense but readable task flows.
- Design for empty state, one-applicant use, and multi-applicant family use from
  the start.
- Text must fit on small devices without overlap or viewport-based font scaling.

## React Native Composition

Keep routes thin. `src/app` should compose screens and route params; it should not
own domain logic.

Preferred module shape under `src/components`:

- `home/`
- `applications/`
- `applicants/`
- `interview/`
- `documents/`
- `review/`
- `cases/`
- `account/`
- `core/`
- `form/`

Within a route-bound module, prefer:

- `*.screen.tsx` for the screen composition.
- `*.data.ts` for Convex query/mutation orchestration and UI-facing data shaping.
- `*.types.ts` for module-owned types.
- `index.ts` for intentional public exports.
- Small leaf components colocated near the screen that owns them.

Shared primitives belong in `core`, `form`, hooks, and icon utilities. Do not move
single-use domain widgets into global shared folders prematurely.

## Suggested Route Shape

This is orientation only, not a build order.

- `src/app/(tabs)/index.tsx`: Home.
- `src/app/(tabs)/documents.tsx`: Documents.
- `src/app/(modal)/new-application.tsx`: create flow.
- `src/app/(modal)/interview/[applicationId]/index.tsx`: question-first interview.
- `src/app/(modal)/review/[applicationId]/index.tsx`: review, preview, and pay gate.
- `src/app/(modal)/upload.tsx`: unified document capture.
- `src/app/(modal)/account.tsx`: account/settings if needed.
- `src/app/(modal)/upgrade.tsx`: account or paywall upgrade surface.

If the current shell temporarily exposes more tabs than the target IA, treat that
as scaffold, not final product direction.

## ADR Amendments Needed

The old ADRs are still useful historical constraints, but several now need
explicit amendments before detailed implementation:

- ADR-0001: replace autosave wording with **Next saves the current step**.
- ADR-0003: keep I-765 and I-90 scope, but align language with Application as the
  product unit.
- ADR-0009/0010: re-check anonymous-to-credentialed gating against the new
  document upload, reminder, RevenueCat, and account deletion flows.
- ADR-0011: amend purchase provider choice to RevenueCat.
- ADR-0012/0013: keep question-first Interview and single form instance intent,
  but update folder names away from legacy `filing/` modules.

Until those ADRs are rewritten, this document supersedes their stale implementation
details but not their legal/privacy constraints.

## Resolved Decisions (2026-07-01 Domain-Modeling Session)

These resolve the ambiguities and conflicts between this document and the
foundations consolidation plan. Where they conflict with older text above,
these win. docs/internal/CONTEXT.md and ADR-0001/0003/0007/0010/0011/0012/0013 amendments
plus ADR-0014 record the same decisions.

1. **Terminology.** Application is the unit noun everywhere (UI, schema,
   code). "Filing" survives only as the act of submitting to USCIS and in
   act-sense compounds (Filing Fee, Filing Window, File-By Date, Filing
   Package — name kept). The field is `applicationKind`
   (`initial | renewal | replacement`); the plan's `filingKind` is dead.
2. **Build phasing.** Walkthrough phase first: real Convex schema, real
   queries/mutations, dev-only seed data, gates present but stubbed
   (account gate non-blocking; purchase = dev mutation flipping the
   entitlement), RevenueCat uninstalled. PII/security hardening and IAP
   are later phases. Client-side fixture data was rejected.
3. **Applicant model.** No user-profile table — Better Auth owns identity.
   The account holder is a lazily created applicant row flagged `isSelf`
   (at most one per owner), created at the first "Who is this for? →
   Myself". New owners have zero applicant rows.
4. **Answer storage (ADR-0014).** Draft-only; the interview never edits the
   applicant row. Person-facts promote draft → applicant profile when the
   user reaches Review (full-form schema passes); promotion overwrites
   (latest wins). New applications seed their draft from the profile at
   creation. A filed application's regenerated output reflects its own
   draft, not shared profile truth.
5. **Progress split.** `applications` carries only a durable summary
   (`currentStepKey`, completed/total counts, `updatedAt`) patched by every
   `saveApplicationStep`; the draft holds answers plus the per-step
   completion map. Dashboard reads never load drafts.
6. **Status transitions.** `draft → filed` by explicit "I've filed it" or
   automatically on case link (receipt-number entry is evidence of filing);
   `filed → closed` by user archive or a one-tap prompt when the linked
   case hits a terminal status. Paying/printing never changes status.
7. **Table roster (7).** `applicants`, `applications`, `applicationDrafts`,
   `applicationDocuments`, `documents`, `cases`, `entitlements`.
   `applicationDocuments` = requirement slots
   `{ applicationId, requirementKey, status: needed | attached | waived,
   documentId? }`, materialized at creation from a per-(formType,
   applicationKind) template and reconciled idempotently after each
   Next-save. No derived Home view-model table; no events table.
8. **Home dashboard.** Headline: "You have N documents expiring and N
   active applications" (the mockup's "processes" renders as
   Applications). Active Application = status ≠ closed. Attention Items
   derive from exactly two sources: documents expiring inside the filing
   window (with "Affects N applications" via slot links) and
   needed-but-missing slots on active applications — computed, bounded,
   no dismissal state. Recent Activity = a brief bounded merge of row
   timestamps (applications/documents/cases), no events table; the case
   timeline is a small embedded `statusHistory` on `cases`.
9. **Vault versioning.** Append-only document rows. "Upload new version"
   from a document's detail screen sets supersedes/supersededBy links; a
   fresh capture starts an independent document (dual passports coexist).
   Current = not superseded. Slots pin the exact `documentId`.
10. **Journey Hub.** A pushed detail screen
    `(tabs)/(home)/application/[applicationId]` owns the
    Prepare | Documents | Review & Pay | Track spine. Rail cards open the
    Hub; an inline Continue deep-links into the interview modal.
    Interview, review, and upload stay root modals.
11. **Entitlements.** Per-application mirror
    `{ ownerId, applicationId, status: active | revoked,
    source: revenuecat | devStub, provider ids for dedupe }`; Convex is the
    authorization source of truth; RevenueCat chosen as provider
    (ADR-0011 amendment).
12. **Seed contract.** One dev-only mutation seeds the current owner with a
    family demo: 3 applicants (self + spouse + child); documents covering
    expiring-in-window, healthy, and a superseded pair; 5 applications
    spanning fresh-draft, interview-complete-at-Review, unlocked
    (dev entitlement), filed-with-linked-case (mid statusHistory), and
    closed; plus one application missing a required document. A companion
    reset mutation wipes back to empty. Invoked from a dev-only Account
    section and via `npx convex run`. The seed doubles as the walkthrough
    acceptance checklist.

## Verification Expectations

For rebuild PRs:

- Run typecheck and lint.
- Add focused tests with the first real domain logic.
- Backend tests must cover owner scoping, step-save idempotency, deletion cascade,
  RevenueCat webhook dedupe, and entitlement revocation.
- UI work should be checked on small and large mobile viewports before handoff.

