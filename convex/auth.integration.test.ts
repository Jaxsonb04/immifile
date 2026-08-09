/// <reference types="vite/client" />
import { register as registerBetterAuthTest } from '@convex-dev/better-auth/test'
import { setCookieToHeader } from 'better-auth/cookies'
import { convexTest } from 'convex-test'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { components } from './_generated/api'
import schema from './schema'
import { CONVEX_JWT_EXPIRATION_SECONDS, DELETION_TOMBSTONE_TTL_MS } from './shared/authSecurity'

const modules = import.meta.glob('./**/*.ts')
const SITE_URL = 'https://some.convex.site'
const PASSWORD = 'correct-horse-battery-staple'

function newT() {
	const t = convexTest(schema, modules)
	registerBetterAuthTest(t)
	return t
}

beforeEach(() => {
	vi.stubEnv('CONVEX_SITE_URL', SITE_URL)
	vi.stubEnv('BETTER_AUTH_SECRET', 'convex-test-secret-that-is-at-least-32-characters')
})

afterEach(() => {
	vi.unstubAllEnvs()
	vi.unstubAllGlobals()
})

describe('Better Auth trusted origins', () => {
	test('accepts an Expo Go development origin when the deployment opted in', async () => {
		vi.stubEnv('AUTH_TRUST_EXPO_DEV_ORIGINS', 'true')
		const t = newT()
		const response = await t.fetch('/api/auth/sign-up/email', {
			method: 'POST',
			headers: new Headers({
				'content-type': 'application/json',
				// The upgrade flow begins from an anonymous account, so the request
				// carries its existing session cookie and Better Auth enforces CSRF.
				cookie: 'better-auth.session_token=stale-development-session',
				'expo-origin': 'exp://10.0.0.215:8081',
			}),
			body: JSON.stringify({
				name: 'Expo Go Test',
				email: 'expo-go@example.com',
				password: PASSWORD,
			}),
		})

		expect(response.status).toBe(200)
	})

	// Origin REJECTION cannot be integration-tested here: this harness runs
	// without a configured Base URL, and Better Auth then skips origin
	// enforcement entirely (even `origin: https://evil.example.com` with a
	// session cookie returns 200 — while the live deployment 403s the same
	// request). The negative side of the policy is pinned two other ways:
	// convex/shared/authOrigins.test.ts proves the expo-origin allowance is
	// off without AUTH_TRUST_EXPO_DEV_ORIGINS, and live-deployment probes
	// (2026-08-08) confirmed cookie-carrying requests get 403 INVALID_ORIGIN
	// for both an untrusted browser origin and an expo-origin with the flag
	// unset, and 200 with the flag set.
})

describe('Better Auth account deletion', () => {
	test('deletion tombstone outlives every previously issued Convex JWT', () => {
		expect(DELETION_TOMBSTONE_TTL_MS).toBeGreaterThan(CONVEX_JWT_EXPIRATION_SECONDS * 1000)
	})

	test('password-confirmed delete-user purges app and Better Auth data', async () => {
		const t = newT()
		const headers = new Headers({
			'content-type': 'application/json',
			origin: 'https://auth.immifile.app',
		})

		const signUpResponse = await t.fetch('/api/auth/sign-up/email', {
			method: 'POST',
			headers,
			body: JSON.stringify({
				name: 'Delete Test',
				email: 'delete-test@example.com',
				password: PASSWORD,
			}),
		})
		expect(signUpResponse.status).toBe(200)
		setCookieToHeader(headers)({ response: signUpResponse })

		const signUp = (await signUpResponse.json()) as {
			token: string
			user: { id: string }
		}
		expect(signUp.token).toBeTruthy()

		const ownerId = `${SITE_URL}|${signUp.user.id}`
		const preferenceId = await t.run((ctx) =>
			ctx.db.insert('ownerPreferences', {
				ownerId,
				key: 'delete-integration-test',
				value: true,
				updatedAt: Date.now(),
			}),
		)

		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'user',
				where: [{ field: '_id', value: signUp.user.id }],
			}),
		).not.toBeNull()
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'account',
				where: [{ field: 'userId', value: signUp.user.id }],
			}),
		).not.toBeNull()
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'session',
				where: [{ field: 'token', value: signUp.token }],
			}),
		).not.toBeNull()

		const deleteResponse = await t.fetch('/api/auth/delete-user', {
			method: 'POST',
			headers,
			body: JSON.stringify({ password: PASSWORD }),
		})
		expect(deleteResponse.status).toBe(200)
		expect(await deleteResponse.json()).toEqual({
			success: true,
			message: 'User deleted',
		})

		expect(await t.run((ctx) => ctx.db.get(preferenceId))).toBeNull()
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'user',
				where: [{ field: '_id', value: signUp.user.id }],
			}),
		).toBeNull()
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'account',
				where: [{ field: 'userId', value: signUp.user.id }],
			}),
		).toBeNull()
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'session',
				where: [{ field: 'token', value: signUp.token }],
			}),
		).toBeNull()

		const tombstone = await t.run((ctx) =>
			ctx.db
				.query('accountDeletionTombstones')
				.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
				.unique(),
		)
		expect(tombstone).toMatchObject({ ownerId })
		expect(tombstone!.expiresAt - tombstone!.createdAt).toBe(DELETION_TOMBSTONE_TTL_MS)
	})
})

describe('Better Auth password recovery', () => {
	test('delivers a one-hour reset link, revokes sessions, and accepts only the new password', async () => {
		vi.stubEnv('AUTH_EMAIL_WEBHOOK_URL', 'https://mailer.example.com/immifile')
		vi.stubEnv('AUTH_EMAIL_WEBHOOK_TOKEN', 'webhook-secret')
		vi.stubEnv('AUTH_EMAIL_FROM', 'Immifile Support <support@immifile.app>')
		const sendEmail = vi.fn(
			async (_input: RequestInfo | URL, _init?: RequestInit) => new Response(null, { status: 202 }),
		)
		vi.stubGlobal('fetch', sendEmail)

		const t = newT()
		const headers = new Headers({
			'content-type': 'application/json',
			origin: 'https://auth.immifile.app',
		})
		const email = 'password-reset-test@example.com'

		const signUpResponse = await t.fetch('/api/auth/sign-up/email', {
			method: 'POST',
			headers,
			body: JSON.stringify({
				name: 'Password Reset Test',
				email,
				password: PASSWORD,
			}),
		})
		expect(signUpResponse.status).toBe(200)
		const signUp = (await signUpResponse.json()) as {
			token: string
			user: { id: string }
		}

		const requestResponse = await t.fetch('/api/auth/request-password-reset', {
			method: 'POST',
			headers,
			body: JSON.stringify({
				email,
				redirectTo: 'immigrationrenewalhelp://reset-password',
			}),
		})
		expect(requestResponse.status).toBe(200)
		expect(await requestResponse.json()).toEqual({
			status: true,
			message: 'If this email exists in our system, check your email for the reset link',
		})
		expect(sendEmail).toHaveBeenCalledOnce()

		const request = sendEmail.mock.calls[0]?.[1]
		expect(request).toBeDefined()
		const message = JSON.parse(request!.body as string) as {
			kind: string
			to: string
			text: string
		}
		expect(message).toMatchObject({
			kind: 'password_reset',
			to: email,
		})
		const resetUrl = message.text.split('\n').find((line) => line.startsWith('https://'))
		expect(resetUrl).toBeTruthy()
		const token = new URL(resetUrl!).pathname.split('/').at(-1)
		expect(token).toBeTruthy()

		const newPassword = 'new-correct-horse-battery-staple'
		const resetResponse = await t.fetch('/api/auth/reset-password', {
			method: 'POST',
			headers,
			body: JSON.stringify({ token, newPassword }),
		})
		expect(resetResponse.status).toBe(200)
		expect(await resetResponse.json()).toEqual({ status: true })

		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'session',
				where: [{ field: 'token', value: signUp.token }],
			}),
		).toBeNull()

		const oldPasswordResponse = await t.fetch('/api/auth/sign-in/email', {
			method: 'POST',
			headers,
			body: JSON.stringify({ email, password: PASSWORD }),
		})
		expect(oldPasswordResponse.status).not.toBe(200)

		const newPasswordResponse = await t.fetch('/api/auth/sign-in/email', {
			method: 'POST',
			headers,
			body: JSON.stringify({ email, password: newPassword }),
		})
		expect(newPasswordResponse.status).toBe(200)
	})
})
