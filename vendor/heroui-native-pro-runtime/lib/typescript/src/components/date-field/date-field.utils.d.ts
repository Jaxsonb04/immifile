declare const CalendarDate: typeof import("@internationalized/date").CalendarDate;
type CalendarDate = InstanceType<typeof CalendarDate>;
/**
 * Formats a calendar date as `dd/mm/yyyy` (fixed display for `DateField` input).
 */
export declare function formatCalendarDateDdMmYyyy(date: CalendarDate): string;
/**
 * Strips non-digits and caps at eight digits (ddmmyyyy) for masked entry.
 */
export declare function extractDateDigits(text: string): string;
/**
 * Builds a `dd/mm/yyyy` string from up to eight digits (day, month, year groups).
 *
 * When **typing forward**, inserts a slash as soon as a 2-digit segment is complete (`11` → `11/`,
 * four digits → `dd/mm/`) so separators appear without typing `/`.
 *
 * When **deleting** (shorter raw text or fewer digits than before), formats **without** trailing
 * slashes so the user can backspace through `11/` → `11` → `1` and `11/03/` → `11/03` → … .
 *
 * @param text - Current `TextInput` value (may include `/` or not).
 * @param previousFormatted - Last committed mask string from state; used to detect deletion.
 */
export declare function formatDigitsToDdMmYyyyMask(text: string, previousFormatted?: string): string;
/**
 * Parses a strict `dd/mm/yyyy` string (day and month may be one or two digits).
 *
 * @returns `CalendarDate` when valid, otherwise `undefined`.
 */
export declare function tryParseDdMmYyyy(text: string): CalendarDate | undefined;
/**
 * Lenient date-string parsing for app code (not used by `DateField` loose mode, which does not parse on blur).
 * Supported inputs:
 *
 * - ISO `yyyy-mm-dd` via `parseDate`
 * - `dd/mm/yyyy` or `dd-mm-yyyy` (day-first)
 * - `yyyy/mm/dd` or `yyyy-mm-dd` with slashes (ISO-style with slashes)
 *
 * Two-digit years are expanded: `00-69` → `2000-2069`, else `1900-1969`.
 *
 * @returns `CalendarDate` when a supported string parses cleanly, otherwise `undefined`.
 */
export declare function tryParseLooseDateString(text: string): CalendarDate | undefined;
export {};
//# sourceMappingURL=date-field.utils.d.ts.map