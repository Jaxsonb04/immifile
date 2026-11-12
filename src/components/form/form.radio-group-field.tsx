import { Description, FieldError, TextField as HeroTextField, Label, Radio } from 'heroui-native'
import { RadioButtonGroup } from 'heroui-native-pro/radio-button-group'
import { useFieldContext } from './form.context'
import { fieldErrorText } from './form.utils'

export type RadioGroupFieldOption = {
	value: string
	label: string
	description?: string
}

export type RadioGroupFieldProps = {
	label: string
	options: RadioGroupFieldOption[]
	description?: string
	isRequired?: boolean
	isDisabled?: boolean
}

/** Radio group bound to a TanStack string field. */
export default function RadioGroupField({
	label,
	options,
	description,
	isRequired,
	isDisabled,
}: RadioGroupFieldProps) {
	const field = useFieldContext<string>()
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
	const error = fieldErrorText(field.state.meta.errors)

	return (
		<HeroTextField isInvalid={isInvalid} isRequired={isRequired} isDisabled={isDisabled}>
			<Label>{label}</Label>
			<RadioButtonGroup
				value={field.state.value}
				// RadioButtonGroup has no blur event, so mark the field touched on change to
				// surface validation just like the text fields do on blur.
				onValueChange={(value) => {
					field.handleChange(value)
					field.handleBlur()
				}}
				isInvalid={isInvalid}
				isDisabled={isDisabled}
				variant="secondary"
				className="gap-tight"
			>
				{options.map((option) => (
					<RadioButtonGroup.Item
						key={option.value}
						value={option.value}
						className="flex-row items-center gap-control p-control"
					>
						<Radio />
						<RadioButtonGroup.ItemContent className="gap-hairline">
							<Label>{option.label}</Label>
							{option.description ? <Description>{option.description}</Description> : null}
						</RadioButtonGroup.ItemContent>
					</RadioButtonGroup.Item>
				))}
			</RadioButtonGroup>
			{description ? <Description>{description}</Description> : null}
			{isInvalid && error ? <FieldError isInvalid>{error}</FieldError> : null}
		</HeroTextField>
	)
}
