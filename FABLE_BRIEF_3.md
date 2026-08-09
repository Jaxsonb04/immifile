# Immifile — Run 3: a premium, one-screen app with a real Profile

## Why you're doing this

I'm building **Immifile**, a free Expo / React Native (SDK 57) + Convex app that helps
immigrants prepare USCIS **I-765** (work permit) and **I-90** (green card) renewals: a
Claude assistant, a guided form → print-ready-PDF pipeline, case tracking, and a community
forum. It's for real, anxious people filing real government paperwork, so it has to feel
**calm, trustworthy, premium, and finished**.

Run 1 (`FABLE_BRIEF.md`) fixed the assistant and laid the warm-paper design system. Run 2
(`FABLE_BRIEF_2.md`, milestone **M6**) added the personalization spine, the temporary-account
lifecycle, a real Profile page, and fuller tabs. The app now works and looks intentional.
**This run is about feel and information architecture** — turning a working app into one that
reads as a finished, premium product. Three themes:

1. **Premium and one-screen.** No primary tab should make the user scroll up and down. Every
   main surface fits one device screen. And the app should look and read as *premium* — drop
   the "free" / "Completely free" messaging that reads as cheap and a little sketchy. The app
   stays free to use; it just stops advertising that fact in a way that undercuts trust.
2. **A real Profile / Account tab — the linchpin.** Today's Profile is cluttered and, worse,
   editing your name doesn't actually propagate. The Account tab should open with a clean
   identity preview, disclose editable details progressively below, and — critically — **Save
   must update everything**: the name you set has to change your greeting, your avatar, and
   every personalized surface, immediately and after a relaunch.
3. **Navigation that fits the product.** Tabs become **Forms · Cases · Forum · Account**. The
   assistant stops being a tab and becomes a small, always-available chat bubble. Each tab
   gets a one-time intro that teaches the surface and then animates out of the way.

Treat this as a multi-day, mostly-autonomous engagement. Scope it, sequence it, execute it,
verify your own work as you go.

## How to work

This inherits the operating rules in `FABLE_BRIEF.md` and `FABLE_BRIEF_2.md` ("How to work") —
I won't repeat them in full. The load-bearing ones, restated:

- **When you have enough information to act, act.** Don't re-derive settled facts, re-litigate
  decisions I've made (the "Decisions already made" section below is final), or narrate options
  you won't pursue in messages to me. Weighing a choice → give a recommendation, not a survey.
  (This does not apply to your thinking.)
- **Operate in a loop:** pick the next unit → implement → verify against acceptance criteria →
  record evidence → advance. Use **high** effort by default.
- **Ground every progress claim in a real result** — a passing test, a log line, a simulator
  screenshot. If it isn't verified, say so. If tests fail, show the output. Never mark work
  "done" you can't back with evidence.
- **Verify with fresh eyes, proportionally.** For anything touching **auth, identity, the
  name-propagation / Better Auth user record, PII, ownership, per-owner persistence, or the
  temp-account lifecycle**, spin up a **separate fresh-context verifier subagent** to check
  against acceptance criteria plus a security/ownership pass. For low-risk JS-only or
  design-token edits, your own test/type/lint/sim loop is enough. Delegate independent work to
  parallel subagents and keep moving while they run.
- **Stay in scope; do the simplest thing that fully works.** No features, abstractions, or
  backwards-compat shims beyond what a task needs. Validate at real boundaries; trust internal
  framework guarantees. A relocation is not a rewrite — re-home working logic, don't rebuild it.
- **Keep the notes file** at `docs/FABLE_NOTES.md`: one lesson per entry, summary first, what
  worked / what didn't and why. Update in place; delete notes that prove wrong.
- **Checkpoint only when the work genuinely needs me:** a destructive/irreversible action, a
  real scope change, a spend or secret only I can provide, a production Convex deploy, or a
  genuine product decision this brief doesn't answer. Ask the one question and end the turn —
  don't end on a promise of unfinished work.
- **Your final message to me is a re-grounding, not a continuation of your working thread.**
  Lead with the outcome; then the one or two things you need from me, each explained as if new.
  Complete sentences, each file/flag in its own plain clause. If you must choose between short
  and clear, choose clear.

**Design + component rules (hard requirements):**

- Use the **`heroui-native-pro` and `heroui-native`** skills and **MCP** for every component —
  this is a React Native app, so the *native* Pro packages, **not** the web `@heroui-pro/react`.
  Look up component APIs via the MCP before using them; never guess props or compound structure.
  Prefer built-in components over custom ones. Follow the HeroUI design-taste profile.
- Honor the existing design system: tokens in `src/global.css` (warm paper ground, one
  **terracotta accent reserved for primary actions and focus only** — don't spray it),
  **Fraunces display-only** for large headlines/titles, **Inter** for body/UI. Both light and
  dark themes must feel intentional.
- **Motion:** transform/opacity only, reduced-motion safe. Reuse the idle-loop hero primitives
  already in the repo (`src/components/core/filing-stack-hero.tsx`,
  `case-tracking-hero.tsx`, `community-hero.tsx`) — the calm float/breathe/sway on different
  periods so nothing reads mechanical. New motion (intro-page transitions, the assistant bubble)
  should feel like a sibling of those, not a copy.
- **The premium bar.** Every surface you touch must clear "would this look believable in a
  screenshot of a real, polished, premium consumer app?" Gather references for the crucial
  surfaces (see the Account-tab task). Remove cheapening copy.

## Decisions already made — do not re-litigate

1. **Tab order is `Forms · Cases · Forum · Account`** — four tabs. The current **Community** tab
   is relabeled **Forum**. Today's Profile (the account modal off the header avatar) becomes its
   own **Account** tab. The **Assistant tab is removed** (it becomes a bubble — decision 2).
   Update `src/app/(tabs)/_layout.tsx` **and** the `MASTER_PLAN.md` "Layout" section to match.

2. **The Assistant is no longer a tab — it's a small, always-available chat bubble.** Placement
   is my call after research, and here it is: a **persistent floating "Ask" bubble anchored
   bottom-right, just above the tab bar, on the Forms and Cases surfaces** — where "which form
   should I prepare?" and "what does my case status mean?" help is actually relevant. Hide it on
   Forum and Account (peer-support and settings surfaces don't need it, and both already own
   their header actions). Tapping the bubble opens the **existing `AssistantScreen` as a
   full-height sheet/modal**. If a bottom-right bubble genuinely collides with a surface's own
   controls, fall back to a header chat-bubble icon on that surface — but the floating bubble is
   preferred. **Re-home the assistant; do not rebuild** the deterministic navigator, the 20/day
   quota, or the error/retry path.

3. **Premium is presentation-only.** The app stays **free to use** — no paywalls, no charging,
   no RevenueCat/entitlement changes in this run. Your job is to **remove the "free" /
   "Completely free" messaging** and make every surface feel premium, polished, and trustworthy.
   (If you ever feel a change implies monetization, that's out of scope — stop and ask.)

4. **No primary tab scrolls.** Each main tab (Forms, Cases, Forum, Account) fits **one device
   screen** at its root. Forms specifically becomes a **compact hub**: a single-screen summary
   surfacing the few most useful things, with **"See all"** affordances that push the full lists
   (all drafts, all completed, all renewals, all cases) to their **own detail screens**. The
   long content moves one level deeper; the tab root never scrolls. "One screen" is
   **device-height-aware** — verify on a small device (iPhone SE, 375×667) and a large one
   (iPhone 17). A scrollable *inner region* on a detail screen is fine; the tab *root* scrolling
   is not.

5. **The Account tab is the crucial surface** and must be genuinely well-designed. Study how
   top consumer apps build their account/profile tabs (e.g. Cash App, Robinhood, Airbnb,
   Revolut, Duolingo): a **compact identity preview at the top** (avatar, name, status/email),
   then **grouped, progressively-disclosed sections** below — not everything flattened onto one
   wall. Move the noise (delete-account, blocked-in-community, dev tools) into a **Settings
   sub-screen** so the tab reads calm. **Editing must actually work:** on Save, the user's name
   must update the **Better Auth user record** — not only the `applicants` self-row — so the
   greeting, avatar initials, and every personalized surface reflect it **immediately and after
   a relaunch**. (Today `updateSelfProfile` writes only the applicants `displayName`; the Better
   Auth `user.name` that `useViewer().firstName` reads is never touched. That's the "doesn't
   sync my name" bug — fix it.)

6. **Every tab gets a one-time intro page.** Forms, Cases, Forum, and Account each open, on first
   visit, with a short intro that teaches what the tab offers and what you can do there, ending
   in a single **"OK" / "Got it"** button. Tapping it **animates a seamless transition** into the
   real tab and the intro **never returns** — persisted **per owner**, exactly like the existing
   Forms intro (extend `ownerPreferences`; server-side so it carries over on account link and is
   erased by the deletion cascade). The **Forms first-run intro must also fit one screen, not
   scroll, and carry premium copy** — remove "Completely free" and anything that reads cheap.

7. **USCIS news moves into the Forum tab**, out of the Assistant. Keep the official-source
   treatment ("Official · uscis.gov", link-outs, staleness note); the cron and cache are
   unchanged.

8. **Modals and popups get a consistent header** with a **close (X) and/or back** affordance and
   **correct top safe-area padding**. Today several modal titles sit too close to the top (the
   Community rules page is the canonical example) and some rely on the user scrolling to find a
   way out. A user should never have to scroll a popup to dismiss it.

## First: confirm the ground before you build

1. **Reach the repo and green the baseline.** Repo at `/Users/jaxson/develop/immifile`.
   Run `npx eslint .`, `bun run typecheck`, and the vitest suite; confirm green before changing
   anything. If it isn't green on a clean checkout, tell me.
2. **After any Convex change, run `npx convex dev --once`** — the client silently targets
   whatever was last pushed (see `docs/FABLE_NOTES.md`). Do all dev/test against the **dev**
   deployment (`dev:impressive-fish-50`); a production deploy is a checkpoint. `DEV_SEED_ENABLED`
   is currently `true` on dev, so the Account tab's "Seed demo data" works for simulator QA.
3. **Extend `MASTER_PLAN.md`, don't reinvent it.** Add a new milestone block (**M7**) mirroring
   the existing `status:` YAML header and the checkbox / `Status:` / `Done when:` / `Evidence:`
   format verbatim. Flip `status` back to `in_progress` and set `next_task` to your first M7
   task. A task is `DONE` only when its tests + acceptance checks pass, in the same commit that
   flips the box and writes the evidence line. Also update the **Layout** section to the new tab
   order + the assistant-bubble decision.
4. **Auth is healthy.** The `auth:rotateKeys` internal action exists for future secret rotations
   (`convex/auth.ts`). Don't be alarmed by it; don't remove it.

## Environment facts that are load-bearing

- **Style gate is ESLint, not Prettier.** `npx eslint .` (`--fix` to autofix). Tabs, single
  quotes, no semicolons. Do **not** run Prettier — it corrupts the codebase. Note the
  `react-hooks/purity` rule: don't call `Date.now()` in render — use the `useSyncExternalStore`
  clock pattern already in `account.temp-banner.tsx` / `use-today.ts`.
- **Convex db API is the 1.42 table-name-first style.** Match the surrounding `convex/` code.
- **Never `npm install`** in this repo — it prunes bun-installed packages. Use `bun add` /
  `bun add -d` and `bun install`.
- **Reuse the M6 seams — don't duplicate them:**
  - `useViewer()` (`src/components/account`) is the single source of `{ isTemp, firstName }`;
    every greeting reads it. It reads the Better Auth `user.name` — which is exactly why the
    Account-tab Save must update that record (decision 5).
  - `ownerPreferences` (`convex/preferences.ts`, key allowlist) already persists
    `formsIntroDismissed` per owner, carries over on link, and is erased by the cascade. Extend
    the allowlist for the per-tab intros; don't invent a new mechanism.
  - The three hero primitives and the `ScreenEmpty` `visual`/`footer` slots exist already.
  - The account/upgrade gate (`useRequireAccount`, the upgrade sheet) and the assistant
    surface are all reusable as-is.
- Build/simulator/PATH mechanics, the remote build Mac, the detached-build pattern, and the
  Maestro-driven simulator QA (screenshot helper, coordinate taps, `pbcopy`+paste for text
  entry, disabling the dev-client floating gear via the dev menu "Tools button" toggle before
  screenshots) all still apply — reuse the appendix in `FABLE_BRIEF.md` / `FABLE_BRIEF_2.md`
  and the `docs/FABLE_NOTES.md` entries rather than rediscovering them.

## Where things live (start here, then confirm by reading)

- **Tabs:** `src/app/(tabs)/_layout.tsx` (expo-router `NativeTabs`). Current groups: `(forms)`
  (holds the index `/`), `cases`, `assistant`, `community`. Target: `(forms)`, `cases`,
  `community` (labeled Forum), `account`; `assistant` removed as a tab.
- **Forms:** `src/screens/home/*` (`home.screen.tsx`, `home.intro.tsx`, `home.empty.tsx`,
  `home.summary.tsx`, `home.active-applications.tsx`, `home.completed.tsx`, `home.renewals.tsx`,
  `home.attention.tsx`); header actions in `src/app/(tabs)/(forms)/index.tsx`.
- **Cases:** `src/app/(tabs)/cases/*`, `src/screens/cases/*`, `convex/cases.ts`.
- **Assistant (to be re-homed into the bubble sheet):** `src/screens/assistant/*`
  (`assistant.screen.tsx`, `assistant.news.tsx` — the news moves to Forum).
- **Forum (currently Community):** `src/app/(tabs)/community/*`, `src/screens/community/*`;
  news data `convex/news.ts` (`news:latestNews`).
- **Profile → Account tab:** today at `src/app/(modal)/account/index.tsx` rendering
  `src/screens/profile/*` (`profile.screen.tsx`, `profile.account.tsx`, `profile.details.tsx`,
  `profile.documents.tsx`). Editable data: `convex/applicants.ts`
  (`getSelfApplicant`/`updateSelfProfile`). Name sync: `src/lib/auth-client.ts`
  (`authClient.updateUser` — verify the exact API via Better Auth before using).
- **Per-owner prefs:** `convex/preferences.ts` + the `ownerPreferences` table (`convex/schema.ts`),
  cascade + link-remap in `convex/model/ownerData.ts`.
- **Modal routes for the header/padding pass:** `src/app/(modal)/*` — `new-application`,
  `new-case`, `new-post`, `community-rules`, `moderation`, `upgrade`, `interview/*`, plus the
  new assistant sheet.

## The work — seven streams, in this order

Each stream de-risks the next. Parallelize within a stream where it's safe.

### Stream 1 — Navigation restructure
- Reorder tabs to **Forms · Cases · Forum · Account**; relabel Community → **Forum**. Move
  `(modal)/account` to a real `(tabs)/account` route; every place that pushed `/account`
  (header avatar buttons across the tabs) now selects the Account tab — and the **header avatar
  itself is redundant, so remove it**. **Remove the Assistant tab.** Update the `MASTER_PLAN`
  Layout section. Regenerate typed routes (a brief `expo start`). Verify all four tabs navigate
  on-device with no route conflicts and a single `/` index.

### Stream 2 — The Assistant bubble
- Implement the floating **"Ask" bubble** (decision 2): bottom-right, above the tab bar, on
  Forms + Cases, opening the existing `AssistantScreen` as a full-height sheet/modal with a
  reduced-motion-safe entrance and a clear close affordance. Re-home the assistant surface —
  keep the navigator, quota, and error/retry logic intact. The news section leaves the assistant
  here (it lands in Forum in Stream 6).

### Stream 3 — The Account tab (the crucial one; fresh-context verify)
- Rebuild the Account tab around a **clean identity preview** (avatar with initials or photo,
  name / "Temporary account", email or provider, or the temp convert card) followed by
  **grouped, progressively-disclosed sections** — gather real references first and follow the
  HeroUI design-taste profile. Move **delete-account, blocked-in-community, and dev tools into a
  Settings sub-screen** so the tab reads calm. Keep editable personal details
  (name/DOB/country/A-number/address), but make **Save actually propagate**: write the
  `applicants` self-row **and** update the Better Auth `user.name`, so the greeting, avatar
  initials, and personalization update everywhere and survive a relaunch. **This touches
  identity — fresh-context verify** (name propagation across `useViewer()` consumers; ownership;
  no PII leak; the temp-vs-credentialed split). Sim-verify the full round-trip: edit name → Save
  → greeting + avatar reflect it on Forms and in the assistant, and persist across a relaunch.

### Stream 4 — Forms as a one-screen hub
- Reshape Forms into a **compact, non-scrolling hub** (decision 4): a single-screen summary of
  the most useful things (next renewal deadline, in-progress draft(s), anything needing
  attention) with **"See all"** entries that push the full **drafts / completed / renewals /
  attention** lists to their own detail screens. Keep the M6 renewals + manual-entry logic —
  just relocate the long lists behind "See all". Premium copy throughout (no "free" messaging).
  Verify **no root scroll** on both a small and a large device.

### Stream 5 — Per-tab intro pages
- Give **Forms, Cases, Forum, and Account** each a one-time intro (decision 6): a
  feature-showcase page with a single OK/Got-it button and a **seamless animated transition**
  into the tab, dismissal persisted **per owner** (extend the `ownerPreferences` key allowlist;
  server-side so it carries over on link and is erased by the cascade). The **Forms intro must
  fit one screen, not scroll, and read premium**. Verify each intro shows once, animates out,
  and stays gone across a relaunch.

### Stream 6 — Forum tab (news + polish)
- Fold the **USCIS news** section into the **Forum** tab (out of the assistant), placed sensibly
  (e.g. above the feed) with the same official-source treatment. Keep the Forum root fitting one
  screen (the feed may own its own scroll region, but the tab chrome + news must not force page
  scroll). Relabel "Forum" consistently.

### Stream 7 — App-wide spacing + modal-header pass
- Build a **consistent modal/popup header** with a close (X) and/or back affordance and correct
  top safe-area padding, and apply it to every modal route (`new-application`, `new-case`,
  `new-post`, `community-rules`, `moderation`, `upgrade`, `interview`, the assistant sheet). Fix
  the too-tight top padding (Community rules is the canonical example) and **sweep the app for
  the "weird" spacing** I flagged — consistent section rhythm, breathing room at the top, aligned
  to the design system's spacing scale. Both themes.

## Definition of Done

- Tabs are Forms · Cases · Forum · Account; **no primary tab scrolls** (verified on a small and a
  large device); `MASTER_PLAN.md` Layout updated. The Assistant is a floating bubble on Forms +
  Cases opening the existing assistant; it is no longer a tab.
- The **Account tab** is a clean identity preview + progressively-disclosed sections with a
  Settings sub-screen for the noise; **Save propagates the name to the Better Auth user record
  and everywhere it's shown**, verified round-trip and across a relaunch, and fresh-context
  verified for identity/PII/ownership.
- **Premium presentation, zero "free" messaging, no monetization added.**
- Every tab has a **one-time animated intro**, persisted per owner; the Forms intro fits one
  screen. **News lives in Forum.** Modals have consistent close/back headers and correct top
  padding; the app's spacing reads intentional in both themes.
- `npx eslint .`, `bun run typecheck`, and vitest are green. Simulator screenshots (light + dark)
  of every changed surface. Fresh-context verification passed on the Account-tab name-sync /
  identity work. `MASTER_PLAN.md` M7 tasks are `DONE` with evidence lines.

## Verify as you build

Run the type/lint/test/sim loop after each task. For **Stream 3** (name propagation, identity,
per-owner persistence) use a **separate fresh-context verifier subagent** against the acceptance
criteria plus a security/ownership pass, and read its structured output. Ground every "done" in
a test, log, or screenshot.

## Checkpoints — stop and ask

A production Convex deploy; any real spend or a secret only I can provide; a destructive action
beyond the scoped changes; anything that would imply real monetization/paywalling (out of
scope); or a genuine product decision this brief doesn't answer (for example, if "no scroll on
the tab root" proves genuinely impossible on a specific surface even as a hub). Ask the one
specific question and end the turn.
