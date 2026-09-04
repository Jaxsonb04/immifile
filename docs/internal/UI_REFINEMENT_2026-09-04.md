# UI refinement — September 4, 2026

The welcome screen now leads with the value of Immifile and a clearly labelled case preview. The first-use introductions fade away without resizing native navigation or repositioning the page beneath them.

## Changes

- **Welcome:** replaced the animated blank document with a product preview showing a work permit, a labelled USCIS receipt number, and an example manual update. Added “Less searching. More clarity.” and “Explore Immifile.” The temporary-account deletion window remains visible before account creation.
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
