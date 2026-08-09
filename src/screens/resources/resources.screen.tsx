import { BodyScrollView } from '@/components/core'
import { StyledLucideIcon } from '@/components/styled-icon'
import type { ComponentProps } from 'react'
import { ListGroup, Separator, Typography } from 'heroui-native'
import { Alert, Linking, View } from 'react-native'

type ResourceLink = {
	title: string
	detail: string
	url: string
	icon: ComponentProps<typeof StyledLucideIcon>['name']
}

// Curated, static, official-only links — the first-review Resources surface
// deliberately has no feeds or dynamic content (release-policy.test.ts scans
// this file's source to keep it that way).
const USCIS_TOOLS: readonly ResourceLink[] = [
	{
		title: 'Case status',
		detail: 'USCIS Case Status Online',
		url: 'https://www.uscis.gov/casestatus',
		icon: 'search',
	},
	{
		title: 'Processing times',
		detail: 'Estimates by form and office',
		url: 'https://www.uscis.gov/processingtimes',
		icon: 'clock-3',
	},
	{
		title: 'Change of address',
		detail: 'Official address-change tools',
		url: 'https://www.uscis.gov/addresschange',
		icon: 'map-pin-house',
	},
	{
		title: 'All online tools',
		detail: 'Appointments, e-Requests, forms',
		url: 'https://www.uscis.gov/tools',
		icon: 'wrench',
	},
] as const

const LEGAL_HELP: readonly ResourceLink[] = [
	{
		title: 'Find legal representation',
		detail: 'U.S. Department of Justice directory',
		url: 'https://www.justice.gov/eoir/find-legal-representation',
		icon: 'scale',
	},
] as const

async function openOfficialUrl(url: string): Promise<void> {
	try {
		await Linking.openURL(url)
	} catch {
		Alert.alert('Could not open this link', 'Please try again when you have a connection.')
	}
}

function LinkGroup({ label, links }: { label: string; links: readonly ResourceLink[] }) {
	return (
		<View className="gap-tight">
			<Typography.Paragraph color="muted" className="ml-hairline text-sm">
				{label}
			</Typography.Paragraph>
			<ListGroup>
				{links.map((link, index) => (
					<View key={link.url}>
						{index > 0 ? <Separator className="mx-card" /> : null}
						<ListGroup.Item
							accessibilityRole="link"
							// An explicit label suppresses ItemDescription for screen readers;
							// fold the detail in so VoiceOver announces the destination too.
							accessibilityLabel={`${link.title}, ${link.detail}`}
							onPress={() => void openOfficialUrl(link.url)}
						>
							<ListGroup.ItemPrefix>
								<View className="size-10 items-center justify-center rounded-full bg-surface-secondary">
									<StyledLucideIcon name={link.icon} size={18} className="text-accent" />
								</View>
							</ListGroup.ItemPrefix>
							<ListGroup.ItemContent>
								<ListGroup.ItemTitle>{link.title}</ListGroup.ItemTitle>
								<ListGroup.ItemDescription>{link.detail}</ListGroup.ItemDescription>
							</ListGroup.ItemContent>
							<StyledLucideIcon name="arrow-up-right" size={16} className="text-muted" />
						</ListGroup.Item>
					</View>
				))}
			</ListGroup>
		</View>
	)
}

/**
 * The Resources tab (reshaped for the App Store release): grouped official
 * links in the same inset-list idiom as the Account tab. Every row opens
 * USCIS.gov or Justice.gov in the system browser; the independence
 * disclaimer lives in one calm footer line instead of a banner.
 */
export function ResourcesScreen() {
	return (
		<BodyScrollView contentContainerClassName="gap-section pt-tight pb-card">
			<LinkGroup label="USCIS tools" links={USCIS_TOOLS} />
			<LinkGroup label="Legal help" links={LEGAL_HELP} />
			<Typography.Paragraph color="muted" className="px-card text-center text-xs leading-relaxed">
				Links open official USCIS.gov and Justice.gov pages. Immifile is independent, not a
				government agency, and does not give legal advice.
			</Typography.Paragraph>
		</BodyScrollView>
	)
}
