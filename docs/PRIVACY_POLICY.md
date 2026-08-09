---
layout: default
title: Immifile Privacy Policy
permalink: /privacy/
---

# Immifile Privacy Policy

Effective August 9, 2026

Immifile is an independent app. It is not affiliated with, endorsed by, or connected to USCIS, DHS, DOJ, or the U.S. government, and it does not provide legal advice.

This policy describes the first App Store release of Immifile. That release provides a manual USCIS case tracker, links to official government resources, and an informational AI assistant. Filing preparation, document uploads, and the public community are not available.

## Data we collect

Immifile automatically creates a temporary account when a person continues past the welcome screen. A person may create a permanent account by providing a name, email address, and password. Authentication infrastructure may also process security metadata such as session identifiers, IP address, and user agent.

When a person saves a case, Immifile stores the USCIS receipt number and any status or note the person enters. If a person uses the AI assistant, Immifile stores only a daily message counter; the conversation itself stays on the device. The app also stores small preferences, such as whether an introductory screen was dismissed, and operational records needed to provide and secure the service.

## How we use data

We use data to authenticate users, display their saved cases, maintain the timelines they enter, protect the service, and provide support. Immifile does not sell personal data, display advertising, or use third-party advertising, tracking, or analytics SDKs.

## Service providers

Convex provides the hosted application backend, database, and authentication components. Vercel hosts `auth.immifile.app`, the endpoint every sign-in, sign-out, and session request passes through, and therefore processes connection metadata such as IP address and user agent. When a person messages the AI assistant, the text they type (and the recent turns of that conversation) is sent to OpenAI to generate the reply; do not include receipt numbers or other sensitive details in assistant messages. Porkbun forwards messages sent to the Immifile support address, and Google provides the monitored destination mailbox. Official USCIS and Department of Justice links open in the device browser.

Immifile requires every service provider that accesses user data to provide the same or equal protection described in this policy and required by the App Store Review Guidelines.

## Retention and deletion

A temporary account becomes eligible for permanent deletion after it is 48 hours old. Cleanup runs hourly, so deletion occurs during an hourly cleanup after the account becomes eligible rather than at the exact 48-hour instant. A delayed or failed cleanup is retried by a later run.

In the app, open **Account → Delete account** to permanently delete the login identity, sessions, saved cases, and all other associated Immifile data.

After either deletion path, Immifile may retain a short-lived opaque deletion-protection record for up to one hour. It contains no saved case content and is used only to reject requests made with a previously issued session while that session expires. It cannot be used to restore the deleted account and is removed after the protection window.

## Security and choices

Immifile transmits authentication and application data over encrypted connections and stores the app session using secure device storage. A person can browse official resources without creating a permanent account. Saving a receipt number requires a permanent account.

This release does not include self-service password reset or email verification. Keep the password safe: without it there is no automated way back into an account, and because Immifile cannot confirm ownership of an unverified email address, support cannot reset a password or delete an account on request. Delete an account from inside the app, while signed in, at **Account → Delete account**.

## Support and privacy requests

Email [support@immifile.app](mailto:support@immifile.app) or use **Account → Support** in the app for private account-access, deletion, or privacy requests. Include only the minimum information needed to identify the request. Read the public [Immifile support information](https://jaxsonb04.github.io/immifile/support/) for the current contact and safety guidance.

The [GitHub issue tracker](https://github.com/Jaxsonb04/immifile/issues/new) is public, requires a GitHub account, and is only suitable for non-sensitive app bugs or general feedback. Never use it for a privacy request or include receipt numbers, A-Numbers, addresses, passwords, or other sensitive immigration information.

Do not send private account information through the public issue tracker.
