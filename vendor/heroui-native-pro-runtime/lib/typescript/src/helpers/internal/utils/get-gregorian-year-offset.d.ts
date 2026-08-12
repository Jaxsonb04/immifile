/**
 * Returns the additive offset between the Gregorian year number and the year
 * number used by the given calendar system for the same absolute instant.
 *
 * Used by the styled calendar wrappers to derive sensible default
 * `minValue` / `maxValue` year bounds for every calendar system supported by
 * `@internationalized/date`. For example, under the Buddhist calendar
 * (`buddhist`), year `1900` in Gregorian corresponds to `2443` — i.e. an
 * offset of `+543`. Using `1900` directly as a year bound inside a
 * non-Gregorian calendar would place the bound thousands of years in the
 * wrong direction.
 *
 * The list of identifiers matches the `CalendarIdentifier` union from
 * `@internationalized/date`.
 *
 * @param identifier - Calendar identifier (e.g. `"gregory"`, `"buddhist"`).
 * @returns Integer offset to add to a Gregorian year to obtain the equivalent
 * year in the given calendar system. `0` for Gregorian-based calendars
 * (`gregory`, `japanese`, `roc`) and unknown identifiers.
 */
export declare function getGregorianYearOffset(identifier: string): number;
//# sourceMappingURL=get-gregorian-year-offset.d.ts.map