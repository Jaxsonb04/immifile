import { BodyScrollView } from '@/components/core'
import { StyledLucideIcon } from '@/components/styled-icon'
import { Button, Surface, Typography } from 'heroui-native'
import { Alert, Linking, View } from 'react-native'

type PolicySection = {
	title: string
	body: string
}

const EFFECTIVE_DATE = 'August 9, 2026'
const SUPPORT_INFO_URL =
	process.env.EXPO_PUBLIC_SUPPORT_URL ??
	'https://jaxsonb04.github.io/immifile/support/'
const SUPPORT_EMAIL = process.env.EXPO_PUBLIC_SUPPORT_EMAIL
const PUBLIC_ISSUE_URL = 'https://github.com/Jaxsonb04/immifile/issues/new'
const USCIS_CONTACT_URL = 'https://www.uscis.gov/contactcenter'

function PolicyScreen({ intro, sections }: { intro: string; sections: readonly PolicySection[] }) {
	return (
		<BodyScrollView contentContainerClassName="gap-section py-gutter">
			<View className="gap-tight">
				<Typography.Paragraph className="leading-relaxed">{intro}</Typography.Paragraph>
				<Typography.Paragraph color="muted" className="text-xs">
					Effective {EFFECTIVE_DATE}
				</Typography.Paragraph>
			</View>
			{sections.map((section) => (
				<View key={section.title} className="gap-tight">
					<Typography.Heading className="text-lg font-semibold">{section.title}</Typography.Heading>
					<Typography.Paragraph color="muted" className="leading-relaxed">
						{section.body}
					</Typography.Paragraph>
				</View>
			))}
		</BodyScrollView>
	)
}

const PRIVACY_SECTIONS: readonly PolicySection[] = [
	{
		title: 'Data used by this release',
		body: 'Immifile creates a temporary account when you continue. If you create a permanent account, we store the name and email you provide plus authentication records. When you save a case, we store its USCIS receipt number and the status notes you enter. If you use the AI assistant, we store only a daily message counter; the conversation itself stays on your device. We also store small account preferences, such as whether you dismissed an introductory screen, and security records needed to operate the service.',
	},
	{
		title: 'How data is used',
		body: 'We use this data only to authenticate you, show your saved cases, maintain the timeline you enter, protect the service, and provide support. Immifile does not sell personal data, show advertising, or use third-party tracking or analytics.',
	},
	{
		title: 'Service providers',
		body: 'Convex hosts the application backend, database, and authentication components. Vercel hosts the sign-in endpoint every authentication request passes through, and so processes connection metadata such as IP address and user agent. When you message the AI assistant, the text you type (and the recent turns of that conversation) is sent to OpenAI to generate the reply; do not include receipt numbers or other sensitive details in assistant messages. Porkbun forwards the support address and Google provides the destination mailbox. We require each provider that accesses user data to provide the same or equal protection described in this policy and required by the App Store Review Guidelines. Your device opens official USCIS and Department of Justice links in the system browser. The filing workflow, document uploads, and public community are not available in this release.',
	},
	{
		title: 'Retention and deletion',
		body: 'A temporary account becomes eligible for permanent deletion after 48 hours. Cleanup runs hourly, so deletion occurs during an hourly cleanup after eligibility rather than at the exact 48-hour instant; a delayed or failed cleanup is retried later. A permanent account is kept until you delete it. Choose Account, then Delete account, to delete the login identity, sessions, saved cases, and other associated Immifile data. An opaque deletion-protection record may remain for up to one hour only to block requests from a stale session; it contains no saved case content, cannot restore the account, and is then removed.',
	},
	{
		title: 'Security and choices',
		body: 'Authentication credentials are transmitted over encrypted connections, and the app stores its session in device secure storage. You may browse official resources without creating a permanent account. Saving a case requires an account so the receipt number is not placed in a short-lived temporary workspace.',
	},
	{
		title: 'Account access in this release',
		body: 'This release has no self-service password reset and does not verify email addresses. Keep your password safe: there is no automated way back into an account without it, and because Immifile cannot confirm ownership of an unverified address, support cannot reset a password or delete an account on request. Delete your account from the Account tab (Delete account) while you are signed in.',
	},
	{
		title: 'Questions',
		body: 'Use the Support page for current contact options. The GitHub issue tracker is public and is only for non-sensitive app bugs or general feedback. Never use it for a privacy request or include receipt numbers, A-Numbers, addresses, passwords, or other sensitive immigration information.',
	},
]

const TERMS_SECTIONS: readonly PolicySection[] = [
	{
		title: 'General information only',
		body: 'Immifile is an independent self-help tool. It is not affiliated with USCIS, DHS, DOJ, or the U.S. government. It does not provide legal advice, legal representation, eligibility decisions, or outcome predictions.',
	},
	{
		title: 'Manual case tracker',
		body: 'The case timeline is a record you maintain yourself. Immifile does not automatically receive case updates from USCIS. Confirm every important status, deadline, address, fee, and instruction through your USCIS notice, USCIS online account, or an official .gov website.',
	},
	{
		title: 'Your responsibility',
		body: 'You are responsible for the accuracy of information you enter and for protecting access to your account. Do not use Immifile as the only source for a deadline or case decision.',
	},
	{
		title: 'Qualified help',
		body: 'For advice about your specific situation, use a licensed immigration attorney or a Department of Justice-accredited representative. The Resources tab includes an official DOJ directory.',
	},
	{
		title: 'Availability and changes',
		body: 'Online services and government websites may be unavailable or change without notice. Features may be improved or removed in later versions. These terms do not limit rights that cannot legally be limited.',
	},
]

async function openUrl(url: string): Promise<void> {
	try {
		await Linking.openURL(url)
	} catch {
		Alert.alert('Could not open this link', 'Please try again when you have a connection.')
	}
}

export function PrivacyPolicyScreen() {
	return (
		<PolicyScreen
			intro="Immifile is an independent app, not affiliated with USCIS, DHS, DOJ, or the U.S. government, and it does not provide legal advice. This policy explains the data practices of the first App Store release."
			sections={PRIVACY_SECTIONS}
		/>
	)
}

export function TermsOfUseScreen() {
	return (
		<PolicyScreen
			intro="Please read these limits before relying on Immifile."
			sections={TERMS_SECTIONS}
		/>
	)
}

export function SupportScreen() {
	return (
		<BodyScrollView contentContainerClassName="gap-section py-gutter">
			<Surface variant="secondary" className="gap-control rounded-2xl p-card">
				<View className="gap-tight">
					<Typography.Heading className="text-lg font-semibold">
						Private account and privacy help
					</Typography.Heading>
					<Typography.Paragraph color="muted" className="text-sm leading-relaxed">
						{SUPPORT_EMAIL
							? 'Email the monitored support address for account access, deletion, or privacy requests. Include only the minimum information needed; never send a password.'
							: 'A monitored private support address must be configured before this build can be released.'}
					</Typography.Paragraph>
				</View>
				{SUPPORT_EMAIL ? (
					<Button
						onPress={() =>
							void openUrl(
								`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Immifile private support')}`,
							)
						}
					>
						<Button.Label>Email support privately</Button.Label>
					</Button>
				) : null}
			</Surface>

			<Surface variant="secondary" className="gap-control rounded-2xl p-card">
				<View className="flex-row items-start gap-control">
					<StyledLucideIcon name="life-buoy" size={20} className="mt-hairline text-accent" />
					<View className="flex-1 gap-tight">
						<Typography.Heading className="text-lg font-semibold">
							Support information
						</Typography.Heading>
						<Typography.Paragraph color="muted" className="text-sm leading-relaxed">
							Read the public support page for current contact options, account deletion help, and
							the limits of public support channels.
						</Typography.Paragraph>
					</View>
				</View>
				<Button onPress={() => void openUrl(SUPPORT_INFO_URL)}>
					<Button.Label>Open support information</Button.Label>
				</Button>
			</Surface>

			<Surface variant="secondary" className="gap-control rounded-2xl p-card">
				<View className="gap-tight">
					<Typography.Heading className="text-lg font-semibold">
						Public issue tracker
					</Typography.Heading>
					<Typography.Paragraph color="muted" className="text-sm leading-relaxed">
						Creating a GitHub issue requires a GitHub account. The issue, its contents, and your
						GitHub username are public. Use it only for non-sensitive app bugs or general feedback —
						never for a privacy request or personal immigration information.
					</Typography.Paragraph>
				</View>
				<Button variant="secondary" onPress={() => void openUrl(PUBLIC_ISSUE_URL)}>
					<Button.Label>Open public issue tracker</Button.Label>
				</Button>
			</Surface>

			<Surface variant="secondary" className="gap-control rounded-2xl p-card">
				<View className="gap-tight">
					<Typography.Heading className="text-lg font-semibold">
						Case-specific help
					</Typography.Heading>
					<Typography.Paragraph color="muted" className="text-sm leading-relaxed">
						Immifile cannot answer questions about a USCIS decision. Contact USCIS or a qualified
						legal representative for help with your situation.
					</Typography.Paragraph>
				</View>
				<Button variant="secondary" onPress={() => void openUrl(USCIS_CONTACT_URL)}>
					<Button.Label>Open USCIS Contact Center</Button.Label>
				</Button>
			</Surface>
		</BodyScrollView>
	)
}
