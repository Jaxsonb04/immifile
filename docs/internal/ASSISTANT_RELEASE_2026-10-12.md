# Assistant fixes and App Store candidate — October 12, 2026

## Current state

Both Assistant defects from the October 11 audit are fixed. A related completed-topic carryover found during verification is fixed as well. The final production candidate is **1.0.0 (21)**, EAS build `bdc77b17-174d-4458-bba6-9d51df7a0391`, from source `1b80a47bcc1a90007ef5723e8a741c6c0cd68012`.

The production build finished successfully. Its TestFlight upload is **blocked by Apple's missing/expired agreement**, confirmed by EAS error `EAS_ASC_REQUIRED_AGREEMENTS_MISSING_OR_EXPIRED`. Apple has not accepted this binary. No public App Store submission or approval occurred.

The user reports completing physical iPhone TestFlight testing on the prior candidate and will handle the Apple agreement and remaining device checks. The corrected candidate still needs a brief physical recheck of the two changed Assistant behaviors.

## Changes

- Choosing a supported suggestion after an unsupported or legal-advice response now starts a new topic. Earlier bubbles remain visible, but rejected-topic context is excluded from subsequent requests.
- A completed form recommendation closes its topic. A new question then starts with fresh context, preventing a prior green-card answer from influencing a new work-permit question.
- Active clarification questions retain their context. Retries use the original exchange's history, even when newer topics are already visible.
- Existing official I-90 and I-765 links remain usable when message quota is exhausted or another request is pending. Message, suggestion, and retry quotas remain enforced. The deferred filing handoff retains its disabled state.

The changes are client-only. Convex handlers, safety screening, persisted consent, and server quota enforcement are unchanged; **no backend deployment is needed**. No release flags, dependencies, data collection, pricing, or public metadata were changed.

Local commits:

- `313db87552852dc66b820d01046d27f2d2d8fe64` — recovery suggestions, topic-scoped retries, and quota-independent official links.
- `1b80a47bcc1a90007ef5723e8a741c6c0cd68012` — completed-topic lifecycle and its regressions.

Build 20 (`f53ccda6-728a-4774-8c0d-7501f401664a`) finished during verification but is **superseded and must not be uploaded or selected**. Build 21 includes the completed-topic correction.

## Verification

- Full Vitest suite: **70 files / 885 tests passed**, exit 0. Thirteen tests were added compared with the 872-test audit baseline.
- TypeScript, full ESLint, and `git diff --check`: passed.
- Regression tests demonstrated failure before the relevant fixes, then passed: unsupported-topic recovery, continued/retried topic scope, completed-topic carryover, and both official-link types while chat sending is disabled.
- Independent review found no blocking issues in the topic boundaries, retries, or unchanged backend protections.
- Production-environment release configuration and remote readiness checks: passed. Authentication discovery, keys, session endpoint, and public privacy/support pages returned HTTP 200 with expected content.
- Local EAS metadata lint: passed, exit 0 with `[]`.
- All six store screenshots freshly checked: 1320×2868 PNG, no alpha. Their existing content remains appropriate because these fixes do not change the advertised release scope.

Native verification used a newly exported, production-configured Hermes bundle in the existing signed Release simulator shell on iPhone SE / iOS 18.1. This tests the corrected client against the live production backend without Metro; it is separate from the fresh EAS distribution compilation.

Observed final sequence:

1. Ask about asylum → receive the safe unsupported-topic response.
2. Choose **Renew my green card** → receive **Green card renewal / Form I-90**.
3. Type a complete lost-green-card replacement request → receive **Green card replacement / Form I-90**.
4. Type a complete work-permit renewal request → receive **Work permit renewal / Form I-765**.
5. Reach the actual 20-message daily limit → sending remains disabled, while **all 19 existing official-form links remain enabled**: 17 I-765 and 2 I-90 links.
6. At zero remaining messages, tap an existing I-765 link and an existing I-90 link → each opens its correct official USCIS page in Safari.

The quota test also repeatedly sent fresh, complete work-permit requests after the green-card topic; the completed-topic correction prevented the earlier form carryover. Clarification, retry, link-opening error feedback, and the future filing gate are covered by automated regressions.

Local evidence: `.gstack/qa-reports/2026-10-12/`, including `final-recovery.json`, `final-replacement.json`, `final-work-permit.json`, `quota-final-check.log`, `final-quota-i765-browser.json`, `final-quota-i90-browser.json`, and the corresponding `screenshots/se-final-*.png` captures. Both disposable synthetic test accounts were deleted through the app. The simulator clipboard was cleared, the preview server stopped, and the simulator shut down.

## Build and upload

- Final EAS build: [1.0.0 (21)](https://expo.dev/accounts/jaxson04s-team/projects/immifile/builds/bdc77b17-174d-4458-bba6-9d51df7a0391).
- Build source: `1b80a47bcc1a90007ef5723e8a741c6c0cd68012`.
- Build status: **FINISHED**, verified version 1.0.0, build 21, exact source commit above; completed October 12 at 8:55 p.m. Pacific (October 13, 03:55:28 UTC).
- TestFlight submission: [`f90bd71c-dcd0-4309-ba8b-7dae0cb6536e`](https://expo.dev/accounts/jaxson04s-team/projects/immifile/submissions/f90bd71c-dcd0-4309-ba8b-7dae0cb6536e), **ERRORED**, with `appStoreConnectBuildUpload=null` and `canRetry=true`.
- Exact failure: `EAS_ASC_REQUIRED_AGREEMENTS_MISSING_OR_EXPIRED`. The submission's job-run error instructs the Account Holder to review required App Store Connect Business agreements and, if prompted, the Apple Developer Program License Agreement, then retry. This is an account agreement blocker; no native build error was reported.
- Apple processing/TestFlight availability: **unverified**. The separate read-only status call could not resolve the app under the current Apple access restriction.
- Public App Review/release: not requested or performed in this work.

The CLI's top-level submission error and log list were empty. The concrete failure was retrieved through the read-only EAS submission job-run errors; sanitized evidence is saved in `.scratch/qa-store-readback/final-submission-failure-detail.json`. An initial scheduling attempt with optional TestFlight notes was rejected by the EAS plan limit; retrying without that optional field scheduled the actual submission above. No paid plan change is needed.

## Apple agreement and remaining field readback

The fresh App Store Connect metadata read authenticated with the stored EAS key, then Apple returned HTTP 403: **“A required agreement is missing or has expired.”** The response does not identify which agreement. The Account Holder must inspect the banners in [Apple Developer](https://developer.apple.com/account/) and [App Store Connect Business](https://appstoreconnect.apple.com/business). No key/certificate replacement is indicated by this response.

Local metadata is valid. The following external fields remain **unverified, not proven missing**, until Apple permits readback:

- Select version 1.0.0 and the final corrected build 21 after Apple processing succeeds.
- Confirm dedicated synthetic review credentials still work, review contact details are complete, and review notes describe the four shipping surfaces, manual USCIS tracking, OpenAI consent/retention, quota, and deletion.
- Confirm the six screenshots are uploaded and processed in the intended order.
- Confirm published App Privacy answers match the reviewed data practices and privacy manifest.
- Confirm age/content, content-rights, export-compliance, pricing/availability, and applicable trader-status fields are complete.
- Confirm the intended release mode. Local `store.config.json` currently requests automatic release after a later App Review approval; uploading a binary does not submit the app for public review.

The review credential/contact block is deliberately absent from the repository's metadata configuration so private credentials are not committed or overwritten. Existing review-note and privacy-answer drafts are in `docs/internal/APP_STORE_METADATA.md`. Store metadata should be read back in an isolated private scratch directory, never printed wholesale or pulled over tracked source files.

After agreement acceptance, retry the **same build 21**; a new native build is unnecessary solely for an agreement change. Use the exact EAS build ID rather than `--latest`, which could select the wrong candidate:

```sh
node /Users/jaxson/.npm/_npx/e25a38a8cc65d08e/node_modules/eas-cli/bin/run submit \
  --platform ios --profile production \
  --id bdc77b17-174d-4458-bba6-9d51df7a0391 \
  --non-interactive --no-auto-testflight-setup --wait
```

Then require successful EAS submission, read back Apple processing/availability for build 21, and verify the external fields above. The user can perform the targeted physical Assistant recheck when the corrected build appears in TestFlight.
