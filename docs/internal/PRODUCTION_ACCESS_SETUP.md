# Production Access and Secrets Setup

This guide contains the manual account and secret setup required before the first
App Store build. Do not paste passwords, API keys, deploy keys, or App Review
credentials into chat, source files, issues, or commit messages.

## What Codex needs

Codex does not need to see any secret value. Complete the account logins and
store each secret directly in its intended service. After each section, Codex
can verify names, permissions, public endpoints, and release checks without
printing secret values.

### Secret inventory

| Name                       | How to obtain it                                | Store it in                                    | Never store it in                                            |
| -------------------------- | ----------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| `HEROUI_KEY`               | Use the trusted vendor key beginning with `hp_` | EAS `production`, visibility `secret`          | Git, Expo `EXPO_PUBLIC_*`, chat                              |
| `HEROUI_AUTH_TOKEN`        | Use the same trusted `hp_` key                  | EAS `production`, visibility `secret`          | Git, Expo `EXPO_PUBLIC_*`, chat                              |
| `BETTER_AUTH_SECRET`       | Generate a new random production-only value     | Convex production environment                  | EAS, Git, chat                                               |
| `OPENAI_API_KEY`           | OpenAI project key with launch-ready capacity   | Convex production environment                  | EAS, Expo `EXPO_PUBLIC_*`, Git, chat                         |
| `GOOGLE_CLIENT_SECRET`     | Google OAuth web client                         | Convex development and production environments | EAS, Expo `EXPO_PUBLIC_*`, Git, chat                         |
| `APPLE_PRIVATE_KEY`        | Apple Sign in with Apple `.p8` key              | Convex development and production environments | EAS, Expo `EXPO_PUBLIC_*`, Git, chat                         |
| `AUTH_EMAIL_WEBHOOK_TOKEN` | Future password-recovery release only           | Convex production and the private webhook host | The mobile app, Git, chat                                    |
| Email-provider API key     | Future password-recovery release only           | Private webhook host only                      | Convex unless it directly calls the provider, EAS, Git, chat |

Expo, Apple, Convex, GitHub, mailbox, and email-provider passwords are account
credentials. Codex never needs them.

The Convex URLs, auth URL, privacy URL, support URL, support email, sender name,
and release confirmation flags are configuration, not secrets.

## 1. Convex project and migrated environments

The local project is linked to:

- Team: `jaxson-bie` (Jaxson Bie's team)
- Project: `immifile`
- Development deployment: `wandering-jaguar-543`
- Production deployment: `enduring-toucan-31`

The previous Oliver-team development database was exported with file storage,
rewritten to the new deployment-scoped owner identifiers, and imported into
`wandering-jaguar-543`. Production intentionally started clean. The backup is
kept only in the ignored local `.scratch/convex-migration/` directory.

Verify access without printing values:

```sh
npx convex login status
npx convex env list --names-only --deployment jaxson-bie:immifile:prod
```

Production code requires `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`,
`DEV_SEED_ENABLED`, and `OPENAI_API_KEY`. Optional social login is deployment
gated: Google requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`; Apple
requires `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, and
`APPLE_PRIVATE_KEY`.

## 2. Set Convex production secrets

Generate a fresh production-only authentication value locally:

```sh
openssl rand -base64 48
```

Use the output for `BETTER_AUTH_SECRET`. Do not reuse the development value.

The safest CLI workflow is interactive because the value stays out of shell
history. For each command, paste the value at the prompt:

```sh
npx convex env set BETTER_AUTH_SECRET --prod
npx convex env set BETTER_AUTH_URL --prod
npx convex env set OPENAI_API_KEY --prod
npx convex env set GOOGLE_CLIENT_ID --prod
npx convex env set GOOGLE_CLIENT_SECRET --prod
npx convex env set DEV_SEED_ENABLED false --prod
```

After the Apple Developer account activates, also set the four Apple values:

```sh
npx convex env set APPLE_CLIENT_ID --prod
npx convex env set APPLE_TEAM_ID --prod
npx convex env set APPLE_KEY_ID --prod
npx convex env set APPLE_PRIVATE_KEY --from-file /absolute/path/to/AuthKey_KEYID.p8 --prod
```

Verify names only:

```sh
npx convex env list --prod --names-only
```

Then deploy:

```sh
npx convex deploy
```

Do not set `IMMIFILE_PRODUCTION_BACKEND_CONFIRMED=true` until that deployment
succeeds and `DEV_SEED_ENABLED` is false.

## 3. Configure the support mailbox and password-reset email

Inbound support uses Porkbun forwarding from `support@immifile.app` to the
monitored `jaxsonbie@gmail.com` mailbox. Porkbun's MX and SPF records are live.
Before submission:

1. Sign in to `jaxsonbie@gmail.com` and search for the exact subject
   `Immifile support delivery test — 2026-08-16`, sent from
   `jaxsonbie@berkeley.edu` to `support@immifile.app`. Confirm the forwarded
   copy is present. The connected Berkeley mailbox can prove that the test was
   sent, but it cannot inspect the forwarding destination.
2. Reply to that message from the destination mailbox. In Gmail's From picker,
   select `support@immifile.app`; if that choice is not available, configure an
   authenticated **Send mail as** address or an outbound mailbox provider first.
   Porkbun forwarding alone proves only inbound routing.
3. In `jaxsonbie@berkeley.edu`, confirm the reply arrives with
   `From: support@immifile.app`, then use **Show original** to verify the
   outbound provider reports domain-aligned SPF or DKIM and DMARC passes. Do
   not use an unverified/spoofed From header for this test.
4. Keep the destination mailbox monitored throughout App Review.
5. Confirm this command continues to return Porkbun's forwarding MX records:

   ```sh
   dig +short MX immifile.app
   ```

Password recovery is source-controlled off for this first release. No SES
identity, transactional-email provider, or outbound-email webhook is required.
Keep `AUTH_EMAIL_WEBHOOK_URL`, `AUTH_EMAIL_WEBHOOK_TOKEN`, and
`AUTH_EMAIL_FROM` unset in Convex production. A later reviewed release can
follow `docs/internal/AUTH_EMAIL_WEBHOOK.md` before enabling the feature.

## 4. Log in to Expo and link the EAS project

This repository is linked to EAS project
`@jaxson04s-team/immifile` (`ba1f9a98-c9d2-439c-92d0-50f591ddc8cf`).
The CLI is authenticated on the release workstation. To refresh the login:

```sh
npx eas-cli login
npx eas-cli whoami
npx eas-cli project:info
```

Use the Expo account that owns `jaxson04s-team`.

## 5. Store the trusted HeroUI key under both required names in EAS

The vendor key must begin with `hp_`. Two build tools read different variable
names, so store the same key as both `HEROUI_KEY` and `HEROUI_AUTH_TOKEN`. Do
not put either value in `.env.production`, `.env.local`, `app.json`, or any
`EXPO_PUBLIC_*` variable.

After EAS login and project linking, enter it without displaying it:

```sh
read -r -s -p "HeroUI hp_ key: " HEROUI_KEY
echo
npx eas-cli env:set production \
  --name HEROUI_KEY \
  --value "$HEROUI_KEY" \
  --visibility secret \
  --scope project \
  --non-interactive
npx eas-cli env:set production \
  --name HEROUI_AUTH_TOKEN \
  --value "$HEROUI_KEY" \
  --visibility secret \
  --scope project \
  --non-interactive
unset HEROUI_KEY
```

The release build runs:

```sh
npx -y hpsetup@4.7.0 native --auto
```

The current `heroui-native-pro` version is already cached locally, so no local
install is required. For vendor diagnostics, use `--dry-run`, which consumes no
quota. Never use `--no-cache` for this workflow. Each uncached EAS CI install
uses one of the vendor's 20 daily CI installations.

## 6. Set the EAS production configuration

Create these as `plaintext` project variables because they are intentionally
embedded in the client build:

```text
EXPO_PUBLIC_CONVEX_URL
EXPO_PUBLIC_CONVEX_SITE_URL
EXPO_PUBLIC_AUTH_SITE_URL
EXPO_PUBLIC_PRIVACY_URL
EXPO_PUBLIC_SUPPORT_URL
EXPO_PUBLIC_SUPPORT_EMAIL
IMMIFILE_PRODUCTION_BACKEND_CONFIRMED
```

Use the EAS dashboard or this pattern:

```sh
npx eas-cli env:set production \
  --name NAME \
  --value "VALUE" \
  --visibility plaintext \
  --scope project \
  --non-interactive
```

Important:

- Use the production `.convex.cloud` and `.convex.site` URLs, never the personal
  development deployment.
- Password recovery is pinned off in `release-policy.json`; do not set either
  `EXPO_PUBLIC_PASSWORD_RECOVERY_ENABLED` or
  `IMMIFILE_AUTH_EMAIL_CONFIRMED` to `true`.
- Set `IMMIFILE_PRODUCTION_BACKEND_CONFIRMED=true` only after the production
  Convex deploy and seed lockout are verified.
- `HEROUI_KEY` and `HEROUI_AUTH_TOKEN` must remain EAS `secret` values and must
  contain the same trusted key.

Verify variable names and visibility in the EAS dashboard. Do not use a CLI
listing command for this project: current EAS CLI output may reveal secret
values instead of masking them.

## 7. Publish legal and support pages

1. Replace every `REQUIRED:` placeholder in the App Store documents.
2. Put the monitored private support email in `docs/SUPPORT.md`.
3. Commit and push the reviewed pages.
4. In GitHub, open **Settings → Pages** and set **Source** to
   **GitHub Actions**.
5. Open the privacy and support URLs in a signed-out browser.

Do not submit until both URLs are public, stable, and match the app.

## 8. Apple-only manual work

In App Store Connect:

1. Wait for the Apple Developer membership to become active, then accept all pending agreements and confirm tax/banking requirements applicable
   to the account.
2. Confirm the activated account’s Team ID matches `ios.appleTeamId` in
   `app.json`; update the source value if it does not.
3. Create the App ID, Sign in with Apple service/key, and app record for bundle ID
   `dev.uing.immigrationrenewalhelp`.
4. Complete App Privacy from the reviewed draft in
   `docs/internal/APP_STORE_METADATA.md`.
5. Add the public privacy and support URLs.
6. Create a dedicated production demo account for App Review and put its
   credentials only in App Store Connect review notes.
7. Upload the production EAS build, answer export-compliance questions, select
   the build, and submit it for review.

Never send Apple credentials, two-factor codes, certificates, or the demo
password through chat.

## 9. Final verification

After all manual setup:

```sh
bun run release:config
bun run typecheck
bun run lint
bun run test:once
npx expo-doctor
npx expo export --platform ios
```

Load the public EAS production variables locally without exposing
`HEROUI_KEY`, then run:

```sh
bun run release:remote-check
```

Finally, install the production-profile build on a physical iPhone and complete
the test matrix in `docs/internal/APP_STORE_RELEASE.md`. The first release is
iPhone-only, so iPad screenshots and iPad-specific QA are not required.
