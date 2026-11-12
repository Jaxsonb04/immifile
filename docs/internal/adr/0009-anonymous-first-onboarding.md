# Anonymous-first onboarding; require account upgrade to complete a filing

Onboarding lets a person fill their profile and first filing under an anonymous identity (Better Auth anonymous plugin) so they invest effort before hitting any signup wall, maximizing activation. Account upgrade to email or social login is **required at the Review / complete-filing step** — the natural commitment moment, matching the PRD flow "Review and Sign Up/In" — before the filing can be exported/submitted. The anonymous user's data is backfilled into the upgraded account via `onLinkAccount`.

## Why upgrade is required at completion, not optional

An anonymous-only account is not recoverable across devices and has no verifiable identity, which would break the Phase 1 "profile survives re-login" criterion and leave the GDPR/CCPA export/deletion requirements without a verifiable subject. Requiring upgrade exactly when the user completes a filing preserves both activation (effort first) and recoverability/deletability (identity captured before any sensitive PII leaves the device anonymously).

## Risks / fallback

The Better Auth anonymous plugin has known open issues on Convex (`get-convex/better-auth#180`, `better-auth#5824`(closed this as completedin #5825 on Jan 8)) — verify these are resolved/workable before relying on it. If blocked, fall back to a sign-up-first flow.

## Consequences

The anonymous → credentialed account-linking flow (profile-preserving) is required work for Phase 1, and sensitive document storage ([ADR-0007](./0007-document-vault-stores-files-versioned.md)) should be gated behind the upgraded identity.

## Amended (2026-07-01)

Read this ADR through [ADR-0010](./0010-account-gate-at-first-sensitive-action.md): the "upgrade required at the Review / complete-filing step" clause was already superseded by the contextual gate at the first sensitive action, and the 2026-07-01 rebuild re-confirmed that gate. What still holds here: the anonymous-first principle, the silent anonymous session, and the `onLinkAccount` backfill. Language: "filing" above reads as *Application* (the unit) per docs/internal/CONTEXT.md.
