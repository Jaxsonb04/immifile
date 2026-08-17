import { readFileSync } from 'node:fs'

const app = JSON.parse(readFileSync(new URL('../app.json', import.meta.url), 'utf8')).expo
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const heroUiNativePro = JSON.parse(
	readFileSync(
		new URL('../vendor/heroui-native-pro-runtime/package.json', import.meta.url),
		'utf8',
	),
)
const eas = JSON.parse(readFileSync(new URL('../eas.json', import.meta.url), 'utf8'))
const bunLock = readFileSync(new URL('../bun.lock', import.meta.url), 'utf8')
const policy = JSON.parse(readFileSync(new URL('../release-policy.json', import.meta.url), 'utf8'))
const privacyPolicy = readFileSync(new URL('../docs/PRIVACY_POLICY.md', import.meta.url), 'utf8')
const assistantConsentCopy = readFileSync(
	new URL('../src/screens/assistant/assistant-consent-copy.ts', import.meta.url),
	'utf8',
)
const openAIChatClient = readFileSync(
	new URL('../convex/lib/openaiChat.ts', import.meta.url),
	'utf8',
)

function assert(condition, message) {
	if (!condition) throw new Error(`Release config: ${message}`)
}

function isConfigured(value) {
	return Boolean(value) && !/REQUIRED/i.test(value)
}

assert(app.version === '1.0.0', 'set an explicit public version')
assert(
	eas.cli?.appVersionSource === 'remote',
	'EAS must own the build number (cli.appVersionSource must be "remote")',
)
assert(
	app.ios?.buildNumber === undefined,
	'ios.buildNumber is ignored under remote versioning — remove it so the remote value stays the single source of truth',
)
assert(Number.isInteger(app.android?.versionCode), 'android.versionCode must be an integer')
assert(Boolean(app.ios?.bundleIdentifier), 'ios.bundleIdentifier is required')
// iPhone-only for the first release. Turning iPad support on makes a 13-inch
// iPad screenshot set mandatory in App Store Connect and puts a portrait-only
// layout in front of a reviewer in iPad landscape, so it is a deliberate
// decision with QA attached — not a flag to flip back quietly.
assert(
	app.ios?.supportsTablet === false,
	'ios.supportsTablet must stay false until iPad is QAd and 13-inch screenshots exist',
)
assert(app.ios?.config?.usesNonExemptEncryption === false, 'declare standard/exempt encryption use')
assert(app.extra?.router?.sitemap === false, 'Expo Router sitemap must be disabled')
const collectedDataTypes = app.ios?.privacyManifests?.NSPrivacyCollectedDataTypes ?? []
const expectedCollectedDataTypes = [
	'NSPrivacyCollectedDataTypeName',
	'NSPrivacyCollectedDataTypeEmailAddress',
	'NSPrivacyCollectedDataTypeUserID',
	'NSPrivacyCollectedDataTypeOtherUserContent',
	'NSPrivacyCollectedDataTypeProductInteraction',
	'NSPrivacyCollectedDataTypeOtherDataTypes',
]
for (const dataType of expectedCollectedDataTypes) {
	const declaration = collectedDataTypes.find(
		(candidate) => candidate.NSPrivacyCollectedDataType === dataType,
	)
	assert(Boolean(declaration), `${dataType} must be declared in the iOS privacy manifest`)
	assert(
		declaration?.NSPrivacyCollectedDataTypeLinked === true,
		`${dataType} must be linked to the user`,
	)
	assert(
		declaration?.NSPrivacyCollectedDataTypeTracking === false,
		`${dataType} must not be used for tracking`,
	)
	assert(
		declaration?.NSPrivacyCollectedDataTypePurposes?.includes(
			'NSPrivacyCollectedDataTypePurposeAppFunctionality',
		),
		`${dataType} must declare the app-functionality purpose`,
	)
}
assert(!app.ios?.infoPlist?.NSCameraUsageDescription, 'camera permission must not ship')
assert(!app.ios?.infoPlist?.NSMicrophoneUsageDescription, 'microphone permission must not ship')
assert(
	app.ios?.infoPlist?.NSAppTransportSecurity?.NSAllowsArbitraryLoads === false,
	'App Transport Security must reject arbitrary loads',
)
assert(
	app.ios?.infoPlist?.NSAppTransportSecurity?.NSAllowsLocalNetworking === false,
	'unused local-network exceptions must not ship',
)
assert(
	!(app.android?.permissions ?? []).includes('android.permission.CAMERA'),
	'camera permission must not ship',
)
assert(
	!(app.android?.permissions ?? []).includes('android.permission.RECORD_AUDIO'),
	'microphone permission must not ship',
)

const pluginNames = (app.plugins ?? []).map((plugin) =>
	Array.isArray(plugin) ? plugin[0] : plugin,
)
const secureStorePlugin = (app.plugins ?? []).find(
	(plugin) => Array.isArray(plugin) && plugin[0] === 'expo-secure-store',
)
assert(
	Array.isArray(secureStorePlugin) && secureStorePlugin[1]?.faceIDPermission === false,
	'expo-secure-store must explicitly disable the unused Face ID permission string',
)
for (const forbidden of ['expo-local-authentication', 'expo-notifications', 'expo-widgets']) {
	assert(!pluginNames.includes(forbidden), `${forbidden} must not be configured`)
}
for (const dependency of [
	'expo-dev-client',
	'expo-local-authentication',
	'expo-notifications',
	'expo-widgets',
	'react-native-vision-camera',
]) {
	assert(!pkg.dependencies?.[dependency], `${dependency} must not be installed`)
}

// The assistant and Google social login ship in this release
// (release-policy.json, pinned by src/lib/release-policy.test.ts and
// convex/releaseGate.test.ts), so they are deliberately absent from this
// pinned-off list.
for (const feature of ['filingPreparation', 'community', 'passwordRecovery']) {
	assert(policy[feature] === false, `${feature} must be pinned off for the first review build`)
}
for (const feature of ['assistant', 'socialLogin']) {
	assert(
		policy[feature] === true,
		`${feature} must be enabled for this release (see release-policy tests)`,
	)
}
for (const [surface, copy] of [
	['public privacy policy', privacyPolicy],
	['in-app assistant consent', assistantConsentCopy],
]) {
	assert(
		copy.includes('up to 30 days') && /abuse-monitoring|abuse monitoring/.test(copy),
		`${surface} must disclose OpenAI's default abuse-monitoring retention`,
	)
}
assert(
	openAIChatClient.includes('store: false'),
	'OpenAI Chat Completions must explicitly disable application-state storage',
)
assert(
	eas.build?.production?.environment === 'production',
	'EAS production profile must use production env',
)
assert(
	pkg.dependencies?.['heroui-native-pro'] === 'file:vendor/heroui-native-pro-runtime',
	'HeroUI Native Pro must use the pinned licensed offline package in vendor/heroui-native-pro-runtime',
)
assert(
	!heroUiNativePro.devDependencies,
	'vendored HeroUI Native Pro must not expose development dependencies to Bun file installs',
)
for (const duplicateRuntime of [
	'heroui-native-pro/react-native',
	'heroui-native-pro/react-native-reanimated',
	'heroui-native-pro/react-native-worklets',
	'heroui-native-pro/uniwind',
]) {
	assert(
		!bunLock.includes(`"${duplicateRuntime}"`),
		`bun.lock must not install the duplicate runtime ${duplicateRuntime}`,
	)
}

if (process.env.IMMIFILE_RELEASE_BUILD === 'true') {
	const requiredPublicEnvironment = [
		['EXPO_PUBLIC_CONVEX_URL', process.env.EXPO_PUBLIC_CONVEX_URL],
		['EXPO_PUBLIC_CONVEX_SITE_URL', process.env.EXPO_PUBLIC_CONVEX_SITE_URL],
		['EXPO_PUBLIC_AUTH_SITE_URL', process.env.EXPO_PUBLIC_AUTH_SITE_URL],
		['EXPO_PUBLIC_PRIVACY_URL', process.env.EXPO_PUBLIC_PRIVACY_URL],
		['EXPO_PUBLIC_SUPPORT_URL', process.env.EXPO_PUBLIC_SUPPORT_URL],
	]
	for (const [name, value] of requiredPublicEnvironment) {
		assert(
			isConfigured(value),
			`${name} is missing or still contains a placeholder in the EAS production environment`,
		)
		assert(/^https:\/\//.test(value), `${name} must use HTTPS`)
		assert(!/localhost|127\.0\.0\.1/i.test(value), `${name} cannot target a local service`)
	}
	assert(
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? '') &&
			isConfigured(process.env.EXPO_PUBLIC_SUPPORT_EMAIL),
		'EXPO_PUBLIC_SUPPORT_EMAIL must be a monitored private support address',
	)
	assert(
		process.env.IMMIFILE_PRODUCTION_BACKEND_CONFIRMED === 'true',
		'set IMMIFILE_PRODUCTION_BACKEND_CONFIRMED=true only after deploying Convex production with DEV_SEED_ENABLED disabled',
	)
}

console.log('Release configuration checks passed.')
