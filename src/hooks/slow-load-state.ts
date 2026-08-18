export type SlowLoadState = 'loading' | 'stalled' | 'ready'

export const SLOW_LOAD_RETRY_MESSAGE =
	'Still loading. Check your connection; we’ll keep trying automatically.'

/** Presentation state for subscriptions that retry in the background. */
export function resolveSlowLoadState(isLoading: boolean, isSlow: boolean): SlowLoadState {
	if (!isLoading) return 'ready'
	return isSlow ? 'stalled' : 'loading'
}
