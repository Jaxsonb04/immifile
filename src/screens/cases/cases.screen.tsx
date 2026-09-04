import { EmptyState } from 'heroui-native-pro'
import { StyledLucideIcon } from '@/components/styled-icon'
import { BodyScrollView, ScreenLoading, SectionHeading } from '@/components/core'
import { useSlowLoad } from '@/hooks/use-slow-load'
import { caseStatusLabels } from '@/lib/application-labels'
import { router } from 'expo-router'
import { Button, Card, Chip, Surface, Typography } from 'heroui-native'
import { Pressable, View } from 'react-native'
import { formatCaseDate, statusTone, useCases, type CaseSummary } from './cases.data'

const TONE_COLOR = {
	attention: 'warning',
	positive: 'success',
	neutral: 'default',
} as const

function StatusChip({ status }: { status: CaseSummary['status'] }) {
	return (
		<Chip
			variant="soft"
			color={TONE_COLOR[statusTone(status)]}
			size="sm"
			className="h-auto max-w-full py-1"
		>
			<Chip.Label className="shrink">{caseStatusLabels[status]}</Chip.Label>
		</Chip>
	)
}

function CaseRow({ item }: { item: CaseSummary }) {
	return (
		<Pressable accessibilityRole="button" onPress={() => router.push(`/cases/${item._id}`)}>
			<Surface className="gap-control rounded-3xl border border-border p-gutter">
				<View className="flex-row items-center gap-tight">
					<StyledLucideIcon name="folder" size={16} className="text-accent" />
					<Typography.Paragraph color="muted" className="flex-1 text-xs">
						USCIS case
					</Typography.Paragraph>
					<StyledLucideIcon name="chevron-right" size={16} className="text-muted" />
				</View>
				<View className="flex-row flex-wrap items-center justify-between gap-control">
					<Typography.Paragraph className="font-mono-medium text-lg tabular-nums">
						{item.receiptNumber}
					</Typography.Paragraph>
					<StatusChip status={item.status} />
				</View>
				<Typography.Paragraph color="muted" className="text-xs">
					Updated {formatCaseDate(item.updatedAt)}
				</Typography.Paragraph>
			</Surface>
		</Pressable>
	)
}

/**
 * Cases tab (M3-T2, reshaped in M6-T7): receipt-number tracking with status
 * timelines, split into Active and Previous — a delivered card is a finished
 * journey, and finished journeys shouldn't crowd the ones still moving.
 * Tapping a card opens its detail + timeline.
 */
export function CasesScreen() {
	const cases = useCases()
	// Convex reports "offline" and "still loading" identically (undefined), so
	// give a stalled first load words and a way out instead of a bare spinner.
	const isSlow = useSlowLoad(cases === undefined)

	if (cases === undefined) {
		return (
			<ScreenLoading
				label={isSlow ? 'Still loading. Check your connection and stay on this screen.' : undefined}
			/>
		)
	}

	if (cases.length === 0) {
		return (
			<BodyScrollView contentContainerClassName="gap-section pt-gutter">
				<Card className="rounded-3xl border border-border p-gutter">
					<EmptyState animation="disable-all" className="gap-section px-0 py-section">
						<EmptyState.Header>
							<EmptyState.Media variant="icon" className="bg-accent/10">
								<StyledLucideIcon name="folder-plus" size={28} className="text-accent" />
							</EmptyState.Media>
							<EmptyState.Title className="font-display text-2xl">
								Your cases start here.
							</EmptyState.Title>
							<EmptyState.Description className="text-sm leading-relaxed">
								Add the receipt number from a USCIS notice to keep your case and its updates
								together.
							</EmptyState.Description>
						</EmptyState.Header>
						<EmptyState.Content className="w-full">
							<Button
								className="h-auto min-h-12 w-full py-control"
								onPress={() => router.push('/new-case')}
							>
								<Button.Label className="shrink text-center">Add a case</Button.Label>
							</Button>
						</EmptyState.Content>
					</EmptyState>
				</Card>
				<View className="gap-control px-hairline">
					<Typography.Paragraph className="font-semibold text-sm">
						Already waiting on USCIS?
					</Typography.Paragraph>
					<Typography.Paragraph color="muted" className="text-sm leading-relaxed">
						You record the updates in Immifile. For the latest official status, use USCIS Case
						Status Online.
					</Typography.Paragraph>
					<Button
						variant="ghost"
						className="h-auto min-h-11 self-start px-0 py-tight"
						onPress={() => router.navigate('/resources')}
					>
						<Button.Label className="shrink text-left">Find official tools</Button.Label>
						<StyledLucideIcon name="arrow-right" size={16} className="text-accent" />
					</Button>
				</View>
			</BodyScrollView>
		)
	}

	const active = cases.filter((item) => item.status !== 'cardDelivered')
	const previous = cases.filter((item) => item.status === 'cardDelivered')

	return (
		<BodyScrollView contentContainerClassName="gap-card py-gutter">
			{active.length > 0 && previous.length > 0 && (
				<SectionHeading title="Active" count={active.length} />
			)}
			{active.map((item) => (
				<CaseRow key={item._id} item={item} />
			))}
			{previous.length > 0 && (
				<View className="gap-control pt-control">
					<SectionHeading title="Previous" count={previous.length} />
					{previous.map((item) => (
						<CaseRow key={item._id} item={item} />
					))}
				</View>
			)}
		</BodyScrollView>
	)
}
