import type { AnimationRootDisableAll } from '../../helpers/internal/types';
import type { CalendarCellBodyAnimation } from './calendar.types';
export declare function useCalendarRootAnimation(options: {
    animation: AnimationRootDisableAll | undefined;
}): {
    isAllAnimationsDisabled: boolean;
};
/**
 * Press scale for `Calendar.CellBody` / `RangeCalendar.CellBody`.
 * Pass `isPressed` only when the day cell is pressed and interaction is allowed (not disabled /
 * unavailable).
 */
export declare function useCalendarCellBodyAnimation(options: {
    animation: CalendarCellBodyAnimation | undefined;
    isPressed: boolean;
}): {
    rCellBodyStyle: import("react-native-reanimated/lib/typescript/hook/commonTypes").AnimatedStyleHandle<{
        transform: {
            scale: number;
        }[];
    }>;
};
//# sourceMappingURL=calendar.animation.d.ts.map