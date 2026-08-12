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
- Ask the informational assistant whether Form I-765 or Form I-90 matches the situation described.
- Delete your account and associated data from inside the app.

Immifile does not automatically receive case updates from USCIS. Always confirm important information through your USCIS notice, USCIS online account, or an official .gov website.

Immifile is not affiliated with USCIS, DHS, DOJ, or the U.S. government. It does not provide legal advice, eligibility decisions, representation, or outcome predictions.

Before an assistant message is sent, Immifile names OpenAI, explains what is shared, warns against entering sensitive immigration information, and asks for explicit consent. Filing preparation, document upload, and public community features are not included in this release.

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

Immifile’s first release contains four user-facing areas:

1. Cases — save a USCIS receipt number and manually record the status updates or notes the user receives.
2. Resources — curated links to official USCIS.gov and Justice.gov tools.
3. Assistant — an informational navigator between Form I-765 and Form I-90, limited to 20 messages per day.
4. Account — email/password, Google, and Apple account access; privacy, terms, support, and complete in-app account deletion.

On first launch, Continue creates a temporary session so the reviewer can browse the retained app surfaces. Adding a case requires creating or signing into a permanent account. Google and Apple buttons appear only when their production credentials are configured.

Before the first assistant conversation, Immifile presents a dedicated consent screen that states the user’s message and recent conversation turns are sent to OpenAI to generate a reply. It also states that the transcript stays on the device, names the limited server-side records, and warns the user not to enter receipt numbers, A-Numbers, addresses, passwords, or uploaded documents. Choosing Not now sends nothing to OpenAI. The choice can be withdrawn from Account → Privacy policy.

The supplied demo account may be used to test adding, editing, and deleting a synthetic case. To test complete account deletion, open Account → Delete account and confirm with the demo account password. A social-only account instead confirms through its linked Google or Apple provider before deletion. Deletion removes the login identity, sessions, saved cases, and associated app data. A short-lived opaque stale-session protection record may remain for up to one hour and contains no case content.

Immifile does not automatically fetch USCIS case status and is not affiliated with the U.S. government. Filing preparation, document upload, public community, and password recovery are disabled in this build and are not advertised in the metadata.

The production backend will remain available throughout review. Public privacy and support URLs are listed in App Store Connect and are also accessible from the Account area.

## App privacy draft

Select **Yes, data is collected**. Verify these answers against the final production services before publishing:

| App Store data type               | Use                                                                                                                | Linked to user | Tracking |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------- | -------- |
| Contact Info → Name               | App Functionality                                                                                                  | Yes            | No       |
| Contact Info → Email Address      | App Functionality; account support                                                                                 | Yes            | No       |
| Identifiers → User ID             | App Functionality; Fraud Prevention or Security                                                                    | Yes            | No       |
| User Content → Other User Content | App Functionality; receipt numbers, status notes, and consented assistant prompts/recent turns sent to OpenAI      | Yes            | No       |
| Usage Data → Product Interaction  | App Functionality; introductory-screen flags, daily assistant count, and the OpenAI consent choice                 | Yes            | No       |
| Other Data                        | App Functionality; Fraud Prevention or Security; limited authentication metadata such as IP address and user agent | Yes            | No       |

Do not select advertising, third-party advertising, developer advertising, analytics, or cross-app tracking. Re-evaluate the answers if the final support or transactional-email service collects additional information.

## Screenshots

Use only synthetic information. Recommended sequence:

1. Welcome screen with the temporary-account disclosure.
2. Cases overview with clearly synthetic data.
3. Assistant welcome state.
4. Assistant recommendation for a non-sensitive synthetic scenario.
5. Official Resources page showing the government-source disclaimer.
6. Account page showing privacy, support, and deletion access.

Do not show or mention filing preparation, document upload, or community.

Final 6.9-inch captures from a clean Release simulator are available in
[`store-assets/app-store/6.9-inch`](../../store-assets/app-store/6.9-inch/):

- `01-welcome.png`
- `02-cases.png`
- `03-assistant.png`
- `04-assistant-recommendation.png`
- `05-resources.png`
- `06-account.png`

The separate production demo account and synthetic case are still required for App Review.
