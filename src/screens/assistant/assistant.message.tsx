import { Avatar, Button, Spinner, Surface } from 'heroui-native'
import { Text, View } from 'react-native'

import { styledIcon } from '@/components/styled-icon'

import { RecommendationCard } from './assistant.recommendation-card'
import { SuggestedReplies } from './assistant.suggested-replies'
import type { AssistantContent, AssistantSendOptions, ChatTurn } from './assistant.types'

const SparkleIcon = styledIcon({ family: 'lucide', name: 'sparkles' })

/** Small assistant identity avatar shown beside its bubbles. */
function AssistantAvatar() {
	return (
		<Avatar size="sm" variant="soft" color="accent" alt="Assistant">
			<Avatar.Fallback>
				<SparkleIcon size={15} className="text-accent" />
			</Avatar.Fallback>
		</Avatar>
	)
}

/** Left-aligned assistant row: avatar + a surface bubble. */
function AssistantRow({ children }: { children: React.ReactNode }) {
	return (
		<View className="max-w-[88%] flex-row items-end gap-tight self-start">
			<AssistantAvatar />
			<View className="flex-1">{children}</View>
		</View>
	)
}

type RecommendationContent = Extract<AssistantContent, { kind: 'recommendation' }>

type MessageProps = {
	turn: ChatTurn
	onPick: (message: string, options?: AssistantSendOptions) => void
	onStart: (content: RecommendationContent) => void
	onRetry: (id: string, failedText: string) => void
	isBusy: boolean
}

/** Render one transcript turn. */
export function Message({ turn, onPick, onStart, onRetry, isBusy }: MessageProps) {
	if (turn.kind === 'user') {
		return (
			<View className="max-w-[82%] self-end rounded-2xl rounded-br-md bg-accent px-card py-control">
				<Text className="text-[15px] leading-snug text-accent-foreground">{turn.text}</Text>
			</View>
		)
	}

	if (turn.kind === 'pending') {
		return (
			<AssistantRow>
				<Surface
					variant="secondary"
					className="self-start rounded-2xl rounded-bl-md px-card py-control"
				>
					<Spinner size="sm" />
				</Surface>
			</AssistantRow>
		)
	}

	if (turn.kind === 'error') {
		return (
			<AssistantRow>
				<View className="items-start gap-tight">
					<Surface variant="secondary" className="rounded-2xl rounded-bl-md px-card py-control">
						<Text className="text-[15px] leading-snug text-foreground">
							Something went wrong reaching the assistant.
						</Text>
					</Surface>
					<Button
						variant="outline"
						size="sm"
						isDisabled={isBusy}
						onPress={() => onRetry(turn.id, turn.failedText)}
					>
						<Button.Label>Try again</Button.Label>
					</Button>
				</View>
			</AssistantRow>
		)
	}

	// Assistant content turn.
	if (turn.content.kind === 'recommendation') {
		return <RecommendationCard content={turn.content} onStart={onStart} isDisabled={isBusy} />
	}

	const { text, suggestions, suggestionsStartNewTopic } = turn.content
	return (
		<View className="gap-tight">
			<AssistantRow>
				<Surface
					variant="secondary"
					className="self-start rounded-2xl rounded-bl-md px-card py-control"
				>
					<Text className="text-[15px] leading-snug text-foreground">{text}</Text>
				</Surface>
			</AssistantRow>
			{suggestions ? (
				<View className="pl-9">
					<SuggestedReplies
						replies={suggestions}
						onPick={(message) => onPick(message, { startNewTopic: suggestionsStartNewTopic })}
						isDisabled={isBusy}
					/>
				</View>
			) : null}
		</View>
	)
}
