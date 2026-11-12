import { Description, FieldError, Label } from 'heroui-native'
import { NumberField as HeroNumberField } from 'heroui-native-pro/number-field'
import { useFieldContext } from './form.context'
import { fieldErrorText } from './form.utils'

export type NumberFieldProps = {
	label: string
	description?: string
	isRequired?: boolean
	isDisabled?: boolean
	minValue?: number
	maxValue?: number
	step?: number
	formatOptions?: Intl.NumberFormatOptions
}

/** Numeric stepper field bound to a TanStack number field. */
export default function NumberField({
	label,
	description,
	isRequired,
	isDisabled,
	minValue,
	maxValue,
	step,
	formatOptions,
}: NumberFieldProps) {
	const field = useFieldContext<number>()
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
	const error = fieldErrorText(field.state.meta.errors)

	// HeroNumberField is itself a form-field root (it provides the FormField
	// context that Label/Description/FieldError read), so there is no outer
	// HeroUI TextField wrapper here.
	return (
		<HeroNumberField
			value={field.state.value}
			onChange={field.handleChange}
			minValue={minValue}
			maxValue={maxValue}
			step={step}
			formatOptions={formatOptions}
			isInvalid={isInvalid}
			isRequired={isRequired}
			isDisabled={isDisabled}
		>
			<Label>{label}</Label>
			<HeroNumberField.Group>
				<HeroNumberField.DecrementButton />
				<HeroNumberField.Input onBlur={field.handleBlur} />
				<HeroNumberField.IncrementButton />
			</HeroNumberField.Group>
			{description ? <Description>{description}</Description> : null}
			{isInvalid && error ? <FieldError isInvalid>{error}</FieldError> : null}
		</HeroNumberField>
	)
}
