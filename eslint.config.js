// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')

module.exports = defineConfig([
	expoConfig,
	{
		// eslint-plugin-react's automatic React-version detection calls the
		// `context.getFilename()` API that ESLint 10 removed, which crashes the
		// whole lint run. Pinning the version skips detection entirely.
		settings: {
			react: { version: '19.2' },
		},
	},
  {
    rules: {
      'react/no-unescaped-entities': 'off',
    },
  },
	{
		ignores: ['.expo', 'convex/_generated', 'vendor/heroui-native-pro-runtime'],
	},
])
