/** Hidden, preloaded Assistant content must not reconfigure the native header
 * while a first-use guide owns the visible route. */
export function shouldUseAssistantContentHeader(contentAccessible: boolean): boolean {
	return contentAccessible
}
