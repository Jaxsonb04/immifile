/**
 * Date column style. The `container` slot claims a `2`-unit flex weight so the
 * day track occupies 40% of the row against the `1`-unit time tracks
 * (2:1:1:1 → 40% / 20% / 20% / 20%). The `itemLabel` slot keeps the label
 * compact so longer day labels (e.g. `"Wed, Jun 3"`) stay legible while
 * scrolling.
 */
declare const date: import("tailwind-variants").TVReturnType<{
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            container?: import("tailwind-merge").ClassNameValue;
            itemLabel?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {
    [x: string]: {
        [x: string]: import("tailwind-merge").ClassNameValue | {
            container?: import("tailwind-merge").ClassNameValue;
            itemLabel?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    container: string;
    itemLabel: string;
}, undefined, {
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            container?: import("tailwind-merge").ClassNameValue;
            itemLabel?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    container: string;
    itemLabel: string;
}, import("tailwind-variants").TVReturnType<unknown, {
    container: string;
    itemLabel: string;
}, undefined, unknown, unknown, undefined>>;
/**
 * Hour column style. The `container` slot claims a single flex unit (20% of
 * the row). The `itemLabel` slot keeps the numerals tabular so digits occupy a
 * constant width while scrolling.
 */
declare const hour: import("tailwind-variants").TVReturnType<{
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            container?: import("tailwind-merge").ClassNameValue;
            itemLabel?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {
    [x: string]: {
        [x: string]: import("tailwind-merge").ClassNameValue | {
            container?: import("tailwind-merge").ClassNameValue;
            itemLabel?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    container: string;
    itemLabel: string;
}, undefined, {
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            container?: import("tailwind-merge").ClassNameValue;
            itemLabel?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    container: string;
    itemLabel: string;
}, import("tailwind-variants").TVReturnType<unknown, {
    container: string;
    itemLabel: string;
}, undefined, unknown, unknown, undefined>>;
/**
 * Minute column style. The `container` slot claims a single flex unit (20% of
 * the row). The `itemLabel` slot keeps the numerals tabular so digits occupy a
 * constant width while scrolling.
 */
declare const minute: import("tailwind-variants").TVReturnType<{
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            container?: import("tailwind-merge").ClassNameValue;
            itemLabel?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {
    [x: string]: {
        [x: string]: import("tailwind-merge").ClassNameValue | {
            container?: import("tailwind-merge").ClassNameValue;
            itemLabel?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    container: string;
    itemLabel: string;
}, undefined, {
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            container?: import("tailwind-merge").ClassNameValue;
            itemLabel?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    container: string;
    itemLabel: string;
}, import("tailwind-variants").TVReturnType<unknown, {
    container: string;
    itemLabel: string;
}, undefined, unknown, unknown, undefined>>;
/**
 * Period (AM/PM) column style. The `container` slot claims a single flex unit
 * (20% of the row) so it lines up with the hour and minute tracks.
 */
declare const period: import("tailwind-variants").TVReturnType<{
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            container?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {
    [x: string]: {
        [x: string]: import("tailwind-merge").ClassNameValue | {
            container?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    container: string;
}, undefined, {
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            container?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    container: string;
}, import("tailwind-variants").TVReturnType<unknown, {
    container: string;
}, undefined, unknown, unknown, undefined>>;
/**
 * Combined class name definitions for every {@link WheelDateTimePicker} part.
 */
export declare const wheelDateTimePickerClassNames: import("../../helpers/internal/types").CombinedStyles<{
    root: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "px-5", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "px-5", unknown, unknown, undefined>>;
    date: import("tailwind-variants").TVReturnType<{
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                container?: import("tailwind-merge").ClassNameValue;
                itemLabel?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {
        [x: string]: {
            [x: string]: import("tailwind-merge").ClassNameValue | {
                container?: import("tailwind-merge").ClassNameValue;
                itemLabel?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        container: string;
        itemLabel: string;
    }, undefined, {
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                container?: import("tailwind-merge").ClassNameValue;
                itemLabel?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        container: string;
        itemLabel: string;
    }, import("tailwind-variants").TVReturnType<unknown, {
        container: string;
        itemLabel: string;
    }, undefined, unknown, unknown, undefined>>;
    hour: import("tailwind-variants").TVReturnType<{
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                container?: import("tailwind-merge").ClassNameValue;
                itemLabel?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {
        [x: string]: {
            [x: string]: import("tailwind-merge").ClassNameValue | {
                container?: import("tailwind-merge").ClassNameValue;
                itemLabel?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        container: string;
        itemLabel: string;
    }, undefined, {
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                container?: import("tailwind-merge").ClassNameValue;
                itemLabel?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        container: string;
        itemLabel: string;
    }, import("tailwind-variants").TVReturnType<unknown, {
        container: string;
        itemLabel: string;
    }, undefined, unknown, unknown, undefined>>;
    minute: import("tailwind-variants").TVReturnType<{
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                container?: import("tailwind-merge").ClassNameValue;
                itemLabel?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {
        [x: string]: {
            [x: string]: import("tailwind-merge").ClassNameValue | {
                container?: import("tailwind-merge").ClassNameValue;
                itemLabel?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        container: string;
        itemLabel: string;
    }, undefined, {
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                container?: import("tailwind-merge").ClassNameValue;
                itemLabel?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        container: string;
        itemLabel: string;
    }, import("tailwind-variants").TVReturnType<unknown, {
        container: string;
        itemLabel: string;
    }, undefined, unknown, unknown, undefined>>;
    period: import("tailwind-variants").TVReturnType<{
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                container?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {
        [x: string]: {
            [x: string]: import("tailwind-merge").ClassNameValue | {
                container?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        container: string;
    }, undefined, {
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                container?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        container: string;
    }, import("tailwind-variants").TVReturnType<unknown, {
        container: string;
    }, undefined, unknown, unknown, undefined>>;
}>;
/** Slot type for the {@link WheelDateTimePicker.Date} style definition. */
export type WheelDateTimePickerDateSlots = keyof ReturnType<typeof date>;
/** Slot type for the {@link WheelDateTimePicker.Hour} style definition. */
export type WheelDateTimePickerHourSlots = keyof ReturnType<typeof hour>;
/** Slot type for the {@link WheelDateTimePicker.Minute} style definition. */
export type WheelDateTimePickerMinuteSlots = keyof ReturnType<typeof minute>;
/** Slot type for the {@link WheelDateTimePicker.Period} style definition. */
export type WheelDateTimePickerPeriodSlots = keyof ReturnType<typeof period>;
export {};
//# sourceMappingURL=wheel-date-time-picker.styles.d.ts.map