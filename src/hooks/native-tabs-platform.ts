export function supportsNativeTabMinimize(platform: string, version: number | string): boolean {
	const major = Number.parseInt(String(version).split('.')[0] ?? '', 10)
	return platform === 'ios' && Number.isFinite(major) && major >= 26
}
