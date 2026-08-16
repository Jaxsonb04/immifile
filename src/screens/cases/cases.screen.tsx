import {
	BodyScrollView,
	CaseTrackingHero,
	ScreenEmpty,
	ScreenLoading,
	SectionHeading,
} from '@/components/core'
import { useSlowLoad } from '@/hooks/use-slow-load'
import { caseStatusLabels } from '@/lib/application-labels'
import { router } from 'expo-router'
import { Chip, Surface, Typography } from 'heroui-native'
import { Pressable, View } from 'react-native'
import { formatCaseDate, statusTone, useCases, type CaseSummary } from './cases.data'

const TONE_COLOR = {
	attention: 'warning',
	positive: 'success',
	neutral: 'default',
} as const

function StatusChip({ status }: { status: CaseSummary['status'] }) {
	return (
		<Chip variant="soft" color={TONE_COLOR[statusTone(status)]} size="sm">
			<Chip.Label>{caseStatusLabels[status]}</Chip.Label>
		</Chip>
	)
}

function CaseRow({ item }: { item: CaseSummary }) {
	return (
		<Pressable accessibilityRole="button" onPress={() => router.push(`/cases/${item._id}`)}>
			<Surface variant="secondary" className="gap-tight rounded-2xl p-card">
				<View className="flex-row items-center justify-between gap-control">
					<Typography.Paragraph className="font-mono tabular-nums">
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
			<ScreenEmpty
				visual={<CaseTrackingHero width={140} />}
				title="No cases to track yet"
				description="Add a USCIS receipt number to save it here and record the updates you receive. Immifile does not fetch status automatically."
				action={{ label: 'Add a case', onPress: () => router.push('/new-case') }}
			/>
		)
	}

	const active = cases.filter((item) => item.status !== 'cardDelivered')
	const previous = cases.filter((item) => item.status === 'cardDelivered')

	return (
		<BodyScrollView contentContainerClassName="gap-control py-card" restoreLargeTitleOnTabReveal>
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
