/**
 * The human sentence out of a server error, for user-facing alerts.
 *
 * Convex wraps a mutation's thrown message in transport noise —
 * `[CONVEX M(applications:markFiled)] [Request ID: …] Server Error
 * Uncaught Error: <the actual sentence> at handler (../convex/foo.ts:1:2)` —
 * which must never reach an Alert. This extracts the sentence the server
 * actually wrote, and falls back to the provided copy for anything that
 * doesn't carry a usable message (network failures, non-Error throws).
 */
export function humanErrorMessage(
	error: unknown,
	fallback = 'Something went wrong. Please try again.',
): string {
	if (!(error instanceof Error) || error.message.trim() === '') return fallback

	let message = error.message
	const uncaughtMarker = message.match(/Uncaught (?:Convex)?Error:\s*/)
	if (uncaughtMarker !== null) {
		message = message.slice(message.indexOf(uncaughtMarker[0]) + uncaughtMarker[0].length)
	} else {
		// No Uncaught marker: still strip any leading [CONVEX …]/[Request ID: …]
		// brackets and the "Server Error" label a Convex failure may carry.
		message = message.replace(/^(?:\s*\[[^\]]*\])*\s*(?:Server Error\s*)?/, '')
	}
	// Convex development envelopes can include the full multiline server stack
	// followed by "Called by client". Only the leading human sentence belongs in
	// an alert.
	// Production can redact the entire server message, leaving the client
	// marker at the beginning after the transport prefix is removed.
	message = message.split(/(?:^|\n)\s*Called by client\b|\n\s*at\b/, 1)[0]
	// Drop the trailing stack-location Convex appends to uncaught errors.
	message = message.replace(/\s+at handler \([^)]*\)\s*$/, '').trim()

	if (/^(?:not authenticated|unauthenticated)$/i.test(message)) return fallback
	return message === '' ? fallback : message
}
