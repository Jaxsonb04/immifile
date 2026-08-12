export function assistantQuotaCopy(remaining: number, limit: number): string {
	return remaining <= 0
		? 'Limit reached — resets at midnight UTC'
		: `${remaining} of ${limit} left today`
}
