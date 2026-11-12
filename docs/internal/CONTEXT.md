# Immigration Renewal Assistant — Domain Language

The ubiquitous language for a self-help tool that helps people in the United States complete recurring USCIS renewals — green-card (Form I-90) and work-permit (Form I-765) — by reusing a persistent personal profile, a document vault, and deadline reminders. This is a glossary of domain meaning only; it deliberately excludes technical, product, and implementation vocabulary.

## Language

### People & Identity

**Applicant**:
The individual human whose immigration benefit is being renewed or replaced — the legal subject named on a form. An applicant is a person, not an account; a single account holder may manage several applicants (themselves plus dependents).
_Avoid_: User, Account holder, Customer, Member

**Account Holder**:
The person who signs in and manages applications; may be the applicant themselves or someone acting on behalf of dependents. Distinguished from Applicant because the human using the app is not always the only person being filed for.
_Avoid_: Owner, Profile

**Permanent Resident (LPR)**:
A non-citizen lawfully authorized to live and work permanently in the United States, evidenced by a Permanent Resident Card. Their status continues even when the physical card expires.
_Avoid_: Green card holder, Immigrant, Resident alien

**Dependent**:
A spouse or child whose own renewal is managed under the same account by the account holder; families frequently renew work permits together.
_Avoid_: Derivative, Beneficiary, Family member

**USCIS**:
U.S. Citizenship and Immigration Services — the federal agency that receives, adjudicates, and issues decisions on these forms. The product is never affiliated with or endorsed by USCIS.
_Avoid_: Immigration office, The government, INS

### Documents & Identifiers

**A-Number**:
The Alien Registration Number — a unique identifier USCIS assigns to a person that stays the same across every one of their applications, cards, and notices. It identifies the *person*, not any single application; on newer cards it is printed as the "USCIS Number."
_Avoid_: Alien number, Case Number, Receipt Number

**Permanent Resident Card**:
The physical card proving lawful permanent resident status (officially Form I-551), which carries an expiry date (typically ten years) and is renewed or replaced via Form I-90.
_Avoid_: Green Card, I-551, PR card

**Employment Authorization Document (EAD)**:
The physical card proving authorization to work in the United States (officially Form I-766), which carries an expiry date and is obtained or renewed via Form I-765.
_Avoid_: Work permit, I-766, Work card

**Eligibility Category**:
The code (for example C08 or A05) identifying the legal basis on which an applicant qualifies for an EAD; it determines which fields and rules apply to a Form I-765.
_Avoid_: EAD category, Class, Eligibility code

**I-94**:
The arrival/departure record showing how and until when a person was admitted to the United States and their authorized period of stay.
_Avoid_: Arrival record, Entry record

**Document**:
A stored copy of an identity or immigration record (passport, EAD, Permanent Resident Card, I-94, Social Security card, and similar), held with metadata such as its expiry date. A Document is the underlying evidence item — a Card is one *kind* of Document, and a Form is an application, not a Document.
_Avoid_: File, Attachment, Upload, Scan

### Forms & Applications

**Form I-90**:
The official USCIS application used to renew or replace a Permanent Resident Card.
_Avoid_: Green card renewal form, I90

**Form I-765**:
The official USCIS application for employment authorization, used both for a first-time EAD and for renewing an existing one.
_Avoid_: EAD form, Work permit application, I765

**Application**:
A single form prepared for one applicant — the unit of work the app guides from blank to ready-to-submit, and the primary product noun. An Application becomes a Case only after USCIS receives it.
_Avoid_: Filing, Submission, Case, Form

**Filing**:
The act of submitting a completed Application to USCIS, by mail or online. Filing is something done *to* an Application, never the name of the thing being prepared. Survives as a noun only in fixed legal terms (Filing Fee) and deadline terms (Filing Window, File-By Date).
_Avoid_: Filing as the unit of work (use Application)

**Application Kind**:
Whether an Application is an Initial Application, a Renewal, or a Replacement — the applicant's situation, captured separately from which form it is.
_Avoid_: Filing kind, Filing type, Case type

**Renewal**:
An application to obtain a fresh card replacing one that is expiring or has expired, where the underlying status or eligibility continues unchanged. Contrast with Replacement.
_Avoid_: Reapplication, Extension

**Replacement**:
An application to obtain a new card because the existing one was lost, stolen, damaged, or contains an error — driven by a problem with the card, not by its expiry. Contrast with Renewal.
_Avoid_: Reissue, Reprint

**Initial Application**:
A first-time application where no prior card exists (common for Form I-765), as opposed to a renewal of an existing card.
_Avoid_: New application, First filing, Initial filing

**Form Edition**:
The dated version of an official USCIS form; USCIS rejects applications prepared on an outdated edition, so the current edition must always be used.
_Avoid_: Form version, Revision

**Filing Fee**:
The government fee owed to USCIS to submit a form (for example, Form I-90 is $465 by mail or $415 online), separate from any biometrics or service charge.
_Avoid_: Cost, Price, Charge

**Form Preparer**:
A non-attorney who helps an applicant complete a form and who must be disclosed in the form's preparer section. Preparing immigration forms for others is regulated (unauthorized-practice-of-law and "notario" laws), so the role carries legal weight.
_Avoid_: Helper, Agent, Assistant

### Case & Status

**Case**:
An in-progress matter at USCIS, created the moment USCIS receives a filed Application and tracked over time by its receipt number. A Case exists only after filing — before that it is an Application.
_Avoid_: Ticket, Matter

**Receipt Number**:
The identifier USCIS assigns when it receives a filed application (three letters — e.g. IOE, MSC, EAC, WAC, LIN, SRC — followed by ten digits) used to look up a case's status. It identifies a *case*, not a person, unlike the A-Number; USCIS sometimes calls this the case number, but we standardize on Receipt Number.
_Avoid_: Case Number, Confirmation number, Tracking number

**Receipt Notice**:
The notice USCIS issues (Form I-797) confirming a filed application was received and bearing the receipt number.
_Avoid_: Confirmation letter, I-797

**Case Status**:
The current stage of a case in USCIS processing. Canonical states include: Case Received, Biometrics (fingerprint appointment), Request for Evidence, Approved, Card Is Being Produced, Card Was Mailed, and Card Was Delivered.
_Avoid_: State, Stage, Step

**Request for Evidence (RFE)**:
A notice in which USCIS asks the applicant for additional documentation before it will decide a case.
_Avoid_: Evidence request, Notice

**Biometrics**:
The appointment at which USCIS collects fingerprints, a photo, and a signature as part of processing a case.
_Avoid_: Fingerprinting, Bio appointment

### Deadlines & Reminders

**Expiry Date**:
The date on which a card (Permanent Resident Card or EAD) ceases to be valid.
_Avoid_: Expiration, End date

**Filing Window**:
The span of time before a card's expiry during which a renewal may properly be filed (for example, a Form I-765 renewal window opens roughly 180 days before the EAD expires).
_Avoid_: Submission period, Renewal window

**File-By Date**:
The recommended last date to file a renewal in order to avoid a lapse in status or work authorization — the core figure the app surfaces and counts down to.
_Avoid_: Due date, Deadline

**Auto-Extension**:
A period during which an expired EAD remained valid while a timely renewal was pending. USCIS removed this automatic extension for Form I-765 renewals filed on or after October 30, 2025, which is the central reason timely filing now matters more.
_Avoid_: Grace period, Extension

**Processing Time**:
USCIS's published estimate of how long a given form takes to adjudicate at a given office; it changes over time and feeds the deadline math.
_Avoid_: Wait time, Turnaround

**Reminder**:
A scheduled alert delivered to the applicant ahead of a file-by or expiry date (for example, at 180, 90, 30, 7, and 1 days before), in the applicant's local time.
_Avoid_: Notification, Alert, Ping

### Dashboard

**Active Application**:
An application that is not closed — still being prepared or awaiting an outcome after filing.
_Avoid_: Open application, In-progress application, Process, Active process

**Attention Item**:
Something the account holder should act on soon: a document expiring within its filing window, or a required document still missing from an active application. Attention items are computed from the vault and applications, never created or dismissed by hand.
_Avoid_: Alert, Notification, Task, Todo

### Profile & Vault

**Applicant Profile**:
The persistent set of an applicant's personal, address, and eligibility information that is reused to pre-fill future applications — the asset that makes a second application near one-tap.
_Avoid_: Account, User record, Form data

**Autofill**:
Populating a new application's fields from the applicant profile rather than re-asking the applicant. The profile is the only conduit — a new application never reads another application's answers directly.
_Avoid_: Pre-fill, Prepopulate, Carry-over

**Document Vault**:
The applicant's organized collection of stored documents and their expiry metadata, reused across applications and feeding the reminder schedule.
_Avoid_: Storage, Locker, Folder, Drive

**Document Requirement**:
A named slot on an application for one supporting document (for example, a passport-style photo for an EAD renewal), which is needed, attached, or waived. Requirements are determined by the form and application kind plus the applicant's answers.
_Avoid_: Checklist item, Needed doc, Missing document

### Experience & Money

**Interview**:
The question-first guided experience that asks an applicant friendly, plain-language questions — one per screen, with help available on each — and maps the answers to the underlying form fields behind the scenes, rather than presenting the raw USCIS form. The Interview is *how* an Application is prepared (see ADR-0012).
_Avoid_: Form, Questionnaire, Survey, Form-fill

**Preview**:
The free, watermarked rendering of the finished form on the real current-edition USCIS document (marked "DRAFT — NOT FOR FILING"), shown before payment so the applicant sees exactly what they will obtain. The Preview is not itself mailable.
_Avoid_: Sample, Mockup, Proof, Demo

**Filing Package**:
The clean, print-ready output unlocked by the Service Fee — the completed current-edition USCIS PDF plus the personalized mailing/assembly instructions and supporting-document checklist for one Application. The user prints, signs, and mails it themselves (ADR-0006). "Filing" here is the act-sense compound (the package one files with), consistent with Filing Fee and File-By Date.
_Avoid_: Export, Download, Final form, Submission

**Service Fee**:
The one-time charge owed to *us* to obtain a Filing Package — payment for self-help software that prepares and renders the form, including unlimited later edits and re-downloads of that Application. It is strictly separate from the **Filing Fee** (the government fee owed to USCIS, which we never collect), and it does not buy legal advice, representation, or any guarantee of approval (ADR-0004, ADR-0011).
_Avoid_: Filing Fee, Subscription, Price, Cost, Unlock fee
