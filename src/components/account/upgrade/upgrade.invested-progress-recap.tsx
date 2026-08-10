import { Typography } from 'heroui-native'
import { View } from 'react-native'
import type { InvestedProgress } from '../account.data'

const DEFAULT_TITLE = 'Save your progress'
const DEFAULT_DESCRIPTION =
	'Create an account to keep everything you’ve entered and pick up where you left off on any device.'

/** Heading shown when the upgrade form is toggled to its sign-in mode — the
 * create-account pitch would mislabel that form. */
export const SIGN_IN_RECAP: InvestedProgress = {
	title: 'Sign in',
	description: 'Welcome back — everything you saved is right where you left it.',
}

/**
 * Small, props-driven recap of invested effort shown above the upgrade actions.
 * Falls back to generic copy when a caller does not supply a recap.
 */
export function InvestedProgressRecap({ recap }: { recap?: InvestedProgress }) {
	const title = recap?.title ?? DEFAULT_TITLE
	const description = recap?.description ?? DEFAULT_DESCRIPTION
	const highlights = recap?.highlights ?? []

	return (
		<View className="gap-tight">
			<Typography.Heading className="text-2xl font-bold">{title}</Typography.Heading>
			<Typography.Paragraph color="muted">{description}</Typography.Paragraph>
			{highlights.length > 0 ? (
				<View className="mt-tight gap-hairline">
					{highlights.map((item) => (
						<Typography.Paragraph key={item} className="text-sm">
							{`•  ${item}`}
						</Typography.Paragraph>
					))}
				</View>
			) : null}
		</View>
	)
}
