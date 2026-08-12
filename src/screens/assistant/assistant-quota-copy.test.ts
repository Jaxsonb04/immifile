import { describe, expect, test } from 'vitest'

import { assistantQuotaCopy } from './assistant-quota-copy'

describe('assistantQuotaCopy', () => {
	test('states the UTC reset boundary instead of local-calendar tomorrow', () => {
		expect(assistantQuotaCopy(0, 20)).toBe('Limit reached — resets at midnight UTC')
		expect(assistantQuotaCopy(7, 20)).toBe('7 of 20 left today')
	})
})
