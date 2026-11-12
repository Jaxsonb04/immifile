# Require the account upgrade at the first sensitive action (document upload / submit), not at Review

The required anonymous → credentialed upgrade triggers at the **first action that handles confidential PII or is irreversible** — uploading a Document, generating/submitting a Filing, or enabling push reminders — rather than at the Review / complete-filing step. This **amends [ADR-0009](./0009-anonymous-first-onboarding.md)**, whose "upgrade required at the Review / complete-filing step" clause is replaced by this contextual action-gate.

Entry leads with a single **"Start filing"** call to action into form selection; the Better Auth anonymous session is created **silently** on form selection (no explicit "Continue as Guest" choice, because the "guest" framing cheapens the invested effort). "Sign in" remains a small affordance for returning users. Everything non-sensitive — form selection, adding oneself as an Applicant, profile fields, **card expiry captured as a date field** (not a file), the deadline reveal, and browsing the tabs — stays available anonymously.

## Why upgrade moves earlier than ADR-0009

Document upload is the natural "do I trust you with my passport?" moment and is where confidential PII first enters, so the ask is self-justifying — *"create a free account to securely store your documents"* — and aligns with [ADR-0007](./0007-document-vault-stores-files-versioned.md), which already requires document storage to sit behind an upgraded identity. Placing the wall here still captures a verifiable, recoverable identity before any sensitive file leaves the device, while preserving the activation goal: by upload time the person has chosen a form, built a profile, and seen their real deadline (value delivered before any wall). The model is endowed-progress / sunk-cost — maximize anonymous investment and a populated, personalized Home before the ask, framed as "save your progress," not a paywall.

## Considered Options

Gate at Review (ADR-0009 — more accumulated effort, but later identity capture and a less self-justifying ask); gate at app open (current `auth.tsx` — kills the activation loop); **contextual gate at the first sensitive action (chosen)** — one shared `requireAccount()` guard + upgrade sheet reused across upload, submit, reminders, and adding dependents.

## Consequences

- ADR-0009 is amended: its gate-placement clause is superseded; its anonymous-first principle and `onLinkAccount` backfill still hold.
- Build a single `requireAccount()` guard + upgrade sheet pattern (the shield/safe mascot pose) reused across every gated action, so the locked/unlocked line stays consistent.
- Anonymous-created data (profile, applicant, filing draft, Document **metadata**) backfills via `onLinkAccount`; Document **files** persist only post-upgrade (ADR-0007).
- Push reminders are gated: a push token must bind to a recoverable account, not a throwaway anonymous identity.
- The known Better Auth anonymous-plugin-on-Convex risks noted in ADR-0009 still apply and must be verified before relying on this flow.

## Amended (2026-07-01)

Re-checked for the ground-up rebuild: the contextual gate at the first sensitive action **survives unchanged** (document upload, obtaining the Filing Package, push reminders). "Start filing" entry copy and the silent anonymous session stay. During the **walkthrough phase**, the gate UI exists but is non-blocking (stubbed) and RevenueCat/IAP is not installed; enforcement lands in the PII/security and IAP phases. Language: Filing → Application per docs/internal/CONTEXT.md.

## Amended (2026-07-06) — the community forum duplicates the gate on the server

The community forum (M4) is a **public write surface**. Unlike document upload
or filing — private, single-owner actions where the client `requireAccount()`
gate is sufficient — forum posts, comments, and reports are visible to everyone,
so a client-only gate is bypassable by any direct Convex call and would let an
anonymous session inject public content. The forum therefore **duplicates the
account gate on the server**: every forum write (`convex/community.ts`) goes
through `requireCredentialedOwnerId` (`convex/lib/auth.ts`), which requires an
authenticated, **non-anonymous** owner.

This does not change the model for the existing private actions (their client
gate stays). The server check is deliberately isolated — `requireOwnerId`'s
identity derivation plus a *separate* `isAnonymous` assertion — so the
identity/ownership path never depends on the claim: a missing or false
`isAnonymous` can only ever ALLOW a write, never wrongly block a real account.
Reading `isAnonymous` server-side is possible because the Better Auth `convex()`
plugin's default `definePayload` spreads the user record (including
`isAnonymous`) into the JWT that surfaces on the Convex identity — the same
mechanism that surfaces `sessionId`. The M4-T2 client gate mirrors this for UX
(the in-place upgrade sheet), but the server is the authoritative boundary.
