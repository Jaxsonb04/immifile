import Lucide from '@react-native-vector-icons/lucide/static'
import type { ComponentProps, ReactNode } from 'react'
import { Platform } from 'react-native'
import { withUniwind } from 'uniwind'

// Immifile uses ONE icon family: Lucide. Its even 2px stroke matches Inter's
// weight and keeps every glyph looking drawn for this system. Do not add
// other families — pick the closest Lucide glyph instead.

const UniwindLucideIcon = withUniwind(Lucide)

/** Decorative glyphs must not become private-use characters in VoiceOver. */
export function StyledLucideIcon(props: ComponentProps<typeof UniwindLucideIcon>) {
	const labelled = Boolean(props.accessibilityLabel)
	return (
		<UniwindLucideIcon
			accessible={labelled}
			accessibilityElementsHidden={!labelled}
			importantForAccessibility={labelled ? 'auto' : 'no'}
			{...props}
		/>
	)
}

type LucideIconName = ComponentProps<typeof Lucide>['name']

/** Config for styledIcon. Lucide is the app's only icon family. */
export type StyledIconConfig = { family: 'lucide'; name: LucideIconName }

/** Props passed to the icon component (size and className). */
export type StyledIconProps = {
	size?: number
	className?: string
}

/** Icon component returned by styledIcon (e.g. for quick actions or lists). */
export type StyledIconComponent = (props: StyledIconProps) => ReactNode

/**
 * Returns a styled Lucide icon component for the given name.
 * TypeScript enforces valid Lucide icon names.
 *
 * @example
 * const BookIcon = styledIcon({ family: 'lucide', name: 'book' })
 */
export function styledIcon(config: StyledIconConfig): StyledIconComponent {
	const iconComponent: StyledIconComponent = ({ size = 22, className }: StyledIconProps) => (
		<StyledLucideIcon
			name={config.name}
			size={size}
			className={className}
			// for web, add color=inherit
			{...(Platform.OS === 'web' ? { color: 'inherit' } : {})}
		/>
	)
	Object.assign(iconComponent, { displayName: `lucide-${String(config.name)}-icon` })
	return iconComponent
}
