import i90Meta from '@/assets/forms/i-90.meta.json'
import i765Meta from '@/assets/forms/i-765.meta.json'
import { situationLabel } from '@/lib/application-labels'
import type { FormType } from '@convex/shared/applicationShapes'
import { Asset } from 'expo-asset'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import * as WebBrowser from 'expo-web-browser'
import type { RenderDraftArgs } from './pdf.render'

// On-device glue for the watermarked draft Preview: resolve the bundled
// current-edition USCIS template, render it via the pure engine (pdf.render.ts),
// write the result to the cache directory only — generated on demand, never
// persisted (ADR-0007) — and hand it to the OS share sheet. Uses the legacy
// expo-file-system subpath deliberately: pdf-lib wants the string base64 API.

// Metro bundles the normalized templates as static assets (metro.config assetExts).
const TEMPLATE_MODULES: Record<FormType, number> = {
	i765: require('@/assets/forms/i-765.pdf'),
	i90: require('@/assets/forms/i-90.pdf'),
}

const FORM_META: Record<FormType, { title: string; omb: string; ombExpires: string }> = {
	i765: i765Meta,
	i90: i90Meta,
}

/** Edition signals (title, OMB number + expiration) read from the bundled asset. */
export function formMetaFor(formType: FormType): {
	title: string
	omb: string
	ombExpires: string
} {
	return FORM_META[formType]
}

const DRAFT_FILENAMES: Record<FormType, string> = {
	i765: 'i-765-draft-preview.pdf',
	i90: 'i-90-draft-preview.pdf',
}

const PACKAGE_FILENAMES: Record<FormType, string> = {
	i765: 'i-765-filing-package.pdf',
	i90: 'i-90-filing-package.pdf',
}

/**
 * Resolve the bundled template, render it, and write the result to the cache
 * directory only (generated on demand, never persisted — ADR-0007). Returns the
 * file:// uri. Rejects on any asset or render failure so the caller can surface it.
 */
async function renderToCacheUri(
	args: RenderDraftArgs,
	options: { render: 'draft' | 'filing'; filename: string },
): Promise<string> {
	const asset = Asset.fromModule(TEMPLATE_MODULES[args.formType])
	if (!asset.localUri) {
		await asset.downloadAsync()
	}
	const templateBase64 = await FileSystem.readAsStringAsync(asset.localUri ?? asset.uri, {
		encoding: FileSystem.EncodingType.Base64,
	})

	// pdf-lib is large and some web runtimes cannot initialize it during the
	// router's eager module scan. Load the renderer only when the user asks for
	// a PDF; native behavior is unchanged and the entry bundle stays portable.
	const { renderDraftPreview, renderFilingPackage } = await import('./pdf.render')
	const render = options.render === 'draft' ? renderDraftPreview : renderFilingPackage
	const { base64 } = await render(templateBase64, args)

	const outUri = `${FileSystem.cacheDirectory}${options.filename}`
	await FileSystem.writeAsStringAsync(outUri, base64, {
		encoding: FileSystem.EncodingType.Base64,
	})
	return outUri
}

/** Render to cache, then hand the file to the OS share sheet (save/share
 * destinations) — the right affordance for the real clean export. */
async function renderAndShare(
	args: RenderDraftArgs,
	options: { render: 'draft' | 'filing'; filename: string; dialogTitle: string },
): Promise<void> {
	const outUri = await renderToCacheUri(args, options)
	// Fail loudly rather than silently no-op: without the share sheet the file
	// never appears, so the caller must be able to surface an error.
	if (!(await Sharing.isAvailableAsync())) {
		throw new Error("Opening files isn't available on this device.")
	}
	await Sharing.shareAsync(outUri, {
		mimeType: 'application/pdf',
		UTI: 'com.adobe.pdf',
		dialogTitle: options.dialogTitle,
	})
}

/**
 * Open the watermarked draft for INSPECTION inside the app — reached only after
 * the structured review, as a deliberate "view the PDF" step, so it no longer
 * fires the OS share sheet the moment the user taps Preview. Presents an in-app
 * browser tab; if that can't render the local PDF (iOS SFSafariViewController is
 * unreliable with file://), falls back to the QuickLook document preview.
 */
export async function openDraftInApp(args: RenderDraftArgs): Promise<void> {
	const outUri = await renderToCacheUri(args, {
		render: 'draft',
		filename: DRAFT_FILENAMES[args.formType],
	})
	try {
		await WebBrowser.openBrowserAsync(outUri)
	} catch {
		if (!(await Sharing.isAvailableAsync())) {
			throw new Error("Opening files isn't available on this device.")
		}
		await Sharing.shareAsync(outUri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' })
	}
}

/**
 * Clean (un-watermarked) print-ready form — free for every user. The
 * server-side entitlement seam (getApplication.isUnlocked, backed by
 * convex/model/entitlements.ts) defaults to unlocked for all owners, so no
 * purchase exists anywhere in the app; the seam stays server-authoritative in
 * case monetization ever returns. The render itself is on-device.
 */
export function openFilingPackage(args: RenderDraftArgs): Promise<void> {
	return renderAndShare(args, {
		render: 'filing',
		filename: PACKAGE_FILENAMES[args.formType],
		dialogTitle: `${situationLabel(args.formType, args.applicationKind).primary} — filing package`,
	})
}
