# Monetize via a one-time Service Fee to obtain the completed filing, not a subscription

The app is **free to sign up and free to prepare**: the entire question-first Interview ([ADR-0012](./0012-question-first-interview.md)), autofill, Document Vault, deadline tracking + reminders, case tracker, and a **watermarked Preview** of the finished form rendered on the real current-edition USCIS form are all free. A single **one-time Service Fee, charged per Filing** at the moment the user obtains the print-ready output (the clean PDF + mailing instructions), is the only charge. The fee includes **unlimited edits and re-renders** of that Filing and **unlimited re-downloads** across devices. This **supersedes** the PRD's "free for now" entry and removes "monetization" from "What We're NOT Building."

## Why one-time per filing, not subscription

These filings are episodic and infrequent (EAD/I-765 ~every 1–2 years; green-card/I-90 ~every 10 years), so a subscription would sit idle, read as a trap, and raise buyer's-remorse and churn. A one-time, pay-for-output charge matches the "I need this form now" mental model and mirrors CitizenPath/SimpleCitizen self-help pricing. **Preview-before-pay** (the TurboTax CompleteCheck pattern) is the single biggest conversion lever and removes purchase risk: the user sees their finished filing on the official form before paying. A discounted **returning-customer / renewal price** rewards the retention thesis without subscription framing.

## Two distinct gates

The **free account gate** ([ADR-0010](./0010-account-gate-at-first-sensitive-action.md)) fires earlier, at the first sensitive action (identity/PII — never money). The **payment gate** sits strictly downstream, at the final "obtain output" step, after the free interview, completeness scan, and watermarked preview. A free account is required before payment so the entitlement binds to a recoverable identity. All value is felt before any charge.

## Considered Options

Fully free (no revenue — superseded); **one-time per-filing Service Fee with a returning-customer renewal discount (chosen)**; subscription/membership (poor fit for infrequent filings, trap perception — rejected); charge to start/prepare (kills activation — rejected).

## Consequences

- The **Service Fee must be itemized as strictly separate from the USCIS Filing Fee** (the government fee, which we never collect; the user pays USCIS directly when mailing — ADR-0006). Checkout/receipt copy must not imply we file or guarantee approval ([ADR-0004](./0004-information-only-no-legal-advice.md)); counsel reviews disclaimers and any guarantee wording.
- **Apple Guideline 3.1.1 requires the in-app digital unlock to use Apple In-App Purchase** (Google Play Billing on Android), ~15–30% commission. Model the unlock as a repeatable **Consumable** IAP backed by a server-side **entitlement record in Convex** (do not rely on store "restore"), so unlimited edits/re-downloads survive reinstall and sync across devices. The US-storefront external-link allowance and the physical-goods carve-out (an optional print-and-ship add-on) are the only paths outside IAP.
- **Client purchase layer — evaluate two options:** `react-native-iap` (OpenIAP; has an Expo config plugin — see openiap.dev) for a lower-level, dependency-light integration, vs **RevenueCat** for managed receipt validation + cross-platform entitlements at the cost of a third-party dependency/fee. Either way, the **source-of-truth entitlement lives in Convex** (verify the store receipt server-side, then grant the per-filing entitlement), so the app never trusts the client alone.
- **Anti-remorse mechanics are required:** watermarked preview before pay; "one-time, no subscription" stated at the gate; price shown up front (avoid hidden-price/dark-pattern reputation); a bounded refund window; and a completeness guarantee scoped to clerical completeness only — never outcome/approval.
- **Equity:** preparation + preview stay genuinely free so no one pays merely to learn whether they qualify; consider reduced pricing / fee waivers.
- Exact prices, the renewal-discount amount, and family/multi-applicant bundles are **business decisions** (launch ranges to test, not fixed by this ADR): I-765 ~$39–59, I-90 ~$49–79, or a flat ~$49–59 per renewal; returning-customer ~25–40% off; second household applicant ~40–50% off.

## Amended (2026-07-01)

The client purchase layer is decided: **RevenueCat** (products, offerings, paywall surface, receipt validation) over `react-native-iap`. Convex keeps a minimal per-application **entitlement mirror** — `{ ownerId, applicationId, status: active | revoked, source: revenuecat | devStub, provider transaction/event ids for idempotent webhook dedupe }` — updated only by RevenueCat webhooks/server validation; the client never grants unlocks from local purchase state. Real IAP testing requires a development build (Expo Go previews only). Account deletion removes all app-owned entitlement rows and purchase metadata — no financial records survive in Convex. During the walkthrough phase a dev-stub mutation flips the entitlement; the RevenueCat SDK is not installed until the IAP phase. Language: the fee is charged per **Application**; the paid output keeps the name **Filing Package** (act-sense compound, per docs/internal/CONTEXT.md).
