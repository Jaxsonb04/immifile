import { TEMP_ACCOUNT_RETENTION_MS, TEMP_ACCOUNT_WARNING_MS } from '@convex/shared/tempAccounts'

const HOUR_MS = 60 * 60 * 1000
const RETENTION_HOURS = TEMP_ACCOUNT_RETENTION_MS / HOUR_MS

/**
 * Shown before an anonymous session is created and on temporary-account
 * surfaces. Keep the exact 48-hour boundary explicit: "temporary" alone does
 * not tell someone when their account will disappear.
 */
export const TEMP_ACCOUNT_START_DISCLOSURE = `To browse without signing up, Immifile creates a temporary account that remembers your intro choices. This account and its data become eligible for permanent deletion after ${RETENTION_HOURS} hours, then hourly cleanup removes them. Create an account before saving a case.`

/** One-line version of the disclosure for the Welcome screen, where the full
 * paragraph overwhelmed the entry moment. The exact hour boundary stays. */
export const TEMP_ACCOUNT_WELCOME_NOTE = `Continue starts a temporary account — deleted after ${RETENTION_HOURS} hours unless you sign up.`

/** Calm phrasing of time left before the 48-hour deletion (M6-T4). */
export function deletionTimeLeftCopy(deleteAt: number, now: number): string {
	const remaining = deleteAt - now
	if (remaining <= HOUR_MS) return 'within the hour'
	const hours = Math.round(remaining / HOUR_MS)
	if (hours === 1) return 'in about 1 hour'
	if (hours < 36) return `in about ${hours} hours`
	return `in about ${Math.round(hours / 24)} days`
}

export type TemporaryAccountNotice = {
	urgent: boolean
	title: string
	description: string
}

/**
 * Copy and tone for the always-visible Forms notice. The final 24 hours raise
 * urgency, but the notice exists for the full lifetime of the temporary
 * account so deletion is never introduced only after most of the window has
 * elapsed.
 */
export function temporaryAccountNotice(deleteAt: number, now: number): TemporaryAccountNotice {
	if (deleteAt <= now) {
		return {
			urgent: true,
			title: 'Your temporary account is eligible for deletion',
			description:
				'Its 48-hour window has ended, and hourly cleanup may delete it at any time. Create an account now if you want to keep using Immifile.',
		}
	}

	const timeLeft = deletionTimeLeftCopy(deleteAt, now)
	const urgent = deleteAt - now <= TEMP_ACCOUNT_WARNING_MS

	return {
		urgent,
		title: urgent
			? `Your temporary account becomes eligible for deletion ${timeLeft}`
			: 'Your account is temporary',
		description: `This account and everything in it becomes eligible for permanent deletion ${timeLeft}; hourly cleanup removes it after that. Create an account to keep using Immifile.`,
	}
}
