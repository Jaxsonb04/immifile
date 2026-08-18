const REQUIRED_ENVIRONMENT = [
	'EXPO_PUBLIC_CONVEX_URL',
	'EXPO_PUBLIC_CONVEX_SITE_URL',
	'EXPO_PUBLIC_AUTH_SITE_URL',
	'EXPO_PUBLIC_PRIVACY_URL',
	'EXPO_PUBLIC_SUPPORT_URL',
	'EXPO_PUBLIC_SUPPORT_EMAIL',
]

function fail(message) {
	throw new Error(`Production readiness: ${message}`)
}

function required(name) {
	const value = process.env[name]?.trim()
	if (!value) fail(`${name} is missing`)
	return value
}

function publicHttpsUrl(name) {
	const value = required(name)
	let url
	try {
		url = new URL(value)
	} catch {
		fail(`${name} is not a valid URL`)
	}
	if (url.protocol !== 'https:' || url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
		fail(`${name} must be a public HTTPS URL`)
	}
	return url
}

async function fetchOk(label, url, options) {
	let response
	try {
		response = await fetch(url, {
			redirect: 'follow',
			signal: AbortSignal.timeout(15_000),
			...options,
		})
	} catch (error) {
		fail(
			`${label} could not be reached (${error instanceof Error ? error.message : 'network error'})`,
		)
	}
	if (!response.ok) fail(`${label} returned HTTP ${response.status}`)
	console.log(`✓ ${label}: HTTP ${response.status}`)
	return response
}

for (const name of REQUIRED_ENVIRONMENT) required(name)

const convexUrl = publicHttpsUrl('EXPO_PUBLIC_CONVEX_URL')
const convexSiteUrl = publicHttpsUrl('EXPO_PUBLIC_CONVEX_SITE_URL')
const authSiteUrl = publicHttpsUrl('EXPO_PUBLIC_AUTH_SITE_URL')
const privacyUrl = publicHttpsUrl('EXPO_PUBLIC_PRIVACY_URL')
const supportUrl = publicHttpsUrl('EXPO_PUBLIC_SUPPORT_URL')
const supportEmail = required('EXPO_PUBLIC_SUPPORT_EMAIL')

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportEmail)) {
	fail('EXPO_PUBLIC_SUPPORT_EMAIL is not a valid email address')
}
if (process.env.IMMIFILE_PRODUCTION_BACKEND_CONFIRMED !== 'true') {
	fail('IMMIFILE_PRODUCTION_BACKEND_CONFIRMED must be true')
}

console.log(`✓ Convex client URL configured for ${convexUrl.hostname}`)
console.log(`✓ Convex site URL configured for ${convexSiteUrl.hostname}`)

const discovery = await fetchOk(
	'Convex authentication discovery',
	new URL('/.well-known/openid-configuration', authSiteUrl),
)
const discoveryBody = await discovery.json()
if (
	typeof discoveryBody !== 'object' ||
	discoveryBody === null ||
	typeof discoveryBody.issuer !== 'string' ||
	typeof discoveryBody.jwks_uri !== 'string'
) {
	fail('authentication discovery response is missing issuer or jwks_uri')
}
await fetchOk('Convex authentication keys', discoveryBody.jwks_uri)

await fetchOk('Better Auth session endpoint', new URL('/api/auth/get-session', authSiteUrl), {
	headers: { accept: 'application/json' },
})

const privacy = await fetchOk('Public privacy policy', privacyUrl)
const privacyBody = (await privacy.text()).toLowerCase()
if (!privacyBody.includes('immifile') || !privacyBody.includes('privacy')) {
	fail('public privacy page does not contain the expected Immifile privacy content')
}
if (
	!privacyBody.includes('openai') ||
	!privacyBody.includes('up to 30 days') ||
	(!privacyBody.includes('abuse-monitoring') && !privacyBody.includes('abuse monitoring'))
) {
	fail('public privacy page does not disclose OpenAI abuse-monitoring retention')
}

const support = await fetchOk('Public support page', supportUrl)
const supportBody = (await support.text()).toLowerCase()
if (!supportBody.includes('immifile') || !supportBody.includes(supportEmail.toLowerCase())) {
	fail('public support page does not contain the expected Immifile name and support email')
}

console.log('Production endpoints and public release pages passed readiness checks.')
