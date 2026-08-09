# Session handoff — immigration app workflow repair

**Written 2026-07-20.** Repo state at handoff: `main` clean and pushed, HEAD `e7f3de9`,
573 tests green, `tsc --noEmit` clean, eslint clean.

---

## 0. HOW TO WORK ON THIS (read first)

**The code is on a REMOTE Mac. Your local file tools (Read/Edit/Write/Grep/Glob) do NOT
see it** — they see an empty laptop. The repo is at `~/develop/immifile` on
the machine reached by `ssh jaxson-build` (passwordless).

The loop that works:

```bash
# read
ssh jaxson-build 'cat ~/develop/immifile/<path>'
ssh jaxson-build "cd ~/develop/immifile && grep -rn 'pattern' src convex"

# edit: scp the file down, edit LOCALLY with Edit/Write, scp it back
scp -q jaxson-build:develop/immifile/<path> /tmp/work/
#   ...edit /tmp/work/<file>...
scp -q /tmp/work/<file> jaxson-build:develop/immifile/<path>

# verify (PATH export is REQUIRED — bun/node are in /usr/local/bin)
ssh jaxson-build 'export PATH=/usr/local/bin:$PATH && cd ~/develop/immifile \
  && bun run typecheck && bun run test:once && bunx eslint <changed paths>'
```

- **ESLint is the style gate** (not prettier). A `.prettierrc` now exists (I added it —
  the repo had a `format` script but no config, so bare `prettier --write` had been
  restyling files to defaults). If you run prettier, it is now safe.
- `git` runs on the remote Mac and uses that machine's GitHub credentials.
- If `ssh jaxson-build` times out: the ngrok TCP address rotated. Ask the user for the
  current host/port and update the `jaxson-build` block in `~/.ssh/config`. The key still
  works at the new address.
- Simulators need a logged-in console session on the Mac; headless compiles are fine.

---

## 1. WHAT THIS PROJECT IS AND WHAT WE WERE FIXING

An Expo/React-Native + Convex self-help immigration app (Immifile) that prepares USCIS
**Form I-765** (work permit) and **Form I-90** (green card replacement/renewal).

A prior audit found the app would declare an application "ready" and export a
"print-ready filing package" that was in fact missing most required USCIS fields, had no
eligibility screening, no real answer review, and no filed lifecycle. This session
executed the repair in ordered safety slices.

**Definition of done for the overall repair:** every offered path either produces a
verified, current-edition filing package or clearly stops and explains why it is
unsupported; "ready" and clean export require all applicable answers + documents; users
can review/correct/export/mark-filed/link a case; the vault, reminders, recovery, and
retention support real multi-day use; tests cover workflow truth.

---

## 2. WHAT SHIPPED THIS SESSION (8 commits, all pushed)

| Commit | What |
|---|---|
| `1602d04` | **Server-owned readiness contract** + fail-closed clean export |
| `cee6fc7` | **Eligibility pre-screening** + verified I-90 status mapping |
| `8cde2b4` | Identity + contact field contracts (both forms) |
| `fcb4f7f` | I-90 biographic + admission contract |
| `9f53734` | **I-90 contract COMPLETE — clean export unlocks** |
| `e8c52b5` | **Answer-review screen** with edit-jump + in-app inspection |
| `2068dc5` | I-765 Other Information + statement; **SSN never storable** |
| `e7f3de9` | **I-765 contract COMPLETE — clean export unlocks** |

**Net result: BOTH form contracts are complete.** `I765_COVERAGE_GAPS` and
`I90_COVERAGE_GAPS` are both `[]`, so a fully answered application with resolved
documents genuinely reaches `isReadyToFile: true` and can export a clean PDF. Milestone
tests prove this end-to-end through the real mutations for both forms.

---

## 3. LOAD-BEARING ARCHITECTURE (understand before changing anything)

### `convex/shared/readiness.ts` — the export gate
`computeReadiness({formType, applicationKind, answers, requirements})` returns
`{answersComplete, documentsComplete, formCoverageComplete, isReadyToFile, blockers[]}`.
Blocker kinds: `answers` (re-derived per step, never trusts stored `stepCompletion`
flags), `document` (slots still `needed`), `coverage` (form-wide items the app cannot
produce — now empty for both forms). Returned by `getApplication`; every surface reads
this one truth. **Nothing may claim "ready" except this.**

### `convex/shared/interviewValidation.ts` — completeness + applicability predicates
`stepOwnedKeys` (which draft keys each step owns — the save clears these before merging,
so a cleared optional actually disappears) and `isStepComplete(formType, kind, stepKey,
answers)`. The conditional rules were **extracted into exported predicates**
(`aNumberRequired`, `physicalAddressApplies`, `physicalAddressComplete`,
`physicalAddressUsComplete`, `immigrantVisaDetailsApply`, `previousNameApplies`,
`replacementReasonApplies`, `accommodationDetailsApply`, `otherNamesApply`,
`travelDocDetailsApply`, `c26ReceiptApplies`, `c8QuestionApplies`) that **both**
`isStepComplete` and the review model call — this is the anti-drift keystone.

### `convex/shared/reviewModel.ts` — what the review screen renders
`buildReviewModel(formType, kind, answers)` derives groups (from `preReviewStepKeys`),
rows (from `stepOwnedKeys`), `group.complete` (**verbatim** `isStepComplete`), documents
(from `requiredSlotKeys`), and per-row status (`ok | missing | invalid | optional-blank |
blocked`). A **69-case drift-guard test** pins:
`group.complete === isStepComplete === !readiness-answers-blocker === (all rows clean && no blocker)`.
**If you add a field, this test will tell you if your applicability logic drifted.**

### `convex/shared/screening.ts` — eligibility boundary
`screenI90(cardStatus, kind)` blocks exactly one combination (conditional resident +
renewal → I-751/I-829). `supportedI765Categories` is the explicit 8-category list;
`notListed` can never complete a step. Enforced server-side in `createApplication`, the
single choke point every start flow uses.

### `convex/shared/interviewSteps.ts` — blueprints + answer-aware documents
i765 = 12 keys, i90 = 12 keys (incl. `review`). `requiredSlotKeys(formType, kind,
answers)` is **answer-aware**: an I-90 legal name change adds `nameChangeEvidence`; an
I-765 (c)(8) "yes" adds `courtDispositions`. `reconcileRequirements` loads the draft and
reconciles on every save (adds/removes `needed` slots; never discards attachments).

### PDF maps — `pdf.i765-map.ts` / `pdf.i90-map.ts`
Every field was verified against the bundled template's own `TU` tooltips + checkbox
export values + widget geometry. **The internal field names lie.** Documented traps:
- I-765 `Line9_Checkbox` = Item 10 **SEX**; `Line10_Checkbox` = Item 11 **MARITAL STATUS**
- I-765 `Line17a/17b_CountryOfBirth` = Item 14 **CITIZENSHIP**
- I-765 `Line3a/b/c_*` other-name rows: **`[1]` is printed Item 3, `[0]` is Item 4** (swapped)
- I-90 `P3_Line9_HeightInches1/2/3` = **WEIGHT** digits
- I-90 eye/hair (`P3_checkbox10/11`) and reason (`P2_checkbox2`) indices do **not** follow printed order
All are pinned by literal-path tests. **Never renumber these from the printed form.**

Clean export **fails closed**: `renderFilingPackage` throws if any fill op misses;
the watermarked draft preview stays fail-open.

### Review screen — `src/screens/applications/review/`
Route `/application/:id/review`. Grouped cards per interview question, complete /
needs-attention chip, per-row values, blocker sentences, documents checklist, coverage
notice. Each group's **Edit** pushes `/interview/:id?stepKey=X&mode=single`; the interview
opens at that step and `router.back()`s to review on save (live Convex query refreshes the
summary). Full-wizard behavior is unchanged when `singleStep` is undefined.

---

## 4. OWNER DECISIONS ALREADY MADE — DO NOT RE-LITIGATE

- **SSN: skip it.** Owner chose this explicitly. The I-765 Item 13 SSN is optional ("if
  known") and this edition has **no SSA card-request/consent/parents items at all**. So:
  `ssn` is **removed from `i765SpecificsShape`** (the storage validator rejects one),
  `buildI765Ops` never writes Item 13, and a test forces an SSN into a draft to prove no
  op can target that box. The interview discloses the box is left blank and how to
  request an SSA card on the printed form. **Do not add SSN collection.**
- Supported situations remain the five: I-765 initial/renewal/replacement, I-90
  renewal/replacement. Supported I-765 categories remain the eight in `screening.ts`.
- The app is free; USCIS filing fees are informational only and never collected.

---

## 5. ~~EXACT NEXT ACTION~~ DONE 2026-07-20 (`5d46788`): the filed lifecycle shipped

**All P0s of the workflow repair are now complete.** What landed:

- `convex/applications.ts` gained `markFiled`, `closeApplication`,
  `reopenApplication`, `deleteApplication` — all owner-scoped, all
  user-confirmed in the UI. `markFiled` is gated on the readiness contract with
  an explicit `acknowledgeNotReady` escape hatch (recording a real filing is
  allowed; silently faking readiness is not), validates the date to
  `[_creationTime − 1d, now + 1d]`, and is idempotent (the first filing date
  stands).
- **Policies decided this session** (keep them consistent): close never erases a
  filing record (a closed filed app keeps `filedAt`; reopen restores it to
  *filed*, not draft). Un-filing (filed → draft) is blocked once a case is
  linked — corrections after a real filing happen with USCIS. Delete refuses
  filed apps (reopen first if it was a mistake), cascades draft + slots +
  entitlements, and *unlinks* (never deletes) a tracked case.
- `createCase` reconciles: linking a receipt to a draft transitions it to filed
  idempotently; closed and already-linked apps are refused. New
  `listLinkableApplications` (non-closed, unlinked, filed-first) powers
  `cases.new.tsx`, whose copy is now honest about the draft→filed effect.
- Journey Hub: `journey-hub.mark-filed.tsx` ("I filed this with USCIS" +
  date picker, honest not-ready confirm), filed branch in ReviewPay
  (re-download of the clean package — export is pure client-side render from
  the locked draft, so it stays byte-faithful), `journey-hub.manage.tsx`
  (close/delete/reopen), Track pushes `/new-case` when filed & unlinked.
- 15 new tests (588 total). The milestone `i90Steps`/`setupI90`/`setupReadyI90`
  fixtures were hoisted to module scope in `applications.test.ts` — reuse
  `setupReadyI90()` whenever a test needs a genuinely ready application.

Not done / consciously left: the read-only review screen still shows a dead-end
"can no longer be edited" card for filed apps (deep-link only; Prepare hides the
button) — a nice-to-have "view answers read-only after filing" remains open.
Sim QA for all of this UI is still owed (see §7).

---

## 6. NEXT UP — the P1 backlog (original order)

- ~~**P1 documents**~~ DONE 2026-07-20 (`e7297e9`): `convex/shared/documentCompatibility.ts`
  is the ONE requirement→type map (server attach rule + reuse picker; fails closed for
  unmapped keys, drift-guard test pins every producible key). attach/detach are draft-only
  now (a filed application's checklist is frozen). Expired documents are tagged in the
  picker but not blocked — an I-765 renewal legitimately attaches the expiring EAD.
- ~~**P1 vault**~~ DONE 2026-07-21 (`c74cc43`): rows are pressable into a detail screen
  (preview via signed Convex storage URL + OS browser, inline expiry editor with Clear,
  Replace file for the current version, Delete). `getDocumentDetail` is null-safe (same
  precedent as `getApplication` — a deleteDocument commit re-runs the still-mounted
  subscription before the screen unmounts). Delete is refused while attached to ANY slot
  on ANY application (a slot's `documentId` has no null-check on the read side) — the
  banner names the application and disables the button rather than failing after the
  fact. `documents/[documentId]` routes exist under both Forms and Account
  (`DocumentsScreen` takes an explicit `basePath` so a row's push never yanks tabs).
  Consolidated three near-duplicate helpers while here: `src/lib/document-upload.ts`
  (pick+upload, shared with Journey Hub), `src/lib/date-picker.ts` (ISO↔DatePicker,
  shared with mark-filed + the form DateField), and `documentTypeLabel` into
  `lib/application-labels.ts`. Sim-verified end to end incl. the Home renewal widget
  reacting to an expiry edit made from the Vault. 610 tests.
- **P1 extraction autofill**: needs owner approval before any paid OCR provider.
- **P1 reminders**: preference is device-only SecureStore + local notifications; a new
  phone loses them though the UI implies otherwise. Needs server-side intent + reconcile.
- **P1 recovery**: no forgot-password flow; dependents have no management surface.
- **P1 retention**: anonymous accounts + all work are hard-deleted after 48h, which
  conflicts with a multi-day filing workflow. Gate the first sensitive upload behind a
  recoverable account and warn earlier.

---

## 7. VERIFICATION EVIDENCE

- `bun run test:once` → **29 files, 600 tests passing** (as of `c26d513`)
- `bun run typecheck` → clean
- `bunx eslint <changed>` → clean
- Both `I765_COVERAGE_GAPS` and `I90_COVERAGE_GAPS` are `[]`
- Milestone tests exist for both forms asserting `isReadyToFile === true` end-to-end

**Sim QA pass DONE 2026-07-21 (`c26d513`)** — full Maestro walkthrough on a booted
iPhone 17 sim covering the seeded demo data, filed lifecycle (ready + not-ready
mark-filed confirms, date picker, filed re-download + account gate, un-file,
close/reopen/delete), the compatibility-filtered reuse picker, the review screen with
its edit-jump round trip, and the new-case linkable list. Five findings, all fixed in
that commit — the notable ones: `getApplication` now returns **null** (never throws)
for a deleted/foreign id because deleteApplication's commit re-runs the still-mounted
hub subscription (was a render crash; hub/interview/review all render a graceful
fallback now), and `src/lib/error-message.ts` `humanErrorMessage()` strips the raw
Convex error envelope from user-facing alerts (applied to the workflow surfaces; an
app-wide sweep of the remaining ~11 alert sites is tracked as a spawned task).
Still never visually walked: the two full interviews step-by-step (Maestro's
`inputText` crashes the iOS 26.5 driver, so typed text entry remains untested).

---

## 8. LESSONS / GOTCHAS FROM THIS SESSION

1. **Batch text-patches silently no-op.** Python `str.replace` patches against
   prettier-reformatted source failed silently twice, shipping half-applied edits into the
   working tree. **Always `assert old in s` before replacing, and grep-verify markers
   after a batch.** One no-op was caught by tests, one only by a marker audit.
2. **The audit doc was wrong more than once.** It guessed at field semantics that the
   template's tooltips contradicted (Sex/Marital vs SSN; the whole "SSA card-request
   block" that doesn't exist). **Always dump the AcroForm and read the `TU` tooltips +
   export values before mapping anything.** Recipe:
   ```bash
   ssh jaxson-build 'export PATH=/usr/local/bin:$PATH && cd ~/develop/immifile \
     && cat > d.mjs << "EOF"
   import { readFileSync } from "node:fs"
   import { PDFDocument, PDFName, PDFString, PDFHexString } from "pdf-lib"
   const doc = await PDFDocument.load(readFileSync("assets/forms/i-765.pdf"), { ignoreEncryption: true })
   for (const f of doc.getForm().getFields()) {
     const tu = f.acroField.dict.get(PDFName.of("TU"))
     const t = tu instanceof PDFString || tu instanceof PDFHexString ? tu.decodeText() : ""
     const on = f.acroField.getWidgets().map(w => w.getOnValue?.()?.decodeText?.()).filter(Boolean)
     console.log(JSON.stringify({ n: f.getName(), on: on.length?on:undefined, t }))
   }
   EOF
   node d.mjs; rm d.mjs'
   ```
   (must run from the repo cwd so `pdf-lib` resolves; `/tmp` fails)
3. **Adversarial review earns its keep.** A multi-lens review caught a CRITICAL swapped
   field index in the I-765 other-names rows that 572 passing tests missed (my tests only
   covered the 0-row and 1-row cases). Run a real review before anything that unlocks
   export.
4. Official instructions are fetchable on the Mac (`curl` with a browser UA; USCIS 403s
   plain fetchers) and readable with `pypdf` — use them to ground required-vs-optional
   rather than guessing.
5. Convex codegen on the Mac regenerates `_generated/api.d.ts` automatically when you add
   a `convex/shared/*` module.

---

## 9. CONSTRAINTS TO PRESERVE

- Information-only self-help positioning; no legal advice or approval guarantees.
- Applicant vs account holder are separate concepts; the applicant profile is the only
  conduit for reusable autofill between applications.
- Explicit Next-save semantics — **no uncontrolled autosave**. The review screen is
  strictly read-only (it calls `saveApplicationStep` zero times).
- One application is the product unit; a case begins after filing.
- Owner-scoped Convex authorization everywhere.
- **Do not guess USCIS checkbox mappings or eligibility rules.** If official requirements
  can't safely support a path, restrict it and explain honestly.
- Do not collect sensitive fields without a defined storage/retention/display/redaction
  behavior (this is why SSN is out).
