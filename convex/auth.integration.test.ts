/// <reference types="vite/client" />
import { register as registerBetterAuthTest } from '@convex-dev/better-auth/test'
import { setCookieToHeader } from 'better-auth/cookies'
import { convexTest } from 'convex-test'
import { UnsecuredJWT } from 'jose'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { api, components, internal } from './_generated/api'
import schema from './schema'
import {
	ACCOUNT_DELETION_RECOVERY_DELAY_MS,
	CONVEX_JWT_EXPIRATION_SECONDS,
	DELETION_TOMBSTONE_TTL_MS,
} from './shared/authSecurity'

const modules = import.meta.glob('./**/*.ts')
const SITE_URL = 'https://some.convex.site'
const PASSWORD = 'correct-horse-battery-staple'
const TEST_ORIGIN_PROOF = 'test-only-origin-proof'
const APPLE_TEST_ENV = {
	APPLE_CLIENT_ID: 'apple-service-id',
	APPLE_TEAM_ID: 'TEAM123456',
	APPLE_KEY_ID: 'KEY1234567',
	APPLE_PRIVATE_KEY: `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgqBBjJ3mK5s60aOqj
iTej7m2+7X09tow94qcBONE+vgmhRANCAATTeVa11K2gVIXiAxRbluPtKYW0JaWk
vEYvm1oCiwnmQTxNE2NKIS/zHMS1blV2W7kiNyyUCW6CMF/CzTWTgvzv
-----END PRIVATE KEY-----`,
}
let requestMetadataIp = '203.0.113.10'
let restoreRequestMetadata: (() => void) | undefined
let deletionAttemptSequence = 0

function deletionAttemptId(): string {
	deletionAttemptSequence += 1
	return `00000000-0000-4000-8000-${deletionAttemptSequence.toString(16).padStart(12, '0')}`
}

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
	deletionAttemptSequence = 0
	vi.stubEnv('CONVEX_SITE_URL', SITE_URL)
	vi.stubEnv('BETTER_AUTH_SECRET', 'convex-test-secret-that-is-at-least-32-characters')
})

afterEach(() => {
	vi.useRealTimers()
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

	test('coarsely throttles repeated deletion link-social initiations', async () => {
		vi.stubEnv('AUTH_ORIGIN_PROOF', TEST_ORIGIN_PROOF)
		vi.stubEnv('GOOGLE_CLIENT_ID', 'google-client-id')
		vi.stubEnv('GOOGLE_CLIENT_SECRET', 'google-client-secret')
		const t = newT()
		const request = () =>
			t.fetch('/api/auth/link-social', {
				method: 'POST',
				headers: new Headers({
					'content-type': 'application/json',
					origin: 'https://auth.immifile.app',
					'x-immifile-origin-proof': TEST_ORIGIN_PROOF,
				}),
				body: JSON.stringify({ provider: 'google', callbackURL: '/' }),
			})

		for (let attempt = 0; attempt < 15; attempt += 1) {
			expect((await request()).status).toBe(403)
		}
		const blocked = await request()
		expect(blocked.status).toBe(429)
		expect(blocked.headers.get('retry-after')).toBeTruthy()
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

	test('default-denies unshipped credential and account-management HTTP routes', async () => {
		const t = newT()
		const headers = new Headers({
			'content-type': 'application/json',
			origin: 'https://auth.immifile.app',
		})
		const email = 'blocked-account-management@example.com'
		const signUpResponse = await t.fetch('/api/auth/sign-up/email', {
			method: 'POST',
			headers,
			body: JSON.stringify({ name: 'Blocked Routes Test', email, password: PASSWORD }),
		})
		expect(signUpResponse.status).toBe(200)
		setCookieToHeader(headers)({ response: signUpResponse })

		const routes = [
			['POST', '/api/auth/verify-password', { password: PASSWORD }],
			[
				'POST',
				'/api/auth/change-password',
				{ currentPassword: PASSWORD, newPassword: 'attacker-installed-password' },
			],
			['POST', '/api/auth/set-password', { newPassword: 'attacker-installed-password' }],
			['POST', '/api/auth/change-email', { newEmail: 'attacker@example.com' }],
			['POST', '/api/auth/unlink-account', { providerId: 'credential' }],
			['POST', '/api/auth/get-access-token', { providerId: 'google' }],
			['POST', '/api/auth/refresh-token', { providerId: 'google' }],
			['GET', '/api/auth/account-info', undefined],
			['GET', '/api/auth/list-sessions', undefined],
			['POST', '/api/auth/revoke-session', { token: 'other-session' }],
			['POST', '/api/auth/revoke-sessions', {}],
			['POST', '/api/auth/revoke-other-sessions', {}],
		] as const
		for (const [method, path, body] of routes) {
			const response = await t.fetch(path, {
				method,
				headers,
				body: body === undefined ? undefined : JSON.stringify(body),
			})
			expect(response.status, `${method} ${path}`).toBe(404)
			expect(await response.json()).toEqual({ message: 'Not found' })
		}

		// A trailing slash cannot bypass exact-path blocking, and the attempted
		// password change above must not have changed the credential hash.
		expect(
			(
				await t.fetch('/api/auth/verify-password/', {
					method: 'POST',
					headers,
					body: JSON.stringify({ password: PASSWORD }),
				})
			).status,
		).toBe(404)
		const oldPassword = await t.fetch('/api/auth/sign-in/email', {
			method: 'POST',
			headers: new Headers({
				'content-type': 'application/json',
				origin: 'https://auth.immifile.app',
			}),
			body: JSON.stringify({ email, password: PASSWORD }),
		})
		expect(oldPassword.status).toBe(200)
	})

	test('blocks the stock delete-user route and deletes only through password step-up action', async () => {
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
		const now = Date.now()
		// Legacy Apple accounts may predate token persistence. They must still
		// delete, while returning an explicit manual-revocation instruction flag.
		await t.mutation(components.betterAuth.adapter.create, {
			input: {
				model: 'account',
				data: {
					accountId: 'legacy-tokenless-apple-sub',
					providerId: 'apple',
					userId: signUp.user.id,
					createdAt: now,
					updatedAt: now,
				},
			},
		})

		const ownerId = `${SITE_URL}|${signUp.user.id}`
		const preferenceId = await t.run((ctx) =>
			ctx.db.insert('ownerPreferences', {
				ownerId,
				key: 'delete-integration-test',
				value: true,
				updatedAt: Date.now(),
			}),
		)
		for (const [identifier, value] of [
			['reset-password:pre-delete-reset-token', signUp.user.id],
			['abandoned-deletion-challenge', JSON.stringify({ userId: signUp.user.id, version: 1 })],
			[
				'abandoned-link-oauth-state',
				JSON.stringify({ link: { userId: signUp.user.id }, expiresAt: now + 60_000 }),
			],
			['unrelated-verification', JSON.stringify({ userId: 'different-user' })],
		] as const) {
			await t.mutation(components.betterAuth.adapter.create, {
				input: {
					model: 'verification',
					data: {
						identifier,
						value,
						expiresAt: now + 60_000,
						createdAt: now,
						updatedAt: now,
					},
				},
			})
		}

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

		const blockedDeleteResponse = await t.fetch('/api/auth/delete-user', {
			method: 'POST',
			headers,
			body: JSON.stringify({ password: PASSWORD }),
		})
		expect(blockedDeleteResponse.status).toBe(404)
		expect(await blockedDeleteResponse.json()).toEqual({ message: 'Not found' })
		expect(await t.run((ctx) => ctx.db.get(preferenceId))).not.toBeNull()

		const session = (await t.query(components.betterAuth.adapter.findOne, {
			model: 'session',
			where: [{ field: 'token', value: signUp.token }],
		})) as { _id: string } | null
		expect(session).not.toBeNull()
		const authenticated = t.withIdentity({
			subject: signUp.user.id,
			issuer: SITE_URL,
			tokenIdentifier: ownerId,
			sessionId: session!._id,
			isAnonymous: false,
		})
		const rejectedAttemptId = deletionAttemptId()
		await expect(
			authenticated.action(api.auth.deleteAccount, {
				attemptId: rejectedAttemptId,
				proof: { kind: 'password', password: 'wrong-password' },
			}),
		).rejects.toThrow('Account confirmation failed. Please try again')
		await expect(
			t.query(api.auth.getAccountDeletionStatus, { attemptId: rejectedAttemptId }),
		).resolves.toEqual({ status: 'missing' })
		expect(await t.run((ctx) => ctx.db.get(preferenceId))).not.toBeNull()

		const acceptedAttemptId = deletionAttemptId()
		await expect(
			authenticated.action(api.auth.deleteAccount, {
				attemptId: acceptedAttemptId,
				proof: { kind: 'password', password: PASSWORD },
			}),
		).resolves.toEqual({ appleManualRevokeRequired: true })
		await expect(
			t.query(api.auth.getAccountDeletionStatus, { attemptId: acceptedAttemptId }),
		).resolves.toEqual({ status: 'completed', appleManualRevokeRequired: true })

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
		for (const identifier of [
			'reset-password:pre-delete-reset-token',
			'abandoned-deletion-challenge',
			'abandoned-link-oauth-state',
		]) {
			expect(
				await t.query(components.betterAuth.adapter.findOne, {
					model: 'verification',
					where: [{ field: 'identifier', value: identifier }],
				}),
			).toBeNull()
		}
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'verification',
				where: [{ field: 'identifier', value: 'unrelated-verification' }],
			}),
		).not.toBeNull()
		const staleReset = await t.fetch('/api/auth/reset-password', {
			method: 'POST',
			headers: new Headers({
				'content-type': 'application/json',
				origin: 'https://auth.immifile.app',
			}),
			body: JSON.stringify({
				token: 'pre-delete-reset-token',
				newPassword: 'must-not-create-an-orphan-credential',
			}),
		})
		expect(staleReset.status).toBe(400)
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'account',
				where: [{ field: 'userId', value: signUp.user.id }],
			}),
		).toBeNull()

		const tombstone = await t.run((ctx) =>
			ctx.db
				.query('accountDeletionTombstones')
				.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
				.unique(),
		)
		expect(tombstone).toMatchObject({ ownerId })
		expect(tombstone!.completedAt).toEqual(expect.any(Number))
		expect(tombstone!.expiresAt - tombstone!.completedAt!).toBe(DELETION_TOMBSTONE_TTL_MS)
	})

	test('does not issue a deletion receipt when the server session is already gone', async () => {
		const t = newT()
		const headers = new Headers({
			'content-type': 'application/json',
			origin: 'https://auth.immifile.app',
		})
		const signUpResponse = await t.fetch('/api/auth/sign-up/email', {
			method: 'POST',
			headers,
			body: JSON.stringify({
				name: 'Expired Session Delete Test',
				email: 'expired-session-delete@example.com',
				password: PASSWORD,
			}),
		})
		const signUp = (await signUpResponse.json()) as { token: string; user: { id: string } }
		const ownerId = `${SITE_URL}|${signUp.user.id}`
		const preferenceId = await t.run((ctx) =>
			ctx.db.insert('ownerPreferences', {
				ownerId,
				key: 'must-survive-rejected-delete',
				value: true,
				updatedAt: Date.now(),
			}),
		)
		const session = (await t.query(components.betterAuth.adapter.findOne, {
			model: 'session',
			where: [{ field: 'token', value: signUp.token }],
		})) as { _id: string } | null
		const staleIdentity = t.withIdentity({
			subject: signUp.user.id,
			issuer: SITE_URL,
			tokenIdentifier: ownerId,
			sessionId: session!._id,
			isAnonymous: false,
		})

		const malformedAttemptId = 'not-a-uuid'
		await expect(
			staleIdentity.action(api.auth.deleteAccount, {
				attemptId: malformedAttemptId,
				proof: { kind: 'password', password: PASSWORD },
			}),
		).rejects.toThrow('The deletion request could not be verified')
		await expect(
			t.query(api.auth.getAccountDeletionStatus, { attemptId: malformedAttemptId }),
		).resolves.toEqual({ status: 'missing' })

		await t.mutation(components.betterAuth.adapter.deleteMany, {
			input: {
				model: 'session',
				where: [{ field: '_id', value: session!._id }],
			},
			paginationOpts: { numItems: 100, cursor: null },
		})
		const rejectedAttemptId = deletionAttemptId()
		await expect(
			staleIdentity.action(api.auth.deleteAccount, {
				attemptId: rejectedAttemptId,
				proof: { kind: 'password', password: PASSWORD },
			}),
		).rejects.toThrow('Not authenticated')
		await expect(
			t.query(api.auth.getAccountDeletionStatus, { attemptId: rejectedAttemptId }),
		).resolves.toEqual({ status: 'missing' })
		expect(await t.run((ctx) => ctx.db.get(preferenceId))).not.toBeNull()
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'user',
				where: [{ field: '_id', value: signUp.user.id }],
			}),
		).not.toBeNull()
	})

	test('rejects a JWT whose session belongs to a different Better Auth user before proof', async () => {
		const t = newT()
		async function signUp(name: string, email: string) {
			const response = await t.fetch('/api/auth/sign-up/email', {
				method: 'POST',
				headers: new Headers({
					'content-type': 'application/json',
					origin: 'https://auth.immifile.app',
				}),
				body: JSON.stringify({ name, email, password: PASSWORD }),
			})
			expect(response.status).toBe(200)
			return (await response.json()) as { token: string; user: { id: string } }
		}

		const subjectUser = await signUp('Forged Subject', 'forged-subject@example.com')
		const sessionOwner = await signUp('Session Owner', 'forged-session-owner@example.com')
		const foreignSession = (await t.query(components.betterAuth.adapter.findOne, {
			model: 'session',
			where: [{ field: 'token', value: sessionOwner.token }],
		})) as { _id: string } | null
		const ownerId = `${SITE_URL}|${subjectUser.user.id}`
		const preferenceId = await t.run((ctx) =>
			ctx.db.insert('ownerPreferences', {
				ownerId,
				key: 'forged-session-delete-must-not-run',
				value: true,
				updatedAt: Date.now(),
			}),
		)
		const rateLimitRowsBefore = await t.run((ctx) => ctx.db.query('authRateLimits').collect())
		const attemptId = deletionAttemptId()
		const forgedIdentity = t.withIdentity({
			subject: subjectUser.user.id,
			issuer: SITE_URL,
			tokenIdentifier: ownerId,
			sessionId: foreignSession!._id,
			isAnonymous: false,
		})

		await expect(
			forgedIdentity.action(api.auth.deleteAccount, {
				attemptId,
				proof: { kind: 'password', password: PASSWORD },
			}),
		).rejects.toThrow('Not authenticated')
		await expect(t.query(api.auth.getAccountDeletionStatus, { attemptId })).resolves.toEqual({
			status: 'missing',
		})
		expect(await t.run((ctx) => ctx.db.get(preferenceId))).not.toBeNull()
		expect(
			await t.run((ctx) =>
				ctx.db
					.query('accountDeletionTombstones')
					.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
					.unique(),
			),
		).toBeNull()
		expect(await t.run((ctx) => ctx.db.query('authRateLimits').collect())).toHaveLength(
			rateLimitRowsBefore.length,
		)
		for (const userId of [subjectUser.user.id, sessionOwner.user.id]) {
			expect(
				await t.query(components.betterAuth.adapter.findOne, {
					model: 'user',
					where: [{ field: '_id', value: userId }],
				}),
			).not.toBeNull()
		}
	})

	test('always revokes a token added before the final Apple snapshot even after manual fallback', async () => {
		for (const [key, value] of Object.entries(APPLE_TEST_ENV)) vi.stubEnv(key, value)
		const t = newT()
		const headers = new Headers({
			'content-type': 'application/json',
			origin: 'https://auth.immifile.app',
		})
		const signUpResponse = await t.fetch('/api/auth/sign-up/email', {
			method: 'POST',
			headers,
			body: JSON.stringify({
				name: 'Apple Snapshot Test',
				email: 'apple-final-snapshot@example.com',
				password: PASSWORD,
			}),
		})
		const signUp = (await signUpResponse.json()) as { token: string; user: { id: string } }
		const now = Date.now()
		for (const account of [
			{ accountId: 'apple-tokenless', providerId: 'apple' },
			{
				accountId: 'apple-first-token',
				providerId: 'apple',
				refreshToken: 'first-refresh-token',
			},
		]) {
			await t.mutation(components.betterAuth.adapter.create, {
				input: {
					model: 'account',
					data: {
						...account,
						userId: signUp.user.id,
						createdAt: now,
						updatedAt: now,
					},
				},
			})
		}

		const revokedTokens: string[] = []
		let insertedLateToken = false
		vi.stubGlobal(
			'fetch',
			vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
				expect(input.toString()).toBe('https://appleid.apple.com/auth/revoke')
				const token = new URLSearchParams(init?.body as string).get('token')
				expect(token).toBeTruthy()
				revokedTokens.push(token!)
				if (!insertedLateToken) {
					insertedLateToken = true
					await t.mutation(components.betterAuth.adapter.create, {
						input: {
							model: 'account',
							data: {
								accountId: 'apple-late-token',
								providerId: 'apple',
								userId: signUp.user.id,
								refreshToken: 'late-refresh-token',
								createdAt: Date.now(),
								updatedAt: Date.now(),
							},
						},
					})
				}
				return new Response(null, { status: 200 })
			}),
		)

		const session = (await t.query(components.betterAuth.adapter.findOne, {
			model: 'session',
			where: [{ field: 'token', value: signUp.token }],
		})) as { _id: string } | null
		const authenticated = t.withIdentity({
			subject: signUp.user.id,
			issuer: SITE_URL,
			tokenIdentifier: `${SITE_URL}|${signUp.user.id}`,
			sessionId: session!._id,
			isAnonymous: false,
		})
		await expect(
			authenticated.action(api.auth.deleteAccount, {
				attemptId: deletionAttemptId(),
				proof: { kind: 'password', password: PASSWORD },
			}),
		).resolves.toEqual({ appleManualRevokeRequired: true })
		expect(revokedTokens).toContain('first-refresh-token')
		expect(revokedTokens).toContain('late-refresh-token')
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'user',
				where: [{ field: '_id', value: signUp.user.id }],
			}),
		).toBeNull()
	})

	test('checkpoints recovery before work and completes on the next durable retry', async () => {
		const t = newT()
		const headers = new Headers({
			'content-type': 'application/json',
			origin: 'https://auth.immifile.app',
		})
		const signUpResponse = await t.fetch('/api/auth/sign-up/email', {
			method: 'POST',
			headers,
			body: JSON.stringify({
				name: 'Deletion Recovery Test',
				email: 'deletion-recovery@example.com',
				password: PASSWORD,
			}),
		})
		const signUp = (await signUpResponse.json()) as { user: { id: string } }
		const ownerId = `${SITE_URL}|${signUp.user.id}`
		const preferenceId = await t.run((ctx) =>
			ctx.db.insert('ownerPreferences', {
				ownerId,
				key: 'recovery-test',
				value: true,
				updatedAt: Date.now(),
			}),
		)
		await t.mutation(components.betterAuth.adapter.create, {
			input: {
				model: 'account',
				data: {
					accountId: 'recovery-apple-account',
					providerId: 'apple',
					userId: signUp.user.id,
					refreshToken: 'cannot-revoke-without-config',
					createdAt: Date.now(),
					updatedAt: Date.now(),
				},
			},
		})

		vi.useFakeTimers({ now: Date.now() })
		await t.mutation(internal.account.beginOwnerDeletion, {
			ownerId,
			authUserId: signUp.user.id,
		})
		vi.advanceTimersByTime(ACCOUNT_DELETION_RECOVERY_DELAY_MS)
		await t.finishInProgressScheduledFunctions()
		expect(await t.run((ctx) => ctx.db.get(preferenceId))).not.toBeNull()
		const pending = await t.run((ctx) =>
			ctx.db
				.query('accountDeletionTombstones')
				.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
				.unique(),
		)
		expect(pending).toMatchObject({ authUserId: signUp.user.id })
		expect(pending?.completedAt).toBeUndefined()

		// Remove the deliberately unrecoverable test token. The second recovery
		// must already exist even though the first action failed mid-completion.
		await t.mutation(components.betterAuth.adapter.deleteMany, {
			input: {
				model: 'account',
				where: [
					{ field: 'userId', value: signUp.user.id },
					{ field: 'providerId', value: 'apple' },
				],
			},
			paginationOpts: { numItems: 100, cursor: null },
		})
		vi.advanceTimersByTime(ACCOUNT_DELETION_RECOVERY_DELAY_MS)
		await t.finishInProgressScheduledFunctions()
		expect(await t.run((ctx) => ctx.db.get(preferenceId))).toBeNull()
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'user',
				where: [{ field: '_id', value: signUp.user.id }],
			}),
		).toBeNull()
		expect(
			await t.run((ctx) =>
				ctx.db
					.query('accountDeletionTombstones')
					.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
					.unique(),
			),
		).toMatchObject({ authUserId: signUp.user.id, completedAt: expect.any(Number) })
	})

	test('completed recovery sweeps late accounts, sessions, and verification rows', async () => {
		for (const [key, value] of Object.entries(APPLE_TEST_ENV)) vi.stubEnv(key, value)
		const revokedTokens: string[] = []
		vi.stubGlobal(
			'fetch',
			vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
				expect(input.toString()).toBe('https://appleid.apple.com/auth/revoke')
				revokedTokens.push(new URLSearchParams(init?.body as string).get('token')!)
				return new Response(null, { status: 200 })
			}),
		)
		const t = newT()
		const headers = new Headers({
			'content-type': 'application/json',
			origin: 'https://auth.immifile.app',
		})
		const signUpResponse = await t.fetch('/api/auth/sign-up/email', {
			method: 'POST',
			headers,
			body: JSON.stringify({
				name: 'Late Artifact Sweep',
				email: 'late-artifact-sweep@example.com',
				password: PASSWORD,
			}),
		})
		const signUp = (await signUpResponse.json()) as { token: string; user: { id: string } }
		const ownerId = `${SITE_URL}|${signUp.user.id}`
		const session = (await t.query(components.betterAuth.adapter.findOne, {
			model: 'session',
			where: [{ field: 'token', value: signUp.token }],
		})) as { _id: string } | null
		await t
			.withIdentity({
				subject: signUp.user.id,
				issuer: SITE_URL,
				tokenIdentifier: ownerId,
				sessionId: session!._id,
				isAnonymous: false,
			})
			.action(api.auth.deleteAccount, {
				attemptId: deletionAttemptId(),
				proof: { kind: 'password', password: PASSWORD },
			})

		const now = Date.now()
		await t.mutation(components.betterAuth.adapter.create, {
			input: {
				model: 'account',
				data: {
					accountId: 'late-apple-account',
					providerId: 'apple',
					userId: signUp.user.id,
					refreshToken: 'late-orphan-refresh-token',
					createdAt: now,
					updatedAt: now,
				},
			},
		})
		await t.mutation(components.betterAuth.adapter.create, {
			input: {
				model: 'session',
				data: {
					token: 'late-orphan-session-token',
					userId: signUp.user.id,
					expiresAt: now + 60_000,
					createdAt: now,
					updatedAt: now,
				},
			},
		})
		await t.mutation(components.betterAuth.adapter.create, {
			input: {
				model: 'verification',
				data: {
					identifier: 'late-orphan-link-state',
					value: JSON.stringify({ link: { userId: signUp.user.id } }),
					expiresAt: now + 60_000,
					createdAt: now,
					updatedAt: now,
				},
			},
		})

		await t.action(internal.auth.recoverAccountDeletion, {
			ownerId,
			authUserId: signUp.user.id,
		})
		expect(revokedTokens).toContain('late-orphan-refresh-token')
		for (const [model, field, value] of [
			['account', 'userId', signUp.user.id],
			['session', 'token', 'late-orphan-session-token'],
			['verification', 'identifier', 'late-orphan-link-state'],
		] as const) {
			expect(
				await t.query(components.betterAuth.adapter.findOne, {
					model,
					where: [{ field, value }],
				} as never),
			).toBeNull()
		}
		const tombstone = await t.run((ctx) =>
			ctx.db
				.query('accountDeletionTombstones')
				.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
				.unique(),
		)
		expect(tombstone?.lastAuthSweepAt).toEqual(expect.any(Number))
		expect(tombstone?.authCleanupGeneration).toBe(tombstone?.authCleanupCompletedGeneration)
	})

	test('limits attempted password deletion proofs to five per user session each minute', async () => {
		const t = newT()
		const headers = new Headers({
			'content-type': 'application/json',
			origin: 'https://auth.immifile.app',
		})
		const signUpResponse = await t.fetch('/api/auth/sign-up/email', {
			method: 'POST',
			headers,
			body: JSON.stringify({
				name: 'Rate Limited Delete Test',
				email: 'delete-rate-limit@example.com',
				password: PASSWORD,
			}),
		})
		expect(signUpResponse.status).toBe(200)
		const signUp = (await signUpResponse.json()) as {
			token: string
			user: { id: string }
		}
		const session = (await t.query(components.betterAuth.adapter.findOne, {
			model: 'session',
			where: [{ field: 'token', value: signUp.token }],
		})) as { _id: string } | null
		expect(session).not.toBeNull()
		const authenticated = t.withIdentity({
			subject: signUp.user.id,
			issuer: SITE_URL,
			tokenIdentifier: `${SITE_URL}|${signUp.user.id}`,
			sessionId: session!._id,
			isAnonymous: false,
		})

		for (let attempt = 0; attempt < 5; attempt += 1) {
			await expect(
				authenticated.action(api.auth.deleteAccount, {
					attemptId: deletionAttemptId(),
					proof: { kind: 'password', password: `wrong-${attempt}` },
				}),
			).rejects.toThrow('Account confirmation failed. Please try again')
		}
		await expect(
			authenticated.action(api.auth.deleteAccount, {
				attemptId: deletionAttemptId(),
				proof: { kind: 'password', password: PASSWORD },
			}),
		).rejects.toThrow('Account confirmation failed. Please wait and try again')

		const secondSignInResponse = await t.fetch('/api/auth/sign-in/email', {
			method: 'POST',
			headers,
			body: JSON.stringify({
				email: 'delete-rate-limit@example.com',
				password: PASSWORD,
			}),
		})
		expect(secondSignInResponse.status).toBe(200)
		const secondSignIn = (await secondSignInResponse.json()) as { token: string }
		const secondSession = (await t.query(components.betterAuth.adapter.findOne, {
			model: 'session',
			where: [{ field: 'token', value: secondSignIn.token }],
		})) as { _id: string } | null
		expect(secondSession).not.toBeNull()
		const secondAuthenticatedSession = t.withIdentity({
			subject: signUp.user.id,
			issuer: SITE_URL,
			tokenIdentifier: `${SITE_URL}|${signUp.user.id}`,
			sessionId: secondSession!._id,
			isAnonymous: false,
		})
		await expect(
			secondAuthenticatedSession.action(api.auth.deleteAccount, {
				attemptId: deletionAttemptId(),
				proof: { kind: 'password', password: 'still-wrong' },
			}),
		).rejects.toThrow('Account confirmation failed. Please try again')
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'user',
				where: [{ field: '_id', value: signUp.user.id }],
			}),
		).not.toBeNull()
	})

	test('blocks direct anonymous auth deletion and atomically purges through the action', async () => {
		const t = newT()
		const headers = new Headers({
			'content-type': 'application/json',
			origin: 'https://auth.immifile.app',
		})
		const signInResponse = await t.fetch('/api/auth/sign-in/anonymous', {
			method: 'POST',
			headers,
		})
		expect(signInResponse.status).toBe(200)
		setCookieToHeader(headers)({ response: signInResponse })
		const anonymous = (await signInResponse.json()) as {
			token: string
			user: { id: string }
		}
		const ownerId = `${SITE_URL}|${anonymous.user.id}`
		const preferenceId = await t.run((ctx) =>
			ctx.db.insert('ownerPreferences', {
				ownerId,
				key: 'anonymous-delete-integration-test',
				value: true,
				updatedAt: Date.now(),
			}),
		)

		const blocked = await t.fetch('/api/auth/delete-anonymous-user', {
			method: 'POST',
			headers,
		})
		expect(blocked.status).toBe(404)
		expect(await t.run((ctx) => ctx.db.get(preferenceId))).not.toBeNull()
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'user',
				where: [{ field: '_id', value: anonymous.user.id }],
			}),
		).not.toBeNull()

		const session = (await t.query(components.betterAuth.adapter.findOne, {
			model: 'session',
			where: [{ field: 'token', value: anonymous.token }],
		})) as { _id: string } | null
		expect(session).not.toBeNull()
		const authenticated = t.withIdentity({
			subject: anonymous.user.id,
			issuer: SITE_URL,
			tokenIdentifier: ownerId,
			sessionId: session!._id,
			isAnonymous: true,
		})
		await expect(
			authenticated.action(api.auth.deleteAccount, {
				attemptId: deletionAttemptId(),
				proof: { kind: 'anonymous' },
			}),
		).resolves.toEqual({ appleManualRevokeRequired: false })
		expect(await t.run((ctx) => ctx.db.get(preferenceId))).toBeNull()
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'user',
				where: [{ field: '_id', value: anonymous.user.id }],
			}),
		).toBeNull()
		expect(
			await t.run((ctx) =>
				ctx.db
					.query('accountDeletionTombstones')
					.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
					.unique(),
			),
		).toMatchObject({ ownerId })
	})

	test('keeps anonymous-to-permanent cleanup while the public plugin delete is disabled', async () => {
		const t = newT()
		const headers = new Headers({
			'content-type': 'application/json',
			origin: 'https://auth.immifile.app',
		})
		const anonymousResponse = await t.fetch('/api/auth/sign-in/anonymous', {
			method: 'POST',
			headers,
		})
		expect(anonymousResponse.status).toBe(200)
		setCookieToHeader(headers)({ response: anonymousResponse })
		const anonymous = (await anonymousResponse.json()) as {
			token: string
			user: { id: string }
		}
		const preferenceId = await t.run((ctx) =>
			ctx.db.insert('ownerPreferences', {
				ownerId: `${SITE_URL}|${anonymous.user.id}`,
				key: 'anonymous-upgrade-integration-test',
				value: true,
				updatedAt: Date.now(),
			}),
		)

		const upgradeResponse = await t.fetch('/api/auth/sign-up/email', {
			method: 'POST',
			headers,
			body: JSON.stringify({
				name: 'Upgraded User',
				email: 'anonymous-upgrade@example.com',
				password: PASSWORD,
			}),
		})
		expect(upgradeResponse.status).toBe(200)
		const upgraded = (await upgradeResponse.json()) as { user: { id: string } }
		expect(upgraded.user.id).not.toBe(anonymous.user.id)
		expect(await t.run((ctx) => ctx.db.get(preferenceId))).toMatchObject({
			ownerId: `${SITE_URL}|${upgraded.user.id}`,
		})
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'user',
				where: [{ field: '_id', value: anonymous.user.id }],
			}),
		).toBeNull()
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'session',
				where: [{ field: 'token', value: anonymous.token }],
			}),
		).toBeNull()
	})

	test('allows link-social only for an existing provider deletion challenge', async () => {
		vi.stubEnv('GOOGLE_CLIENT_ID', 'google-client-id')
		vi.stubEnv('GOOGLE_CLIENT_SECRET', 'google-client-secret')
		const t = newT()
		const headers = new Headers({
			'content-type': 'application/json',
			origin: 'https://auth.immifile.app',
		})
		const signUpResponse = await t.fetch('/api/auth/sign-up/email', {
			method: 'POST',
			headers,
			body: JSON.stringify({
				name: 'Link Bootstrap Test',
				email: 'link-bootstrap@example.com',
				password: PASSWORD,
			}),
		})
		expect(signUpResponse.status).toBe(200)
		setCookieToHeader(headers)({ response: signUpResponse })
		const signUp = (await signUpResponse.json()) as { token: string; user: { id: string } }

		const bootstrap = await t.fetch('/api/auth/link-social', {
			method: 'POST',
			headers,
			body: JSON.stringify({ provider: 'google', callbackURL: '/' }),
		})
		expect(bootstrap.status).toBe(403)
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'account',
				where: [
					{ field: 'userId', value: signUp.user.id },
					{ field: 'providerId', value: 'google' },
				],
			}),
		).toBeNull()

		const session = (await t.query(components.betterAuth.adapter.findOne, {
			model: 'session',
			where: [{ field: 'token', value: signUp.token }],
		})) as { _id: string } | null
		const authenticated = t.withIdentity({
			subject: signUp.user.id,
			issuer: SITE_URL,
			tokenIdentifier: `${SITE_URL}|${signUp.user.id}`,
			sessionId: session!._id,
			isAnonymous: false,
		})
		await expect(
			authenticated.action(api.auth.beginSocialAccountDeletion, { provider: 'google' }),
		).rejects.toThrow('not linked')
	})

	test('rejects inline idToken link-social even with a valid deletion challenge', async () => {
		vi.stubEnv('GOOGLE_CLIENT_ID', 'google-client-id')
		vi.stubEnv('GOOGLE_CLIENT_SECRET', 'google-client-secret')
		const t = newT()
		const email = 'link-id-token@example.com'
		const headers = new Headers({
			'content-type': 'application/json',
			origin: 'https://auth.immifile.app',
		})
		const signUpResponse = await t.fetch('/api/auth/sign-up/email', {
			method: 'POST',
			headers,
			body: JSON.stringify({ name: 'Inline Token Test', email, password: PASSWORD }),
		})
		setCookieToHeader(headers)({ response: signUpResponse })
		const signUp = (await signUpResponse.json()) as { token: string; user: { id: string } }
		const now = Date.now()
		await t.mutation(components.betterAuth.adapter.create, {
			input: {
				model: 'account',
				data: {
					accountId: 'original-inline-google-sub',
					providerId: 'google',
					userId: signUp.user.id,
					createdAt: now,
					updatedAt: now,
				},
			},
		})
		const session = (await t.query(components.betterAuth.adapter.findOne, {
			model: 'session',
			where: [{ field: 'token', value: signUp.token }],
		})) as { _id: string } | null
		const authenticated = t.withIdentity({
			subject: signUp.user.id,
			issuer: SITE_URL,
			tokenIdentifier: `${SITE_URL}|${signUp.user.id}`,
			sessionId: session!._id,
			isAnonymous: false,
		})
		const { challenge } = await authenticated.action(api.auth.beginSocialAccountDeletion, {
			provider: 'google',
		})
		const response = await t.fetch('/api/auth/link-social', {
			method: 'POST',
			headers,
			body: JSON.stringify({
				provider: 'google',
				callbackURL: '/',
				idToken: {
					token: new UnsecuredJWT({ sub: 'foreign-inline-google-sub', email }).encode(),
				},
				additionalData: { immifileAccountDeletionChallenge: challenge },
			}),
		})
		expect(response.status).toBe(403)
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'account',
				where: [
					{ field: 'providerId', value: 'google' },
					{ field: 'accountId', value: 'foreign-inline-google-sub' },
				],
			}),
		).toBeNull()
	})

	test('wrong social chooser account neither proves deletion nor remains linked', async () => {
		vi.stubEnv('GOOGLE_CLIENT_ID', 'google-client-id')
		vi.stubEnv('GOOGLE_CLIENT_SECRET', 'google-client-secret')
		const t = newT()
		const email = 'social-delete-chooser@example.com'
		const headers = new Headers({
			'content-type': 'application/json',
			origin: 'https://auth.immifile.app',
		})
		const signUpResponse = await t.fetch('/api/auth/sign-up/email', {
			method: 'POST',
			headers,
			body: JSON.stringify({ name: 'Social Delete Test', email, password: PASSWORD }),
		})
		expect(signUpResponse.status).toBe(200)
		setCookieToHeader(headers)({ response: signUpResponse })
		const signUp = (await signUpResponse.json()) as {
			token: string
			user: { id: string }
		}
		const session = (await t.query(components.betterAuth.adapter.findOne, {
			model: 'session',
			where: [{ field: 'token', value: signUp.token }],
		})) as { _id: string } | null
		expect(session).not.toBeNull()
		const now = Date.now()
		await t.mutation(components.betterAuth.adapter.create, {
			input: {
				model: 'account',
				data: {
					accountId: 'original-google-sub',
					providerId: 'google',
					userId: signUp.user.id,
					createdAt: now,
					updatedAt: now,
					accessToken: 'original-access-token',
					refreshToken: 'original-refresh-token',
				},
			},
		})

		const authenticated = t.withIdentity({
			subject: signUp.user.id,
			issuer: SITE_URL,
			tokenIdentifier: `${SITE_URL}|${signUp.user.id}`,
			sessionId: session!._id,
			isAnonymous: false,
		})
		const { challenge } = await authenticated.action(api.auth.beginSocialAccountDeletion, {
			provider: 'google',
		})
		const linkResponse = await t.fetch('/api/auth/link-social', {
			method: 'POST',
			headers,
			body: JSON.stringify({
				provider: 'google',
				callbackURL: 'https://auth.immifile.app/',
				additionalData: { immifileAccountDeletionChallenge: challenge },
			}),
		})
		expect(linkResponse.status).toBe(200)
		setCookieToHeader(headers)({ response: linkResponse })
		const link = (await linkResponse.json()) as { url: string }
		const state = new URL(link.url).searchParams.get('state')
		expect(state).toBeTruthy()

		const foreignIdToken = new UnsecuredJWT({
			sub: 'foreign-google-sub',
			email,
			email_verified: true,
			name: 'Wrong Chooser Account',
		}).encode()
		vi.stubGlobal(
			'fetch',
			vi.fn(async (input: RequestInfo | URL) => {
				if (input.toString() !== 'https://oauth2.googleapis.com/token') {
					throw new Error(`Unexpected OAuth request: ${input.toString()}`)
				}
				return new Response(
					JSON.stringify({
						token_type: 'Bearer',
						access_token: 'foreign-access-token',
						refresh_token: 'foreign-refresh-token',
						expires_in: 3_600,
						id_token: foreignIdToken,
					}),
					{ status: 200, headers: { 'content-type': 'application/json' } },
				)
			}),
		)
		const callbackResponse = await t.fetch(
			`/api/auth/callback/google?code=foreign-code&state=${encodeURIComponent(state!)}`,
			{ method: 'GET', headers },
		)
		expect(callbackResponse.status).toBeGreaterThanOrEqual(300)
		expect(callbackResponse.status).toBeLessThan(400)
		expect(callbackResponse.headers.get('location')).toContain('unable_to_link_account')

		// A signed OAuth state can outlive its deletion challenge (for example,
		// when two browser flows were started and one action consumed the proof).
		// Such a callback must remain deletion-marked and fail closed rather than
		// falling back to Better Auth's ordinary account-create path.
		const secondLinkResponse = await t.fetch('/api/auth/link-social', {
			method: 'POST',
			headers,
			body: JSON.stringify({
				provider: 'google',
				callbackURL: 'https://auth.immifile.app/',
				additionalData: { immifileAccountDeletionChallenge: challenge },
			}),
		})
		expect(secondLinkResponse.status).toBe(200)
		setCookieToHeader(headers)({ response: secondLinkResponse })
		const secondLink = (await secondLinkResponse.json()) as { url: string }
		const secondState = new URL(secondLink.url).searchParams.get('state')
		expect(secondState).toBeTruthy()
		await t.mutation(components.betterAuth.adapter.deleteMany, {
			input: {
				model: 'verification',
				where: [{ field: 'identifier', value: challenge }],
			},
			paginationOpts: { numItems: 100, cursor: null },
		})
		const missingChallengeCallback = await t.fetch(
			`/api/auth/callback/google?code=missing-challenge-code&state=${encodeURIComponent(secondState!)}`,
			{ method: 'GET', headers },
		)
		expect(missingChallengeCallback.status).toBeGreaterThanOrEqual(300)
		expect(missingChallengeCallback.status).toBeLessThan(400)
		expect(missingChallengeCallback.headers.get('location')).toContain('unable_to_link_account')

		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'account',
				where: [
					{ field: 'providerId', value: 'google' },
					{ field: 'accountId', value: 'foreign-google-sub' },
				],
			}),
		).toBeNull()
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'account',
				where: [
					{ field: 'providerId', value: 'google' },
					{ field: 'accountId', value: 'original-google-sub' },
				],
			}),
		).toMatchObject({ userId: signUp.user.id, accessToken: 'original-access-token' })
		await expect(
			authenticated.action(api.auth.deleteAccount, {
				attemptId: deletionAttemptId(),
				proof: { kind: 'social', challenge },
			}),
		).rejects.toThrow('Sign-in confirmation was not completed')
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'user',
				where: [{ field: '_id', value: signUp.user.id }],
			}),
		).not.toBeNull()
	})

	test('exact original social account callback proves and completes deletion', async () => {
		vi.stubEnv('GOOGLE_CLIENT_ID', 'google-client-id')
		vi.stubEnv('GOOGLE_CLIENT_SECRET', 'google-client-secret')
		const t = newT()
		const email = 'social-delete-exact@example.com'
		const headers = new Headers({
			'content-type': 'application/json',
			origin: 'https://auth.immifile.app',
		})
		const signUpResponse = await t.fetch('/api/auth/sign-up/email', {
			method: 'POST',
			headers,
			body: JSON.stringify({ name: 'Exact Social Delete', email, password: PASSWORD }),
		})
		expect(signUpResponse.status).toBe(200)
		setCookieToHeader(headers)({ response: signUpResponse })
		const signUp = (await signUpResponse.json()) as {
			token: string
			user: { id: string }
		}
		const session = (await t.query(components.betterAuth.adapter.findOne, {
			model: 'session',
			where: [{ field: 'token', value: signUp.token }],
		})) as { _id: string } | null
		expect(session).not.toBeNull()
		const now = Date.now()
		await t.mutation(components.betterAuth.adapter.create, {
			input: {
				model: 'account',
				data: {
					accountId: 'exact-google-sub',
					providerId: 'google',
					userId: signUp.user.id,
					createdAt: now - 1_000,
					updatedAt: now - 1_000,
					accessToken: 'old-access-token',
					refreshToken: 'old-refresh-token',
				},
			},
		})
		const ownerId = `${SITE_URL}|${signUp.user.id}`
		const preferenceId = await t.run((ctx) =>
			ctx.db.insert('ownerPreferences', {
				ownerId,
				key: 'exact-social-delete',
				value: true,
				updatedAt: now,
			}),
		)
		const authenticated = t.withIdentity({
			subject: signUp.user.id,
			issuer: SITE_URL,
			tokenIdentifier: ownerId,
			sessionId: session!._id,
			isAnonymous: false,
		})
		const { challenge } = await authenticated.action(api.auth.beginSocialAccountDeletion, {
			provider: 'google',
		})
		const linkResponse = await t.fetch('/api/auth/link-social', {
			method: 'POST',
			headers,
			body: JSON.stringify({
				provider: 'google',
				callbackURL: 'https://auth.immifile.app/',
				additionalData: { immifileAccountDeletionChallenge: challenge },
			}),
		})
		expect(linkResponse.status).toBe(200)
		setCookieToHeader(headers)({ response: linkResponse })
		const link = (await linkResponse.json()) as { url: string }
		const state = new URL(link.url).searchParams.get('state')
		expect(state).toBeTruthy()

		const idToken = new UnsecuredJWT({
			sub: 'exact-google-sub',
			email,
			email_verified: true,
			name: 'Exact Social Delete',
		}).encode()
		vi.stubGlobal(
			'fetch',
			vi.fn(async (input: RequestInfo | URL) => {
				if (input.toString() !== 'https://oauth2.googleapis.com/token') {
					throw new Error(`Unexpected OAuth request: ${input.toString()}`)
				}
				return new Response(
					JSON.stringify({
						token_type: 'Bearer',
						access_token: 'new-access-token',
						refresh_token: 'new-refresh-token',
						expires_in: 3_600,
						id_token: idToken,
					}),
					{ status: 200, headers: { 'content-type': 'application/json' } },
				)
			}),
		)
		const callbackResponse = await t.fetch(
			`/api/auth/callback/google?code=exact-code&state=${encodeURIComponent(state!)}`,
			{ method: 'GET', headers },
		)
		expect(callbackResponse.status).toBeGreaterThanOrEqual(300)
		expect(callbackResponse.status).toBeLessThan(400)
		expect(callbackResponse.headers.get('location')).not.toContain('error')

		await expect(
			authenticated.action(api.auth.deleteAccount, {
				attemptId: deletionAttemptId(),
				proof: { kind: 'social', challenge },
			}),
		).resolves.toEqual({ appleManualRevokeRequired: false })
		expect(await t.run((ctx) => ctx.db.get(preferenceId))).toBeNull()
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'user',
				where: [{ field: '_id', value: signUp.user.id }],
			}),
		).toBeNull()
		expect(
			await t.run((ctx) =>
				ctx.db
					.query('accountDeletionTombstones')
					.withIndex('by_ownerId', (q) => q.eq('ownerId', ownerId))
					.unique(),
			),
		).toMatchObject({ ownerId })
	})

	test('ordinary same-email Apple sign-in cannot implicitly link a credential account', async () => {
		for (const [key, value] of Object.entries(APPLE_TEST_ENV)) vi.stubEnv(key, value)
		const t = newT()
		const email = 'implicit-apple-link@example.com'
		const signUpResponse = await t.fetch('/api/auth/sign-up/email', {
			method: 'POST',
			headers: new Headers({
				'content-type': 'application/json',
				origin: 'https://auth.immifile.app',
			}),
			body: JSON.stringify({ name: 'Implicit Link Guard', email, password: PASSWORD }),
		})
		const signUp = (await signUpResponse.json()) as { user: { id: string } }
		// Make local verification true so this regression specifically exercises
		// disableImplicitLinking rather than Better Auth's separate local-email gate.
		await t.mutation(components.betterAuth.adapter.updateOne, {
			input: {
				model: 'user',
				update: { emailVerified: true },
				where: [{ field: '_id', value: signUp.user.id }],
			},
		})

		const socialHeaders = new Headers({
			'content-type': 'application/json',
			origin: 'https://auth.immifile.app',
		})
		const socialResponse = await t.fetch('/api/auth/sign-in/social', {
			method: 'POST',
			headers: socialHeaders,
			body: JSON.stringify({
				provider: 'apple',
				callbackURL: 'https://auth.immifile.app/',
			}),
		})
		expect(socialResponse.status).toBe(200)
		setCookieToHeader(socialHeaders)({ response: socialResponse })
		const social = (await socialResponse.json()) as { url: string }
		const state = new URL(social.url).searchParams.get('state')
		expect(state).toBeTruthy()

		const sameEmailIdToken = new UnsecuredJWT({
			sub: 'unlinked-same-email-apple-sub',
			email,
			email_verified: true,
			name: 'Different Apple Identity',
		}).encode()
		vi.stubGlobal(
			'fetch',
			vi.fn(async (input: RequestInfo | URL) => {
				if (input.toString() !== 'https://appleid.apple.com/auth/token') {
					throw new Error(`Unexpected Apple request: ${input.toString()}`)
				}
				return new Response(
					JSON.stringify({
						token_type: 'Bearer',
						access_token: 'implicit-link-access-token',
						refresh_token: 'implicit-link-refresh-token',
						expires_in: 3_600,
						id_token: sameEmailIdToken,
					}),
					{ status: 200, headers: { 'content-type': 'application/json' } },
				)
			}),
		)
		const callbackHeaders = new Headers({
			'content-type': 'application/x-www-form-urlencoded',
		})
		const cookie = socialHeaders.get('cookie')
		if (cookie) callbackHeaders.set('cookie', cookie)
		const formPostResponse = await t.fetch('/api/auth/callback/apple', {
			method: 'POST',
			headers: callbackHeaders,
			body: new URLSearchParams({ code: 'implicit-link-code', state: state! }).toString(),
		})
		setCookieToHeader(socialHeaders)({ response: formPostResponse })
		const normalizedCallback = new URL(formPostResponse.headers.get('location')!)
		const callbackResponse = await t.fetch(
			`${normalizedCallback.pathname}${normalizedCallback.search}`,
			{ method: 'GET', headers: socialHeaders },
		)
		expect(callbackResponse.status).toBeGreaterThanOrEqual(300)
		expect(callbackResponse.status).toBeLessThan(400)
		expect(callbackResponse.headers.get('location')).toContain('account_not_linked')
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'account',
				where: [
					{ field: 'providerId', value: 'apple' },
					{ field: 'accountId', value: 'unlinked-same-email-apple-sub' },
				],
			}),
		).toBeNull()
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'user',
				where: [{ field: '_id', value: signUp.user.id }],
			}),
		).not.toBeNull()
	})

	test('Apple repeat callback proves deletion when managed Apple reports email unverified', async () => {
		for (const [key, value] of Object.entries(APPLE_TEST_ENV)) vi.stubEnv(key, value)
		const t = newT()
		const email = 'real-first-login-email@example.com'
		const headers = new Headers({
			'content-type': 'application/json',
			origin: 'https://auth.immifile.app',
		})
		const signUpResponse = await t.fetch('/api/auth/sign-up/email', {
			method: 'POST',
			headers,
			body: JSON.stringify({ name: 'Apple Repeat Test', email, password: PASSWORD }),
		})
		setCookieToHeader(headers)({ response: signUpResponse })
		const signUp = (await signUpResponse.json()) as { token: string; user: { id: string } }
		const now = Date.now()
		await t.mutation(components.betterAuth.adapter.create, {
			input: {
				model: 'account',
				data: {
					accountId: 'stable-repeat-apple-sub',
					providerId: 'apple',
					userId: signUp.user.id,
					refreshToken: 'old-apple-refresh-token',
					createdAt: now - 1_000,
					updatedAt: now - 1_000,
				},
			},
		})
		const session = (await t.query(components.betterAuth.adapter.findOne, {
			model: 'session',
			where: [{ field: 'token', value: signUp.token }],
		})) as { _id: string } | null
		const ownerId = `${SITE_URL}|${signUp.user.id}`
		const authenticated = t.withIdentity({
			subject: signUp.user.id,
			issuer: SITE_URL,
			tokenIdentifier: ownerId,
			sessionId: session!._id,
			isAnonymous: false,
		})
		const { challenge } = await authenticated.action(api.auth.beginSocialAccountDeletion, {
			provider: 'apple',
		})
		const linkResponse = await t.fetch('/api/auth/link-social', {
			method: 'POST',
			headers,
			body: JSON.stringify({
				provider: 'apple',
				callbackURL: 'https://auth.immifile.app/',
				additionalData: { immifileAccountDeletionChallenge: challenge },
			}),
		})
		expect(linkResponse.status).toBe(200)
		setCookieToHeader(headers)({ response: linkResponse })
		const link = (await linkResponse.json()) as { url: string }
		const state = new URL(link.url).searchParams.get('state')
		expect(state).toBeTruthy()

		const repeatIdToken = new UnsecuredJWT({
			sub: 'stable-repeat-apple-sub',
			email_verified: false,
			name: 'Apple Repeat Test',
		}).encode()
		const revokedTokens: string[] = []
		vi.stubGlobal(
			'fetch',
			vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
				if (input.toString() === 'https://appleid.apple.com/auth/token') {
					return new Response(
						JSON.stringify({
							token_type: 'Bearer',
							access_token: 'repeat-apple-access-token',
							refresh_token: 'repeat-apple-refresh-token',
							expires_in: 3_600,
							id_token: repeatIdToken,
						}),
						{ status: 200, headers: { 'content-type': 'application/json' } },
					)
				}
				if (input.toString() === 'https://appleid.apple.com/auth/revoke') {
					revokedTokens.push(new URLSearchParams(init?.body as string).get('token')!)
					return new Response(null, { status: 200 })
				}
				throw new Error(`Unexpected Apple request: ${input.toString()}`)
			}),
		)
		const callbackHeaders = new Headers({
			'content-type': 'application/x-www-form-urlencoded',
		})
		const cookie = headers.get('cookie')
		if (cookie) callbackHeaders.set('cookie', cookie)
		const formPostResponse = await t.fetch('/api/auth/callback/apple', {
			method: 'POST',
			headers: callbackHeaders,
			body: new URLSearchParams({ code: 'repeat-apple-code', state: state! }).toString(),
		})
		expect(formPostResponse.status).toBeGreaterThanOrEqual(300)
		expect(formPostResponse.status).toBeLessThan(400)
		setCookieToHeader(headers)({ response: formPostResponse })
		const normalizedCallback = new URL(formPostResponse.headers.get('location')!)
		const callbackResponse = await t.fetch(
			`${normalizedCallback.pathname}${normalizedCallback.search}`,
			{ method: 'GET', headers },
		)
		expect(callbackResponse.status).toBeGreaterThanOrEqual(300)
		expect(callbackResponse.status).toBeLessThan(400)
		expect(callbackResponse.headers.get('location')).toBe('https://auth.immifile.app/')
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'account',
				where: [
					{ field: 'providerId', value: 'apple' },
					{ field: 'accountId', value: 'stable-repeat-apple-sub' },
				],
			}),
		).toMatchObject({
			userId: signUp.user.id,
			refreshToken: 'repeat-apple-refresh-token',
		})

		await expect(
			authenticated.action(api.auth.deleteAccount, {
				attemptId: deletionAttemptId(),
				proof: { kind: 'social', challenge },
			}),
		).resolves.toEqual({ appleManualRevokeRequired: false })
		expect(revokedTokens).toContain('repeat-apple-refresh-token')
		expect(
			await t.query(components.betterAuth.adapter.findOne, {
				model: 'user',
				where: [{ field: '_id', value: signUp.user.id }],
			}),
		).toBeNull()
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
