import { Button, InputGroup, Spinner, useThemeColor } from 'heroui-native'
import { useState } from 'react'
import { FadeIn, ReduceMotion } from 'react-native-reanimated'

import { styledIcon } from '@/components/styled-icon'

const SendIcon = styledIcon({ family: 'lucide', name: 'arrow-up' })

type ComposerProps = {
	/** Returns true when the message was accepted (enqueued); the field is only
	 * cleared then, so a rejected send never discards the user's text. */
	onSend: (message: string) => boolean
	isSending: boolean
	/** False when a request is in flight or the daily quota is spent. */
	canSend: boolean
	outOfMessages: boolean
}

/** The message input row: a growing multiline field with an inline send button
 * that turns into a spinner while a request is in flight. The button is sized
 * smaller than the input's own height (HeroUI's `sm` icon-only button is a
 * 40pt circle inside a 44pt-tall pill — almost no clearance, so it visually
 * collided with the pill's own rounded corners) so it reads as inset with a
 * clean margin instead of wedged into the border. */
export function Composer({ onSend, isSending, canSend, outOfMessages }: ComposerProps) {
	const [value, setValue] = useState('')
	const accentForeground = useThemeColor('accent-foreground')
	const trimmed = value.trim()
	const canSubmit = canSend && trimmed.length > 0

	function submit() {
		if (!canSubmit) return
		if (onSend(trimmed)) setValue('')
	}

	return (
		<InputGroup isDisabled={outOfMessages}>
			<InputGroup.Input
				value={value}
				onChangeText={setValue}
				// Scoped rather than open-ended ("Describe your situation…" invited
				// questions the navigator can only deflect).
				placeholder={
					outOfMessages ? 'Daily message limit reached' : 'Work permit or green card question…'
				}
				multiline
				editable={!outOfMessages}
				className="max-h-32 min-h-11 py-control"
				submitBehavior="blurAndSubmit"
			/>
			<InputGroup.Suffix>
				<Button
					isIconOnly
					size="sm"
					variant="primary"
					isDisabled={!canSubmit}
					onPress={submit}
					accessibilityLabel="Send message"
					className="h-8 w-8"
					hitSlop={8}
				>
					{isSending ? (
						<Spinner
							size="sm"
							color={accentForeground}
							entering={FadeIn.duration(150).reduceMotion(ReduceMotion.System)}
						/>
					) : (
						<SendIcon size={15} className="text-accent-foreground" />
					)}
				</Button>
			</InputGroup.Suffix>
		</InputGroup>
	)
}
