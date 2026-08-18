# App Store Connect Copy

This document is ready-to-paste copy for the first Immifile release. Private
App Review credentials are intentionally omitted and must remain only in App
Store Connect and the authorized local credential store.

## Product page

**Name**

Immifile

**Version**

1.0.0

**Copyright**

2026 Jaxson Bie

**Release method**

Automatic release after App Review approval

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

Before an assistant message is sent, Immifile names OpenAI, explains what is shared, warns against entering sensitive immigration information, and asks for explicit consent. Immifile does not store the chat transcript; OpenAI may retain prompts and replies for up to 30 days for abuse monitoring. Filing preparation, document upload, and public community features are not included in this release.

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

- First name: Jaxson
- Last name: Bie
- Phone: +1 510 408 7340
- Email: jaxsonbie@gmail.com

**Demo account**

- Username: configured in App Store Connect; not recorded in the repository
- Password: configured in App Store Connect; not recorded in the repository

Use a dedicated production email/password account containing one clearly synthetic case, or provide exact steps to create one. Keep it active throughout review.

Enter the demo username and password directly in App Store Connect and mark
**Sign-in required**. Do not add review credentials to `store.config.json` or
any committed file. The non-secret contact fields above have already been
synced; the `review` block is intentionally omitted from `store.config.json` so
future metadata pushes do not reset or expose the manually managed credentials.

Treat `eas metadata:pull` output as a secret: App Store Connect returns the
saved demo username and password in the generated `review` block. Never commit
that pulled file. Remove the block before retaining other metadata, or delete
the generated file after a read-only audit.

**Review notes**

Immifile’s first release contains four user-facing areas:

1. Cases — save a USCIS receipt number and manually record the status updates or notes the user receives.
2. Resources — curated links to official USCIS.gov and Justice.gov tools.
3. Assistant — an informational navigator between Form I-765 and Form I-90, limited to 20 messages per day.
4. Account — email/password, Google, and Apple account access; privacy, terms, support, and complete in-app account deletion.

On first launch, Continue creates a temporary session so the reviewer can browse the retained app surfaces. Adding a case requires creating or signing into a permanent account. Google and Apple buttons appear only when their production credentials are configured.

Before the first assistant conversation, Immifile presents a dedicated consent screen that states the user’s current and recent messages are sent to OpenAI to generate a reply. It states that Immifile does not store the transcript, discloses that OpenAI may retain prompts and replies for up to 30 days for abuse monitoring, names the limited Immifile records, and warns the user not to enter receipt numbers, A-Numbers, addresses, passwords, or uploaded documents. Choosing Not now sends nothing to OpenAI. The choice can be withdrawn from Account → Privacy policy; withdrawal stops future sharing but does not erase content already processed by OpenAI.

The supplied demo account may be used to test adding, editing, and deleting a synthetic case. To test complete account deletion, open Account → Delete account and confirm with the demo account password. A social-only account instead confirms through its linked Google or Apple provider before deletion. Deletion removes the login identity, sessions, saved cases, and associated app data. An opaque stale-session protection record normally remains for approximately one hour and contains no case content; interrupted security cleanup may retain it longer only until cleanup safely completes.

Immifile does not automatically fetch USCIS case status and is not affiliated with the U.S. government. Filing preparation, document upload, public community, and password recovery are disabled in this build and are not advertised in the metadata.

The production backend will remain available throughout review. Public privacy and support URLs are listed in App Store Connect and are also accessible from the Account area.

## App privacy draft

Select **Yes, data is collected**. Verify these answers against the final production services before publishing:

| App Store data type               | Use                                                                                                                | Linked to user | Tracking |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------------- | -------- |
| Contact Info → Name               | App Functionality                                                                                                  | Yes            | No       |
| Contact Info → Email Address      | App Functionality; account support                                                                                 | Yes            | No       |
| Identifiers → User ID             | App Functionality; Fraud Prevention or Security                                                                    | Yes            | No       |
| User Content → Other User Content | App Functionality; receipt numbers, status notes, and consented current/recent assistant messages sent to OpenAI   | Yes            | No       |
| Usage Data → Product Interaction  | App Functionality; introductory-screen flags, daily assistant count, and the OpenAI consent choice                 | Yes            | No       |
| Other Data                        | App Functionality; Fraud Prevention or Security; limited authentication metadata such as IP address and user agent | Yes            | No       |

Do not select advertising, third-party advertising, developer advertising, analytics, or cross-app tracking. Re-evaluate the answers if the final support or transactional-email service collects additional information.

## Screenshots

Use only synthetic information. The approved replacement sequence focuses on
functional, in-app surfaces:

1. Cases overview with one clearly synthetic saved case.
2. Case detail showing its manual timeline and the official status action.
3. Assistant consent or active input screen showing the feature is functional.
4. Assistant recommendation for a non-sensitive synthetic scenario.
5. Official Resources page showing the government-source disclaimer.
6. Account page showing privacy, support, and deletion access.

Do not show or mention filing preparation, document upload, or community.

The title-art/welcome captures were replaced on August 16, 2026. The approved
set was captured from a clean production Release build and is stored in
[`store-assets/app-store/6.9-inch`](../../store-assets/app-store/6.9-inch/) as:

- `01-cases-overview.png`
- `02-case-timeline.png`
- `03-assistant-consent.png`
- `04-assistant-recommendation.png`
- `05-resources.png`
- `06-account.png`

`store.config.json` owns this ordered set under Apple API display type
`APP_IPHONE_67` (the API name for the current 6.9-inch bucket). Running
`eas metadata:push` synchronizes only that configured locale and display type;
it deletes unmatched files in the set before uploading replacements. Verify
all six source files exist and pass the dimension/alpha checks before pushing.

The separate production demo account and synthetic case are still required for App Review.
