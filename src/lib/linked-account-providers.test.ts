// @vitest-environment node
import { describe, expect, test } from 'vitest'
import { resolveLinkedAccountProviders } from './linked-account-providers'

describe('linked sign-in method verification', () => {
	test('settles a structured HTTP error so deletion can offer retry', () => {
		expect(resolveLinkedAccountProviders({ data: null, error: { message: 'Service unavailable' } })).toEqual([])
	})
	test('fails closed even if an error response also contains stale provider data', () => {
		expect(resolveLinkedAccountProviders({ data: [{ providerId: 'credential' }], error: {} })).toEqual([])
	})
	test('deduplicates successful provider lookup', () => {
		expect(resolveLinkedAccountProviders({ data: [{ providerId: 'google' }, { providerId: 'credential' }, { providerId: 'google' }] })).toEqual(['google', 'credential'])
	})
})
