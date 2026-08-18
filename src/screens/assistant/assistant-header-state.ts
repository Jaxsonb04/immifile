/** The Assistant consent header takes ownership during the covered preparation
 * phase, after the guide is acknowledged but before its cover fades away. */
export function shouldUseAssistantContentHeader(contentHeaderReady: boolean): boolean {
	return contentHeaderReady
}
