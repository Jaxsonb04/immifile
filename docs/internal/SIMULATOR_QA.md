# Immifile simulator QA workflow

This is the default repository-wide development QA workflow for Immifile. It
applies to every feature and release, not only Fable/Maestro work.

## Why this workflow

A live simulator stream in the Codex right panel makes transient behavior
visible while the QA conversation, source, and logs remain in the same window.
It is more accurate than isolated screenshots for navigator remounts, auth
handoffs, one-frame chrome flashes, delayed insertions, and animation overlap.

The stream is one evidence source, not a substitute for accessibility
snapshots, timed frame sampling, Metro/native logs, assertions, compact-device
coverage, or the production physical-device release gate.

## Start the QA bench

1. Start the current bundle for the installed development client:

   ```sh
   bunx expo start --dev-client --clear --port 8081
   ```

2. Discover booted simulators and launch Immifile on each target:

   ```sh
   xcrun simctl list devices booted
   xcrun simctl launch <SIMULATOR_UDID> dev.uing.immigrationrenewalhelp
   ```

3. Start or discover `serve-sim`. Never assume the assigned port:

   ```sh
   npx serve-sim --detach -q
   npx serve-sim --list -q
   ```

4. Open each returned URL in Codex's right-side browser panel. Keep the stream
   visible throughout the interaction.

Use the helper evidence endpoints when available:

- `/ax` for the accessibility tree and target labels;
- `/foreground` to prove which process owns the visible frame;
- `/config` for display dimensions and normalized coordinates;
- `npx serve-sim event-log` for recent simulator events.

Prefer label-based actions derived from `/ax`. If `/ax` is empty or incomplete,
record that limitation and use normalized 0–1 coordinates only after checking
`/config`.

## Required device matrix

Run layout-sensitive flows on both:

- the oldest supported compact iPhone (currently the 375 x 667 pt iPhone SE,
  iOS 18 path); and
- a current Face ID iPhone on the newest installed iOS (currently iOS 26).

At minimum, repeat compact layout checks at the standard text size and at a
large accessibility text size. A fixed decision surface must fit without a
swipe at standard size; large Dynamic Type may scroll, but every action must
remain reachable and tappable.

## Transition protocol

For login, logout, deletion, intro dismissal, native-tab reveal, and any issue
described as a flash, reload, lag, or pop-in:

1. Begin recording or sampling before the tap.
2. Sample through the final settled frame, not merely the first plausible one.
3. Assert both absence and presence. Example: no content, tab bar, or header
   action before `Got it`; then one reveal with all expected chrome afterward.
4. Inspect Metro and native logs for the same interval.
5. Repeat login and account deletion at least three times.

A practical sampler is the native recorder, which captures every rendered
frame instead of depending on the MJPEG stream's cadence:

```sh
xcrun simctl io <SIMULATOR_UDID> recordVideo --codec=h264 --force /tmp/immifile-transition.mov
# perform the interaction, then send Ctrl-C to the recorder
ffmpeg -i /tmp/immifile-transition.mov -vf fps=10 /tmp/immifile-transition-%03d.png
```

For first-use surfaces, create a fresh temporary account. Do not erase a whole
simulator unless the destructive reset was explicitly authorized; prefer the
app's account-deletion flow so that path receives coverage too.

## Release-surface checklist

- Welcome: disclosure and privacy link are visible before Continue; primary
  actions stay in the lower, easy-reach region.
- Auth: provider discovery causes no moving tap targets; keyboard never traps
  email or account-upgrade actions.
- Cases: first-use intro hides tabs and add actions; empty copy is visually
  centered; case add/update/delete works.
- Resources: every external link opens the correct official destination.
- Assistant: guide geometry, concise consent, decline/accept/withdraw, provider
  consent gate, quota state, input boundary, keyboard, and Dynamic Type.
- Account: temporary banner is present on the first revealed frame; privacy and
  support links; all deletion methods; one atomic transition to Welcome.
- Disabled routes: signed-in and signed-out deep links redirect before content
  mounts.
- Logs: no red screen, LogBox overlay, unhandled promise, repeated navigator
  mount, or unsupported-OS warning.

## NativeTabs and large-title gate

iOS 26 can reset a root ScrollView when a first-use intro reveals NativeTabs.
For every new iOS major, create a fresh temporary account and dismiss the
Resources and Account intros while sampling through at least one second after
the fade. The final frame must retain the expanded large title and first
section. Repeat on the oldest supported simulator before changing OS guards or
header geometry.

## Evidence and handoff

Record:

- device model, iOS version, points, text size, bundle/profile, and commit;
- exact flow and state prerequisites;
- screenshot/video paths and relevant accessibility/log excerpts;
- PASS/FAIL plus the final settled frame, not only an intermediate frame;
- anything not exercised and why.

Simulator QA does not close the release gate. Real Apple/Google/email
credentials, provider callbacks, App Store production configuration, VoiceOver
on hardware, and production-profile behavior require the physical-device pass
defined in `APP_STORE_RELEASE.md`.

Clean up detached streams when the pass is finished:

```sh
npx serve-sim --kill
```
