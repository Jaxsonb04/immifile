import { describe, expect, test } from 'vitest'
import { trustedAuthOrigins } from './authOrigins'

describe('Better Auth origin policy', () => {
	test('trusts an Expo Go origin only on a request marked by the Expo client', () => {
		const expoOrigin = 'exp://10.0.0.215:8081'
		const expoRequest = new Request('https://auth.immifile.app/api/auth/sign-up/email', {
			headers: { 'expo-origin': expoOrigin },
		})
		const ordinaryRequest = new Request('https://auth.immifile.app/api/auth/sign-up/email')

		expect(trustedAuthOrigins(expoRequest, true)).toContain(expoOrigin)
		expect(trustedAuthOrigins(ordinaryRequest, true)).not.toContain(expoOrigin)
	})

	test('never trusts the Expo client header unless the deployment opted in', () => {
		const expoOrigin = 'exp://10.0.0.215:8081'
		const request = new Request('https://auth.immifile.app/api/auth/sign-up/email', {
			headers: { 'expo-origin': expoOrigin },
		})

		expect(trustedAuthOrigins(request)).not.toContain(expoOrigin)
		expect(trustedAuthOrigins(request, false)).not.toContain(expoOrigin)
	})

	test.each([
		'https://untrusted.example.com',
		'immigrationrenewalhelp://attacker',
		'exp://10.0.0.215:8081/unexpected-path',
		'exp://10.0.0.215:8081?unexpected=query',
		'exp://10.0.0.215',
	])('does not trust a malformed Expo client origin: %s', (expoOrigin) => {
		const request = new Request('https://auth.immifile.app/api/auth/sign-up/email', {
			headers: { 'expo-origin': expoOrigin },
		})

		expect(trustedAuthOrigins(request, true)).not.toContain(expoOrigin)
	})
})
