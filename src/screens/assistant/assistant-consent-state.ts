export type AssistantConsentState = 'loading' | 'consent' | 'chat'

export function resolveAssistantConsentState(
	persistedConsent: boolean | undefined,
	acceptedThisSession: boolean,
): AssistantConsentState {
	// A persisted withdrawal must win over stale local state from an earlier
	// acceptance in this still-mounted native tab.
	if (persistedConsent === false) return 'consent'
	if (acceptedThisSession || persistedConsent === true) return 'chat'
	if (persistedConsent === undefined) return 'loading'
	return 'consent'
}
