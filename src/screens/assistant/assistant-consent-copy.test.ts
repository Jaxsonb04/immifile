import { describe, expect, test } from 'vitest'

import { ASSISTANT_CONSENT_COPY } from './assistant-consent-copy'

describe('assistant consent copy', () => {
	test('fits the compact disclosure while retaining every required choice detail', () => {
		const visibleCopy = Object.values(ASSISTANT_CONSENT_COPY).join(' ')
		const wordCount = visibleCopy.trim().split(/\s+/).length

		expect(wordCount).toBeLessThanOrEqual(65)
		expect(visibleCopy).toContain('OpenAI')
		expect(visibleCopy).toContain('recent conversation turns')
		expect(visibleCopy).toContain('daily message count')
		expect(visibleCopy).toContain('consent choice')
		expect(visibleCopy).toContain('receipt numbers')
		expect(visibleCopy).toContain('A-Numbers')
		expect(visibleCopy).toContain('addresses')
		expect(visibleCopy).toContain('passwords')
		expect(visibleCopy).toContain('documents')
		expect(visibleCopy).toContain('Withdraw anytime')
	})
})
