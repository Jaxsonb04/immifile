---
layout: default
title: Immifile Privacy Policy
permalink: /privacy/
---

# Immifile Privacy Policy

Effective August 16, 2026

Immifile is an independent app. It is not affiliated with, endorsed by, or connected to USCIS, DHS, DOJ, or the U.S. government, and it does not provide legal advice.

This policy describes the first App Store release of Immifile. That release provides a manual USCIS case tracker, links to official government resources, and an informational AI assistant. Filing preparation, document uploads, and the public community are not available.

## Data we collect

Immifile automatically creates a temporary account when a person continues past the welcome screen. A person may create a permanent account by providing a name, email address, and password or by using a configured Google or Apple sign-in option. Social sign-in may provide Immifile with the person’s name, email address, and provider account identifier. Authentication infrastructure may also process security metadata such as session identifiers, IP address, and user agent.

When a person saves a case, Immifile stores the USCIS receipt number and any status or note the person enters. If a person uses the AI assistant, Immifile stores only a daily message counter and the person’s OpenAI consent choice, not a server-side chat transcript. The live chat remains in the current app session; messages sent to OpenAI are subject to the provider retention described below. The app also stores small preferences, such as whether an introductory screen was dismissed, and operational records needed to provide and secure the service.

## How we use data

We use data to authenticate users, display their saved cases, maintain the timelines they enter, protect the service, and provide support. Immifile does not sell personal data, display advertising, or use third-party advertising, tracking, or analytics SDKs.

## Service providers

Convex provides the hosted application backend, database, and authentication components. Vercel hosts `auth.immifile.app`, the endpoint every sign-in, sign-out, and session request passes through, and therefore processes connection metadata such as IP address and user agent. Google and Apple process their respective social sign-in flows when a person chooses one of those options. The assistant sends nothing to OpenAI until the person explicitly agrees. After agreement, the person’s current and recent messages are sent to OpenAI to generate a reply; do not include receipt numbers, A-Numbers, addresses, passwords, or other sensitive details. OpenAI may retain prompts and replies in abuse-monitoring logs for up to 30 days and may retain them longer when legally required or reasonably necessary to protect its services or others. OpenAI states that API data is not used to train its models unless the API customer opts in. Porkbun forwards messages sent to the Immifile support address, and Google provides the monitored destination mailbox. Official USCIS and Department of Justice links open in the device browser.

Immifile requires every service provider that accesses user data to provide the same or equal protection described in this policy and required by the App Store Review Guidelines.

## Retention and deletion

A temporary account becomes eligible for permanent deletion after it is 48 hours old. Cleanup runs hourly, so deletion occurs during an hourly cleanup after the account becomes eligible rather than at the exact 48-hour instant. A delayed or failed cleanup is retried by a later run.

In the app, open **Account → Delete account** to permanently delete the login identity, sessions, saved cases, and all other associated Immifile data.

After either deletion path, Immifile normally retains an opaque deletion-protection record for approximately one hour while previously issued sessions expire. It contains no saved case content, is used only to reject stale-session requests and safely finish deletion, and cannot restore the account. If deletion or provider/session cleanup is interrupted, the record may remain longer only until that security cleanup safely completes; it is then removed.

Withdrawing AI consent stops future messages from being sent to OpenAI but does not erase prompts or replies that OpenAI already processed. Those may remain in OpenAI abuse-monitoring logs for up to 30 days, subject to the longer legal or safety retention described above.

## Security and choices

Immifile transmits authentication and application data over encrypted connections and stores the app session using secure device storage. A person can browse official resources and decline AI sharing without creating a permanent account. Saving a receipt number requires a permanent account. A person can withdraw AI consent at any time from **Account → Privacy policy**; the assistant asks again before any later message is shared with OpenAI.

This release does not include self-service password reset or email verification. Keep the password safe: without it there is no automated way back into an account, and because Immifile cannot confirm ownership of an unverified email address, support cannot reset a password or delete an account on request. Delete an account from inside the app, while signed in, at **Account → Delete account**.

## Support and privacy requests

Email [support@immifile.app](mailto:support@immifile.app) or use **Account → Support** in the app for private account-access, deletion, or privacy requests. Include only the minimum information needed to identify the request. Read the public [Immifile support information](https://jaxsonb04.github.io/immifile/support/) for the current contact and safety guidance.

The [GitHub issue tracker](https://github.com/Jaxsonb04/immifile/issues/new) is public, requires a GitHub account, and is only suitable for non-sensitive app bugs or general feedback. Never use it for a privacy request or include receipt numbers, A-Numbers, addresses, passwords, or other sensitive immigration information.

Do not send private account information through the public issue tracker.
