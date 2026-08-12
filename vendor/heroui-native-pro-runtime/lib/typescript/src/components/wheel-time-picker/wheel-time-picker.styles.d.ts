/**
 * Hour column style. The `itemLabel` slot keeps the numerals tabular so digits
 * occupy a constant width while scrolling.
 */
declare const hour: import("tailwind-variants").TVReturnType<{
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            itemLabel?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {
    [x: string]: {
        [x: string]: import("tailwind-merge").ClassNameValue | {
            itemLabel?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    itemLabel: string;
}, undefined, {
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            itemLabel?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    itemLabel: string;
}, import("tailwind-variants").TVReturnType<unknown, {
    itemLabel: string;
}, undefined, unknown, unknown, undefined>>;
/**
 * Minute column style. The `itemLabel` slot keeps the numerals tabular so
 * digits occupy a constant width while scrolling.
 */
declare const minute: import("tailwind-variants").TVReturnType<{
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            itemLabel?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {
    [x: string]: {
        [x: string]: import("tailwind-merge").ClassNameValue | {
            itemLabel?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    itemLabel: string;
}, undefined, {
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            itemLabel?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    itemLabel: string;
}, import("tailwind-variants").TVReturnType<unknown, {
    itemLabel: string;
}, undefined, unknown, unknown, undefined>>;
/**
 * Combined class name definitions for every {@link WheelTimePicker} part.
 */
export declare const wheelTimePickerClassNames: import("../../helpers/internal/types").CombinedStyles<{
    root: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "", unknown, unknown, undefined>>;
    hour: import("tailwind-variants").TVReturnType<{
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                itemLabel?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {
        [x: string]: {
            [x: string]: import("tailwind-merge").ClassNameValue | {
                itemLabel?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        itemLabel: string;
    }, undefined, {
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                itemLabel?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        itemLabel: string;
    }, import("tailwind-variants").TVReturnType<unknown, {
        itemLabel: string;
    }, undefined, unknown, unknown, undefined>>;
    minute: import("tailwind-variants").TVReturnType<{
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                itemLabel?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {
        [x: string]: {
            [x: string]: import("tailwind-merge").ClassNameValue | {
                itemLabel?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        itemLabel: string;
    }, undefined, {
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                itemLabel?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        itemLabel: string;
    }, import("tailwind-variants").TVReturnType<unknown, {
        itemLabel: string;
    }, undefined, unknown, unknown, undefined>>;
}>;
/** Slot type for the {@link WheelTimePicker.Hour} style definition. */
export type WheelTimePickerHourSlots = keyof ReturnType<typeof hour>;
/** Slot type for the {@link WheelTimePicker.Minute} style definition. */
export type WheelTimePickerMinuteSlots = keyof ReturnType<typeof minute>;
export {};
//# sourceMappingURL=wheel-time-picker.styles.d.ts.map