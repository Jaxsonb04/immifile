export const ASSISTANT_CONSENT_COPY = {
	title: 'Before you chat',
	summary: 'Your current and recent messages are sent to OpenAI for a reply.',
	storageTitle: 'Retention',
	storageBody:
		'Immifile does not store the transcript—only your daily message count and consent choice. OpenAI may retain prompts and replies up to 30 days for abuse monitoring.',
	privacyTitle: 'Keep details private',
	privacyBody: 'Don’t enter receipt numbers, A-Numbers, addresses, passwords, or documents.',
	withdrawal: 'Withdraw anytime: Account → Privacy policy.',
	accept: 'Agree & continue',
	decline: 'Not now',
} as const
