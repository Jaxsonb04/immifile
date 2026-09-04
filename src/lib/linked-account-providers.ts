type LinkedAccountsResult = {
	data?: { providerId: string }[] | null
	error?: { message?: string } | null
}

/** Empty means verification failed or no supported method exists; never stay loading. */
export function resolveLinkedAccountProviders(result: LinkedAccountsResult): string[] {
	if (result.error || !result.data) return []
	return [...new Set(result.data.map((account) => account.providerId))]
}
