import { Button, Spinner, Typography } from 'heroui-native'
import type { ReactNode } from 'react'
import { ScrollView, View } from 'react-native'
import { initialWindowMetrics, useSafeAreaInsets } from 'react-native-safe-area-context'

import type { StyledIconComponent } from '@/components/styled-icon'
import { getStableStateShellBottomPadding } from './screen-state-layout'

/** Matches src/components/core/tab-intro.tsx: enough air that the last element
 * clears the floating tab bar instead of sitting behind it. */
const TAB_BAR_CLEARANCE = 72

/**
 * Centered, full-height container shared by every screen state.
 *
 * A ScrollView rather than a plain View: at accessibility text sizes this
 * content outgrows the viewport, and a fixed centered box has nowhere to put
 * the overflow — it bleeds up into the large title and down under the tab bar,
 * unreachable. `grow` keeps the content centered while it fits and only starts
 * scrolling once it doesn't.
 *
 * Note there is no top padding and no `contentInsetAdjustmentBehavior`: both
 * push the centered content down far enough that the trailing action lands
 * behind the tab bar at ordinary text sizes.
 */
function StateShell({ children }: { children: ReactNode }) {
	const insets = useSafeAreaInsets()
	const bottomPadding = getStableStateShellBottomPadding({
		initialBottomInset: initialWindowMetrics?.insets.bottom,
		liveBottomInset: insets.bottom,
		tabBarClearance: TAB_BAR_CLEARANCE,
	})
	return (
		<ScrollView
			className="flex-1 bg-background"
			contentContainerClassName="grow items-center justify-center gap-gutter px-8"
			contentContainerStyle={{ paddingBottom: bottomPadding }}
			showsVerticalScrollIndicator={false}
		>
			{children}
		</ScrollView>
	)
}

// NOTE: an optional circular icon chip is supported below, but the placeholder
// screens ship icon-less on purpose. The `@react-native-vector-icons` glyph map
// is newer than the bundled TTFs, so many in-screen glyphs (e.g. lucide
// `sparkles`, feather `clock`) fall through to the system font and render as a
// stray emoji/□. Resolve that font/glyph-map mismatch before leaning on
// decorative in-screen icons (needed for M1-T3 chat UI).
/** Circular icon chip used by the empty and error states when an icon renders. */
function StateIcon({ icon: Icon }: { icon: StyledIconComponent }) {
	return (
		<View className="h-16 w-16 items-center justify-center rounded-full bg-surface">
			<Icon size={26} className="text-muted" />
		</View>
	)
}

/** Loading placeholder for a screen awaiting its first data. */
export function ScreenLoading({ label }: { label?: string }) {
	return (
		<StateShell>
			<Spinner />
			{label ? (
				<Typography.Paragraph color="muted" className="text-center text-sm">
					{label}
				</Typography.Paragraph>
			) : null}
		</StateShell>
	)
}

type ScreenEmptyProps = {
	icon?: StyledIconComponent
	/** Rich header graphic (M6-T8 animated empty-state heroes); wins over icon. */
	visual?: ReactNode
	title: string
	description?: string
	action?: { label: string; onPress: () => void }
	/** Extra content under the action (e.g. a secondary link). */
	footer?: ReactNode
}

/** Empty state: no data yet, optionally with a single primary action. */
export function ScreenEmpty({ icon, visual, title, description, action, footer }: ScreenEmptyProps) {
	return (
		<StateShell>
			{visual ?? (icon ? <StateIcon icon={icon} /> : null)}
			<View className="gap-tight">
				<Typography.Heading className="text-center text-xl font-semibold">{title}</Typography.Heading>
				{description ? (
					<Typography.Paragraph color="muted" className="text-center text-base leading-relaxed">
						{description}
					</Typography.Paragraph>
				) : null}
			</View>
			{action ? (
				<Button variant="secondary" onPress={action.onPress}>
					<Button.Label>{action.label}</Button.Label>
				</Button>
			) : null}
			{footer ?? null}
		</StateShell>
	)
}

type ScreenErrorProps = {
	icon?: StyledIconComponent
	title?: string
	description?: string
	onRetry?: () => void
}

/** Error state with an optional retry affordance. */
export function ScreenError({
	icon,
	title = 'Something went wrong',
	description,
	onRetry,
}: ScreenErrorProps) {
	return (
		<StateShell>
			{icon ? <StateIcon icon={icon} /> : null}
			<View className="gap-tight">
				<Typography.Heading className="text-center text-xl font-semibold">{title}</Typography.Heading>
				{description ? (
					<Typography.Paragraph color="muted" className="text-center text-base leading-relaxed">
						{description}
					</Typography.Paragraph>
				) : null}
			</View>
			{onRetry ? (
				<Button variant="secondary" onPress={onRetry}>
					<Button.Label>Try again</Button.Label>
				</Button>
			) : null}
		</StateShell>
	)
}
