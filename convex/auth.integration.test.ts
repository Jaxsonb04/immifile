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
const TEST_ORIGIN_PROOF = 'test-only-origin-proof'
let requestMetadataIp = '203.0.113.10'
let restoreRequestMetadata: (() => void) | undefined

function mockRequestMetadata(getIp: () => string) {
	const runtime = (
		globalThis as typeof globalThis & {
			Convex: { asyncSyscall: (op: string, jsonArgs: string) => Promise<string> }
		}
	).Convex
	const descriptor = Object.getOwnPropertyDescriptor(runtime, 'asyncSyscall')
	if (!descriptor?.get) throw new Error('convex-test async syscall proxy is unavailable')
	Object.defineProperty(runtime, 'asyncSyscall', {
		configurable: true,
		get() {
			const original = descriptor.get!.call(runtime) as (
				op: string,
				jsonArgs: string,
			) => Promise<string>
			return async (op: string, jsonArgs: string) => {
				if (op === '1.0/getRequestMetadata') {
					return JSON.stringify({
						ip: getIp(),
						userAgent: 'convex-test',
						requestId: 'auth-rate-limit-test',
						scheduledFunctionId: null,
					})
				}
				return await original(op, jsonArgs)
			}
		},
	})
	return () => Object.defineProperty(runtime, 'asyncSyscall', descriptor)
}

function newT() {
	const t = convexTest(schema, modules)
	registerBetterAuthTest(t)
	restoreRequestMetadata ??= mockRequestMetadata(() => requestMetadataIp)
	return t
}

beforeEach(() => {
	requestMetadataIp = '203.0.113.10'
	vi.stubEnv('CONVEX_SITE_URL', SITE_URL)
	vi.stubEnv('BETTER_AUTH_SECRET', 'convex-test-secret-that-is-at-least-32-characters')
})

afterEach(() => {
	restoreRequestMetadata?.()
	restoreRequestMetadata = undefined
	vi.unstubAllEnvs()
	vi.unstubAllGlobals()
})

describe('Better Auth origin rate limiting', () => {
	test('rejects a sixth email sign-in attempt from the same client inside one minute', async () => {
		const t = newT()
		const request = (email = 'missing-rate-limit-user@example.com', forwardedFor?: string) =>
			t.fetch('/api/auth/sign-in/email', {
				method: 'POST',
				headers: new Headers({
					'content-type': 'application/json',
					origin: 'https://auth.immifile.app',
					...(forwardedFor ? { 'x-forwarded-for': forwardedFor } : {}),
				}),
				body: JSON.stringify({
					email,
					password: 'definitely-not-the-password',
				}),
			})

		for (let attempt = 0; attempt < 5; attempt += 1) {
			expect((await request()).status).toBe(401)
		}

		const blocked = await request()
		expect(blocked.status).toBe(429)
		expect(blocked.headers.get('retry-after')).toBeTruthy()
		expect(blocked.headers.get('x-retry-after')).toBeTruthy()
		expect(await blocked.json()).toEqual({
			message: 'Too many requests. Please try again later.',
		})
		requestMetadataIp = '198.51.100.44'
		expect((await request(undefined, '198.51.100.44')).status).toBe(429)
		// Requests proxied through one Vercel egress address must not let one
		// person's typo lock every other account sharing that address. Conversely,
		// changing IP or spoofing X-Forwarded-For must not reset the same account's
		// strict credential bucket.
		expect((await request('another-user@example.com')).status).toBe(401)
	})

	test('uses the last normalized email in accepted JSON and form bodies', async () => {
		const t = newT()
		const target = 'duplicate-target@example.com'
		const send = (contentType: string, body: string) =>
			t.fetch('/api/auth/sign-in/email', {
				method: 'POST',
				headers: new Headers({
					'content-type': contentType,
					origin: 'https://auth.immifile.app',
				}),
				body,
			})

		for (let attempt = 0; attempt < 5; attempt += 1) {
			expect(
				(
					await send(
						'application/json',
						JSON.stringify({ email: target, password: 'not-the-password' }),
					)
				).status,
			).toBe(401)
		}

		requestMetadataIp = '198.51.100.77'
		const duplicateJson = `{"email":"decoy@example.com","email":" ${target.toUpperCase()} ","password":"not-the-password"}`
		expect((await send('application/json; charset=utf-8', duplicateJson)).status).toBe(429)

		const form = new URLSearchParams()
		form.append('email', 'decoy@example.com')
		form.append('password', 'not-the-password')
		form.append('email', target)
		expect(
			(await send('application/x-www-form-urlencoded; charset=UTF-8', form.toString())).status,
		).toBe(429)
	})

	test('throttles social initiation by normalized IPv6 network but not OAuth callbacks', async () => {
		vi.stubEnv('AUTH_ORIGIN_PROOF', TEST_ORIGIN_PROOF)
		const t = newT()
		const initiate = (clientIp: string, spoofedCloudflareIp: string) => {
			requestMetadataIp = clientIp
			return t.fetch('/api/auth/sign-in/social', {
				method: 'POST',
				headers: new Headers({
					'cf-connecting-ip': spoofedCloudflareIp,
					'content-type': 'application/json',
					origin: 'https://auth.immifile.app',
					'x-immifile-origin-proof': TEST_ORIGIN_PROOF,
				}),
				body: JSON.stringify({ provider: 'google', callbackURL: 'immigrationrenewalhelp://' }),
			})
		}

		for (let attempt = 0; attempt < 15; attempt += 1) {
			const suffix = (attempt + 1).toString(16)
			expect(
				(await initiate(`2001:db8:abcd:1234::${suffix}`, `198.51.100.${attempt + 1}`)).status,
			).not.toBe(429)
		}
		expect((await initiate('2001:db8:abcd:1234::ffff', '198.51.100.250')).status).toBe(429)

		const callback = await t.fetch('/api/auth/callback/google?code=invalid&state=invalid', {
			method: 'GET',
			headers: new Headers({ 'x-immifile-origin-proof': TEST_ORIGIN_PROOF }),
		})
		expect(callback.status).not.toBe(429)
	})

	test('normalizes IPv4-mapped addresses into the same coarse sign-up bucket', async () => {
		vi.stubEnv('AUTH_ORIGIN_PROOF', TEST_ORIGIN_PROOF)
		const t = newT()
		const request = (clientIp: string) => {
			requestMetadataIp = clientIp
			return t.fetch('/api/auth/sign-up/email', {
				method: 'POST',
				headers: new Headers({
					'content-type': 'application/json',
					origin: 'https://auth.immifile.app',
					'x-immifile-origin-proof': TEST_ORIGIN_PROOF,
				}),
				body: '{}',
			})
		}

		for (let attempt = 0; attempt < 5; attempt += 1) {
			const address = attempt % 2 === 0 ? '::ffff:192.0.2.8' : '192.0.2.8'
			expect((await request(address)).status).not.toBe(429)
		}
		expect((await request('192.0.2.8')).status).toBe(429)
	})

	test('does not trust or apply coarse client buckets before origin proof rollout', async () => {
		const t = newT()
		for (let attempt = 0; attempt < 6; attempt += 1) {
			requestMetadataIp = '192.0.2.25'
			const response = await t.fetch('/api/auth/sign-up/email', {
				method: 'POST',
				headers: new Headers({
					'cf-connecting-ip': '192.0.2.25',
					'content-type': 'application/json',
					origin: 'https://auth.immifile.app',
				}),
				body: '{}',
			})
			expect(response.status).not.toBe(429)
		}
	})
})

describe('Better Auth proxy proof', () => {
	test('keeps direct requests compatible while AUTH_ORIGIN_PROOF is unset', async () => {
		const t = newT()
		const response = await t.fetch('/api/auth/get-session', { method: 'GET' })
		expect(response.status).toBe(200)
	})

	test('accepts the exact configured proof for GET and POST', async () => {
		vi.stubEnv('AUTH_ORIGIN_PROOF', TEST_ORIGIN_PROOF)
		const t = newT()
		const proofHeaders = { 'x-immifile-origin-proof': TEST_ORIGIN_PROOF }

		const getResponse = await t.fetch('/api/auth/get-session', {
			method: 'GET',
			headers: new Headers(proofHeaders),
		})
		expect(getResponse.status).toBe(200)

		const postResponse = await t.fetch('/api/auth/sign-in/email', {
			method: 'POST',
			headers: new Headers({
				...proofHeaders,
				'content-type': 'application/json',
				origin: 'https://auth.immifile.app',
			}),
			body: JSON.stringify({ email: 'missing@example.com', password: 'not-the-password' }),
		})
		expect(postResponse.status).toBe(401)
	})

	test.each(['/api/auth/convex/.well-known/openid-configuration', '/api/auth/convex/jwks'])(
		'keeps the exact public GET endpoint available without proof: %s',
		async (path) => {
			vi.stubEnv('AUTH_ORIGIN_PROOF', TEST_ORIGIN_PROOF)
			const response = await newT().fetch(path, { method: 'GET' })
			expect(response.status).toBe(200)
		},
	)

	test.each([
		['GET', '/api/auth/convex/jwks/extra'],
		['GET', '/api/auth/convex/.well-known/openid-configuration/extra'],
		['POST', '/api/auth/convex/jwks'],
		['POST', '/api/auth/convex/.well-known/openid-configuration'],
	] as const)('does not broaden the public-key exemption to %s %s', async (method, path) => {
		vi.stubEnv('AUTH_ORIGIN_PROOF', TEST_ORIGIN_PROOF)
		const response = await newT().fetch(path, { method })
		expect(response.status).toBe(403)
		expect(await response.json()).toEqual({ message: 'Forbidden' })
	})

	test.each([
		['GET', '/api/auth/get-session', undefined],
		[
			'POST',
			'/api/auth/sign-in/email',
			JSON.stringify({ email: 'missing@example.com', password: 'not-the-password' }),
		],
	] as const)('rejects missing and incorrect proof for %s requests', async (method, path, body) => {
		vi.stubEnv('AUTH_ORIGIN_PROOF', TEST_ORIGIN_PROOF)
		const t = newT()
		for (const suppliedProof of [undefined, 'incorrect-proof']) {
			const headers = new Headers()
			if (body) {
				headers.set('content-type', 'application/json')
				headers.set('origin', 'https://auth.immifile.app')
			}
			if (suppliedProof) headers.set('x-immifile-origin-proof', suppliedProof)
			const response = await t.fetch(path, { method, headers, body })
			expect(response.status).toBe(403)
			expect(await response.json()).toEqual({ message: 'Forbidden' })
		}
	})
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
