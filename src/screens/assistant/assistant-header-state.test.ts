import { describe, expect, test } from 'vitest'

import { shouldUseAssistantContentHeader } from './assistant-header-state'

describe('shouldUseAssistantContentHeader', () => {
	test('settles the consent header behind the opaque cover before content is revealed', () => {
		expect(shouldUseAssistantContentHeader(false)).toBe(false)
		expect(shouldUseAssistantContentHeader(true)).toBe(true)
	})
})
