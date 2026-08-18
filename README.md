# Immifile

Immifile is an independent Expo mobile app for manually tracking USCIS cases
and opening official immigration resources. It does not automatically receive
case updates, file with USCIS, provide legal advice, represent an applicant, or
imply government affiliation.

## First App Store Release

The source-controlled [release policy](./release-policy.json) limits the first
review build to:

- **Cases:** save a USCIS receipt number, maintain a manual status timeline,
  and open official USCIS Case Status Online. This is also the release home
  route (`RELEASE_HOME_PATH = '/cases'`).
- **Resources:** open curated official USCIS and Department of Justice tools.
- **Assistant:** get an informational recommendation between Form I-765 and
  Form I-90 after explicitly consenting to OpenAI processing, capped at
  **20 messages per day** per owner. Immifile does not persist a server-side
  transcript; selected user messages are sent to OpenAI and may remain in its
  abuse-monitoring logs for up to 30 days.
- **Account:** email/password and configured Google/Apple authentication,
  complete in-app account deletion, privacy information, terms, and support.

The full policy is five booleans in [`release-policy.json`](./release-policy.json):

| Feature             | First release |
| ------------------- | ------------- |
| `filingPreparation` | `false`       |
| `assistant`         | `true`        |
| `community`         | `false`       |
| `socialLogin`       | `true`        |
| `passwordRecovery`  | `false`       |

Filing preparation, interviews, application/document routes, public community,
and password recovery are disabled, along with camera, microphone, Face ID,
widgets, and notification configuration. Their data and implementation remain
intact for a later reviewed release. See
[the release checklist](./docs/internal/APP_STORE_RELEASE.md),
[privacy policy](./docs/PRIVACY_POLICY.md), and
[support information](./docs/SUPPORT.md).

## The Release Gate

Disabling a feature is enforced in **two** places, and both must stay in step.
This is the single most important thing to understand before changing a route.

- **Client** — [`src/lib/release-policy.ts`](./src/lib/release-policy.ts) hides
  the tabs and guards deep links. It **default-denies**: `isReleasePathBlocked`
  returns `true` for anything not explicitly allowed, so a newly added route
  cannot silently join the reviewed release. The guard runs before a disabled
  screen mounts, so hidden routes never issue queries or flash their UI.
- **Server** — [`convex/lib/releaseGate.ts`](./convex/lib/releaseGate.ts).
  A hidden tab is not an authorization boundary: every Convex function is a
  public internet endpoint and an anonymous session token is free to mint, so
  each disabled feature's handlers assert the policy before touching identity or
  data. `convex/releaseGate.test.ts` runs against the real `release-policy.json`
  and fails if any of those endpoints becomes reachable again.

Re-enabling a feature means flipping `release-policy.json` and updating the
pinned tests — never deleting a guard. The values are build-time static on
purpose: a remote switch could reveal unreviewed functionality after approval.

The six declared tabs are `(forms)`, `cases`, `resources`, `assistant`,
`community`, and `account`. Only `cases`, `resources`, `assistant`, and
`account` are visible in this release.

## Deferred Filing System

The repository retains a larger filing-preparation system for a later,
separately reviewed release. That deferred implementation:

- Starts one of five supported situations:
  - Work Permit initial application, renewal, or replacement
  - Green Card renewal or replacement
- Keeps a reusable applicant profile so later applications can start with known
  facts already filled in.
- Guides applicants through a question-first interview instead of exposing raw
  USCIS form fields.
- Saves progress only when the applicant taps Next, so each completed step is
  validated and persisted intentionally.
- Maintains a document vault and explicit needed-document slots for active
  applications.
- Renders draft previews and filled USCIS PDF templates for I-765 and I-90.
- Tracks post-filing cases through manually entered receipt numbers.
- Mirrors paid unlock state in Convex entitlements instead of trusting only the
  client purchase state.

## Product Boundaries

This codebase is built around a few hard constraints:

- **Application** is the product unit. A case exists only after USCIS receives a
  filed application.
- **Applicant** and **account holder** are different concepts. One account can
  manage multiple applicants.
- **Service Fee** and **USCIS Filing Fee** must stay separate in product copy and
  data model.
- **Autofill** flows through the applicant profile into a new application's own
  draft. A new application never reads another application's answers directly.
- **No autosave.** Every Next action validates, saves, marks step progress, and
  returns the next step.
- **No legal advice.** Copy and workflows must not recommend legal strategy,
  guarantee approval, or imply USCIS endorsement.

See [CONTEXT.md](./CONTEXT.md) for the domain language and
[REARCHITECTURE.md](./REARCHITECTURE.md) for the rebuild decisions behind the
current shape of the app.

## Tech Stack

|                              | Version                                             |
| ---------------------------- | --------------------------------------------------- |
| Expo / Expo Router           | `~57.0.14`                                          |
| React Native                 | `0.86.2`                                            |
| React                        | `19.2.3`                                            |
| TypeScript                   | `~6.0.3`                                            |
| Convex                       | `^1.42.1`                                           |
| Better Auth                  | `~1.6.22` with `@convex-dev/better-auth` `^0.12.5`  |
| HeroUI Native                | `^1.0.2`                                            |
| HeroUI Native Pro            | vendored at `file:vendor/heroui-native-pro-runtime` |
| Uniwind (Tailwind v4 for RN) | `^1.5.0`                                            |
| TanStack React Form          | `^1.33.0`                                           |
| pdf-lib                      | `^1.17.1`                                           |
| Vitest / convex-test         | `^4.1.9` / `^0.0.54`                                |

Convex is the single backend. Better Auth handles email/password and temporary
anonymous accounts, plus deployment-gated Google and Apple sign-in, with
server-side rate limiting in [`convex/authRateLimit.ts`](./convex/authRateLimit.ts)
and origin hardening in [`convex/auth.ts`](./convex/auth.ts).

The app ships as `dev.uing.immigrationrenewalhelp`, scheme
`immigrationrenewalhelp` (also the Better Auth Expo deep-link callback).

## Design System — Security Ink

The visual identity is **Security Ink**: a cobalt-and-porcelain palette built on
oklch tokens in [`src/global.css`](./src/global.css), replacing the earlier
warm-paper/terracotta identity.

- **Light** is porcelain-and-ink — `--background: oklch(97.3% 0.005 240)`,
  `--foreground: oklch(23% 0.03 258)`, `--accent: oklch(44% 0.155 262)`.
- **Dark** is a night ledger — `--background: oklch(16.5% 0.018 258)` with a
  lifted `--accent: oklch(73% 0.115 262)`.
- **Libre Franklin Bold** carries display titles, **Inter** the body text, and
  **IBM Plex Mono** the data face — receipt numbers and document artifacts,
  where digit alignment is the point.

Logo, splash, and icon assets are generated from the token set by
`scripts/generate-logo-assets.mjs`; `app.json` splash grounds match it. Both
themes are deliberate, not one derived from the other.

## Repository Map

```text
src/app/                  Expo Router routes: (tabs), (modal), auth screens
src/components/           Shared UI (core/, account/, form/) and providers
src/lib/                  Release policy, auth/session state, reminders, deletion
src/screens/              account, applications, assistant, auth, cases,
                          community, documents, home, interview, resources
convex/                   Schema, auth, queries, mutations, crons, tests
convex/lib/               Server-side release gate and shared helpers
convex/shared/            Shared application shapes and step definitions
convex/model/             Backend domain helpers
assets/forms/             Bundled USCIS PDF templates and metadata
vendor/                   Vendored HeroUI Native Pro runtime (tracked)
store-assets/app-store/   6.9-inch App Store screenshots
scripts/                  Release config validation, navigator eval, asset gen
docs/                     Public support site (GitHub Pages) — see warning below
docs/internal/            Release checklist, audits, ADRs, QA notes
```

Routes in `src/app` should stay thin. Domain behavior belongs in screen modules,
Convex functions, shared shapes, or model helpers.

> **`docs/` is published.** The GitHub Pages workflow builds the whole `docs/`
> directory as the public App Store support site, so anything placed there
> becomes world-readable. Internal material goes in `docs/internal/`.

`apps/`, `ios/`, `dist/`, and `infra/` exist in a working checkout but are
**untracked build output and scratch space** — the repository is a flat
single-app layout, not the older `apps/mobile` monorepo shape.

## Getting Started

### Prerequisites

- Node.js 20 or newer
- Bun, npm, or another package manager compatible with this lockfile setup
- Xcode for iOS development or Android Studio for Android development
- A Convex account and deployment for backend-backed flows

### Install

```bash
bun install
```

If you prefer npm:

```bash
npm install
```

> **HeroUI Native Pro needs two tokens, not one.** The published package is a
> ~9KB stub whose postinstall downloads the real library. Two consumers read two
> _different_ variable names for the same `hp_` key: the `eas-build-pre-install`
> hook reads `HEROUI_KEY`, while `heroui-native-pro`'s own postinstall reads
> `HEROUI_AUTH_TOKEN`. Set both to the same value. With one missing, the
> postinstall prints "Sign in to finish installing", **exits 0**, and the build
> fails much later at Metro bundling. `bun run release:config` fails fast on
> this rather than letting it surface as a confusing bundler error.

### Configure Environment

Create a local `.env` file for Expo:

```bash
EXPO_PUBLIC_CONVEX_URL=https://<your-deployment>.convex.cloud
EXPO_PUBLIC_CONVEX_SITE_URL=https://<your-deployment>.convex.site
```

Convex deployment secrets are managed with the Convex CLI, not the Expo `.env`
file. Optional social sign-in providers are enabled only when these are present:

```bash
npx convex env set GOOGLE_CLIENT_ID
npx convex env set GOOGLE_CLIENT_SECRET

npx convex env set APPLE_CLIENT_ID
npx convex env set APPLE_TEAM_ID
npx convex env set APPLE_KEY_ID
npx convex env set APPLE_PRIVATE_KEY --from-file /absolute/path/to/AuthKey_KEYID.p8
```

Omit values as shown so the CLI prompts for them without putting secrets in
shell history. Apple appears only when all four Apple values are present. Its
client-secret JWT is generated at runtime from the durable signing inputs, so
there is no static six-month secret to rotate. Add `--prod` to each command for
the production deployment.

Email/password and anonymous auth work without social OAuth credentials.

The assistant needs a server-side key on the deployment, never in the client:

```bash
npx convex env set OPENAI_API_KEY
npx convex env set OPENAI_MODEL   # optional; falls back to the pinned default
```

### Run Convex

```bash
npx convex dev
```

Keep this running while developing backend-backed screens. Convex generated files
under `convex/_generated/` are expected and should be updated by the Convex CLI.

### Run the App

```bash
bun run start
```

Common native targets:

```bash
bun run ios
bun run android
```

The app scheme is `immigrationrenewalhelp`, which is also used by Better Auth's
Expo deep-link callback configuration.

## Development Workflow

### Code Quality

```bash
bun run lint
bun run typecheck
bun run test:once
```

`bun run test:once` runs Vitest with `--passWithNoTests` across **62 test
files**. Convex tests use `convex-test` and the edge runtime; PDF tests use the
real bundled USCIS form templates as field-map tripwires.

**ESLint is the style gate, not Prettier.** A `.prettierrc` exists so
`bun run format` is safe to run, but lint is what has to pass.

### Release Checks

```bash
bun run release:config          # validates release config + required tokens
bun run release:remote-check    # production readiness against the deployment
bun run eval:navigator          # assistant router against pinned eval cases
```

`release:config` also runs automatically as the `eas-build-pre-install` hook, so
a misconfigured build fails at the start instead of at bundling.

### Building For Release

EAS uses `appVersionSource: "remote"` with `autoIncrement` on the production
profile, so **build numbers come from EAS, not from `app.json`** — do not bump
them by hand. Production builds set `IMMIFILE_RELEASE_BUILD=true`, and
`eas.json` pins the App Store Connect app id for submission.

Marketing version is `1.0.0`. Follow
[`docs/internal/PRODUCTION_ACCESS_SETUP.md`](./docs/internal/PRODUCTION_ACCESS_SETUP.md)
for the exact account-role, secret, mailbox, EAS, and Apple steps; it is written
so no secret value needs to be committed or shared.

### Convex Rules

Before editing Convex code, read:

```text
convex/_generated/ai/guidelines.md
```

Important local rules:

- Every app-owned table is scoped by a server-derived `ownerId`.
- Never accept `ownerId`, `userId`, or another authorization identity from the
  client.
- Every Convex function needs argument validators.
- Prefer indexes over filters.
- Keep high-churn interview answers in `applicationDrafts`; keep
  `applications` small and stable.
- Requirement slots are explicit rows in `applicationDocuments`, not absence of
  data.
- A handler for a gated feature must assert the release gate **before** touching
  identity or data. Hiding the tab is not enough.
- Public community payloads are built by the allowlist constructors
  `toPublicPost` / `toPublicComment`, which return `authorHandle` and never
  `authorOwnerId`. Do not hand-roll a public shape.

### PDF Form Templates

USCIS templates live in `assets/forms/`. Field maps are intentionally pinned in
tests because visually similar AcroForm widgets can have surprising internal
names or ordering.

Run this after changing PDF maps or bundled forms:

```bash
bun run test:once -- src/screens/applications/journey-hub/pdf/pdf.fill.test.ts
```

## Current Backend Model

The app-owned Convex schema ([`convex/schema.ts`](./convex/schema.ts)) contains
nineteen tables. Most are not reachable in the first release, because the
release gate closes their endpoints — but they are deployed schema, so treat
them as real surface.

**Filing core** (gated off by `filingPreparation`)

- `applicants`: people managed by an owner, including self and dependents
- `applications`: stable metadata for one applicant's form workflow
- `applicationDrafts`: typed per-form answers and step completion
- `applicationDocuments`: needed, attached, or waived requirement slots
- `documents`: vault files and expiry metadata
- `entitlements`: per-application unlock state mirrored from purchase events
- `renewalEntries`: tracked renewal deadlines

**Shipping in the first release**

- `cases`: manual post-filing case tracking
- `assistantUsage`: per-owner daily assistant counter (the 20-message limit)
- `ownerPreferences`: per-owner settings
- `authRateLimits`: server-side auth throttling state
- `accountDeletionTombstones`: deletion records that must outlive the account
- `newsItems` / `newsMeta`: curated resource feed and its fetch metadata

**Community** (gated off by `community`)

- `communityProfiles`: pseudonymous handles, never joined to `ownerId` in public
  payloads
- `forumPosts`, `forumComments`, `communityBlocks`, `forumReports`

Better Auth owns identity data in its own component namespace. The app schema
does not keep a separate user-profile table.

The assistant is a **deterministic router**, not a free-form chat: it decides
between Form I-765 and Form I-90, and the model
([`convex/navigator.ts`](./convex/navigator.ts), OpenAI via
`convex/lib/openaiChat.ts`, 512 max output tokens, 40-turn history cap) only
fills a small fixed set of fields. `bun run eval:navigator` runs it against the
pinned cases in `scripts/navigator-eval-cases.json`.

## Documentation

- [CONTEXT.md](./CONTEXT.md): product glossary and preferred domain language
- [REARCHITECTURE.md](./REARCHITECTURE.md): rebuild context and implementation
  boundaries
- [docs/internal/APP_STORE_RELEASE.md](./docs/internal/APP_STORE_RELEASE.md):
  the shipping surface and what enforces it
- [docs/internal/PRODUCTION_ACCESS_SETUP.md](./docs/internal/PRODUCTION_ACCESS_SETUP.md):
  secrets, roles, EAS, and Apple setup
- [docs/internal/SIMULATOR_QA.md](./docs/internal/SIMULATOR_QA.md): the
  side-panel simulator QA procedure
- [docs/internal/adr](./docs/internal/adr): architecture decision records
- [assets/forms/README.md](./assets/forms/README.md): USCIS form asset notes
- [convex/README.md](./convex/README.md): Convex directory notes

Two audit files are historical records, not current state:
`docs/internal/RELEASE_AUDIT.md` (2026-07-07) is explicitly superseded, and
`RELEASE_AUDIT_2026-07-27.md` carries 2026-07-27 verdicts that later work has
moved past. Read their headers before quoting either.

## Legal And Policy Notes

This repository contains software for preparing self-help immigration paperwork.
Do not add user-facing copy or behavior that says or implies:

- the app files directly with USCIS
- the app is affiliated with, approved by, or endorsed by USCIS
- the app gives legal advice
- approval is guaranteed
- the Service Fee includes government filing fees

Public launch copy, Terms of Service, Privacy Policy, disclaimers, preparer
section handling, and payment language should be reviewed by qualified counsel.
