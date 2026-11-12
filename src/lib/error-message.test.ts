import { describe, expect, test } from 'vitest'
import { humanErrorMessage } from './error-message'

describe('humanErrorMessage', () => {
	test('extracts the sentence from a real Convex uncaught-error envelope', () => {
		// Verbatim shape observed in the simulator (2026-07-21 QA pass).
		const error = new Error(
			'[CONVEX M(applications:markFiled)] [Request ID: f74c9d63d02404e7] Server Error Uncaught Error: The filing date can’t be before this application was started at handler (../convex/applications.ts:342:28)',
		)
		expect(humanErrorMessage(error)).toBe(
			'The filing date can’t be before this application was started',
		)
	})

	test('strips bracketed prefixes when no Uncaught marker is present', () => {
		const error = new Error('[CONVEX Q(home:getDashboard)] [Request ID: abc] Server Error')
		expect(humanErrorMessage(error, 'Please try again.')).toBe('Please try again.')
	})

	test('uses the fallback for production errors with only a client stack marker', () => {
		// Production redacts the server message; Convex appends this marker.
		const error = new Error(
			'[CONVEX A(auth:deleteAccount)] [Request ID: abc] Server Error\n  Called by client',
		)
		expect(humanErrorMessage(error, 'Check your password and try again.')).toBe(
			'Check your password and try again.',
		)
	})

	test('drops multiline Convex stacks and hides technical authentication failures', () => {
		const error = new Error(
			'[CONVEX M(cases:createCase)] [Request ID: abc] Server Error\nUncaught Error: Not authenticated\n    at requireCredentialedOwnerId (../../convex/lib/auth.ts:66:13)\n    at async handler (../convex/cases.ts:122:41)\n\nCalled by client',
		)
		expect(humanErrorMessage(error, 'Please try again.')).toBe('Please try again.')
	})

	test('passes plain client-side errors through untouched', () => {
		expect(humanErrorMessage(new Error('The upload did not complete. Please try again.'))).toBe(
			'The upload did not complete. Please try again.',
		)
	})

	test('falls back for non-Error throws and empty messages', () => {
		expect(humanErrorMessage('boom', 'Fallback.')).toBe('Fallback.')
		expect(humanErrorMessage(new Error(''), 'Fallback.')).toBe('Fallback.')
		expect(humanErrorMessage(undefined)).toBe('Something went wrong. Please try again.')
	})
})
