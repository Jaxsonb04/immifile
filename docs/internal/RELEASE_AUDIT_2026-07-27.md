# Immifile — Pre-Submission Release Audit

**Date:** 2026-07-27, 16:00–17:20 PDT (UTC−7)
**Audited commit:** `a76b92eedd6f30da96f41095f942f8c433ba9335` (`main` == `origin/main`, tree clean)
**Audit type:** read-only. No file, repository, deployment, DNS, Expo, Convex, Apple, or AWS state was changed. No secret value was retrieved or printed.

> **Do not move this file into `docs/`.** The GitHub Pages workflow builds the whole
> `docs/` directory as the public App Store support site, so anything placed there
> becomes world-readable (see F-38). This file is currently untracked; committing it
> to the **public** `Jaxsonb04/expo-immigration-app` repository would publish a list of
> unfixed security findings. Keep it untracked, move it to the gitignored `.scratch/`,
> or make the repository private before committing.

---

## 1. Executive verdict

| Question | Verdict |
|---|---|
| **Ready behind the Apple steps?** | **CONDITIONAL GO** |
| **Ready to create the first signed production build?** | **NO-GO** |
| **Ready to submit to App Review?** | **NO-GO** |

Five decisive reasons:

1. **The first production build will most likely fail at bundling.** `heroui-native-pro`
   publishes a **9 KB / 4-file stub**; its real 4.3 MB library is fetched by a licensed
   postinstall. Proven by executing the vendor's own installed code: that postinstall reads
   **`HEROUI_AUTH_TOKEN`** and returns `null` for `HEROUI_KEY` — the only variable configured
   on EAS. With no token it prints "Sign in to finish installing" and **exits 0**, so the
   install *succeeds* with a stub and Metro then fails to resolve
   `Calendar` / `DatePicker` / `EmptyState` / `Badge` / `Widget`.
2. **The release policy gates the client, not the backend.** `release-policy.json` is imported
   by exactly two server files. Confirmed from the public internet, unauthenticated, that
   production `enduring-toucan-31` answers `community:listPosts` with HTTP success. Filing-PII
   writes and the assistant are reachable by anyone holding a freely-mintable anonymous token.
   This does not block Apple's review of the binary, but it should block launch.
3. **Two irreversible identity decisions are still open and both must be settled *before* the
   build**: `supportsTablet: true` (which makes 13″ iPad screenshots mandatory — only 6.9″
   iPhone shots exist) and the bundle identifier `dev.uing.immigrationrenewalhelp`, which is
   permanent once submitted.
4. **App Store Connect metadata is still placeholdered** — review contact and demo account are
   literal `REQUIRED:` values, and a demo account with a synthetic case does not yet exist.
5. **Everything the repository can verify by itself is green.** Typecheck 0, lint 0,
   **725/725 tests across 45 files**, release-config validation passed, all six live production
   endpoints HTTP 200, static iOS export succeeded, working tree clean. The engineering baseline
   is genuinely solid; the blockers are configuration and decision items, not code quality.

---

## 2. Current-state architecture

| Layer | Current state |
|---|---|
| **Mobile app** | Expo SDK 57 / RN 0.86 / React 19.2, expo-router with typed routes + React Compiler. `Immifile` v1.0.0, iOS build 1, portrait (iPhone) / all-orientation (iPad), min iOS 16.4. |
| **Expo / EAS** | Account `jaxson04s-team`, project `immifile`, ID `ba1f9a98-c9d2-439c-92d0-50f591ddc8cf`. Remote version source; remote iOS buildNumber **1**; **zero builds exist**. Production profile → `environment: production`, `IMMIFILE_RELEASE_BUILD=true`, `autoIncrement: true`. |
| **Convex** | Team `jaxson-bie`, project `immifile`. Dev `wandering-jaguar-543`, prod `enduring-toucan-31` (started clean). Prod env holds exactly `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `DEV_SEED_ENABLED` — prod/dev secrets are distinct. |
| **Auth proxy** | `Jaxsonb04/immifile-auth-proxy` — **private**, default branch `main`, HEAD `cd8228aa`. Deployed on **Vercel** (not Railway), pure static + two rewrites → `enduring-toucan-31.convex.site`. Serves `auth.immifile.app`. |
| **GitHub** | App repo `Jaxsonb04/expo-immigration-app` is **PUBLIC**, issues enabled. PR #4 "Finalize support-only first release" merged 2026-07-27T22:43:11Z as `a76b92e`. Only one workflow exists (Pages) — **no CI**. |
| **DNS / public pages** | Porkbun nameservers; `auth.immifile.app` CNAME → Vercel. Apex + `www` serve an **HTTP-only Porkbun parking page with no TLS**. Privacy/support live on `jaxsonb04.github.io` via Jekyll Pages (both deploys succeeded). |
| **Support email** | `support@immifile.app`; MX → `fwd1/fwd2.porkbun.com`; SPF `v=spf1 include:_spf.porkbun.com ~all`; **no DMARC**. Forward destination not verifiable from DNS. |
| **HeroUI** | `heroui-native` 1.0.4 (OSS, real package) + `heroui-native-pro` 1.0.0-beta.5 (**licensed stub + CDN download**, MIT-licensed once fetched). Build hook: `node scripts/validate-release-config.mjs && npx -y hpsetup@latest native --auto`. |
| **Apple boundary** | No signing credentials, no App Store Connect record, no build, no submission — intentionally deferred. |

---

## 3. Workflow reconstruction

| # | Milestone | Status | Evidence |
|---|---|---|---|
| 1 | Earlier workflow audit continued | **Verified** | `docs/internal/RELEASE_AUDIT.md` (2026-07-07) present; its one blocking FINDING (Better Auth user row survived deletion) is now fixed and test-covered |
| 2 | Product strategy narrowed for first review | **Verified** | `docs/internal/APP_STORE_RELEASE.md` "Shipping surface"; app.json description matches |
| 3 | Five features disabled | **Partially verified** | Client: fully enforced. Server: enforced only for `socialLogin` + `passwordRecovery`. See F-01 |
| 4 | Convex migrated to Jaxson's team | **Verified** | `docs/internal/PRODUCTION_ACCESS_SETUP.md`; prod/dev env listings; zero stale deployment refs in active config |
| 5 | `immifile-auth-proxy` repo + deployment updated | **Verified** | HEAD `cd8228aa`; rewrites target `enduring-toucan-31`; live behaviour confirms deployed commit |
| 6 | Expo linked to Jaxson's team/project | **Verified** | `eas project:info` → `@jaxson04s-team/immifile`, ID matches |
| 7 | Public privacy + support pages created | **Verified** | Both HTTP 200, correct content, Pages workflow run `30311717005` succeeded |
| 8 | `support@immifile.app` Porkbun forward | **Partially verified** | MX + SPF present; **destination unverifiable without a test send** |
| 9 | AWS SES determined unnecessary | **Unknown** | No AWS profile except the unrelated WeatherEdge one, SSO token expired. Circumstantially supported: no `AUTH_EMAIL_*` vars on prod, `IMMIFILE_AUTH_EMAIL_CONFIRMED=false` |
| 10 | HeroUI vendor key configured for CI | **Contradicted (partially)** | `HEROUI_KEY` exists as an EAS production Secret, but it is **not the variable the package's postinstall reads**. See F-02 |
| 11 | Exposed key revoked and replaced | **Unknown** | Replacement created 2026-07-27 15:49:01. Revocation of the old key is vendor-dashboard state; retrieving either key is out of scope |
| 12 | Replacement key added as an Expo production Secret | **Verified** | `HEROUI_KEY`, Scope PROJECT, **Visibility SECRET**, Environments `production` only |
| 13 | Apple steps deferred | **Verified** | No builds, no credentials configured |
| 14 | Non-interactive build initialised remote build number then stopped | **Verified** | `build:version:get --platform ios` → `1`; `build:list` → `[]` |

---

## 4. Evidence ledger

| Claim | Evidence | Status | Confidence |
|---|---|---|---|
| Working tree clean; `main` == `origin/main` | `git status --porcelain` empty at audit start; `git rev-parse HEAD origin/main` both `a76b92e…` | Confirmed | High |
| Merge commit `a76b92e` / PR #4 | `gh pr view 4` → mergeCommit `a76b92eedd6f…`, MERGED | Confirmed | High |
| Version 1.0.0, iOS build 1 local | `app.json` v1.0.0, `ios.buildNumber "1"` | Confirmed | High |
| EAS remote versioning, remote build 1 | `eas.json` `appVersionSource: remote`; `build:version:get` → 1 | Confirmed | High |
| No production iOS build exists | `eas build:list --json` → `[]` | Confirmed | High |
| Name / bundle ID / scheme / team ID | `expo config --type introspect` → `dev.uing.immigrationrenewalhelp`, scheme `immigrationrenewalhelp`, `F8V4932HJN` | Confirmed | High |
| Legacy identifiers not evaluated | No ADR or decision record; `FABLE_BRIEF.md:47` defers it | Confirmed (still open) | High |
| Expo account/project/ID | `eas project:info` → `@jaxson04s-team/immifile` / `ba1f9a98-…` | Confirmed | High |
| Production profile uses production env | `eas.json`; EAS CLI echoed the 9 plaintext vars + profile `IMMIFILE_RELEASE_BUILD` | Confirmed | High |
| All 10 production variables present | `eas env:list production --format long` | Confirmed | High |
| `HEROUI_KEY` production-scoped, Secret | Same listing → Visibility SECRET, Environments `production` | Confirmed | High |
| Replacement key valid / old key revoked | Vendor dashboard state; retrieving keys is out of scope | Unknown | — |
| Convex team/project/deployments | `docs/internal/PRODUCTION_ACCESS_SETUP.md` + env listings for both | Confirmed | High |
| Prod endpoints `…convex.cloud` / `.site` | `check-production-readiness.mjs` → both HTTP 200 | Confirmed | High |
| Prod deployed with seeding disabled | Prod `DEV_SEED_ENABLED=false`; `dev/seed.ts:29` requires literal `'true'` (fail-closed) | Confirmed | High |
| Auth config points at production | `BETTER_AUTH_URL=https://auth.immifile.app`; `getAuthConfigProvider()` derives issuer from `CONVEX_SITE_URL` | Confirmed | High |
| No stale team/deployment refs in active config | Only historical docs mention `impressive-fish-50` / `fluid-design-io`; shipped bundle contains neither | Confirmed | High |
| `auth.immifile.app` healthy | Discovery 200, JWKS 200 (RS256, 1 key), `/api/auth/get-session` 200 → `null` | Confirmed | High |
| Proxy points only at migrated resources | `vercel.json` rewrites → `enduring-toucan-31.convex.site`; no localhost/preview/old refs | Confirmed | High |
| Privacy/support pages live and accurate | Both 200; content matches shipped behaviour | Confirmed (2 omissions, F-13/F-14) | High |
| Porkbun forwards to `jaxsonbie@gmail.com` | MX present; destination not in DNS | Unknown | — |
| Build hook command | `package.json` `eas-build-pre-install` matches exactly; no `--no-cache` | Confirmed | High |
| Vendor docs require `HEROUI_KEY` | Both attachments byte-identical; `HEROUI_KEY` for hpsetup | Confirmed | High |
| No SES/Lambda/secret residue | AWS SSO token expired; no read access | Unknown | — |
| No secrets in tracked files or history | Redacted scan across all refs → only `hp_REQUIRED_SECRET` and `REQUIRED_32_PLUS…` placeholders | Confirmed | High |

---

## 5. Findings

### P0 — None found.

No active compromise, no live data exposure, no destructive production failure. Production
Convex started clean and the open community endpoint currently returns an empty page.

---

### P1

#### F-01 · Security/Privacy · The release policy gates the client; the Convex API is ungated

**Evidence.** `release-policy.json` is imported by exactly three files repo-wide —
`src/lib/release-policy.ts:1`, `convex/crons.ts:3`, `convex/shared/socialProviders.ts:2`.
Nothing in `convex/community.ts`, `applications.ts`, `applicants.ts`, `documents.ts`,
`assistant.ts`, or `navigator.ts` reads it. Proven live, unauthenticated, from the public
internet:

```
POST https://enduring-toucan-31.convex.cloud/api/query  {"path":"community:listPosts",…}
→ {"status":"success","value":{"page":[],"isDone":true,…}}
```

Owner-scoped queries correctly reject the same caller (`applications:listApplications` → error,
no info leak).

**Current behaviour.** Community reads are world-readable with no credential; community writes,
the full filing-PII write path (A-number, passport / I-94 / SEVIS numbers, DOB, addresses,
parents' names, physical description, immigration history — `convex/shared/applicationShapes.ts:228-296`),
and the assistant actions are all callable by anyone holding a session token. Anonymous tokens
are free and unlimited. `MODERATOR_EMAILS` is unset on production, so `requireModerator` throws
for **everyone** — nobody can moderate content that reaches the forum.

**Impact.** An unmoderated, publicly-readable UGC surface and a PII write path that the shipped
privacy policy says does not exist in this release.

**Fix.** Add the guard pattern that already exists in-repo (`if (!releasePolicy.community) throw …`)
to the first line of every handler in `community.ts`, `moderation.ts`, `applications.ts`,
`applicants.ts`, `documents.ts`, `home.ts`, `renewals.ts`, `assistant.ts`, `navigator.ts`.
Set `MODERATOR_EMAILS` regardless. ~20 lines closes all three feature families.

**Blocks App Review:** No (the binary cannot reach any of it). **Blocks launch:** Yes.
**Owner:** agent-completable. **Confidence:** high.

#### F-02 · Build · The configured HeroUI secret is not the variable the package authenticates with

**Evidence.** `npm view heroui-native-pro@1.0.0-beta.5 dist.unpackedSize` → **8977**,
`fileCount` → **4**, `scripts.postinstall` → `node ./dist/postinstall/index.js`.
On disk: `node_modules/heroui-native-pro/lib` is **4.3 MB / 355 JS files**.
The postinstall calls `getCIToken()` from `heroui-pro/auth/ci`; executed directly:

```
no env            -> null
HEROUI_KEY        -> null
HEROUI_AUTH_TOKEN -> "hp_dummy_not_a_real_key"
```

With no token and no local keyring it prints "Sign in to finish installing" and
**`process.exit(0)`** — the install succeeds with a stub.

**Current behaviour.** On an EAS builder only `HEROUI_KEY` exists. The pre-install hook runs
`hpsetup` (which does read `HEROUI_KEY`) *before* `node_modules` exists; the subsequent
`bun install` re-extracts the package and re-runs its postinstall, which cannot authenticate.
`heroui-native-pro` is imported by six screens, so an unpopulated stub fails Metro resolution.

**Impact.** High-probability failure of the first production build — and it fails *late*, after
minutes of build time, with a confusing module-resolution error rather than an auth error.

**Fix.** Add **`HEROUI_AUTH_TOKEN`** as a *second* EAS production Secret holding the same `hp_`
key. Do **not** remove `HEROUI_KEY` — hpsetup genuinely needs it, exactly as the trusted vendor
documentation says. This is additive, and the evidence for the second name is the vendor's own
installed code, not third-party documentation.

**Residual.** Whether hpsetup's pre-install run alone would have sufficed can only be settled by
an actual build. **Owner:** user (EAS secret) + agent (hook change if desired).
**Confidence:** high on the mechanism, medium on whether the build fails without the fix.

#### F-03 · App Store · iPad screenshots are mandatory and do not exist; the decision is build-affecting

**Evidence.** `app.json` → `ios.supportsTablet: true`; introspected plist grants iPad all four
orientations. Apple: *"iPad 13″ screenshots are **required** if your app runs on iPad"*
(https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/).
Only four 6.9″ iPhone captures exist (`docs/internal/app-store-assets/screenshots/*.png`, 1320×2868,
tracked in git). `docs/internal/APP_STORE_METADATA.md` plans iPhone only.

**Impact.** App Store Connect will not accept the submission without a 13″ iPad set
(2064×2752), and the app has had no iPad QA — a portrait-designed layout rotating into iPad
landscape is a Guideline 2.1 risk.

**Fix.** Either capture iPad screenshots **and** QA the iPad layout, or set
`supportsTablet: false`. Because that flag is compiled into the binary, this must be decided
before the first build. **Owner:** user decision; agent can implement either.
**Confidence:** high.

#### F-04 · App Store · Review metadata contains literal placeholders and no demo account exists

**Evidence.** `docs/internal/APP_STORE_METADATA.md` — contact first/last/phone/email and demo
username/password are all `REQUIRED`; the doc itself notes "The final production demo account
and synthetic case are still required".

**Impact.** Apple rejects submissions lacking working reviewer credentials for account-gated
functionality — and here **saving a case requires a permanent account**
(`cases.new.tsx:63` `useRequireAccount`), so a reviewer with no account sees only an empty Cases
tab, Resources, and Account.

**Fix.** Create a production demo account with one synthetic case, keep it live throughout
review, fill every placeholder. **Owner:** user (App Store Connect + production account).
**Confidence:** high.

#### F-05 · Privacy/Operational · The only private support channel is unverified

**Evidence.** MX → `10 fwd1.porkbun.com`, `20 fwd2.porkbun.com`; SPF valid. The forward
*destination* is Porkbun panel state, absent from DNS; no test message was sent. Both public
pages and the in-app Support screen route **all** account-access, deletion, and privacy requests
to `support@immifile.app`.

**Impact.** If the forward is not actually configured, every privacy and deletion request
vanishes silently — a GDPR/CCPA exposure and a broken published commitment. It is also the sole
recovery path for a locked-out user (F-07).

**Fix.** Send one message to `support@immifile.app` and confirm arrival at the Gmail
destination. **Owner:** user. **Confidence:** high that it is unverified.

#### F-06 · Security · No rate limiting anywhere; free unlimited identities; unbounded uploads

**Evidence.** Repo-wide grep for `ratelimit|throttl|captcha|turnstile` across `convex/`, `src/`,
`package.json` → zero hits. `betterAuth({…})` (`convex/auth.ts:27-98`) passes no `rateLimit`
option. `documents.generateUploadUrl` (`documents.ts:103`) requires only `requireOwnerId`, which
**accepts anonymous sessions**; no per-owner document count or size cap, no content-type check.
The assistant's 20/day quota is per-owner, so it resets for every new anonymous identity.

**Impact.** `POST /api/auth/sign-in/anonymous` → `generateUploadUrl` → upload → repeat is an
unbounded storage/bandwidth cost loop and a mechanism for hosting arbitrary content on your
infrastructure. Hourly temp-account cleanup bounds steady state at ~48 h, not a burst.

**Fix.** Configure Better Auth `rateLimit` with a database store; require
`requireCredentialedOwnerId` for `generateUploadUrl`; cap documents per owner (the codebase
already caps renewals at 20 and blocks at 200). **Owner:** agent-completable.
**Confidence:** high.

#### F-07 · Product/Privacy · A forgotten password is permanent, unrecoverable account loss

**Evidence.** `release-policy.json` `passwordRecovery: false`; `convex/auth.ts:33`
`requireEmailVerification: false`; deletion for credentialed accounts requires the current
password (`account.settings.tsx:123`, `authClient.deleteUser({ password })`); anonymous sessions
have no sign-out at all (`SignInSection` returns `null` when not credentialed,
`account.settings.tsx:49`).

**Impact.** A user who mistypes their email at sign-up or forgets their password can neither
sign in, nor recover, nor delete their own data — the account and its receipt numbers are
stranded. Support cannot authenticate such a request either, since the support page instructs
users **not** to send identifying details by email.

**Fix (minimum).** State the limitation in the sign-up flow and on the support page, and define
an authenticated fallback. Ideally re-enable password recovery before launch — the code and
tests already exist and pass. **Owner:** agent-completable (copy); user decision (scope).
**Confidence:** high.

---

### P2

**F-08 · Storage blobs orphaned by upload, and they survive account deletion.**
`generateUploadUrl` (`documents.ts:103`) and `saveDocument` (`:116`) are separate transactions;
the deletion cascade iterates the `documents` table only (`model/ownerData.ts:79-88`, `:283-292`)
and `OWNER_DATA_TABLES` has no `_storage` entry. Any upload whose `saveDocument` never lands is
permanent. A user who deletes their account can leave uploaded immigration documents behind.
Undercuts the "we delete everything" claim. *Agent-completable.*

**F-09 · `account.deleteAccountData` destroys everything with a bearer token and no re-authentication.**
`convex/account.ts:44-52` — a public action whose only check is `getUserIdentity() !== null`,
while the UI path correctly requires a password. Any leaked 15-minute JWT becomes a
total-data-destruction primitive. Restrict to anonymous identities or make it `internalAction`.

**F-10 · `dev/seed` is public in production, one env flip from a data-wipe endpoint.**
`seedDemo` and `resetOwner` are deployed `public`; `resetOwner` wipes the caller's entire
workspace. Inert today (gate is fail-closed and prod `DEV_SEED_ENABLED=false`), but the client
`__DEV__` guard is irrelevant to a direct API call. Exclude `convex/dev/` from production or
convert to internal.

**F-11 · Bundle identifier and URL scheme are the partner's, and become permanent on submission.**
`dev.uing.immigrationrenewalhelp` (iOS + Android), scheme `immigrationrenewalhelp`, also
hardcoded at `convex/shared/socialProviders.ts:28` and in `trustedOrigins` (`convex/auth.ts:29`).
`uing` is the partner org's reverse domain and the scheme is the retired product name. Changing
it later requires a new App Store Connect record. **Decide before signing credentials are
created.** *User decision.*

**F-12 · No app-level privacy manifest will be generated.**
Clean-tree introspection → `ios.privacyManifests` absent;
`@expo/config-plugins/build/ios/PrivacyInfo.js:46-47` only emits when the config declares
entries. Ten third-party `.xcprivacy` files ship with the pods (react-native, expo-file-system,
expo-device, expo-constants, expo-localization), which covers the third-party SDK requirement
(https://developer.apple.com/support/third-party-SDK-requirements/); Expo's guidance
(https://docs.expo.dev/guides/apple-privacy/) is that a manifest is needed *"only if your app
uses native libraries that call 'restricted reason' APIs."* Risk is an ITMS-91053 "Missing API
declaration" email after upload rather than a rejection. Cheap insurance: declare
`NSPrivacyAccessedAPICategoryUserDefaults` / `CA92.1`. *Build-affecting.* **Confidence:** medium.

**F-13 · The privacy policy omits Vercel as a processor.**
Every authentication request transits `auth.immifile.app` (Vercel edge), which necessarily
processes IP and user agent. The service-provider paragraph names Convex, Porkbun, and Google
only. Accuracy defect in a document Apple relies on. *Agent-completable.*

**F-14 · The non-affiliation disclaimer is missing from the privacy and support pages.**
It appears only on the site index (`docs/index.md`). Reviewers open the privacy and support URLs
directly. For an immigration app this is the single most valuable sentence to repeat.
*Agent-completable.*

**F-15 · `immifile.app` apex and `www` have no TLS.**
`curl https://immifile.app/` → `sslv3 alert handshake failure`; `http://` → 200 Porkbun parking
page (`X-Powered-By: PHP/8.0.25`). The domain in the app's support address serves a plain-HTTP
parking page. A wildcard `*.immifile.app` → `pixie.porkbun.com` also makes convincing lookalike
subdomains resolvable. Relatedly, hosting privacy/support on `jaxsonb04.github.io` rather than
`immifile.app` is acceptable to Apple (stable, signed-out-accessible, HTTPS, HSTS) but weaker on
trust and durability — it ties two legally-operative URLs to a personal GitHub username.

**F-16 · No DMARC record.**
`_dmarc.immifile.app` returns a wildcard CNAME to `pixie.porkbun.com`, not a policy. With only
SPF softfail, `@immifile.app` is spoofable — and users are told to trust that domain for account
and privacy matters. Publish a real TXT policy (it overrides the wildcard).

**F-17 · Offline and error UX are undesigned.**
No error boundary exists in `src/` (grep for `ErrorBoundary|componentDidCatch|getDerivedStateFromError`
→ zero), so route errors fall through to expo-router's **default** boundary, which renders an
unbranded "Something went wrong / Error: `<raw message>`" screen — it would surface strings like
`Account deletion is in progress` verbatim. Separately, `expo-network` is a dependency but is
never imported (zero hits for `expo-network|isConnected|NetInfo|offline`), and a Convex
`useQuery` that never resolves leaves `CasesScreen` on `<ScreenLoading />` indefinitely with no
retry affordance. Guideline 2.1 rejections for "stuck on a loading screen" are common. Needs
device testing to size precisely.

**F-18 · Every disabled feature ships inside the reviewed binary.**
`strings` on the exported Hermes bundle finds `A-Number`, `Report this content`,
`Community rules`, `eligibility category` all **PRESENT** (11 MB `.hbc`, 19 MB export). Clean
signals too: `Anthropic`, `sk-ant`, `Seed demo data`, and the dev deployment name are all
**absent**, and the only Convex hosts in the bundle besides production are
`happy-otter-123`/`impressive-fish-50`, which trace to the `convex` npm package's own
error-message examples (`node_modules/convex/dist/esm/react/client.js`) — not stale config. The
routes are unreachable (source-controlled constant + default-deny deep-link guard), so review
risk is low, but the dead weight is real.

**F-19 · Guideline 4.2 minimum-functionality risk.**
The shipped surface is: manual receipt-number entry with a self-maintained timeline, five
official links, and account management. Apple: *"Other than catalogs, apps shouldn't primarily be
marketing materials, advertisements, web clippings, content aggregators, or a collection of
links."* The manual tracker is genuine app functionality and the drafted description leads with
it, which is the right mitigation — but this is the most likely rejection reason after metadata.

**F-20 · No CI.**
`gh run list` shows only two runs ever, both the Pages workflow. Nothing runs typecheck, lint, or
the 725 tests on a PR. The suite is fast (1.7 s) and green; wiring it is cheap.
*Agent-completable.*

**F-21 · An unencrypted export of the previous Oliver-team database sits on disk.**
`.scratch/convex-migration/` holds `oliver-expo-immigration-app-dev-2026-07-27.zip`,
`jaxson-immifile-dev-import-2026-07-27.zip`, and an extracted tree (76 MB) containing real
applicant PII and uploaded documents with file storage. Correctly gitignored (`.gitignore:44`)
and absent from git — but it is the highest-value data concentration in the project. Set a
retention date or move it to encrypted storage. *User.*

**F-22 · Build-time dependency vulnerabilities, including a critical one in the HeroUI install path.**
`bun audit` → **10 vulnerabilities (1 critical, 4 high, 5 moderate)**. All are build/dev-time
transitive: `tar` ≤7.5.15 via `heroui-native-pro → heroui-pro → tar` (critical decompression DoS,
high infinite loop, +4), `brace-expansion` via eslint/glob/config-plugins, `postcss` via
metro-config and vite, `uuid` via `xcode`. **None ships in the app runtime bundle**, so
production exploitability is nil. The `tar` chain deserves attention specifically because it is
the code that extracts a downloaded archive on the EAS builder.

**F-23 · `npx -y hpsetup@latest` is an unpinned pre-install supply-chain surface.**
It runs before dependency installation on every build, auto-installs the newest version, and
executes with the build's environment. Correctly avoids `--no-cache` (vendor doc: 1/day, 429
beyond), so no quota is consumed — but pinning a known-good version would make builds
reproducible. Note also that `bun.lock` pins `heroui-native-pro@1.0.0-beta.5` while npm now
serves `beta.7`, and hpsetup installs "latest" — a possible lockfile/frozen-install conflict on
the builder. Related to F-02.

**F-38 · Internal release and security documentation is published on the public App Store support site.**
The Pages workflow builds `source: ./docs`, and Jekyll converts **every** markdown file there —
not just the four the workflow watches. Verified live (HTTP 200 with real content):

| URL | Contents |
|---|---|
| `…/PRODUCTION_ACCESS_SETUP` | secret **inventory**, team `jaxson-bie`, deployments, `BETTER_AUTH_SECRET` / `HEROUI_KEY` names |
| `…/APP_STORE_RELEASE` | the full release runbook |
| `…/APP_STORE_METADATA` | review notes and the demo-account plan |
| `…/RELEASE_AUDIT` | the previous security audit and its findings |
| `…/BASELINE`, `…/SESSION-HANDOFF` | internal engineering notes |

No secret *values* are exposed (those documents are deliberately written without them), but the
infrastructure topology, the deployment name to probe, and a prior findings list are all
world-readable on the URL Apple will be given as the support page. Combined with F-01 this is a
meaningful uplift for an attacker. **Fix:** move non-public docs out of `docs/` (e.g. `docs/internal/`
plus a Jekyll `exclude:` in `_config.yml`, or a separate directory entirely), leaving only
`index.md`, `PRIVACY_POLICY.md`, and `SUPPORT.md` publishable. *Agent-completable.* **Confidence:** high.

---

### P3

| ID | Finding | Evidence |
|---|---|---|
| F-24 | **Stale `ios/` prebuild carries dev-launcher local-network keys.** `ios/Immifile/Info.plist` (Jul 26) contains `NSLocalNetworkUsageDescription` ("Expo Dev Launcher … development servers") and `NSBonjourServices: _expo._tcp`. Introspecting the dirty tree reproduces these, but introspecting a clean copy with no `ios/` shows both **absent**. `/ios` is gitignored and EAS prebuilds in the cloud, so they will not ship. Delete the stale folder to stop it misleading future checks. |
| F-25 | **`docs/internal/RELEASE_AUDIT.md` is stale.** References `src/app/(modal)/account/index.tsx` and `src/app/(tabs)/forms/index.tsx`, which no longer exist, and still lists the Better Auth user-row deletion gap as "Must land before public release" — fixed and covered by `convex/auth.integration.test.ts`. |
| F-26 | **`app.json` `ios.buildNumber` is ignored under remote versioning**, and EAS says so on every invocation — but `validate-release-config.mjs:19` *asserts* it is numeric, so removing it breaks validation. Reconcile the two. |
| F-27 | **The first build will be buildNumber 2, not 1.** Remote value is 1 and the production profile sets `autoIncrement: true`. Harmless; avoid surprise. |
| F-28 | **`/forgot-password` and `/reset-password` are reachable unauthenticated via the custom scheme.** `isReleasePathBlocked` runs only when `isAuthenticated` (`_layout.tsx:48`) and neither screen sits inside a `Stack.Protected`. Both self-gate with accurate copy, so this is a dead-end, not an exposure. |
| F-29 | Missing hardening headers on `auth.immifile.app` — no `X-Content-Type-Options`, CSP, `X-Frame-Options`, or `Referrer-Policy`; HSTS lacks `includeSubDomains`/`preload`; `cache-control: public…` on `/api/auth/get-session` (`max-age=0, must-revalidate` prevents actual caching). CORS is correctly restrictive on auth endpoints. |
| F-30 | Second public origin `immifile-auth-proxy.vercel.app` serves the identical deployment. Low risk — `trustedOrigins` excludes it, so it cannot be an auth callback target. |
| F-31 | OIDC discovery on the branded host 302s off-domain and advertises `issuer: enduring-toucan-31.convex.site` (issuer ≠ fetch prefix), plus `HS256` while JWKS serves RS256. **No impact** — Convex validates against `CONVEX_SITE_URL`, which matches. |
| F-32 | Dev deployment `wandering-jaguar-543` is publicly reachable with Better Auth live. Inherent to Convex's URL model; separate database, distinct secret, seeding off. |
| F-33 | The local `immifile-auth-proxy` checkout sits on merged branch `codex/add-auth-discovery-rewrite` (content identical to `main`); stale local tracking refs remain. |
| F-34 | EAS `development` and `preview` environments contain **zero** variables — builds from those profiles would launch without a Convex URL. |
| F-35 | `src/lib/session-sync.ts:23` reaches into better-auth's private `$store.atoms.session`. Necessary today (documented race), fragile across upgrades; `better-auth` is pinned `~1.6.22`, which limits the blast radius. |
| F-36 | **Audit artifact:** a 2-byte file named `=32"` was left untracked in the repo root (created 16:06 by a stray shell redirect from an audit command, not a pre-existing condition). The tree was clean at audit start. Remove with `rm '=32"'`. |
| F-37 | Unbounded string fields on private writes — `documents.saveDocument` `label` and the draft-answer Zod shapes have `.min()` but no `.max()`. Auth-gated, so self-DoS only. |

---

## 6. First-review feature matrix

| Feature | Enabled in source | Enabled by policy | Reachable in app | Bundled | Backend exposed | Tested | Suitable |
|---|---|---|---|---|---|---|---|
| Account creation (email/password) | Yes | Yes | Yes — sign-in screen | Yes | Yes | Yes (integration) | Yes |
| Sign in / sign out | Yes | Yes | Yes (sign-out hidden for anonymous by design) | Yes | Yes | Yes | Yes |
| Anonymous "Continue" session | Yes | Yes | Yes — welcome | Yes | Yes | Yes | Yes (48 h disclosure shown pre-creation) |
| Session restoration | Yes | Yes | Yes — SecureStore | Yes | Yes | Yes | Offline path untested (F-17) |
| Account deletion | Yes | Yes | Yes — Account → Settings | Yes | Yes | Yes | Needs password (F-07); F-08 / F-09 |
| USCIS receipt tracking | Yes | Yes | Yes — Cases | Yes | Yes (owner-scoped) | Yes | Yes |
| Official USCIS/DOJ links | Yes | Yes | Yes — Resources | Yes | n/a | — | Yes |
| Privacy / Terms / Support | Yes | Yes | Yes — Account | Yes | n/a | — | Yes |
| **Filing preparation** | Present | **Off** | No — tab hidden + default-deny guard | **Yes** | **Fully callable** | Yes | No — F-01 |
| **AI assistant** | Present | **Off** | No | Yes (SDK server-side only) | **Callable**; inert only because `ANTHROPIC_API_KEY` is unset | Yes | No — F-01 |
| **Community** | Present | **Off** | No | **Yes** | **Reads open unauthenticated**; no moderator | Yes | No — F-01 |
| **Social login** | Present | **Off** | No | Labels only | **Server-gated** (`socialProviders.ts:15` returns empty map before reading creds) | Yes | Yes — safely off |
| **Password recovery** | Present | **Off** | Deep-link reachable, self-gated copy | Yes | **Fail-closed** (`authEmail.ts` needs all three `AUTH_EMAIL_*`; none set) | Yes | F-07 |
| Email confirmation | `requireEmailVerification: false` | — | — | — | — | — | F-07 |
| Notifications | Not installed | — | — | No | — | validator-enforced | Yes |
| Camera / mic / Face ID / local network / widgets | No | — | — | No | — | validator-enforced; clean-tree plist confirms absent | Yes |

---

## 7. Security and privacy assessment

**What the app collects.** Name + email + password (permanent accounts); an anonymous identity
for temporary sessions; USCIS receipt numbers and user-entered status notes; small preferences;
Better Auth security metadata (session id, IP, user agent). No analytics, advertising, or
tracking SDK exists anywhere — grep for `analytics|posthog|amplitude|sentry|segment|firebase`
returns zero.

**Authorization — genuinely strong.** Ownership derives from `identity.tokenIdentifier`
(`convex/lib/auth.ts:18-32`), never from an argument; **no public function accepts a
`userId`/`ownerId` parameter**; every client-supplied id is re-checked through a `getOwned*`
helper; not-found and not-owned collapse to the same result, so ids are non-enumerable; all 79
registered functions have argument validators; zero `.filter()` on database queries. Community
payloads are built by allowlist constructors (`community.ts:70-91`), so `authorOwnerId` cannot
leak. `convex/http.ts` is eight lines registering only Better Auth's routes — no hand-written
endpoint exists.

**Secret handling — clean.** Redacted scans of tracked files and full git history across all refs
surfaced only placeholders (`hp_REQUIRED_SECRET`, `REQUIRED_32_PLUS_CHARACTER_SECRET`). The
shipped bundle contains no Anthropic SDK or key. `HEROUI_KEY` is correctly Secret-visibility and
not `EXPO_PUBLIC_`-prefixed, so it cannot reach the client. Prod and dev `BETTER_AUTH_SECRET`
values are distinct. Session cookies are stored in SecureStore (Keychain). ATS rejects arbitrary
loads; `usesNonExemptEncryption: false` is declared.

**PII logging — clean.** The only non-test `console.*` calls in `convex/` are a fetch error, an
Anthropic error object, and two integers. Nothing logs answers, drafts, or document fields.

**Deletion — thorough, with one hole.** The cascade covers all 15 owner-keyed tables including
third-party reports against the deleted user's content, community blocks in both directions, and
foreign comment-count repair, with phased batching and a ≤1 h tombstone covering the JWT expiry
window. The hole is `_storage` (F-08).

**Privacy-policy accuracy.** Both the in-app and published policies are unusually well-scoped and
materially accurate: they name the release, list the disabled features correctly, describe the
48-hour / hourly-cleanup timing honestly rather than promising an exact instant, explain the
deletion-protection record, and warn users off the public issue tracker. Two omissions: Vercel as
a processor (F-13) and the non-affiliation disclaimer (F-14). One tension: the policy says the
filing workflow and document uploads "are not available in this release" — true of the app, not
of the service (F-01).

**Disclaimers.** Present and well-written across Resources ("Immifile is independent and does not
represent the U.S. government"), Terms ("not affiliated with USCIS, DHS, DOJ… does not provide
legal advice, legal representation, eligibility decisions, or outcome predictions"), and the
Cases empty state ("Immifile does not fetch status automatically"). No outcome promises anywhere.
App Store privacy labels can be answered consistently from the implementation; the draft table in
`docs/internal/APP_STORE_METADATA.md` matches what was observed.

---

## 8. Reliability and quality evidence

| Check | Command | Result |
|---|---|---|
| Typecheck | `bun run typecheck` | **PASS** (exit 0) |
| Lint | `bun run lint` | **PASS** (exit 0, no warnings) |
| Test suite | `bun run test:once` | **PASS** — **45 files, 725 tests, 0 failures**, 1.71 s |
| Release config validation | `node scripts/validate-release-config.mjs` | **PASS** |
| Production endpoint readiness | `node scripts/check-production-readiness.mjs` (real production URLs) | **PASS** — discovery 200, JWKS 200, session 200, privacy 200, support 200 |
| Static iOS export | `npx expo export --platform ios` | **PASS** — 11 MB `.hbc`, 19 MB total |
| Expo Doctor | `npx expo-doctor@latest` | **19/20** — only "native tooling versions" (local CocoaPods); irrelevant to EAS cloud builds |
| Dependency vulnerabilities | `bun audit` | **10 (1 critical, 4 high, 5 moderate)** — all build-time only (F-22) |
| Expo SDK compatibility | `npx expo install --check` | **PASS** — "Dependencies are up to date" |
| Lockfile consistency | `git status --porcelain bun.lock` | clean |
| Git provenance | `git rev-parse HEAD origin/main` | both `a76b92e…`; tree clean at audit start |
| Secret scan (tracked + history) | redacted `git grep` / `git log --all -p` | placeholders only |
| Live unauthenticated API probe | `POST /api/query` × 5 | community + news open; owner-scoped correctly denied |
| Bundle content inspection | `strings entry-*.hbc` | disabled-feature strings present; no secrets |
| Clean-tree iOS config introspection | `expo config --type introspect` on a copy without `ios/` | no local-network keys, no privacy manifest |
| Vendor CI-token resolution | executed `getCIToken()` from installed vendor code | reads `HEROUI_AUTH_TOKEN`, **not** `HEROUI_KEY` |
| Public-site exposure probe | `curl` × 6 against `jaxsonb04.github.io/expo-immigration-app/…` | all internal docs live (F-38) |
| EAS build inventory | `eas build:list --json` | `[]` — no build exists |
| Pages deploy | `gh run list --workflow=public-pages.yml` | 2 runs, both success |
| Physical-device testing | — | **NOT PERFORMED.** No iPhone/iPad/simulator run. All UX findings are static-analysis or network-level only |
| EAS production build | — | **NOT PERFORMED** (out of scope) |
| Porkbun forward delivery | — | **NOT PERFORMED** (would require sending mail) |
| AWS SES/Lambda/Secrets | — | **UNAVAILABLE** — only profile is WeatherEdge's, SSO token expired |

---

## 9. App Store readiness matrix

| Requirement | Status | Evidence | Blocking | Next action | Owner |
|---|---|---|---|---|---|
| In-app account deletion (5.1.1(v)) | Met | `account.settings.tsx:113-232`; password-confirmed; server cascade + integration test | No | Verify on device | Agent/User |
| Privacy policy URL | Met | 200, HTTPS+HSTS, signed-out accessible | No | Add Vercel + disclaimer (F-13/14) | Agent |
| Support URL | Met | 200, names a monitored private address | No | Verify the forward (F-05) | User |
| Privacy labels answerable | Met | Draft table matches implementation | No | Enter in ASC | User |
| Export compliance | Met | `ITSAppUsesNonExemptEncryption: false` in config and plist | No | None | — |
| Permission strings | Met | Clean-tree plist has no camera/mic/Face ID/local-network keys | No | None | — |
| Tracking / ATT | N/A | Zero tracking SDKs | No | Answer "No" | User |
| Sign in with Apple (4.8) | N/A | No third-party social login ships | No | None | — |
| UGC (1.2) | N/A to binary | Community unreachable in-app | No | But close F-01 | Agent |
| Legal/advice representations | Met | Disclaimers on Resources, Terms, Cases | No | Repeat on public pages | Agent |
| App completeness (2.1) | Partial | No device testing; F-17 | **Yes** | Physical iPhone + iPad pass | User |
| Minimum functionality (4.2) | Risk | Thin surface (F-19) | Possibly | Lead metadata with the tracker | User |
| Demo account | Missing | `REQUIRED` placeholders | **Yes** | Create production demo + synthetic case | User |
| Review contact info | Missing | `REQUIRED` placeholders | **Yes** | Fill in ASC | User |
| iPhone 6.9″ screenshots | Drafted | 4 × 1320×2868 tracked | No | Recapture after demo account | Agent/User |
| **iPad 13″ screenshots** | Missing | `supportsTablet: true`; none exist | **Yes** | Capture 2064×2752 **or** set `supportsTablet: false` | User decision |
| Name/subtitle/keywords/category | Drafted | `docs/internal/APP_STORE_METADATA.md` | No | Paste into ASC | User |
| Age rating | Not drafted | Absent from metadata doc | No | Answer questionnaire (4+ expected) | User |
| Privacy manifest | Absent | No `ios.privacyManifests` (F-12) | No (warning risk) | Add `CA92.1` before first upload | Agent |
| Bundle ID / scheme | Open decision | `dev.uing.immigrationrenewalhelp` (F-11) | **Yes, before credentials** | Decide keep or change | User decision |
| Signing credentials | Deferred | None configured | **Yes** | Apple Developer + `eas credentials` | User (Apple + 2FA) |
| App Store Connect record | Deferred | None | **Yes** | Create after bundle ID is final | User (ASC) |

---

## 10. Remaining manual actions

Only items that genuinely require the owner, Apple access, 2FA, a vendor panel, or a
legal/product decision.

1. **Add `HEROUI_AUTH_TOKEN` as a second EAS production Secret** *(do this first — likeliest
   cause of a failed first build).*
   expo.dev → **jaxson04s-team** → **immifile** → **Environment variables** → **Create variable**
   → Name `HEROUI_AUTH_TOKEN`, Value = the same `hp_…` key already in `HEROUI_KEY`, Visibility
   **Secret**, Environment **production** only → Save.
   **Keep `HEROUI_KEY`.** hpsetup needs it; this is additive, not a replacement.

2. **Decide iPad support.** Either set `supportsTablet: false` (simplest for a first release), or
   keep iPad and plan a 13″ screenshot capture (2064×2752) plus an iPad QA pass. **Changes the
   binary — settle before the build.**

3. **Decide the bundle identifier.** Keep `dev.uing.immigrationrenewalhelp` permanently, or change
   to an Immifile-owned identifier now. Changing it after submission requires a new App Store
   Connect record. **Settle before creating signing credentials.**

4. **Verify the support-email forward.** Send any message to `support@immifile.app` from an
   unrelated address and confirm it lands in `jaxsonbie@gmail.com`. If not: Porkbun → Domain
   Management → immifile.app → Email Forwarding.

5. **Create the App Review demo account.** In the shipped app: Continue → Sign in → "Don't have an
   account? Sign up" → create a dedicated production account → add one clearly synthetic case
   (e.g. `EAC0000000000`) with one or two timeline entries. Record the credentials for App Store
   Connect only. Keep it active throughout review.

6. **Apple Developer / signing** *(2FA required)*: enroll or confirm team `F8V4932HJN`, then run
   `eas credentials` (or let `eas build --platform ios --profile production` provision
   interactively) once items 1–3 are settled.

7. **App Store Connect record and metadata** *(owner account)*: create the app with the final
   bundle ID; paste name, subtitle, promotional text, description, keywords, category
   (Utilities / Reference), Support URL and Privacy Policy URL from `docs/internal/APP_STORE_METADATA.md`;
   fill the review contact block and demo credentials; complete the age-rating questionnaire;
   answer App Privacy per the drafted table; upload screenshots.

8. **Optional but recommended:** publish a `_dmarc.immifile.app` TXT record
   (`v=DMARC1; p=quarantine; rua=mailto:…`) in Porkbun DNS, and give the apex/`www` a valid
   certificate instead of the HTTP-only parking page.

9. **Housekeeping:** delete the audit artifact `rm '=32"'` in the repo root, and set a retention
   date for `.scratch/convex-migration/` (76 MB of real applicant PII, unencrypted).

---

## 11. Agent-completable work (not performed during this audit)

1. **Server-gate the disabled features** (F-01) — add `releasePolicy` guards to `community.ts`,
   `moderation.ts`, `applications.ts`, `applicants.ts`, `documents.ts`, `home.ts`, `renewals.ts`,
   `assistant.ts`, `navigator.ts` using the pattern already in `crons.ts` / `socialProviders.ts`.
   Highest-value change in this report.
2. **Move internal docs out of the published `docs/` tree** (F-38).
3. **Rate limiting and upload bounds** (F-06) — Better Auth `rateLimit` with a database store;
   `requireCredentialedOwnerId` on `generateUploadUrl`; per-owner document cap.
4. **Storage-blob lifecycle** (F-08) — issued-upload tracking table, a reaper cron, and inclusion
   in the deletion cascade.
5. **Harden `deleteAccountData`** (F-09) and **make `dev/seed` internal** (F-10).
6. **Privacy-page corrections** (F-13, F-14).
7. **`ios.privacyManifests`** (F-12) with `NSPrivacyAccessedAPICategoryUserDefaults` / `CA92.1`.
8. **Offline and error UX** (F-17) — a branded route `ErrorBoundary`, a reachability check using
   the already-installed `expo-network`, and a timeout/retry state instead of an indefinite spinner.
9. **CI workflow** (F-20) — typecheck, lint, `test:once`, `release:config` on PRs.
10. **Cleanups** — delete the stale `ios/` folder (F-24), refresh `docs/internal/RELEASE_AUDIT.md` (F-25),
    reconcile the `buildNumber` assertion (F-26), pin the hpsetup version (F-23), bound the
    unbounded string fields (F-37).
11. **Optional lockout mitigation** (F-07) — either re-enable the already-tested password-recovery
    path or add explicit sign-up copy about the absence of recovery.

---

## 12. Final recommendation

**Safest next action:** add `HEROUI_AUTH_TOKEN` as a second EAS production Secret and answer the
two irreversible questions (iPad support, bundle identifier) — then land the server-side release
gate and the privacy-page corrections before any build is started.

**Begin the first production build when, and only when:** (1) `HEROUI_AUTH_TOKEN` exists as a
production Secret alongside `HEROUI_KEY`; (2) `supportsTablet` reflects a deliberate decision and
the matching screenshot plan; (3) the bundle identifier is final; and (4) F-01's server gate is
merged — because the build you sign is the one you will be shipping against a backend that is
currently open to any session holder.

---

**Audit timestamp:** 2026-07-27, 16:00–17:20 PDT (UTC−7)

**Repositories/commits audited:** `Jaxsonb04/expo-immigration-app` @
`a76b92eedd6f30da96f41095f942f8c433ba9335` (public, clean, == `origin/main`);
`Jaxsonb04/immifile-auth-proxy` @ `cd8228aa1bb7478b788218033e2ebfb739db5911` (private)

**External environments inspected:** Expo/EAS (`@jaxson04s-team/immifile`); Convex prod
`enduring-toucan-31` + dev `wandering-jaguar-543`; Vercel-hosted `auth.immifile.app`; GitHub repo,
Actions, and Pages; Porkbun DNS for `immifile.app`; `jaxsonb04.github.io` public pages; npm
registry metadata; installed HeroUI vendor code.

**Not inspected, and why:** physical iPhone/iPad and simulator runtime behaviour (no device
session — every UX finding is static or network-level); the production EAS build itself (out of
scope); Vercel project internals and env var names (CLI not authenticated on the build Mac); AWS
SES/Lambda/Secrets Manager (only the unrelated WeatherEdge profile exists and its SSO token is
expired — the "no SES residue" claim is **unverified**); Porkbun panel forward configuration
(would require sending mail or panel access); HeroUI vendor dashboard (old-key revocation is
unverifiable without retrieving keys); production database contents (reading user data was out of
scope — though the live unauthenticated probe showed the forum is empty); WeatherEdge AWS
resources (deliberately untouched).

---

## 13. Remediation applied 2026-07-27 (branch `fix/release-hardening-2026-07-27`)

Everything below was fixed **after** the audit above was written, on a branch off
`a76b92e`. The findings are left as originally written; this section records what
changed. Verified after every change: `tsc --noEmit` clean, `eslint .` clean,
**736/736 tests across 46 files**, `expo export --platform ios` succeeds,
**`expo-doctor` 20/20** (was 19/20).

| Finding | Status | What changed |
|---|---|---|
| **F-01** server gate | **Fixed** | New `convex/lib/releaseGate.ts`; `assertFeatureEnabled(...)` is now the first statement of **48 handlers** across `community`, `moderation`, `news`, `applications`, `applicants`, `documents`, `home`, `renewals`, `cases.listLinkableApplications`, `assistant`, `navigator`, `assistantQuota`. New `convex/releaseGate.test.ts` runs against the **real** policy and fails if any of them becomes reachable again; the other 10 suites mock the policy open so they still test the implementations underneath. |
| **F-02** HeroUI token | **Fail-fast added; still needs the secret** | `scripts/validate-release-config.mjs` now requires **`HEROUI_AUTH_TOKEN`** as well as `HEROUI_KEY`, so a build without it dies in the pre-install hook with a named error instead of at Metro bundling. Creating the secret is still a manual step (item 1 of §10). |
| **F-06** rate limiting | **Fixed (needs post-deploy verification)** | `convex/auth.ts` now configures Better Auth `rateLimit` with `storage: 'database'` (the Convex component ships a `rateLimit` table and is generated for it) plus per-path rules for sign-in, sign-up, anonymous sign-in, delete-user, and password reset. `advanced.ipAddress.ipAddressHeaders` is set explicitly because requests arrive through the `auth.immifile.app` proxy. Limits are deliberately generous so a misconfigured forward degrades to one shared bucket rather than locking users out — **verify against a real device after the first deploy and tighten**. The upload-abuse half of this finding is closed by F-01 (`generateUploadUrl` is now gated off entirely). |
| **F-07** lockout | **Disclosed, not removed** | The limitation is now stated at sign-up (a warning card on the create-account form), in the in-app privacy policy ("Account access in this release"), and on both public pages. Re-enabling recovery remains a product decision. |
| **F-09** deletion re-auth | **Fixed** | `account.deleteAccountData` now rejects credentialed sessions — permanent accounts must go through Better Auth's password-confirmed `deleteUser`. New regression test in `convex/foundation.test.ts`. |
| **F-10** dev seed | **Fixed** | `seedDemo` → `internalAction`, `resetOwner` → `internalMutation`, new `resetOwnerById` for CLI parity. The `__DEV__` DevSection was removed from `account.settings.tsx`; demo data is now CLI-only against a dev deployment. |
| **F-12** privacy manifest | **Fixed** | `app.json` declares `ios.privacyManifests` for UserDefaults (CA92.1), FileTimestamp (C617.1), SystemBootTime (35F9.1), and DiskSpace (E174.1), plus `NSPrivacyTracking: false`. (`expo-doctor` caught a wrong key name on the first attempt — it is `NSPrivacyAccessedAPITypeReasons`.) |
| **F-13** Vercel processor | **Fixed** | Named as a processor in `docs/PRIVACY_POLICY.md` and the in-app policy. |
| **F-14** disclaimer | **Fixed** | The non-affiliation sentence now opens `docs/PRIVACY_POLICY.md`, `docs/SUPPORT.md`, and the in-app privacy screen. |
| **F-17** error/offline UX | **Fixed** | New `RouteErrorBoundary` exported as `ErrorBoundary` from the root layout, so route failures render the app's own error state via `humanErrorMessage` instead of Expo Router's unstyled default with a raw error string. New `useSlowLoad` hook gives the Cases screen an explanatory message after 6s instead of an indefinite spinner. |
| **F-20** CI | **Fixed** | `.github/workflows/ci.yml` runs release-config, typecheck, lint, and tests on every PR and on `main`. |
| **F-23** unpinned hpsetup | **Fixed** | `hpsetup@latest` → `hpsetup@4.7.0`. |
| **F-24** stale `ios/` | **Fixed** | Deleted. Introspection now confirms **no** `NSLocalNetworkUsageDescription` and **no** `NSBonjourServices`, and `expo-doctor` went 19/20 → 20/20. |
| **F-25** stale audit doc | **Fixed** | `docs/internal/RELEASE_AUDIT.md` carries a superseded banner correcting its resolved findings and dead paths. |
| **F-26** buildNumber | **Fixed** | Removed from `app.json`; the validator now asserts `appVersionSource: 'remote'` **and** that `ios.buildNumber` is absent. |
| **F-33** proxy checkout | **Fixed** | `immifile-auth-proxy` fast-forwarded to `main` @ `cd8228a`; merged branch deleted. |
| **F-36** stray artifact | **Fixed** | Removed. |
| **F-37** unbounded label | **Fixed** | `documents.saveDocument` / `uploadNewVersion` cap `label` at 120 chars via the existing `optionalText` helper. |
| **F-38** published internal docs | **Fixed** | Only `index.md`, `PRIVACY_POLICY.md`, and `SUPPORT.md` remain at `docs/`. Everything else moved to `docs/internal/` and `docs/_config.yml` excludes it — default-deny for anything added later. Public URLs are unchanged (both pages keep their `permalink`). Cross-references updated in actionable files; historical narrative (`docs/internal/MASTER_PLAN.md`, `FABLE_BRIEF*`) deliberately left as written. |

### Deliberately not done

- **F-08 (orphaned storage blobs).** Its urgency dropped sharply: `generateUploadUrl`
  is now gated off, so this release cannot create new orphans. The fix needs a new
  tracking table, a reaper cron, and a new deletion phase — a schema change with
  real risk, days before a release, for a path the release cannot reach. It should
  land with the filing release. **Existing orphans from development are unaffected
  and still need a one-off sweep.**
- **F-11 (bundle identifier)**, **F-03 (iPad)**, **F-19 (minimum functionality)**,
  **F-15/F-16 (apex TLS, DMARC)**, **F-21 (migration backup)**, **F-05 (support
  forward)** — decisions or credentials that are not an agent's to make.
- **F-22 (build-time CVEs)** — all transitive dev tooling; upgrading them means
  moving Expo/ESLint/Vitest majors, which is not a pre-release change.
- **F-34 (empty EAS dev/preview environments)** — left alone rather than writing to
  an external service unprompted.

### Re-verification after remediation

| Check | Result |
|---|---|
| `bun run typecheck` | PASS |
| `bun run lint` | PASS |
| `bun run test:once` | **PASS — 46 files, 736 tests** (was 45 / 725) |
| `node scripts/validate-release-config.mjs` | PASS |
| Same, simulating a release build with both HeroUI vars | PASS |
| Same, with `HEROUI_AUTH_TOKEN` missing | **Fails as designed**, exit 1, names the variable |
| `npx expo export --platform ios` | PASS |
| `npx expo-doctor@latest` | **20/20** (was 19/20) |
| iOS config introspection | bundle id unchanged; `buildNumber` absent; privacy manifest present; no local-network keys |
