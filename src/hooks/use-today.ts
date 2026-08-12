import { useSyncExternalStore } from 'react'

// Small buffer avoids an early timer firing in the last milliseconds of the
// old UTC day and then waiting another full day to publish the new snapshot.
const DAY_BOUNDARY_BUFFER_MS = 50

export function millisecondsUntilNextUtcDay(now: number): number {
	const date = new Date(now)
	const nextUtcMidnight = Date.UTC(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate() + 1,
	)
	return Math.max(1, nextUtcMidnight - now + DAY_BOUNDARY_BUFFER_MS)
}

const subscribeUtcDay = (onDayChange: () => void): (() => void) => {
	let timer: ReturnType<typeof setTimeout>
	const schedule = () => {
		timer = setTimeout(() => {
			onDayChange()
			schedule()
		}, millisecondsUntilNextUtcDay(Date.now()))
	}
	schedule()
	return () => clearTimeout(timer)
}
const currentIsoDay = () => new Date().toISOString().slice(0, 10)

/** Today as YYYY-MM-DD (UTC), stable within the hour. */
export function useToday(): string {
	return useSyncExternalStore(subscribeUtcDay, currentIsoDay, currentIsoDay)
}
