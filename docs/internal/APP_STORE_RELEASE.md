# First App Store Release

## Shipping surface

- Cases: account-gated receipt-number storage, a manual status timeline, deletion, and a link to official USCIS Case Status Online.
- Resources: curated links to official USCIS and DOJ tools.
- Assistant: an informational navigator between Form I-765 and Form I-90, with a 20-message daily limit and explicit consent before messages are sent to OpenAI.
- Account: email/password plus configured Google/Apple sign-in, complete account deletion, privacy policy, terms, and support.

Filing preparation, interviews, application/document routes, public community, password recovery, camera, microphone, Face ID, widgets, and notification configuration are disabled for this release. Their data and implementation remain intact for a later reviewed release.

Disabling is enforced in **two** places, and both must stay in step:

- **Client** — `src/lib/release-policy.ts` hides the tabs and default-denies
  every unreviewed deep link.
- **Server** — `convex/lib/releaseGate.ts`. A hidden tab is not an
  authorization boundary: every Convex function is a public internet endpoint
  and an anonymous session token is free to mint, so each disabled feature's
  handlers assert the policy before touching identity or data.
  `convex/releaseGate.test.ts` runs against the real `release-policy.json`
  and fails if any of those endpoints becomes reachable again.

Re-enabling a feature therefore means flipping `release-policy.json`, not
deleting guards.

## Required production setup

Follow `docs/internal/PRODUCTION_ACCESS_SETUP.md` for the exact account-role, secret,
mailbox, EAS, and Apple steps. It is written so no secret value needs to be
shared with Codex or committed to the repository.

1. Create EAS `production` environment values for:
   - `EXPO_PUBLIC_CONVEX_URL`
   - `EXPO_PUBLIC_CONVEX_SITE_URL`
   - `EXPO_PUBLIC_AUTH_SITE_URL`
   - `EXPO_PUBLIC_PRIVACY_URL`
   - `EXPO_PUBLIC_SUPPORT_URL`
   - `EXPO_PUBLIC_SUPPORT_EMAIL`
   - `IMMIFILE_PRODUCTION_BACKEND_CONFIRMED=true`
   - `HEROUI_KEY` as a secret, using the trusted `hp_` API key
   - `HEROUI_AUTH_TOKEN` as a secret, holding the **same** `hp_` key.
     Two consumers read two different variable names, verified against the
     installed vendor code rather than documentation: `hpsetup` (the
     `eas-build-pre-install` hook) reads `HEROUI_KEY`, while
     `heroui-native-pro`'s own postinstall — run later by `bun install` —
     reads `HEROUI_AUTH_TOKEN`. The published package is a ~9KB stub whose
     real library that postinstall downloads; without the token it prints
     "Sign in to finish installing", exits 0, and the build fails much later
     at Metro bundling. `scripts/validate-release-config.mjs` now fails fast
     if either is missing.
2. Deploy a production Convex backend. Set a production `BETTER_AUTH_SECRET`, confirm `DEV_SEED_ENABLED` is absent or false, and ensure the public auth proxy routes to that production deployment rather than a development deployment. Leave the three `AUTH_EMAIL_*` values unset for this release.
3. Keep both layers of auth abuse protection enabled:
   - Vercel injects a sensitive `x-immifile-origin-proof` header into branded
     `/api/auth/*` proxy requests. Matching `AUTH_ORIGIN_PROOF` values live in
     Vercel and each Convex deployment, never in Git. Convex rejects protected
     direct-origin requests; only exact GET discovery/JWKS endpoints remain
     public. Rotate both sides together, and remove the Convex value first if a
     proxy rollback is ever required.
   - `convex/auth.ts` uses transactional Convex counters for credential,
     recovery, account-creation, anonymous-creation, and social-initiation
     limits. Keep the Vercel WAF rule narrowed to the four identity/sign-in POST
     paths; never include session, token, sign-out, or OAuth callback paths.
     Before App Store submission, prove branded auth works, spoofed proof headers
     are overwritten, protected direct-origin requests receive 403, and a sixth
     mixed JSON/form email sign-in receives 429 with retry headers. Automatic
     DDoS protection alone is not an authentication or assistant-cost control.
4. Publish `docs/PRIVACY_POLICY.md` at a stable public URL. Verify it while signed out, then enter that URL in App Store Connect.
5. Publish `docs/SUPPORT.md` at a stable public support-information URL with accurate contact information and a monitored private support channel. Verify it while signed out and enter it as the App Store support URL. The public GitHub issue tracker is supplemental and does not satisfy the private-support gate.
6. Update `SUPPORT_INFO_URL` in `src/screens/account/account.legal.tsx` if the published support URL differs from the repository document. Do not submit while that URL is unavailable or still says the private channel has not been published.
7. Provide an App Review demo email/password account. Keep the production backend online throughout review.
8. Test complete account deletion for email/password, Google-only, and Apple-only accounts. Social-only deletion must open the linked provider, establish a newly confirmed session, and then remove the identity and app data; cancelling provider confirmation must leave the account intact.
9. In App Store Connect, describe the four shipping surfaces above. Screenshots and review notes must not advertise filing preparation, document upload, or community features.
10. Copy the reviewed product-page, review-note, and privacy-answer drafts from `docs/internal/APP_STORE_METADATA.md`, replacing every `REQUIRED:` placeholder.

The repository includes `.github/workflows/public-pages.yml`, which builds the
two public documents from `docs/` after they reach `main`. GitHub Pages must be
enabled once with **Settings → Pages → Source: GitHub Actions** before the first
deployment.

Jekyll publishes **every** markdown file in its source directory, not only the
ones the workflow watches — internal runbooks were briefly reachable on the
public support site because of this. Only `index.md`, `PRIVACY_POLICY.md`, and
`SUPPORT.md` now live at `docs/`; everything else is under `docs/internal/`,
which `docs/_config.yml` excludes. **New internal documents go in
`docs/internal/`.**

## App privacy answers to verify

The release stores account contact information, an internal user/session identifier, security metadata, user-entered receipt numbers/status notes, the assistant daily counter, and the explicit OpenAI consent choice for app functionality. Assistant messages and recent conversation turns are sent to OpenAI only after consent and are not stored as a server-side transcript by Immifile. The app has no ads or cross-app tracking. After account deletion, an opaque deletion-protection identifier may remain for up to one hour solely to reject requests made with a stale session; it contains no saved case content and is then removed. Confirm the final answers against the production Convex, Better Auth, and OpenAI configuration before submission.

Temporary accounts become eligible for permanent deletion after 48 hours. Cleanup runs hourly, so deletion occurs in an hourly run after eligibility and may be delayed until a later retry if a cleanup fails. Store metadata, the public privacy policy, and review notes must describe that timing rather than promise deletion at the exact 48-hour instant.

## Verification

Run:

```sh
bun run release:config
bun run typecheck
bun run lint
bun run test:once
npx expo export --platform ios
```

`.github/workflows/ci.yml` runs the first four on every pull request and on
`main`, so a regression should surface before release day rather than during it.

Then test a production-profile build on a physical iPhone. This first release is
iPhone-only (`ios.supportsTablet: false`), so iPad screenshots and iPad-specific
QA are not required. Exercise first launch, email sign-up, Google sign-in, Apple
sign-in, the OpenAI consent/decline/withdraw paths, one real assistant response,
add/update/delete case, every official resource link, account deletion through
each sign-in method, stale-session write rejection, temporary-account cleanup
after eligibility, offline/error states, Dynamic Type, VoiceOver labels, and
disabled-route deep links.

Before that physical-device gate, run the development simulator regression pass
with the live Codex side-panel workflow in `docs/internal/SIMULATOR_QA.md`. The
continuous stream is the preferred way to catch transient auth/intro frames;
pair it with accessibility snapshots and the iPhone SE-class layout pass. Use a
fresh temporary account for the iOS 26/native-tabs large-title regression gate,
and repeat that gate before adopting each new iOS major.

Open the published privacy and support URLs in a signed-out browser. Confirm that neither requires a developer account, both match the in-app disclosures, and the support page contains the monitored private contact that will be available throughout review.

With the EAS production variables loaded locally, run `npm run release:remote-check`. It verifies the authentication discovery document and keys, the public session endpoint, and the published privacy/support pages without creating or modifying production data.
