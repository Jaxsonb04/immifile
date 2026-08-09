# App Store Connect Copy

This document is ready-to-paste copy for the first Immifile release. Replace every `REQUIRED:` placeholder before submission.

## Product page

**Name**  
Immifile

**Subtitle**  
USCIS case tracker

**Promotional text**  
Keep USCIS receipt numbers and the updates you receive in one calm place, with quick access to official government tools.

**Description**

Immifile is a simple, independent USCIS case tracker.

Use it to:

- Save USCIS receipt numbers.
- Record status updates and notes in a manual timeline.
- Open official USCIS case-status, processing-time, address-change, and online tools.
- Find the Department of Justice directory for legal representation.
- Delete your account and associated data from inside the app.

Immifile does not automatically receive case updates from USCIS. Always confirm important information through your USCIS notice, USCIS online account, or an official .gov website.

Immifile is not affiliated with USCIS, DHS, DOJ, or the U.S. government. It does not provide legal advice, eligibility decisions, representation, or outcome predictions.

Filing preparation, document upload, AI assistance, and public community features are not included in this release.

**Keywords**  
uscis,case,status,receipt,immigration,tracker,processing,timeline,government,resources

**Primary category**  
Utilities

**Secondary category**  
Reference

**Support URL**  
https://jaxsonb04.github.io/immifile/support/

**Privacy Policy URL**  
https://jaxsonb04.github.io/immifile/privacy/

**Marketing URL**  
Optional; omit for the first release unless a public product page is available.

## App Review information

**Contact**

- First name: REQUIRED
- Last name: REQUIRED
- Phone: REQUIRED
- Email: REQUIRED

**Demo account**

- Username: REQUIRED
- Password: REQUIRED

Use a dedicated production email/password account containing one clearly synthetic case, or provide exact steps to create one. Keep it active throughout review.

**Review notes**

Immifile’s first release contains three user-facing areas:

1. Cases — save a USCIS receipt number and manually record the status updates or notes the user receives.
2. Resources — curated links to official USCIS.gov and Justice.gov tools.
3. Account — email/password account access, settings, privacy, terms, support, and complete in-app account deletion.

On first launch, Continue creates a temporary session so the reviewer can browse the retained app surfaces. Adding a case requires creating or signing into a permanent email/password account.

The supplied demo account may be used to test adding, editing, and deleting a synthetic case. To test complete account deletion, open Account → Settings → Delete account and confirm with the demo account password. Deletion removes the login identity, sessions, saved cases, and associated app data. A short-lived opaque stale-session protection record may remain for up to one hour and contains no case content.

Immifile does not automatically fetch USCIS case status and is not affiliated with the U.S. government. Filing preparation, document upload, AI assistance, public community, social login, and password recovery are disabled in this build and are not advertised in the metadata.

The production backend will remain available throughout review. Public privacy and support URLs are listed in App Store Connect and are also accessible from the Account area.

## App privacy draft

Select **Yes, data is collected**. Verify these answers against the final production services before publishing:

| App Store data type               | Use                                                                                                                | Linked to user | Tracking |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------- | -------- |
| Contact Info → Name               | App Functionality                                                                                                  | Yes            | No       |
| Contact Info → Email Address      | App Functionality; account support                                                                                 | Yes            | No       |
| Identifiers → User ID             | App Functionality; Fraud Prevention or Security                                                                    | Yes            | No       |
| User Content → Other User Content | App Functionality; receipt numbers and user-entered status notes                                                   | Yes            | No       |
| Usage Data → Product Interaction  | App Functionality; remembers whether the user dismissed introductory screens                                       | Yes            | No       |
| Other Data                        | App Functionality; Fraud Prevention or Security; limited authentication metadata such as IP address and user agent | Yes            | No       |

Do not select advertising, third-party advertising, developer advertising, analytics, or cross-app tracking. Re-evaluate the answers if the final support or transactional-email service collects additional information.

## Screenshots

Use only synthetic information. Recommended sequence:

1. Cases overview with a clearly synthetic receipt number and manual timeline.
2. Case detail showing the manual timeline and the link to USCIS Case Status Online.
3. Official Resources page showing the government-source disclaimer.
4. Account page showing privacy, support, settings, and deletion access.

Do not show or mention filing, document upload, AI, community, or social login.

Final 6.9-inch captures from a clean Release simulator are available in
[`app-store-assets/screenshots`](./app-store-assets/screenshots/):

- `01-cases-overview-6.9-inch.jpg`
- `02-case-detail-6.9-inch.jpg`
- `03-resources-6.9-inch.jpg`
- `04-account-6.9-inch.jpg`

The separate production demo account and synthetic case are still required for App Review.
