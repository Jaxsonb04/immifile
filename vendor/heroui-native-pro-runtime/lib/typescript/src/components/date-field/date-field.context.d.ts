import type { DateFieldInputContextValue, DateFieldInputMode } from './date-field.types';
declare const useDateField: () => DateFieldInputContextValue;
/**
 * Provides draft text state and blur commit for `DateField.Input`.
 * `masked` commits parsed `dd/mm/yyyy` on blur; `loose` does not parse or commit on blur (plain text).
 * Must render inside `DatePickerProvider` (inside `DateField` root).
 */
declare function DateFieldInputProvider({ inputMode, children, }: {
    inputMode: DateFieldInputMode;
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export { DateFieldInputProvider, useDateField };
//# sourceMappingURL=date-field.context.d.ts.map