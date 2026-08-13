import { cronJobs } from 'convex/server'
import { internal } from './_generated/api'
import releasePolicy from '../release-policy.json'

// Scheduled jobs. The first release has no dynamic news surface, so its
// six-hour refresh remains dormant with Community. Anonymous-account cleanup
// stays active because temporary browsing sessions ship in every release.

const crons = cronJobs()

if (releasePolicy.community) {
	crons.interval('refresh USCIS news cache', { hours: 6 }, internal.news.fetchNews, {})
}

crons.interval(
	'clean up expired temp accounts',
	{ hours: 1 },
	internal.tempAccounts.cleanupTempAccounts,
	{},
)

crons.interval(
	'clean up expired auth rate limits',
	{ hours: 1 },
	internal.authRateLimit.cleanupExpired,
	{},
)

export default crons
