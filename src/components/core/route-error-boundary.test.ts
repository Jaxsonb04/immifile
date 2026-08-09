// @vitest-environment node

import { createElement, type PropsWithChildren } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, test, vi } from 'vitest'
import { RouteErrorBoundary } from './route-error-boundary'

vi.mock('react-native', async () => {
	const { createElement } = await import('react')
	type HostProps = PropsWithChildren<Record<string, unknown>>

	return {
		Pressable: ({ children, onPress: _onPress, ...props }: HostProps) =>
			createElement('button', props, children),
		Text: ({ children, ...props }: HostProps) => createElement('span', props, children),
		View: ({ children, ...props }: HostProps) => createElement('div', props, children),
	}
})

// This reproduces HeroUI's strict text context without pulling the native
// runtime into Vitest. The root route boundary must remain renderable when the
// layout (and therefore HeroUINativeProvider) has been replaced after a throw.
vi.mock('heroui-native', () => {
	const missingProvider = () => {
		throw new Error('HeroUI provider is unavailable')
	}

	return {
		Button: Object.assign(missingProvider, { Label: missingProvider }),
		Spinner: missingProvider,
		Typography: { Heading: missingProvider, Paragraph: missingProvider },
	}
})

describe('RouteErrorBoundary', () => {
	test('renders a recovery screen without app-level providers', () => {
		const markup = renderToStaticMarkup(
			createElement(RouteErrorBoundary, {
				error: new Error(''),
				retry: vi.fn(async () => undefined),
			}),
		)

		expect(markup).toContain('Something went wrong')
		expect(markup).toContain('Immifile could not load this screen')
		expect(markup).toContain('Try again')
	})
})
