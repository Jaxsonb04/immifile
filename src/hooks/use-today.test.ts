import { describe, expect, test } from 'vitest'

import { millisecondsUntilNextUtcDay } from './use-today'

describe('millisecondsUntilNextUtcDay', () => {
	test('schedules the next snapshot at the UTC day boundary', () => {
		const now = Date.parse('2026-08-11T23:59:30.000Z')
		expect(millisecondsUntilNextUtcDay(now)).toBe(30_050)
	})
})
