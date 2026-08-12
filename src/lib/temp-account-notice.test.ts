import { describe, expect, test } from 'vitest'
import {
	TEMP_ACCOUNT_START_DISCLOSURE,
	TEMP_ACCOUNT_WELCOME_NOTE,
	tempAccountCardDescription,
	temporaryAccountNotice,
} from './temp-account-notice'

const HOUR = 60 * 60 * 1000

describe('temporary account disclosure', () => {
	test('states the exact deletion window before temporary work begins', () => {
		expect(TEMP_ACCOUNT_START_DISCLOSURE).toContain('48 hours')
		expect(TEMP_ACCOUNT_START_DISCLOSURE).toContain('eligible for permanent deletion')
		expect(TEMP_ACCOUNT_START_DISCLOSURE).toContain('hourly cleanup')
		expect(TEMP_ACCOUNT_START_DISCLOSURE).toMatch(/create an account/i)
	})

	test('does not promise deletion at the exact 48-hour boundary on Welcome', () => {
		expect(TEMP_ACCOUNT_WELCOME_NOTE).toContain('eligible for deletion after 48 hours')
		expect(TEMP_ACCOUNT_WELCOME_NOTE).toContain('cleanup runs hourly')
		expect(TEMP_ACCOUNT_WELCOME_NOTE).toMatch(/sign up/i)
	})

	test('keeps a calm deletion notice visible before the final 24 hours', () => {
		const notice = temporaryAccountNotice(47 * HOUR, 0)

		expect(notice).toMatchObject({
			urgent: false,
			title: 'Your account is temporary',
		})
		expect(notice.description).toContain('eligible for permanent deletion in about 2 days')
		expect(notice.description).toContain('hourly cleanup')
	})

	test('keeps the temporary-account card stable while its exact deadline loads', () => {
		const pending = tempAccountCardDescription(undefined, 0)

		expect(pending).toContain('after 48 hours')
		expect(pending).toContain('hourly cleanup')
		expect(pending).toMatch(/create an account/i)
	})

	test('escalates the notice inside the final 24 hours', () => {
		const notice = temporaryAccountNotice(23 * HOUR, 0)

		expect(notice).toMatchObject({
			urgent: true,
			title: 'Your temporary account becomes eligible for deletion in about 23 hours',
		})
	})

	test('switches urgency exactly at 24 hours and calls out the final hour', () => {
		expect(temporaryAccountNotice(24 * HOUR + 1, 0).urgent).toBe(false)
		expect(temporaryAccountNotice(24 * HOUR, 0).urgent).toBe(true)
		expect(temporaryAccountNotice(HOUR, 0).title).toContain('within the hour')
		expect(temporaryAccountNotice(HOUR + 1, 0).title).toContain('in about 1 hour')
	})

	test('does not imply time remains after the deletion deadline', () => {
		expect(temporaryAccountNotice(0, 1)).toMatchObject({
			urgent: true,
			title: 'Your temporary account is eligible for deletion',
		})
	})
})
