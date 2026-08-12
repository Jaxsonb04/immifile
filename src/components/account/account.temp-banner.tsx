import { api } from '@convex/_generated/api'
import { useQuery } from 'convex/react'
import { Button, Surface, Typography } from 'heroui-native'
import { useSyncExternalStore } from 'react'
import { View } from 'react-native'

import { StyledLucideIcon } from '@/components/styled-icon'
import { tempAccountCardDescription, temporaryAccountNotice } from '@/lib/temp-account-notice'

import { useRequireAccount } from './account.require-account'
import { useAccountSession } from './account.session'

function useTempAccountDeadline(): number | null | undefined {
	const { isAnonymous } = useAccountSession()
	const status = useQuery(api.tempAccounts.tempAccountStatus, isAnonymous ? {} : 'skip')
	if (!isAnonymous) return null
	return status?.deleteAt
}

// Wall clock as an external store, quantized to the minute so the snapshot is
// referentially stable between ticks (render-purity-safe way to read time).
const MINUTE = 60_000
const subscribeMinuteTick = (onTick: () => void): (() => void) => {
	const id = setInterval(onTick, MINUTE)
	return () => clearInterval(id)
}
const currentMinute = () => Math.floor(Date.now() / MINUTE) * MINUTE

function useNow(): number {
	return useSyncExternalStore(subscribeMinuteTick, currentMinute, currentMinute)
}

/**
 * Deletion notice for temporary sessions (M6-T4): visible throughout the
 * entire 48-hour window, with stronger warning treatment inside the final
 * 24 hours. Rendered at the top of every Forms dashboard state.
 */
export function TempAccountDeletionBanner() {
	const requireAccount = useRequireAccount()
	const deleteAt = useTempAccountDeadline()
	const now = useNow()
	if (deleteAt == null) return null
	const notice = temporaryAccountNotice(deleteAt, now)

	return (
		<Surface
			className={`gap-control rounded-2xl border p-card ${
				notice.urgent ? 'border-warning/40 bg-warning/10' : 'border-border bg-surface-secondary'
			}`}
		>
			<View className="flex-row items-start gap-control">
				<StyledLucideIcon
					name="clock-alert"
					size={18}
					className={`mt-hairline ${notice.urgent ? 'text-warning' : 'text-muted'}`}
				/>
				<View className="flex-1 gap-hairline">
					<Typography.Paragraph className="font-medium">{notice.title}</Typography.Paragraph>
					<Typography.Paragraph color="muted" className="text-sm leading-snug">
						{notice.description}
					</Typography.Paragraph>
				</View>
			</View>
			<Button
				size="sm"
				variant="secondary"
				onPress={() =>
					void requireAccount({
						title: 'Keep your work',
						description: 'Create an account to keep using Immifile.',
					})
				}
			>
				<Button.Label maxFontSizeMultiplier={1.5}>Keep my work</Button.Label>
			</Button>
		</Surface>
	)
}

/**
 * Always-visible conversion card for temporary sessions on the Profile screen
 * (M6-T2/T3): states the 48-hour lifetime plainly and offers the upgrade.
 */
export function TempAccountCard() {
	const requireAccount = useRequireAccount()
	const deleteAt = useTempAccountDeadline()
	const now = useNow()
	if (deleteAt === null) return null
	// AccountScreen remains mounted beneath its intro, so this query normally
	// resolves before Got it. Keep the complete card mounted even on a slow first
	// response so the exposed Account layout never inserts a banner after the fade.
	const description = tempAccountCardDescription(deleteAt, now)

	return (
		<Surface variant="secondary" className="gap-control rounded-2xl p-card">
			<View className="gap-hairline">
				<Typography.Paragraph className="font-medium">
					You’re using a temporary account
				</Typography.Paragraph>
				<Typography.Paragraph color="muted" className="text-sm leading-snug">
					{description}
				</Typography.Paragraph>
			</View>
			<Button
				size="sm"
				onPress={() =>
					void requireAccount({
						title: 'Keep your work',
						description: 'Create an account to save cases and keep using Immifile.',
					})
				}
			>
				<Button.Label maxFontSizeMultiplier={1.5}>Create account</Button.Label>
			</Button>
		</Surface>
	)
}
