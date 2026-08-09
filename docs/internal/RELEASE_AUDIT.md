# Release audit — M5-T3 (2026-07-07)

> **Status: historical record, superseded 2026-07-27.**
>
> This is the 2026-07-07 audit, kept as written. Do not use it as the current
> state of the app — several of its file paths and open items are out of date:
>
> - Its §2 FINDING ("the Better Auth user row survives deletion; `user.deleteUser`
>   must be enabled before public release") **has since been fixed**. Deletion now
>   runs through Better Auth's password-confirmed `deleteUser` with a
>   `beforeDelete` cascade, covered by `convex/auth.integration.test.ts`.
> - Its §4 FINDING on rate limits ("no size bound on owner-scoped writes") is
>   superseded: the filing and community endpoints are now closed on the server
>   by the release gate (`convex/lib/releaseGate.ts`), and Better Auth rate
>   limiting is configured in `convex/auth.ts`.
> - Screen paths it cites (`src/app/(modal)/account/index.tsx`,
>   `src/app/(tabs)/forms/index.tsx`) no longer exist; the M7 restructure moved
>   account settings to `src/screens/account/account.settings.tsx`.
>
> The current assessment is `RELEASE_AUDIT_2026-07-27.md` in the repository root.

Scope note: the plan's "Release audit" was reframed for this run per owner
decision — App Store submission work (store metadata, EAS submit, the App
Privacy questionnaire) is explicitly deferred. This audit verifies privacy,
in-app account deletion, accessibility, rate limits, and disclaimers, and ends
with the "left for release day" list. Contrast and reduced-motion were already
measured in `docs/internal/FABLE_NOTES.md` and are not re-verified here.

Verdicts: **PASS** (verified, no change), **FIXED** (gap found and fixed in
this audit), **FINDING** (documented, deliberately not fixed here).

## 1. Privacy

| Item | Verdict | Evidence |
|---|---|---|
| No secrets in the client bundle | PASS | `grep -rn "sk-ant\|apiKey\|ANTHROPIC" src/` → zero hits outside `EXPO_PUBLIC_*`. Only public config is read client-side: `src/components/providers.tsx:23` (`EXPO_PUBLIC_CONVEX_URL`), `src/lib/auth-client.ts:9` (`EXPO_PUBLIC_CONVEX_SITE_URL`) — both are public by design. |
| Anthropic key server-side only | PASS | Declared in the Convex deployment env (`convex/convex.config.ts:13`), read only in `convex/assistant.ts:76` and `convex/navigator.ts:111`. Never referenced under `src/`. |
| No PII logged | PASS | Only three `console.*` calls in non-test code: `src/hooks/use-haptic.tsx:113` (platform warning), `convex/news.ts:148` (RSS fetch error), `convex/navigator.ts:136` (Anthropic API error object, server-side only, explicitly never returned to the client per the comment at `convex/navigator.ts:133-135`). None logs answers, drafts, or document fields. |
| Chat transcripts device-session-only | PASS | `src/screens/assistant/assistant.data.ts:11` — "nothing is persisted"; transcript lives in hook state only. Convex stores only the per-owner daily counter (`assistantUsage`, `convex/schema.ts:191`). |
| Community pseudonymity | PASS | Public payloads built by allowlist constructors `toPublicPost`/`toPublicComment` (`convex/community.ts:70,83`) returning `authorHandle`, never `authorOwnerId`; double-enforced by `returns:` validators and the recursive-key test in `convex/moderation.test.ts`. Block rows reference the pseudonymous `profileId` + handle, never the blocked user's ownerId (`convex/schema.ts:248-258`). |
| No analytics / third-party trackers | PASS | `grep -rn "analytics\|posthog\|amplitude\|sentry\|segment\|firebase" src/ convex/ package.json` → zero SDK hits. Nothing to declare beyond Convex + Anthropic on the release-day privacy questionnaire. |
| Dev seed gated in production | PASS | `convex/dev/seed.ts:28` throws unless the `DEV_SEED_ENABLED` deployment env var is `'true'`; the UI section is additionally `__DEV__`-only (`src/app/(modal)/account/index.tsx`). Leave the var unset on prod. |

## 2. Account deletion

| Item | Verdict | Evidence |
|---|---|---|
| In-app delete surface exists and is reachable | **FIXED** | Before this audit `api.account.deleteAccountData` existed server-side but **nothing in `src/` called it** — there was no delete button anywhere. Added a "Delete account" section to the Account modal (`src/app/(modal)/account/index.tsx`, `DeleteAccountSection`): destructive confirm Alert → `deleteAccountData` → `authClient.signOut()`. Reachable from every tab via the person toolbar button (`router.push('/account')` in all five `src/app/(tabs)/**/index.tsx` files). |
| Deletion calls the cascade | PASS | `convex/account.ts:13-20` — `deleteAccountData` derives the owner server-side (`requireOwnerId`) and calls `deleteOwnerData` (`convex/model/ownerData.ts`). |
| Cascade covers every owner-keyed table | PASS | Schema tables vs. cascade, one by one: `applicants` ✓, `applications` ✓, `applicationDrafts` ✓, `applicationDocuments` ✓, `documents` ✓ (rows **and** storage blobs, `ownerData.ts:36-45`), `cases` ✓, `entitlements` ✓, `assistantUsage` ✓, `communityProfiles` ✓, `forumPosts` ✓ (+ third-party reports against them), `forumComments` ✓ (+ reports, + foreign `commentCount` adjust), `forumReports` ✓ (filed **and** received), `communityBlocks` ✓ (**both directions** — owner-as-blocker via `by_blocker`, and every other viewer's block pointing at the erased profile via `by_blockedProfile`, `ownerData.ts:170-200`). Not owner-keyed (correctly untouched): `newsItems`, `newsMeta` (global caches, no user data). Cascade coverage already test-verified in `convex/community.test.ts` / `convex/moderation.test.ts` (full-erasure tests incl. third-party reports and both block directions). |
| Auth user record deletion | **FINDING** | The Better Auth user row (email address) survives `deleteAccountData` — `user.deleteUser` is not enabled in `convex/auth.ts`, and the scope note in `convex/account.ts:8-11` assigns it to the deferred auth-hardening/PII phase (owner-deferred). All app data and files are gone; the remaining PII is the auth email + session rows. Must land before public release (App Review 5.1.1(v) expects full account deletion). |

## 3. Accessibility

| Item | Verdict | Evidence |
|---|---|---|
| Assistant send button | PASS | `src/screens/assistant/assistant.composer.tsx:49` `accessibilityLabel="Send message"`. |
| Icon-only toolbar buttons (all tabs) | **FIXED** | The nine `Stack.Toolbar.Button` instances (person/plus/folder/shield) had no labels. Added `accessibilityLabel` to all: "Account" ×5, "New post", "New case", "Document vault", "Moderation queue" (`src/app/(tabs)/forms/index.tsx`, `forms/documents/index.tsx`, `(assistant)/index.tsx`, `cases/index.tsx`, `community/index.tsx`). Prop supported per `expo-router/build/layouts/stack-utils/toolbar/shared.d.ts:11`. |
| Reminders Switch | **FIXED** | The heroui-native `Switch` in `src/screens/documents/documents.reminders.tsx` had no label association; added `accessibilityLabel="Renewal reminders"` (Switch extends Pressable props). |
| Block / report / delete actions | PASS | Already labeled: `community.detail.tsx:48` (`Delete this ${label}`), `:95` (`Block ${handle}`), `community.report.tsx:65` ("Report this content"), rules links labeled in `community.screen.tsx:79` / `community.new.tsx:80`; interview close/help labeled (`interview.header.tsx:17`, `interview.question.tsx:25`). |
| Moderation queue actions | PASS | Text-labeled buttons, not icon-only (`community.moderation.tsx:119,137,155,195` — Restore / Hide / Resolve / Dismiss / Load more). |
| Contrast + reduced motion | PASS (prior) | Measured and recorded in `docs/internal/FABLE_NOTES.md`; not re-run per scope. |

## 4. Rate limits and abuse bounds

| Item | Verdict | Evidence |
|---|---|---|
| Assistant quota 20/day + refund | PASS | `convex/assistantQuota.ts:11` `DAILY_MESSAGE_LIMIT = 20`; `reserveDailyMessage` throws at the limit (:35-37) with server-derived owner; `refundDailyMessage` returns the reservation when the Anthropic call fails pre-billing (`convex/assistant.ts:101-103`, `convex/navigator.ts:137-138`). |
| Community text bounds | PASS | `convex/shared/community.ts:33-36` — title ≤120, post/comment body ≤10,000, report note ≤500; enforced server-side via `requireText`/`optionalText` in `convex/community.ts:217-218,240,351`. |
| Public read page clamps | PASS | Every paginated list clamps to [1, 50] (`clampPageSize`, `convex/shared/community.ts:44-47`; used at `community.ts:508,543` and `moderation.ts:104`). |
| Report dedupe | PASS | `reportContent` (`convex/community.ts:357-365`) dedupes per (reporter, targetKey) via `by_reporter_and_targetKey` — duplicate report returns the existing id, no counter inflation; self-report rejected (:356). |
| Block cap | PASS | `MAX_BLOCKS_PER_OWNER` (200) enforced at `convex/community.ts:448-449`. |
| News fetch bounded | PASS | Cache capped at ≤12 items (`MAX_NEWS_ITEMS`, `convex/news.ts:92`), reads return ≤8 (`LATEST_NEWS_LIMIT`, :44), 15s abort timeout, URL prefix-validated twice against `https://www.uscis.gov/`. |
| Write mutations with no size bound | **FINDING** (low) | All PUBLIC-surface writes are bounded (above). But owner-scoped private writes accept unbounded strings: `documents.saveDocument` / `uploadNewVersion` `label` (`convex/documents.ts:101,171` — `v.optional(v.string())`, no cap) and the draft answer text fields (`convex/shared/applicationShapes.ts:29-58` — zod `.min()` but no `.max()` on street/city/names/etc.). Auth-gated so abuse ≈ self-DoS, but a cap (e.g. `.max(200)` per field, label ≤120) is cheap hardening. Not fixed here: the shared zod shapes feed the interview UI + PDF fill and their tests — bigger than an audit-sized change. |

## 5. Disclaimers

| Surface | Verdict | Evidence |
|---|---|---|
| Assistant persistent bar | PASS | `src/screens/assistant/assistant.screen.tsx:36` — "General information only — not legal advice." |
| Assistant greeting | PASS | `assistant.screen.tsx:20` — greeting ends "…I share general information only, not legal advice." Out-of-scope replies restate the boundary (`assistant.recommendation.ts:98`). |
| Community feed | PASS | `community.screen.tsx:75` ("Peer support … not legal advice") + empty-state copy (:65). |
| Community detail | PASS | `community.detail.tsx:220` persistent notice + composer copy (:257). |
| Community rules + composer | PASS | `community.rules.tsx:15-16` (rule #1, points to uscis.gov / licensed attorney / DOJ-accredited rep); new-post PII warning `community.new.tsx:49`. |
| Review/filing screen — fee provenance | PASS | `journey-hub.review-pay.tsx:30` ("Paid directly to USCIS (the U.S. government), never to this app"), :55 ("Confirm all details on uscis.gov before submitting"), :107; `src/lib/filing-info.ts:52` `FEE_DISCLAIMER` ("…Confirm the current fee … at uscis.gov/feecalculator … fee information, not legal advice") — test-pinned in `filing-info.test.ts:34-35`. New-application header repeats fee provenance (`new-application.header.tsx:9`). |
| News section | PASS | `assistant.news.tsx:64` "Official · uscis.gov" tag; only `https://www.uscis.gov/` URLs can ever be stored (`convex/news.ts`). |

## Left for release day (deferred per owner decision)

1. **App Store metadata + App Privacy questionnaire + EAS submit** — the entire
   store-submission track. Privacy answers from this audit: data collected =
   email (auth), user content (form answers, documents, forum posts); no
   trackers, no third-party analytics; data processors = Convex, Anthropic.
2. **Scheme + bundle-id rename coordination** — app is branded Immifile but the
   scheme/trustedOrigins are still `immigrationrenewalhelp://` (see
   `docs/internal/FABLE_NOTES.md` "Immifile rename"; `convex/auth.ts:40` must change in
   lockstep with `app.json` and the Better Auth deep-link config).
3. **Production Convex deploy + env** — set `OPENAI_API_KEY`,
   `MODERATOR_EMAILS` on prod; leave `DEV_SEED_ENABLED` unset; verify the
   6-hour news cron registers on prod.
4. **Better Auth hardening (owner-deferred)** — enable `user.deleteUser` and
   chain it through `deleteAccountData` so the auth email row dies with the
   account (finding §2); require email verification; review session lifetimes;
   trustedOrigins for the final scheme.
5. **Push-notification entitlements** — only if remote push is ever added;
   today's reminders are local-only (`expo-notifications` DATE triggers), which
   need no push entitlement.
6. **Sign in with Apple** — required by App Review the moment Google/GitHub
   social login ships (both are env-gated off today, `convex/auth.ts:26-37`).
7. **RevenueCat customer deletion** — noted in `convex/account.ts:9-10` for the
   IAP phase; not applicable while the package is free (commit 710a796).
