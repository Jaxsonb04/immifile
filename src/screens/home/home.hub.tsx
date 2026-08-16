import { StyledLucideIcon } from '@/components/styled-icon'
import { useToday } from '@/hooks/use-today'
import {
	formatIsoDate,
	progressLabel,
	requirementLabel,
	situationLabel,
} from '@/lib/application-labels'
import { renewalStateFor, type RenewalState } from '@convex/shared/renewals'
import { router, type Href } from 'expo-router'
import { Card, Typography } from 'heroui-native'
import { Pressable, Text, View } from 'react-native'
import type { ActiveApplication, AttentionItem } from './home.data'
import { KIND_LABELS, renewalStateCopy, type RenewalItem } from './home.renewals'

// ————————————————————————————————————————————————————————————————————————
// The Forms hub (M7-T4). Hierarchy over uniformity: the next renewal
// deadline — the one fact this app exists to protect — is the featured
// card with a display-scale figure; drafts and attention items are a pair
// of compact stat tiles; completed filings are a quiet historical row.
// Every block pushes into its full list, so the tab root never scrolls.
// ————————————————————————————————————————————————————————————————————————

const URGENCY_ORDER = { expired: 0, windowOpen: 1, windowOpens: 2, awaitingCard: 3 } as const

function mostUrgentRenewal(
	items: RenewalItem[],
	today: string,
): { item: RenewalItem; state: RenewalState } | undefined {
	const pairs = items
		.map((item) => ({ item, state: renewalStateFor(item, today) }))
		.filter((pair): pair is { item: RenewalItem; state: RenewalState } => pair.state !== null)
	pairs.sort((a, b) => URGENCY_ORDER[a.state.status] - URGENCY_ORDER[b.state.status])
	return pairs[0]
}

/** The display-scale figure + its unit line for each renewal state. */
function deadlineFigure(state: RenewalState): { value: string; unit: string; tone: string } {
	switch (state.status) {
		case 'expired':
			return {
				value: `${state.daysSinceExpiry}`,
				unit: state.daysSinceExpiry === 1 ? 'day past expiry' : 'days past expiry',
				tone: 'text-danger',
			}
		case 'windowOpen':
			return state.daysUntilExpiry === 0
				? { value: 'Today', unit: 'is the expiry date', tone: 'text-warning' }
				: {
						value: `${state.daysUntilExpiry}`,
						unit: state.daysUntilExpiry === 1 ? 'day to expiry' : 'days to expiry',
						tone: 'text-foreground',
					}
		case 'windowOpens':
			return { value: formatIsoDate(state.opensOn), unit: 'window opens', tone: 'text-foreground' }
		case 'awaitingCard':
			return { value: formatIsoDate(state.filedOn), unit: 'filed', tone: 'text-foreground' }
	}
}

/**
 * Featured deadline card: label row, a Libre Franklin display figure with an
 * optically-aligned unit, and the plain-language state line underneath.
 */
function NextDeadlineCard(props: { pair?: { item: RenewalItem; state: RenewalState } }) {
	const { pair } = props
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel="Renewals"
			onPress={() => router.push('/renewals')}
			className="active:opacity-90"
		>
			<Card variant="secondary" className="gap-control p-gutter">
				<View className="flex-row items-center justify-between">
					<Typography.Paragraph color="muted" className="text-sm">
						{pair !== undefined ? `Next renewal · ${KIND_LABELS[pair.item.kind]}` : 'Renewals'}
					</Typography.Paragraph>
					<StyledLucideIcon name="chevron-right" size={16} className="text-muted" />
				</View>

				{pair !== undefined ? (
					<>
						<View className="flex-row items-end gap-tight">
							<Text
								className={`font-display text-5xl leading-none tabular-nums ${deadlineFigure(pair.state).tone}`}
							>
								{deadlineFigure(pair.state).value}
							</Text>
							<Typography.Paragraph color="muted" className="mb-hairline text-sm">
								{deadlineFigure(pair.state).unit}
							</Typography.Paragraph>
						</View>
						<Typography.Paragraph color="muted" className="text-sm leading-snug">
							{renewalStateCopy(pair.state).text}
						</Typography.Paragraph>
					</>
				) : (
					<>
						<Text className="font-display text-2xl leading-tight text-foreground">
							Know your window.
						</Text>
						<Typography.Paragraph color="muted" className="text-sm leading-snug">
							Add your card’s expiry date and we’ll tell you exactly when you can file.
						</Typography.Paragraph>
					</>
				)}
			</Card>
		</Pressable>
	)
}

type Tile = {
	key: string
	count: number
	label: string
	detail: string
	href: Href
	tone?: string
}

/** Compact stat tile: count at display scale, category label, one detail line. */
function StatTile({ tile }: { tile: Tile }) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={`${tile.label} · ${tile.count}`}
			onPress={() => router.push(tile.href)}
			className="flex-1 active:opacity-90"
		>
			<Card variant="secondary" className="flex-1 gap-hairline p-card">
				<View className="flex-row items-baseline gap-tight">
					<Text
						className={`font-display text-3xl leading-none tabular-nums ${tile.tone ?? 'text-foreground'}`}
					>
						{tile.count}
					</Text>
					<Typography.Paragraph className="text-sm font-medium">{tile.label}</Typography.Paragraph>
				</View>
				<Typography.Paragraph color="muted" numberOfLines={2} className="text-xs leading-snug">
					{tile.detail}
				</Typography.Paragraph>
			</Card>
		</Pressable>
	)
}

/** Quiet historical row — deliberately not a card, so it never competes. */
function CompletedRow({ completed }: { completed: ActiveApplication[] }) {
	const latest = [...completed].sort((a, b) => (b.filedAt ?? 0) - (a.filedAt ?? 0))[0]
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={`Completed · ${completed.length}`}
			onPress={() => router.push('/completed')}
			className="flex-row items-center gap-control px-hairline py-hairline active:opacity-70"
		>
			<StyledLucideIcon name="circle-check" size={18} className="text-success" />
			<Typography.Paragraph className="flex-1 text-sm">
				{completed.length === 1 ? '1 completed filing' : `${completed.length} completed filings`}
				{latest?.filedAt !== undefined && (
					<Typography.Paragraph color="muted" className="text-sm">
						{'  ·  latest '}
						{new Date(latest.filedAt).toLocaleDateString()}
					</Typography.Paragraph>
				)}
			</Typography.Paragraph>
			<StyledLucideIcon name="chevron-right" size={16} className="text-muted" />
		</Pressable>
	)
}

export function HubSections(props: {
	drafts: ActiveApplication[]
	completed: ActiveApplication[]
	renewalItems: RenewalItem[]
	attentionItems: AttentionItem[]
}) {
	const { drafts, completed, renewalItems, attentionItems } = props
	const today = useToday()
	const urgent = mostUrgentRenewal(renewalItems, today)

	const tiles: Tile[] = [
		...(drafts.length > 0
			? [
					{
						key: 'drafts',
						count: drafts.length,
						label: drafts.length === 1 ? 'draft' : 'drafts',
						// progressLabel clamps the step counter and says "Answers
						// complete" once every step (including review) is done —
						// never "step 13 of 12".
						detail: `${situationLabel(drafts[0]!.formType, drafts[0]!.applicationKind).primary} — ${progressLabel(drafts[0]!).toLowerCase()}`,
						href: '/drafts' as Href,
					},
				]
			: []),
		...(attentionItems.length > 0
			? [
					{
						key: 'attention',
						count: attentionItems.length,
						label: attentionItems.length === 1 ? 'needs attention' : 'need attention',
						detail:
							attentionItems[0]!.kind === 'documentExpiring'
								? `${attentionItems[0]!.label ?? attentionItems[0]!.documentType} expires ${formatIsoDate(attentionItems[0]!.expiryDate)}`
								: `${requirementLabel(attentionItems[0]!.requirementKey)} needed`,
						href: '/attention' as Href,
						tone: 'text-warning',
					},
				]
			: []),
	]

	return (
		<View className="gap-control">
			<NextDeadlineCard pair={urgent} />
			{tiles.length > 0 && (
				<View className="flex-row items-stretch gap-control">
					{tiles.map((tile) => (
						<StatTile key={tile.key} tile={tile} />
					))}
				</View>
			)}
			{completed.length > 0 && <CompletedRow completed={completed} />}
		</View>
	)
}
