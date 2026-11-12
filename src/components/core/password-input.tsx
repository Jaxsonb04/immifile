import { StyledLucideIcon } from '@/components/styled-icon'
import { Button, InputGroup } from 'heroui-native'
import { useState, type ComponentProps } from 'react'

/** Shared native password control for sign-in and account upgrades. */
export function PasswordInput(props: ComponentProps<typeof InputGroup.Input>) {
	const [visible, setVisible] = useState(false)
	return (
		<InputGroup isDisabled={props.editable === false}>
			<InputGroup.Input
				{...props}
				secureTextEntry={!visible}
				autoCorrect={false}
				autoCapitalize="none"
			/>
			<InputGroup.Suffix className="pr-hairline">
				<Button
					isIconOnly
					variant="ghost"
					className="size-11"
					isDisabled={props.editable === false}
					accessibilityLabel={visible ? 'Hide password' : 'Show password'}
					onPress={() => setVisible((value) => !value)}
				>
					<StyledLucideIcon name={visible ? 'eye-off' : 'eye'} size={19} className="text-muted" />
				</Button>
			</InputGroup.Suffix>
		</InputGroup>
	)
}
