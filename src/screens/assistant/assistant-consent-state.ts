export type AssistantConsentState = 'loading' | 'consent' | 'chat'

export function resolveAssistantConsentState(
	persistedConsent: boolean | undefined,
	acceptedThisSession: boolean,
): AssistantConsentState {
	if (acceptedThisSession || persistedConsent === true) return 'chat'
	if (persistedConsent === undefined) return 'loading'
	return 'consent'
}
