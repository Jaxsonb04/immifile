# Native workflow regression checks

Run against a rebuilt iOS development client and the development Convex deployment.
These checks require Maestro. They complement `bun run test:once`; they are not
production or physical-device sign-off.

## Case account handoff

Use a dedicated disposable email account. Begin on Cases with a temporary account,
after dismissing the Cases introduction. Supply an unused synthetic receipt:

```sh
maestro --device DEVICE_ID test \
  -e QA_EMAIL="$QA_EMAIL" -e QA_PASSWORD="$QA_PASSWORD" \
  -e QA_RECEIPT=IOE1234567890 qa/maestro/case-account-resume.yaml
```

The flow enters a receipt, verifies cancellation preserves it, signs in from
inside the native case modal, verifies automatic saving, then removes that case.
It does not delete the supplied account. Set the variables outside Git. Maestro
may include expanded input values in its local logs; keep those logs private.

## Consent on small phones and large text

Begin on Assistant with consent withdrawn. Run at standard and accessibility
text sizes on iPhone SE:

```sh
maestro --device DEVICE_ID test qa/maestro/assistant-consent-decline.yaml
```

The flow scrolls to the decline button, confirms it is visible, and returns to
Cases. For acceptance, quota updates, official links, deletion, dark mode, and
release-only checks, use `docs/internal/SIMULATOR_QA.md` and the dated audit report.

The flows were derived from the interactive September 4 audit. The account flow
requires the preconditions above; new temporary accounts also have per-tab
introductions. A missing selector from an iOS password prompt or an offscreen
keyboard is an automation issue until reproduced directly in the interface.
