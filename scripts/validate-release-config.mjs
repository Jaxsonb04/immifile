import { readFileSync } from 'node:fs'

const app = JSON.parse(readFileSync(new URL('../app.json', import.meta.url), 'utf8')).expo
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const eas = JSON.parse(readFileSync(new URL('../eas.json', import.meta.url), 'utf8'))
const policy = JSON.parse(readFileSync(new URL('../release-policy.json', import.meta.url), 'utf8'))

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

// The assistant ships in this release (release-policy.json assistant: true,
// pinned by src/lib/release-policy.test.ts and convex/releaseGate.test.ts),
// so it is deliberately absent from this pinned-off list.
for (const feature of [
	'filingPreparation',
	'community',
	'socialLogin',
	'passwordRecovery',
]) {
	assert(policy[feature] === false, `${feature} must be pinned off for the first review build`)
}
assert(policy.assistant === true, 'assistant must be enabled for this release (see release-policy tests)')
assert(
	eas.build?.production?.environment === 'production',
	'EAS production profile must use production env',
)

if (process.env.IMMIFILE_RELEASE_BUILD === 'true') {
	assert(
		/^hp_\S+$/.test(process.env.HEROUI_KEY ?? '') && isConfigured(process.env.HEROUI_KEY),
		'HEROUI_KEY is missing or invalid; add the trusted hp_ key as an EAS production secret',
	)
	// Two different consumers, two different variable names — verified against
	// the installed vendor code, not documentation:
	//   * `hpsetup` (this pre-install hook)            reads HEROUI_KEY
	//   * heroui-native-pro's own postinstall, run by  reads HEROUI_AUTH_TOKEN
	//     `bun install` AFTER this hook
	// The published heroui-native-pro package is a ~9KB stub; its real library is
	// downloaded by that postinstall. Without HEROUI_AUTH_TOKEN the postinstall
	// prints "Sign in to finish installing" and exits 0, so the install SUCCEEDS
	// with a stub and the build fails much later at Metro bundling with an
	// unrelated-looking module-resolution error. Fail here instead, with a name.
	assert(
		/^hp_\S+$/.test(process.env.HEROUI_AUTH_TOKEN ?? '') &&
			isConfigured(process.env.HEROUI_AUTH_TOKEN),
		'HEROUI_AUTH_TOKEN is missing or invalid; add the same trusted hp_ key as a second EAS production secret so heroui-native-pro can fetch its library during install',
	)
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
