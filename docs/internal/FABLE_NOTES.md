# Fable run notes

One lesson per entry. What worked / what didn't and why. Update entries in
place; delete ones that prove wrong.

## Assistant "misbehaving" — root cause (2026-07-07)

**Summary:** No server-side defect existed in the navigator pipeline; the
live failures were (a) the app running against a Convex dev deployment that
hadn't had the newest functions pushed, and (b) UX dead-ends that read as
"broken".

- Verified layer by layer with a throwaway `convex/diag.ts` action (deleted
  after use): ANTHROPIC_API_KEY valid + funded, `claude-haiku-4-5` resolves,
  `output_config` structured output works, an 8-message extraction battery
  classifies correctly, and multi-turn history merges facts across the
  clarification loop (turn 1 "expires next month" + turn 3 "work permit" →
  supported i765/renewal).
- On first sim launch the app showed a persisted render-error overlay:
  `Could not find public function for community:listPosts` — evidence the
  app had been running while the dev deployment lagged the committed code.
  **Lesson: after committing Convex code, always `npx convex dev --once`;
  the client silently targets whatever was last pushed.**
- The real UX defect: out-of-scope / legal-advice replies dead-ended the
  conversation (deliberately, per an old test asserting
  `suggestions === undefined`). To an anxious filer that reads as "the
  assistant stopped working". Fixed: every out-of-scope reply now keeps the
  attorney referral AND offers tappable supported paths. The safety boundary
  is unaffected — it lives in the deterministic server classifier
  (`convex/shared/navigator.ts`), not in hiding chips.
- Error/retry path verified live by pointing ANTHROPIC_MODEL at a bogus id:
  generic "Something went wrong" bubble + Try again, quota refunded
  (stayed at 7/20). Env restored afterwards.

## Convex env changes don't reach warm Node actions immediately (2026-07-07)

`npx convex env set` propagates to `'use node'` actions only when their
execution environment recycles — warm containers kept serving the old
value for several minutes while a fresh CLI invocation saw the new one.
**Lesson: after changing an env var that a Node action reads, force a
redeploy (`npx convex dev --once`) to recycle containers before trusting
test results.**

## Immifile rename: user-facing only (2026-07-07)

The app's user-facing name becomes **Immifile**; the technical identifiers
stay for now — scheme `immigrationrenewalhelp://`, iOS bundle
`dev.uing.immigrationrenewalhelp`, and the Expo slug — because the scheme is
wired into Better Auth trusted-origins and the Maestro deep links. Renaming
those is a coordinated release-time change, invisible to users.

## Simulator text entry without Maestro inputText (2026-07-07)

Maestro `inputText` crashes the XCUITest driver on iOS 26.5. Workaround that
works: `echo -n "text" | xcrun simctl pbcopy booted`, then Maestro
`longPressOn` the input + `tapOn: "Paste"` + `tapOn: "Send message"`
(accessibility label). Used to drive freeform assistant turns.

## Default simulator QA: live stream in the Codex side panel (2026-08-10)

The repository-wide source of truth is now
[`SIMULATOR_QA.md`](./SIMULATOR_QA.md). It retains the live Codex side-panel
workflow learned here and adds the device matrix, native frame recording,
transition assertions, evidence format, and release-surface checklist.

### NativeTabs / large-title regression gate

iOS 26 can reset a root `ScrollView` to `contentOffset.y = 0` when a first-use
intro reveals NativeTabs, putting the first section under the large-title
header. The app's correction is deliberately scoped to iOS 26 geometry; iOS 18
uses UIKit's automatic inset path. For every iOS-major upgrade, create a fresh
temporary account and dismiss the Resources and Account intros while sampling
through at least one second after the fade. The large title and first section
must remain in their expanded positions on the final frame. Run the same check
on the oldest supported simulator before changing the OS guard or the measured
navigation-bar constant.

## Immifile design system — measured contrast (2026-07-07)

Palette: warm paper ground, one terracotta accent, Fraunces (OFL) display +
Inter (OFL) body — both bundled via @expo-google-fonts (license permits app
redistribution). All tokens in src/global.css; zero hardcoded colors in
components (grep-gated). WCAG ratios computed via oklch→linear-sRGB→relative
luminance (script kept in session scratchpad; re-run on any token change).

| Pairing (text on ground)               | Light   | Dark    | Min |
| -------------------------------------- | ------- | ------- | --- |
| foreground / background                | 14.91:1 | 15.10:1 | 4.5 |
| surface-fg / surface                   | 14.94:1 | 13.00:1 | 4.5 |
| surface-secondary-fg / surface-sec.    | 12.29:1 | 12.05:1 | 4.5 |
| surface-tertiary-fg / surface-tert.    | 11.38:1 | 11.19:1 | 4.5 |
| muted / background                     | 6.47:1  | 6.63:1  | 4.5 |
| muted / surface-secondary              | 6.01:1  | 5.63:1  | 4.5 |
| default-fg / default                   | 10.82:1 | 10.83:1 | 4.5 |
| accent-fg / accent (button label)      | 5.80:1  | 6.81:1  | 4.5 |
| accent as text / background            | 5.63:1  | 6.90:1  | 4.5 |
| success-fg / success                   | 4.94:1  | 7.51:1  | 4.5 |
| warning-fg / warning                   | 4.78:1  | 8.07:1  | 4.5 |
| danger-fg / danger                     | 5.43:1  | 5.74:1  | 4.5 |
| foreground / field                     | 15.81:1 | 13.51:1 | 4.5 |
| accent vs background (focus, non-text) | 5.63:1  | 6.90:1  | 3.0 |
| danger as text / background            | 5.27:1  | 5.79:1  | 4.5 |
| success as text / background           | 4.80:1  | 7.45:1  | 4.5 |

All 32 pairings PASS. Key hexes: light bg #f7f3eb, light accent #8e503a,
dark bg #130f0a, dark accent #d78863.

Gotchas learned:

- The old global.css font tokens (`montserrat-Bold`) never matched the
  registered font names (`Montserrat_700Bold`), so HeroUI text silently fell
  back to the system font. CSS font vars MUST equal the exact useFonts keys.
- The Remi mascot PNG had a semi-transparent white background (alpha 1–2)
  that was invisible on light but showed as a ghost box on dark — stripped
  alpha<16 pixels with PIL and overwrote the asset.
- Motion: 2 purposeful animations only (welcome staggered rise, assistant
  recommendation-card settle), both `ReduceMotion.System`-gated; verified
  with ReduceMotionEnabled=1 on the sim (instant render, no crash).
- Icons rationalized to Lucide only; removed 5 unused
  @react-native-vector-icons families (packages + app.json plugins).

## M5-T2 news fallback ladder — rung taken (2026-07-07)

Rung 1 (official RSS) shipped: `https://www.uscis.gov/news/rss-feed/59144`
serves clean RSS 2.0 with a browser User-Agent (default agents get 403 /
Drupal antibot on HTML pages, but the RSS endpoint is clean). No newsroom
scraping or static link-out needed. Every cached URL is prefix-validated
against `https://www.uscis.gov/` twice (parse + write).

## Driving the credentialed auth flow in the sim (2026-07-07)

The upgrade-sheet auth form is portal-rendered and invisible to Maestro's
element tree. Working recipe: create accounts via Better Auth's public HTTP
`sign-up/email` on the current development site URL from `.env.local` (do not
reuse a deployment name copied from these historical notes), mint JWTs from
`/api/auth/convex/token` for seeding via `convex.cloud/api/mutation`, then
sign into the APP through the regular sign-in screen (keychain reset →
Welcome → pbcopy+Paste per field → Sign in), which Maestro CAN drive. This
unlocked the full live moderation round-trip (hide/restore/block/unblock).

## Logo has a vector source now (2026-07-09)

**Summary:** `assets/images/logo.svg` is the canonical Immifile monogram —
recreated in M6-T2 because the logo previously existed only as exported PNGs.
Future recolors are trivial: edit the SVG (or the color constants in
`scripts/generate-logo-assets.mjs`) and run `node
scripts/generate-logo-assets.mjs` to regenerate all five shipped PNGs (icon,
adaptive-icon, favicon, splash-icon, splash-icon-dark) via `@resvg/resvg-js`
(devDependency).

- The stem is the Fraunces SemiBold dotless-i outline (IoU 0.991 against the
  original mark — measured, not eyeballed); the dot is a circle in the ink
  tone: light `#261D16` = oklch(24% 0.02 60), dark-splash `#E9E4DC`.
- The five variants are one parameterized composition: same mark scaled about
  (514, 511) at 1.0 / 0.713 / 0.629 with per-variant colors — measured from
  the original PNGs so regenerated files are drop-in.
- Gotcha: NEVER `npm install` in this repo — it prunes bun-installed packages
  (76 removed before `bun install` restored them). Use `bun add` / `bun add -d`.

## Driving Better Auth over HTTP for live verification (2026-07-09)

**Summary:** the fastest way to live-verify auth flows (anonymous linking,
carryover, cleanup) is plain HTTP against the dev deployment + a
ConvexHttpClient authed via `/api/auth/convex/token`. Gotchas that cost time:

- Every state-changing Better Auth endpoint needs `Origin:
immigrationrenewalhelp://` (the app scheme in trustedOrigins) or it 403s
  with MISSING_OR_NULL_ORIGIN. `sign-in/anonymous` happens to pass without it;
  `sign-up/email` does not.
- The betterAuth component's raw adapter functions (`npx convex run
--component betterAuth adapter:updateOne`) wrap args in `{ "input": ... }`,
  and raw docs key by `_id` — a where-clause on `id` matches nothing (and
  warns about a missing index). `createdAt` is stored as a number (ms).
- Test scripts must live inside the project dir (not /tmp) so node resolves
  the repo's `convex` package.

## Temp-account lifecycle invariants (2026-07-09, M6-T3/T4)

**Summary:** conversion carryover and the 48h cleanup share one identity fact:
ownerId = `${CONVEX_SITE_URL}|${betterAuthUserId}` (= JWT `iss|sub` =
tokenIdentifier). The cron re-verifies every candidate against
`isExpiredTempAccount` (strictly >48h AND `isAnonymous === true`; unknown age
= keep) immediately before deleting, and purges app data BEFORE auth rows so
a crash retries instead of orphaning. Anonymous owners can never hold
community rows (requireCredentialedOwnerId), so the remap only touches the
filing-side tables. Fresh-context verifier passed all sections (commit
6e5342d); if CONVEX_SITE_URL ever changes (custom domain), pre-change anon
data would be orphaned (never mis-deleted) — remember at migration time.

## Maestro on iOS 26.5: hideKeyboard dismisses formSheets (2026-07-10)

**Summary:** during M7-T3 sign-in QA, `hideKeyboard` intermittently performed
a swipe that DISMISSED the `formSheet` sign-in screen; subsequent taps landed
on the Welcome screen underneath (one hit the Google button, which opened an
ASWebAuthenticationSession dialog and made email sign-in look broken). Email
sign-in itself works and transitions in-place — no app bug.

- Recipe that works: never call `hideKeyboard` inside a sheet. Target fields
  by placeholder text (`longPressOn: "you@example.com"`, `longPressOn:
"••••••••"` — the password placeholder is literally eight U+2022 bullets)
  then `tapOn: "Paste"`, then tap the submit button by its exact label.
- Percent-point taps inside sheets are unreliable while the keyboard is up
  (layout shifts); prefer text selectors.
- iOS "Save Password?" prompt appears after a successful credential sign-in —
  dismiss with `tapOn: "Not Now"` before asserting anything else.

## One-screen tab roots: iOS insets vs non-scrolling ScrollViews (2026-07-10)

**Summary:** for the M7 "no primary tab scrolls" rule, do NOT disable
scrolling. On iOS 26 native-stack transparent large-title headers, the
content clears the header via `contentInsetAdjustmentBehavior="automatic"`,
and that adjustment silently stops applying when the scroll view cannot rest
at a negative offset: both `scrollEnabled={false}` and `bounces={false}`
made the root render underneath the large title (content clamped to y=0).
The working recipe is a plain BodyScrollView whose CONTENT fits one screen —
a fitting page simply has nothing to scroll. Verify fit on an iPhone SE
(667pt): the first pass overflowed there and only showed on-device.

Also: `h-full` on a Card inside a flex-row tile resolves circularly in
Uniwind/Yoga and stretched the tiles to the tab bar — use `flex-1` on the
card + `items-stretch` on the row for equal-height tiles.

Driving a second simulator: install the same dev-client .app
(`simctl get_app_container booted <bundle> app` → `simctl install <udid>`),
launch, tap the Metro server row in the dev-client launcher; Maestro targets
it with `--device <udid>`; `simctl pbcopy <udid>` for paste-based text entry.

## Native tabs mount every tab screen eagerly (2026-07-10)

**Summary:** an effect in a screen inside expo-router NativeTabs runs even
when that tab has never been visited — all tab screens mount at startup. The
TabIntro overlay hid the tab bar (`hidden` prop on NativeTabs via
TabBarContext) from a BACKGROUND tab, killing the bar app-wide. Anything
side-effectful that should apply only while a tab is showing must use
`useFocusEffect`, not `useEffect`.

Also: the empty-state "grow + justify-center" inside an inset-adjusted
BodyScrollView sized content to the full frame and pushed the CTA below the
tab bar. Full-surface states (intros, empty states) now use plain Views with
explicit `insets.top + 96` / `insets.bottom + 12` padding — deterministic on
every device.

Better Auth: `signIn.anonymous()` refuses when a session survives
half-signed-out ("anonymous users cannot sign in again anonymously") — the
Welcome CTA now signs out best-effort and retries once, self-healing.

Pro DatePicker: `presentation` must be set to the SAME value on BOTH
`DatePicker.Select` and `DatePicker.Content` or it throws at render.

## Anonymous sign-in after account deletion dead-ends on Welcome (M7 fix, superseded)

Symptom: delete the account → back on Welcome → tap "Start filing" → the
server creates the anonymous user and session (visible in Convex logs /
betterAuth user table), but the app never leaves Welcome. Every further tap
mints another orphan anonymous user (the previous session is killed by the
self-heal signOut, then a new user is created).

Root cause: the anonymous client plugin notifies `$sessionSignal` as part of
the `/sign-in/anonymous` call, which makes better-auth refetch `/get-session`
— but under the Expo client the secure-store cookie write can land _after_
that refetch, so the session store refetches with no cookie, stays null, and
`useConvexAuth().isAuthenticated` never flips. A manual
`authClient.getSession()` moments later returns the session fine, and a cold
relaunch enters the app — only the live store is stale.

The old fix manually called `authClient.$store.notify()` after sign-in. Do not
restore it. Better Auth's Expo plugin already persists `Set-Cookie` and emits
the correctly ordered session signal; the generic client action can emit a
second delayed signal as well. App-owned auth calls now suppress that delayed
signal, wait briefly for the Expo-owned refresh, and use at most one coalesced
cache-bypassed fallback. Root reconciliation handles only a stable
cookie/session mismatch, and later Convex token loading retains the mounted
navigator instead of replacing it with the boot screen.

**Current rule:** one owner-driven signal, one bounded fallback only when
stranded, and no refresh-revision bus or raw `$sessionSignal` notification.
Any retry loop here is a regression because overlapping `/get-session` calls
abort each other and replay the root navigation transition.

Note: orphan anonymous users from this bug are swept by the existing
`cleanupTempAccounts` cron, so no manual cleanup was needed.

## Verifying modal routes: deep links beat tap paths (M7-T7)

A Pressable with an `accessibilityLabel` replaces its child text in the iOS
accessibility tree — Maestro `tapOn: "Forum rules"` fails even when the link
is visibly on screen (the node is "Read the forum rules"). For modal-route
verification skip selector archaeology entirely: `openLink:
immigrationrenewalhelp://<route>` (or `xcrun simctl openurl`) opens each
modal deterministically, then `tapOn: "Close"` hits the shared ModalHeader X
(a11y label "Close"). Verified all six M7 modals this way in light and dark.

## USCIS I-765/I-90 form facts, verified (2026-07-13, M8-T7 groundwork)

**Summary:** a parallel research + adversarial-verify workflow pulled the current
official I-765 and I-90 facts from uscis.gov only; full cited detail is in
`docs/internal/uscis-form-research.md` (the source of truth for the M8-T7 audit). Headline
facts, all CONFIRMED by an independent verifier re-fetching the live pages:

- **I-765** edition **08/21/25**; fee **$520 paper / $470 online**, **$0** separate
  biometrics; general filing fee is category- and channel-dependent (many
  humanitarian/adjustment categories are $0; a non-waivable Pub. L. 119-21 surcharge
  applies to some asylum/parole/TPS categories). Source: uscis.gov/i-765, G-1055.
- **I-765 eligibility set = 53 genuine codes** (the app currently offers only 8 — a
  real correctness gap for M8-T5/T7). Verifier caveats to honour when I wire the set:
  **(c)(34) is NOT in the 08/21/25 instructions "Who May File" list** (drop it despite
  a stray fee-table mention), and **"(a)(7)(ii)" is not a category** — it's a regex
  artifact of the CFR citation `8 CFR 103.2(a)(7)`. Reconcile against the live form PDF
  before finalizing options.
- **I-90** edition **01/20/25**; fee **$465 paper / $415 online**, **$0** separate
  biometrics (folded in since the 04/01/2024 fee rule). Source: uscis.gov/i-90, G-1055.
- **I-90 Part 2 Item 1 "My status is"** — RESOLVED 2026-07-20: status is now collected
  (new-application pre-screen + `card-details` step) and mapped (`P2_checkbox1[0/1/2]` =
  1.a/1.b/1.c, verified via TU tooltips + export values). Printed order/text CONFIRMED
  verbatim: **1.** Lawful Permanent Resident (Proceed to Section A.) · **2.** Permanent
  Resident - In Commuter Status (Proceed to Section A.) · **3.** Conditional Permanent
  Resident (Proceed to Section B.). Section B reasons (`P2_checkbox3`, shuffled indices)
  are mapped too; conditional-resident renewal is screened out (`shared/screening.ts`).
- **A-Number** on both forms: USCIS specifies only that it "begins with an A"; it is
  labeled "(if any)" and instructions say enter "N/A" if none. The app's digits-only
  7–9 regex is close but not the official phrasing — revisit in M8-T5.

**Lesson: adversarial verification earned its cost here** — it caught (c)(34) and the
(a)(7)(ii) artifact that a single-pass research agent asserted as real. Never wire a
"known set" into a guard from one research pass; cross-check against the live form.

## Detached `bash -c` subshell drops PATH — npx 127, vitest mis-collects (2026-07-13)

**Summary:** the remote-build detached pattern `ssh jaxson-build 'cd repo && nohup bash
-c "…" > log 2>&1 &'` does NOT inherit an outer `export PATH=/usr/local/bin`. Inside
that subshell `npx` resolves to nothing → **EXIT 127**, and `bun run test:once` reported
**20/24 test files "failed"** (really failed to collect, only 46/385 tests ran) — a
misleading cascade that looks like a real regression but is pure environment. Re-running
with `export PATH=/usr/local/bin:$PATH` as the FIRST line _inside_ the `bash -c` body
made both green (eslint 0 errors, 385/385 vitest). **Lesson: put the PATH export inside
the `bash -c` body, not just on the outer ssh command; and treat a mass "files failed to
collect" (not assertion failures) as a PATH/toolchain artifact, not a code break.**
