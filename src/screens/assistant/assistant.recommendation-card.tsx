import { Button, Card, Typography } from 'heroui-native'
import { Alert, Linking, Text, View } from 'react-native'
import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated'

import { styledIcon } from '@/components/styled-icon'
import { RELEASE_FEATURES } from '@/lib/release-policy'

import type { AssistantContent } from './assistant.types'

type RecommendationContent = Extract<AssistantContent, { kind: 'recommendation' }>

type RecommendationCardProps = {
	content: RecommendationContent
	onStart: (content: RecommendationContent) => void
	isDisabled?: boolean
}

const FormIcon = styledIcon({ family: 'lucide', name: 'file-text' })
const ExternalIcon = styledIcon({ family: 'lucide', name: 'arrow-up-right' })

/** Official USCIS landing page for each form this release can recommend. */
const OFFICIAL_FORM_URL: Record<RecommendationContent['formType'], string> = {
	i765: 'https://www.uscis.gov/i-765',
	i90: 'https://www.uscis.gov/i-90',
}

async function openOfficialForm(url: string): Promise<void> {
	try {
		await Linking.openURL(url)
	} catch {
		Alert.alert('Could not open this link', 'Please try again when you have a connection.')
	}
}

/** The card's one purposeful motion: a calm rise as the answer arrives.
 * Collapses to an instant appearance under system Reduce Motion. */
const settle = FadeInDown.duration(280).reduceMotion(ReduceMotion.System)

/**
 * The `supported` result: a single deterministic form suggestion. This card is
 * the assistant's centerpiece — serif title, roomy padding, hairline border.
 *
 * The action depends on what this release ships. With filing preparation on,
 * the button is the M1-T4 handoff into the application-creation flow. With it
 * frozen off, that handoff would push a release-blocked route and the root
 * layout would bounce the user to Cases — a dead end at the exact moment the
 * assistant finally answered. So the card instead opens the form's official
 * USCIS page, which keeps the answer actionable and matches the app's
 * official-sources-first posture.
 */
export function RecommendationCard({ content, onStart, isDisabled }: RecommendationCardProps) {
	const canStartFiling = RELEASE_FEATURES.filingPreparation
	const officialUrl = OFFICIAL_FORM_URL[content.formType]
	return (
		<Animated.View entering={settle} className="max-w-[92%] self-start">
			<Card className="gap-hairline border border-border">
				<Card.Body className="gap-card p-gutter">
					<View className="flex-row items-center gap-control">
						<View className="h-11 w-11 items-center justify-center rounded-full bg-accent-soft">
							<FormIcon size={20} className="text-accent" />
						</View>
						<View className="flex-1 gap-hairline">
							<Text className="font-display text-xl leading-tight text-surface-foreground">
								{content.title}
							</Text>
							<Card.Description className="text-sm">{content.formLabel}</Card.Description>
						</View>
					</View>
					<Typography.Paragraph color="muted" className="text-sm leading-relaxed">
						{content.lead}
					</Typography.Paragraph>
				</Card.Body>
				<Card.Footer className="px-gutter pb-gutter">
					{canStartFiling ? (
						<Button variant="primary" isDisabled={isDisabled} onPress={() => onStart(content)}>
							<Button.Label>Start this form</Button.Label>
						</Button>
					) : (
						<Button
							variant="primary"
							isDisabled={isDisabled}
							accessibilityRole="link"
							accessibilityHint="Opens the official USCIS page for this form in your browser"
							onPress={() => void openOfficialForm(officialUrl)}
						>
							<Button.Label>Open the official form page</Button.Label>
							<ExternalIcon size={16} className="text-accent-foreground" />
						</Button>
					)}
				</Card.Footer>
			</Card>
		</Animated.View>
	)
}
