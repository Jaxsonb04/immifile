// @vitest-environment node
import { createElement, type ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { RecommendationCard } from './assistant.recommendation-card'
import type { AssistantContent } from './assistant.types'

type ButtonProps = {
	children?: ReactNode
	isDisabled?: boolean
	onPress?: () => void
	accessibilityLabel?: string
}

const state = vi.hoisted(() => ({
	filingPreparation: false,
	buttons: [] as ButtonProps[],
	openURL: vi.fn(),
	alert: vi.fn(),
}))

vi.mock('heroui-native', () => {
	const Box = ({ children }: { children?: ReactNode }) => createElement('div', null, children)
	const Button = (props: ButtonProps) => {
		state.buttons.push(props)
		return createElement('button', { disabled: props.isDisabled }, props.children)
	}
	return {
		Button: Object.assign(Button, { Label: Box }),
		Card: Object.assign(Box, { Body: Box, Description: Box, Footer: Box }),
		Typography: { Paragraph: Box },
	}
})

vi.mock('react-native', () => {
	const Box = ({ children }: { children?: ReactNode }) => createElement('div', null, children)
	return {
		Text: Box,
		View: Box,
		Linking: { openURL: state.openURL },
		Alert: { alert: state.alert },
	}
})

vi.mock('react-native-reanimated', () => ({
	default: {
		View: ({ children }: { children?: ReactNode }) => createElement('div', null, children),
	},
	FadeInDown: { duration: () => ({ reduceMotion: () => undefined }) },
	ReduceMotion: { System: 'system' },
}))

vi.mock('@/components/styled-icon', () => ({ styledIcon: () => () => null }))
vi.mock('@/lib/release-policy', () => ({
	RELEASE_FEATURES: {
		get filingPreparation() {
			return state.filingPreparation
		},
	},
}))

type RecommendationContent = Extract<AssistantContent, { kind: 'recommendation' }>

function render(formType: 'i90' | 'i765', isDisabled: boolean) {
	const content: RecommendationContent = {
		kind: 'recommendation',
		formType,
		applicationKind: 'renewal',
		lead: 'Review the current instructions on USCIS.gov.',
		title: 'Renewal',
		formLabel: formType === 'i90' ? 'Form I-90' : 'Form I-765',
	}
	const onStart = vi.fn()
	const html = renderToStaticMarkup(
		createElement(RecommendationCard, { content, onStart, isDisabled }),
	)
	return { content, onStart, html, button: state.buttons.at(-1)! }
}

beforeEach(() => {
	state.filingPreparation = false
	state.buttons.length = 0
	state.openURL.mockReset().mockResolvedValue(undefined)
	state.alert.mockReset()
})

describe('existing official form recommendations', () => {
	test.each(['i90', 'i765'] as const)(
		'%s stays actionable when chat sending is disabled',
		async (formType) => {
			const { button, html, onStart } = render(formType, true)

			expect(Boolean(button.isDisabled)).toBe(false)
			expect(html).not.toContain('disabled=""')
			button.onPress!()
			await vi.waitFor(() =>
				expect(state.openURL).toHaveBeenCalledWith(
					formType === 'i90' ? 'https://www.uscis.gov/i-90' : 'https://www.uscis.gov/i-765',
				),
			)
			expect(onStart).not.toHaveBeenCalled()
		},
	)

	test('preserves error feedback when the system cannot open the link', async () => {
		state.openURL.mockRejectedValue(new Error('unavailable'))
		const { button } = render('i90', true)
		button.onPress!()
		await vi.waitFor(() =>
			expect(state.alert).toHaveBeenCalledWith(
				'Could not open this link',
				'Please try again when you have a connection.',
			),
		)
	})

	test('retains the disabled state for a future filing handoff', () => {
		state.filingPreparation = true
		const { button, html } = render('i90', true)
		expect(button.isDisabled).toBe(true)
		expect(html).toContain('disabled=""')
		expect(state.openURL).not.toHaveBeenCalled()
	})
})
