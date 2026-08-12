import { api } from '@convex/_generated/api'
import { useMutation, useQuery } from 'convex/react'
import { useRouter } from 'expo-router'
import { cn, Spinner, Typography } from 'heroui-native'
import { useRef, useState } from 'react'
import { Alert, ScrollView, useWindowDimensions, View } from 'react-native'
import { KeyboardStickyView } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useViewer } from '@/components/account'
import { styledIcon } from '@/components/styled-icon'

import { Composer } from './assistant.composer'
import { AssistantConsent } from './assistant-consent'
import { resolveAssistantConsentState } from './assistant-consent-state'
import { useAssistantChat } from './assistant.data'
import { Message } from './assistant.message'
import { OPENING_REPLIES } from './assistant.recommendation'
import type { AssistantContent, ChatTurn } from './assistant.types'

const InfoIcon = styledIcon({ family: 'lucide', name: 'info' })

/** The intro turn shown while the transcript is empty. Reuses the assistant
 * bubble + suggestion layout so first-run looks like a real message. Greets by
 * name only for converted accounts (M6-T1 viewer spine); anonymous sessions
 * always get the neutral "Hi!". */
function greetingTurn(firstName: string | null): ChatTurn {
	const hi = firstName ? `Hi ${firstName}!` : 'Hi!'
	return {
		id: 'greeting',
		kind: 'assistant',
		content: {
			kind: 'text',
			// Names the two forms and the five situations up front, and points at
			// the taps first: the suggestions below cover every supported case
			// deterministically, while free text has to survive extraction. Setting
			// that expectation is what keeps an off-topic question feeling like a
			// scope boundary rather than a refusal.
			text: `${hi} I help with two USCIS forms — a work permit (Form I-765) or a green card (Form I-90). Pick the closest match below, or describe your situation in your own words. I share general information only, not legal advice.`,
			suggestions: OPENING_REPLIES,
		},
	}
}

/** Above this text scale the disclaimer and the quota can no longer share a
 * row: the quota refuses to shrink, so the disclaimer is squeezed to about one
 * character per line and the resulting column of letters grows tall enough to
 * push the entire transcript off screen. Stacked, both simply wrap. */
const STACK_FOOTER_FONT_SCALE = 1.2

/** Always-visible reminder placed where the user acts (above the composer). */
function DisclaimerBar({ isStacked }: { isStacked: boolean }) {
	return (
		<View className={cn('flex-row items-center gap-tight', !isStacked && 'flex-1')}>
			<InfoIcon size={13} className="text-muted" />
			<Typography.Paragraph color="muted" className="flex-1 text-xs leading-snug">
				General information only — not legal advice.
			</Typography.Paragraph>
		</View>
	)
}

function QuotaNote({
	used,
	limit,
	isStacked,
}: {
	used: number
	limit: number
	isStacked: boolean
}) {
	const remaining = Math.max(0, limit - used)
	// `shrink-0` protects the count from being crushed by the disclaimer while
	// they share a row; stacked it would instead force its own overflow.
	const className = cn('text-xs tabular-nums', !isStacked && 'shrink-0')
	return (
		<Typography.Paragraph color="muted" className={className}>
			{remaining <= 0 ? 'Limit reached — resets tomorrow' : `${remaining} of ${limit} left today`}
		</Typography.Paragraph>
	)
}

type RecommendationContent = Extract<AssistantContent, { kind: 'recommendation' }>

/**
 * M1-T3 safe-navigator chat. Navigator-first: every message runs the
 * deterministic `getRecommendation` action once; the transcript is
 * device-session-only. "Start this form" hands off to the create-application
 * flow (M1-T4) with the recommended form + kind preselected.
 */
export function AssistantScreen() {
	const persistedConsent = useQuery(api.preferences.getPreference, {
		key: 'assistantOpenAIConsent',
	})
	const setPreference = useMutation(api.preferences.setPreference)
	const [acceptedThisSession, setAcceptedThisSession] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const state = resolveAssistantConsentState(persistedConsent, acceptedThisSession)

	if (state === 'loading') {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<Spinner />
			</View>
		)
	}

	if (state === 'consent') {
		return (
			<AssistantConsent
				isSaving={isSaving}
				onAccept={() => {
					if (isSaving) return
					setIsSaving(true)
					void setPreference({ key: 'assistantOpenAIConsent', value: true })
						.then(() => setAcceptedThisSession(true))
						.catch(() => {
							Alert.alert(
								"Couldn't save your choice",
								'Please check your connection and try again.',
							)
						})
						.finally(() => setIsSaving(false))
				}}
			/>
		)
	}

	return <AssistantChatScreen />
}

function AssistantChatScreen() {
	const insets = useSafeAreaInsets()
	const { fontScale } = useWindowDimensions()
	const isFooterStacked = fontScale >= STACK_FOOTER_FONT_SCALE
	const router = useRouter()
	const { turns, usage, isSending, canSend, outOfMessages, send, retry } = useAssistantChat()
	const { firstName } = useViewer()
	const scrollRef = useRef<ScrollView>(null)
	const viewportHeight = useRef(0)

	function handleStart(content: RecommendationContent) {
		// M1-T4: open the existing create-application modal with the deterministic
		// recommendation preselected. The user still confirms and submits there.
		router.push({
			pathname: '/new-application',
			params: { formType: content.formType, applicationKind: content.applicationKind },
		})
	}

	const isEmpty = turns.length === 0
	const visibleTurns = isEmpty ? [greetingTurn(firstName)] : turns

	return (
		<View className="flex-1 bg-background">
			<ScrollView
				ref={scrollRef}
				className="flex-1"
				contentContainerClassName="px-gutter pt-control pb-control gap-control"
				contentInsetAdjustmentBehavior="automatic"
				automaticallyAdjustsScrollIndicatorInsets
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="interactive"
				showsVerticalScrollIndicator={false}
				onLayout={(event) => {
					viewportHeight.current = event.nativeEvent.layout.height
				}}
				onContentSizeChange={(_width, contentHeight) => {
					// Only pin to the bottom once the transcript actually overflows the
					// viewport. Scrolling short content would fight the large-title
					// header's content inset and tuck the first bubble under the title.
					if (turns.length > 0 && contentHeight > viewportHeight.current) {
						scrollRef.current?.scrollToEnd({ animated: true })
					}
				}}
			>
				{visibleTurns.map((turn) => (
					<Message
						key={turn.id}
						turn={turn}
						onPick={send}
						onStart={handleStart}
						onRetry={retry}
						isBusy={!canSend}
					/>
				))}
			</ScrollView>

			{/* The row's own bottom padding clears the home indicator when the
			    keyboard is closed. KeyboardStickyView only ever translates by the
			    keyboard's height, so without this offset that same safe-area
			    padding survives as dead space between the composer and the
			    keyboard once it's open — the offset cancels it out exactly, and
			    interpolates smoothly with the keyboard's own open/close motion. */}
			<KeyboardStickyView offset={{ opened: insets.bottom }}>
				<View
					className="gap-tight border-t border-separator bg-background px-gutter pt-control"
					style={{ paddingBottom: insets.bottom + 8 }}
				>
					<Composer
						onSend={send}
						isSending={isSending}
						canSend={canSend}
						outOfMessages={outOfMessages}
					/>
					<View
						className={cn('gap-tight', !isFooterStacked && 'flex-row items-center gap-control')}
					>
						<DisclaimerBar isStacked={isFooterStacked} />
						{usage ? (
							<QuotaNote used={usage.used} limit={usage.limit} isStacked={isFooterStacked} />
						) : null}
					</View>
				</View>
			</KeyboardStickyView>
		</View>
	)
}
