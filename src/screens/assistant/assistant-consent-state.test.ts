import { describe, expect, test } from 'vitest'

import { resolveAssistantConsentState } from './assistant-consent-state'

describe('resolveAssistantConsentState', () => {
	test('keeps the chat unmounted until explicit OpenAI consent is granted', () => {
		expect(resolveAssistantConsentState(undefined, false)).toBe('loading')
		expect(resolveAssistantConsentState(false, false)).toBe('consent')
		expect(resolveAssistantConsentState(false, true)).toBe('consent')
		expect(resolveAssistantConsentState(true, false)).toBe('chat')
	})
})
