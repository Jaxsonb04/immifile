# Present filings as a plain-language Interview, not a replica of the USCIS form

The guided filing experience is a **question-first Interview** (the tax-software pattern): one friendly, plain-language question per screen, with the mascot, a large heading, and contextual help (a "?" available on every step), plus smart branching that skips irrelevant questions. The app maps the user's answers to the actual I-90 / I-765 form fields **behind the scenes** — users never see the raw form layout while filling. This is the core of what the Service Fee ([ADR-0011](./0011-monetization-one-time-service-fee.md)) buys: the cognitive work of translating a person's situation into a correct filing, and the differentiator versus filling a USCIS PDF by hand.

## Why

Replicating the form's Parts and fields as plain inputs is what makes form-filling feel like a 30-minute chore and fails to deliver value worth paying for. A friendly interview lowers the comprehension burden for an often non-native-English audience, reduces errors through branching and inline help, and produces the same field-level data model underneath. Tax software (TurboTax) asks a warm question that *leads to* a form field rather than exposing the field itself; we adopt that.

## Considered Options

Faithful form-shape replication (low value, high abandonment — rejected); **question-first Interview with behind-the-scenes field mapping (chosen)**.

## Consequences

- The filing **wizard blueprint's per-form "steps" define the underlying data model** (the fields we must collect); the Interview defines the presentation. The two stay decoupled, realized by [ADR-0013](./0013-multi-step-wizard-tanstack.md).
- Each step carries friendly question copy + help text in a **step descriptor**; the bound field's `name` still targets the real form-field path, so the data model remains a faithful field-level mirror of the official form.
- Requires a reusable **InterviewStep** shell (avatar, big heading, help sheet, Back/Next, canAdvance) and per-form step descriptors with branching (`getVisibleSteps`).
- The literal USCIS form is shown only as the watermarked **Preview** / final output (ADR-0006/0011), not as the data-entry surface.

## Amended (2026-07-01)

Mechanics unchanged. Language: the Interview prepares an **Application** (docs/internal/CONTEXT.md); "filing" above reads as the act of filing or the Filing Package. Reaching Review also triggers person-fact promotion per [ADR-0014](./0014-draft-only-answers-promote-at-review.md).
