# Immifile — Run 2: personalization, account conversion, and a fuller, calmer app

## Why you're doing this

I'm building **Immifile**, a free Expo / React Native (SDK 57) + Convex app that helps
immigrants prepare USCIS **I-765** (work permit) and **I-90** (green card) renewals: a
Claude assistant, a guided form → print-ready-PDF pipeline, case tracking, and a community
forum. It's for real, anxious people filing real government paperwork, so it has to feel
**calm, trustworthy, personal, and finished**.

Run 1 (see `FABLE_BRIEF.md`) fixed the assistant and laid the warm-paper design system.
The app now works and looks intentional. **This run is about three things:**

1. **Make it personal and convert temporary users into real accounts** — anonymous "temp"
   filers should be able to do everything, but must create an account (or continue with
   Google) at the moment they file/export, and temp accounts that never convert are cleaned
   up after two days.
2. **Kill the empty, unfinished feeling** — the Forms and Cases tabs are too long or too
   bare; several screens have too much white space. Give each screen a decent amount of
   genuinely useful content and a distinct animated empty state.
3. **Build a real Profile page** — today it shows nothing about the user. It should hold
   their name, address, saved forms, and uploaded documents, so future filings can reuse
   what they already uploaded.

Treat this as a multi-day, mostly-autonomous engagement. Scope it, sequence it, execute it,
verify your own work as you go.

## How to work

This inherits the operating rules in `FABLE_BRIEF.md` ("How to work") — I won't repeat them
in full. The load-bearing ones, restated:

- **When you have enough information to act, act.** Don't re-derive settled facts, re-litigate
  decisions I've made (the "Decisions already made" section below is final), or narrate
  options you won't pursue in messages to me. Weighing a choice → give a recommendation, not
  a survey. (This does not apply to your thinking.)
- **Operate in a loop:** pick the next unit → implement → verify against acceptance criteria →
  record evidence → advance. Use **high** effort by default.
- **Ground every progress claim in a real result** — a passing test, a log line, a simulator
  screenshot. If it isn't verified, say so. If tests fail, show the output. Never mark work
  "done" you can't back with evidence.
- **Verify with fresh eyes, proportionally.** For anything touching **auth, the temp-account
  deletion cron, the export/conversion gate, PII, ownership, or the PDF pipeline**, spin up a
  **separate fresh-context verifier subagent** to check against acceptance criteria, plus a
  security/ownership pass. For low-risk JS-only or design-token edits, your own
  test/type/lint/sim loop is enough. Delegate independent work to parallel subagents and keep
  moving while they run.
- **Stay in scope; do the simplest thing that fully works.** No features, abstractions, or
  backwards-compat shims beyond what a task needs. Validate at real boundaries; trust internal
  framework guarantees.
- **Keep the notes file** at `docs/FABLE_NOTES.md`: one lesson per entry, summary first, what
  worked / what didn't and why. Update in place; delete notes that prove wrong.
- **Checkpoint only when the work genuinely needs me:** a destructive/irreversible action
  beyond the scoped temp-deletion cascade, a real scope change, a spend or secret only I can
  provide, a production Convex deploy, or a genuine product decision this brief doesn't
  answer. Ask the one question and end the turn — don't end on a promise of unfinished work.
- **Your final message to me is a re-grounding, not a continuation of your working thread.**
  Lead with the outcome; then the one or two things you need from me, each explained as if
  new. Complete sentences, each file/flag in its own plain clause. If you must choose between
  short and clear, choose clear.

**Design + component rules (hard requirements):**

- Use the **`heroui-native-pro` and `heroui-native`** skills and **MCP** for every component —
  this is a React Native app, so the *native* Pro packages, **not** the web `@heroui-pro/react`.
  Look up component APIs via the MCP before using them; never guess props or compound
  structure. Prefer built-in components over custom ones. Follow the HeroUI design-taste
  profile.
- Honor the existing design system: tokens in `src/global.css` (warm paper ground, one
  **terracotta accent reserved for primary actions and focus only** — don't spray it),
  **Fraunces display-only** for large headlines/titles, **Inter** for body/UI. Both light and
  dark themes must feel intentional.
- **Motion:** transform/opacity only, reduced-motion safe. Reuse the animation primitives in
  `src/components/core/filing-stack-hero.tsx` (calm float / breathe / sway, different periods
  so it never reads mechanical). I built that "floating filing-cards" hero and I love it —
  the new empty-state graphics should feel like siblings of it, not copies.

## Decisions already made — do not re-litigate

1. **Tab order:** `Forms` · `Case Status` · `AI Assistant` · `Community` (currently
   Assistant · Forms · Cases · Community). Four tabs only. Update the tab layout **and** the
   `MASTER_PLAN.md` "Layout" section to match.
2. **Profile lives off the header avatar as a full-screen page** — not a fifth tab. Expand
   today's account modal into a full Profile screen.
3. **Temporary accounts** are the anonymous Better Auth sessions created by "Start filing."
   They stay **anonymous and unpersonalized**. **Auto-delete 48 hours after creation** if not
   converted, **with a clear in-app warning + a reminder beforehand** (a user mid-task must
   not be surprised). Deletion uses the **existing owner-data cascade**.
4. **Personalization by name happens only AFTER conversion to a real account** (Google or
   email/password). Temp users see neutral copy (e.g. "Welcome", no name). Do **not** prompt
   temp users for their name up front — we ask them for enough later. Once converted, use
   "Hi &lt;name&gt;" / "Welcome back &lt;name&gt;" throughout (assistant greeting, screen
   headers, profile).
5. **Conversion gate is at the file/export moment.** When a temp user is about to file or
   export their packet, require them to **create an account or continue with Google** to
   proceed. Converting must **carry their existing work over** (Better Auth anonymous
   account-linking). This value-moment gate is the primary conversion driver — do not gate the
   rest of the app.
6. **Renewal reminders** are sourced from **both** in-app completed filings **and** a manual
   entry (user logs an existing EAD / green-card expiry or a prior filing date).
7. **Google is the only social provider** right now (Apple is planned but gated behind its
   env vars; GitHub is intentionally gone — a developer identity provider is wrong for this
   audience).

## First: confirm the ground before you build

1. **Reach the repo and green the baseline.** Repo at `/Users/jaxson/develop/immifile`.
   Run `npx eslint .`, `bun run typecheck`, and the vitest suite; confirm green before
   changing anything. If it isn't green on a clean checkout, tell me.
2. **After any Convex change, run `npx convex dev --once`** — the client silently targets
   whatever was last pushed (this bit us in Run 1; see `docs/FABLE_NOTES.md`). Do all dev/test
   against the **dev** deployment (`dev:impressive-fish-50`); a production deploy is a
   checkpoint.
3. **Extend `MASTER_PLAN.md`, don't reinvent it.** Add a new milestone block (e.g. **M6**) for
   this run, mirroring the existing `status:` YAML header and the checkbox / `Status:` /
   `Done when:` / `Evidence:` format verbatim. Flip `status` back to `in_progress` and set
   `next_task` to your first M6 task. A task is `DONE` only when its tests + acceptance checks
   pass, in the same commit that flips the box and writes the evidence line.
4. **Auth is currently healthy.** A JWKS-secret mismatch was repaired this session by running
   `convex run auth:rotateKeys` (that internal action lives in `convex/auth.ts` for future
   secret rotations). Don't be alarmed by it; don't remove it.

## Environment facts that are load-bearing

- **Style gate is ESLint, not Prettier.** `npx eslint .` (`--fix` to autofix). Tabs, single
  quotes, no semicolons. Do **not** run Prettier — it corrupts the codebase.
- **Convex db API is the 1.42 table-name-first style.** Confirm exact call shapes from existing
  `convex/` code before writing new ones; match the surrounding code.
- **The logo has no vector source** — `assets/images/` holds only PNGs (`icon.png`,
  `adaptive-icon.png`, `favicon.png`, `splash-icon.png`, `splash-icon-dark.png`). See the logo
  task in Stream 1 for how to handle this.
- Build/simulator/PATH mechanics: reuse the appendix in `FABLE_BRIEF.md` rather than
  rediscovering them. The remote build Mac, detached-build pattern, and Maestro-driven
  simulator QA all still apply.

## Where things live (start here, then confirm by reading)

- Tabs: `src/app/(tabs)/_layout.tsx` (expo-router `NativeTabs`).
- Forms tab → `src/screens/home/*` (`home.screen.tsx`, `home.empty.tsx`, sections);
  header avatar/vault buttons in `src/app/(tabs)/forms/index.tsx`. Hero + motion primitive:
  `src/components/core/filing-stack-hero.tsx`.
- Cases: `src/app/(tabs)/cases/*`, `src/screens/cases/*`, `convex/cases.ts`.
- Assistant: `src/screens/assistant/*` (greeting copy in `assistant.screen.tsx`).
- Community: `src/app/(tabs)/community/*`, `src/screens/community/*`.
- Profile/account: `src/app/(modal)/account/index.tsx` (+ `_layout.tsx`); account gate /
  upgrade sheet in `src/components/account/*` (`useRequireAccount`, the upgrade sheet).
- Profile data: `convex/applicants.ts` (name / address / DOB / A-number) and
  `convex/documents.ts` + `src/screens/documents/*` (the upload vault).
- Auth: `convex/auth.ts` (`anonymous()` server plugin), `src/lib/auth-client.ts`
  (`anonymousClient`); the `isAnonymous` identity claim already distinguishes temp sessions
  (see `convex/community.test.ts`).
- Deletion cascade: `convex/account.ts` and `convex/model/ownerData.ts`. Cron infra:
  `convex/crons.ts`. Export/file step: `src/screens/applications/journey-hub/*`
  (`journey-hub.review-pay.tsx`, `pdf/*`).

## The work — six streams, in this order

Each stream de-risks the next. Parallelize within a stream where it's safe.

### Stream 1 — Navigation, personalization spine, and the logo

- **Reorder the tabs** to Forms · Case Status · AI Assistant · Community in
  `src/app/(tabs)/_layout.tsx`, and update the `MASTER_PLAN.md` Layout section. Keep labels
  short for a native tab bar ("Cases" is fine if "Case Status" crowds; you decide).
- **Personalization spine.** Add one source of truth for the current viewer: a hook returning
  `{ isTemp, firstName }` (temp = anonymous session; `firstName` only known post-conversion,
  from the Better Auth user / applicant record). Wire greetings to it: the assistant's opening
  greeting, and a "Welcome back, &lt;name&gt;" moment on Forms/Profile. **Neutral fallback for
  temp users** ("Welcome" / no name). Never show a name for an anonymous session.
- **Logo dot.** The "i" monogram's dot is currently light green; make it a **warm near-black**
  (about the app's ink token, e.g. `oklch(24% 0.02 60)` — a soft off-black, **not pure
  `#000`**). Because there's no vector source, **recreate the mark as a small SVG/vector you
  own**, then regenerate `icon.png`, `adaptive-icon.png`, `favicon.png`, `splash-icon.png`,
  and `splash-icon-dark.png`, plus any in-app logo usage. Record in `FABLE_NOTES.md` that the
  vector source was (re)created here so future recolors are trivial.

### Stream 2 — Temp-account lifecycle and conversion (auth/PII — fresh-context verify)

- **Export/file conversion gate.** When a temp (anonymous) user reaches the file/export step
  in the journey hub (`journey-hub.review-pay.tsx` / the PDF export path), interpose a
  conversion prompt: **"Create an account or continue with Google to export your filing."**
  Reuse the account-gate pattern in `src/components/account/*` (repurpose `useRequireAccount` /
  the upgrade sheet for hard account creation). On success, **Better Auth anonymous linking
  must carry their applications, answers, documents, and cases over** to the real account —
  verify the data actually survives the link.
- **2-day cleanup cron.** Add a daily job to `convex/crons.ts` that permanently deletes
  anonymous accounts **created more than 48 hours ago that never converted**, via the existing
  owner-data cascade (`convex/account.ts` / `convex/model/ownerData.ts`). Before deletion,
  **warn the user in-app** — e.g. a banner as the window approaches, and a clear "your
  temporary account and its data will be deleted soon — link an account to keep it" reminder.
  **This is destructive:** a fresh-context verifier subagent must confirm the query targets
  **only** anonymous, never-converted, past-48h accounts and never a real or freshly-linked
  one; add tests for the boundary (47h vs 49h; converted-then-idle).
- **Profile temp banner** (feeds Stream 3): temp users get a prominent "You're using a
  temporary account — link Google or create an account to save your work" card with the
  convert CTA.

### Stream 3 — Profile page (header avatar → full screen)

Turn the near-empty account modal into a real, well-built Profile screen. Sections, real data,
no placeholder rows:

- **Identity & details** — name (post-conversion), plus editable profile fields (name,
  address, date of birth, A-number) backed by `convex/applicants.ts`. For a solo filer this is
  their own applicant record; keep it obvious which applicant is "you".
- **Documents / uploads** — surface the Document Vault (`convex/documents.ts`,
  `src/screens/documents/*`) as a reusable library of everything they've uploaded (photos,
  scans). **Build the reuse seam now:** a "select from documents you've already uploaded" flow
  the filing pipeline can call, so a future filing can attach an existing upload instead of
  re-uploading.
- **Account & conversion** — for temp users, the convert card from Stream 2. For real
  accounts, show the provider, sign-out, and the existing delete-account cascade.

### Stream 4 — Forms tab: acknowledgeable intro → compact dashboard → renewals

This fixes "too long, I don't want to scroll." Target a **compact, single-screen dashboard**;
light scroll only if content genuinely warrants.

- **Don't delete the current intro** (the floating filing-cards hero + the "never miss a
  deadline / print-ready filing" feature rows) — it's genuinely useful. Make it a
  **dismissible intro**: the user taps "Got it" and it's **stored per user so it doesn't
  reappear**.
- **After acknowledgement**, Forms shows a compact dashboard:
  - **Drafts** (in-progress applications) and **Completed** (filed) as two distinct, scannable
    groups.
  - **Upcoming renewals** — computed from (a) completed in-app filings and (b) manual entries
    of a document expiry or prior filing date. Include an "add a document / filing date"
    affordance for the manual path, and remind against the real filing window (e.g. I-765
    EADs are typically filed up to ~180 days before expiry — confirm the exact guidance from a
    USCIS source and cite it in a note, don't hardcode a guessed number).
  - If there's genuinely nothing (no drafts, no completed, nothing to renew): the **animated
    floating-file empty-state graphic** for Forms (Stream 6).

### Stream 5 — Cases tab: existing + previous + empty animation

- **Case Status** shows both **existing (active)** and **previous (older/closed)** cases —
  receipt-number tracking and status timelines from `convex/cases.ts`. Compact and scannable;
  single-screen where the data allows.
- Distinct **animated empty-state graphic** for Cases (Stream 6).

### Stream 6 — Empty-state animations + the "not so empty" pass

- **Three distinct animated empty states**, all built on the `filing-stack-hero` motion
  primitives (calm, transform-only, reduced-motion safe), each a different motif so the tabs
  feel distinct:
  - **Forms** — the floating filing-cards stack (already built; reuse).
  - **Cases** — a status/tracking motif (e.g. a receipt or envelope easing along a status
    timeline).
  - **Community** — a people / conversation motif (e.g. drifting chat bubbles or paired
    avatars).
- **App-wide "not so empty" pass.** Where screens read as bare, add a decent amount of
  **genuinely useful** content — not filler, and not filling every pixel. Use your judgment
  within the design system; keep it calm. (Examples of the bar: the assistant already carries
  news + suggested paths; Forms now carries renewals; Profile carries documents; Cases carries
  timelines.)

## Definition of Done

- Tabs reordered to Forms · Case Status · AI Assistant · Community; `MASTER_PLAN.md` Layout
  updated. Profile is a full screen off the header avatar. Logo dot is a warm near-black across
  every icon/splash/favicon asset and any in-app logo, from a vector source you now own.
- Temp accounts: gated at file/export behind Google/email account creation, with verified data
  carryover on link; auto-deleted 48h after creation if unconverted, with a prior in-app
  warning; the deletion query provably targets only anonymous, never-converted, expired
  accounts (boundary tests included).
- Personalization by name appears only for converted accounts; temp users see neutral copy.
- Forms: dismissible-and-persisted intro → compact drafts/completed/renewals dashboard →
  animated empty state; no long scroll. Cases: existing + previous + animated empty state.
  Community: animated empty state. Bare screens now carry useful content; the app reads
  populated and calm in both light and dark.
- `npx eslint .`, `bun run typecheck`, and vitest are green. Simulator screenshots (light +
  dark) of each changed screen. Fresh-context verification passed on the auth / deletion-cron /
  export-gate / PII work. `MASTER_PLAN.md` M6 tasks are `DONE` with evidence lines.

## Verify as you build

Establish a self-check cadence and run it at intervals as you go: after each task, re-run the
type/lint/test/sim loop; for the sensitive streams (2 and the export gate in 4), have a
separate fresh-context subagent check your work against the acceptance criteria above and do a
security/ownership pass. Read the structured thinking of your verifier subagents; ground every
"done" in a test, log, or screenshot.

## Checkpoints — stop and ask

A production Convex deploy; any real spend or a secret only I can provide; a destructive action
beyond the scoped temp-deletion cascade; or a genuine product decision this brief doesn't
answer. Ask the one specific question and end the turn.
