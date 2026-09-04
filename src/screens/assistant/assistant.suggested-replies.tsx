import { Chip } from 'heroui-native'
import { View } from 'react-native'

import type { SuggestedReply } from './assistant.types'

type SuggestedRepliesProps = {
	replies: SuggestedReply[]
	onPick: (message: string) => void
	isDisabled?: boolean
}

/** Wrapping row of tappable suggestion pills. Each pill sends a complete,
 * self-contained message so the common paths resolve in a single tap. */
export function SuggestedReplies({ replies, onPick, isDisabled }: SuggestedRepliesProps) {
	if (replies.length === 0) return null
	return (
		<View className="flex-row flex-wrap gap-tight">
			{replies.map((reply) => (
				<Chip
					key={reply.id}
					accessibilityRole="button"
					accessibilityState={{ disabled: Boolean(isDisabled) }}
					className="h-auto min-h-11 max-w-full py-tight"
					variant="soft"
					color="accent"
					disabled={isDisabled}
					onPress={() => onPick(reply.message)}
				>
					<Chip.Label className="shrink">{reply.label}</Chip.Label>
				</Chip>
			))}
		</View>
	)
}
