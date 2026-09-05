# UI refinement — September 4, 2026

The welcome screen now uses the app icon, a single short headline, and an animated receipt example. The first-use introductions fade away without resizing native navigation or repositioning the page beneath them.

## Changes

- **Welcome:** replaced the blank document and verbose product preview with “Your case. More clarity.” and a compact USCIS receipt typing animation. The app icon supplies the logo. “Explore Immifile,” Sign in, and the temporary-account deletion window remain immediately available.
- **Sign-in and account creation:** clearer heading and spacing, a shared accessible show/hide password control, and an explicit sign-in close button. Existing Apple, Google, and email authentication paths are preserved.
- **Cases:** HeroUI Pro EmptyState, a clear primary action, contextual receipt guidance, consistent case cards, and a connected status timeline. Receipt entry explains where to find the number and preserves asterisks while normalizing spaces/dashes.
- **Resources:** stronger section hierarchy, consistent icon containers, and clearer destination context.
- **Assistant:** replaced the long simulated greeting bubble with a concise start screen and five direct choices. All five fit above the composer on the iPhone SE at standard text size. Consent remains a separate explicit choice.
- **Account:** compact identity summary, a clearer account card, and consistent settings rows. Decorative icons are excluded from accessibility labels.

## Why “Got it” moved the page

The introduction used to hide the native tab bar, reveal it before its fade, wait several animation frames, and manually reset the underlying scroll position twice. Assistant also changed its native header during this transition. These operations changed UIKit's available content area and large-title insets while the content was becoming visible.

Native tabs now stay mounted and visible, including during an introduction. The three large-title root screens use opaque headers; Assistant owns one compact header from its initial mount through consent and chat. Dismissal animates only opacity. The old tab-bar context, scroll-offset corrections, header staging, and unused blank-document artwork were removed.

The real content stays mounted beneath the cover for data loading, with touches and accessibility access blocked until the fade finishes. Introduction persistence and account-deletion latching remain covered by tests. Native tabs provide an escape route from any introduction.

## Verification

| Check                          | Result                                                                                                                                                                                             |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Automated tests                | 871 passed across 69 files                                                                                                                                                                         |
| TypeScript and ESLint          | Passed                                                                                                                                                                                             |
| Release configuration          | Passed                                                                                                                                                                                             |
| Production iOS export          | Passed                                                                                                                                                                                             |
| iOS 26.5, iPhone 17 Pro        | Welcome, sign-in close/password toggle, all introductions, consent decline, account creation, pending-receipt save, case details, status update, case removal, password-confirmed account deletion |
| iOS 18.1, iPhone SE            | All tabs in light/dark mode, consent actions, five Assistant choices, recommendation, temporary-account deletion                                                                                   |
| Accessibility Large text on SE | Welcome actions, sign-in password control, and close action reachable by scrolling                                                                                                                 |
| Transition recordings          | Cases, Resources, Account, and Assistant captured; frame inspection confirmed stable native chrome and content during dismissal                                                                    |

The native account-creation test used a disposable account and a synthetic receipt. All test accounts and their case data were deleted through the app. No production deployment was performed. Coverage here is the iOS simulator interface and its production JavaScript bundle; the broader release checks remain documented in APP_AUDIT_2026-09-04.md.

## Repeatable checks

`qa/maestro/first-use-navigation.yaml` starts on Welcome with a fresh disposable session and verifies all four introductions plus consent decline. `qa/maestro/case-account-resume.yaml` uses QA_RECEIPT, QA_EMAIL, and QA_PASSWORD for the existing-account resume path; its selectors were updated for the refined controls and case cards.

Local screenshots and transition recordings are under `.gstack/qa-reports/2026-09-04/` (ignored by Git):

- `screenshots/design-welcome.png`
- `screenshots/qa-sign-in-final.png`
- `screenshots/qa-receipt-refined.png`
- `screenshots/design-case-detail.png`
- `screenshots/qa-resources-refined.png`
- `screenshots/design-assistant-dark.png`
- `screenshots/design-account-dark.png`
- `intro-transitions-fixed.mp4`

## Welcome simplification follow-up

The entry screen now uses the actual `assets/images/icon.png` app icon beside the wordmark. A single “Your case. More clarity.” headline replaces the introductory paragraph and extra slogan. The example card contains only a USCIS receipt label and a receipt number that types in, then settles. The temporary-account footer keeps the 48-hour boundary in plain language.

The typing animation uses fixed-width character slots and an overlaid caret, so it cannot shift surrounding content. It stops after its entrance; system Reduce Motion renders the completed number immediately. VoiceOver encounters one labelled example image instead of thirteen changing characters. Main copy and controls retain Dynamic Type and scrolling.

Follow-up validation: 10 focused tests passed; TypeScript, ESLint, and production iOS export passed. On iPhone SE (iOS 18.1), light/dark appearance, standard/Accessibility Large text, live text-size changes, sign-in opening/closing, and footer-action reachability were checked. Frame inspection confirmed that typing keeps the layout stationary and Reduce Motion shows the complete receipt from the first visible frame. Simulator preferences were restored. Evidence: `welcome-typing.mp4`, `welcome-reduced-motion.mp4`, and `screenshots/se-welcome-minimal-final.png`.
