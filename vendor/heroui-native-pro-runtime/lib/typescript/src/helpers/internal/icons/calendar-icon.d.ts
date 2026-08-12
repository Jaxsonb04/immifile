import React from 'react';
export interface CalendarIconProps {
    /**
     * Width of the icon in logical pixels (height scales to preserve the 13×14 viewBox aspect ratio)
     * @default 16
     */
    size?: number;
    /**
     * Fill color
     * @default currentColor
     */
    color?: string;
}
/**
 * Calendar glyph used by `DatePicker.TriggerIndicator` (and available for custom layouts).
 */
export declare const CalendarIcon: React.FC<CalendarIconProps>;
//# sourceMappingURL=calendar-icon.d.ts.map