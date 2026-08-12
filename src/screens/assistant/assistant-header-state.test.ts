import { describe, expect, test } from 'vitest'

import { shouldUseAssistantContentHeader } from './assistant-header-state'

describe('shouldUseAssistantContentHeader', () => {
	test('keeps hidden Assistant content from changing the intro header', () => {
		expect(shouldUseAssistantContentHeader(false)).toBe(false)
		expect(shouldUseAssistantContentHeader(true)).toBe(true)
	})
})
