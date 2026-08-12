/**
 * Indicator style definition.
 *
 * Slots:
 * - `wrapper` — absolutely-positioned band centered on the group viewport.
 * - `highlight` — filled rectangle rendered inside the wrapper.
 */
declare const indicator: import("tailwind-variants").TVReturnType<{
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            wrapper?: import("tailwind-merge").ClassNameValue;
            highlight?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {
    [x: string]: {
        [x: string]: import("tailwind-merge").ClassNameValue | {
            wrapper?: import("tailwind-merge").ClassNameValue;
            highlight?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    wrapper: string;
    highlight: string;
}, undefined, {
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            wrapper?: import("tailwind-merge").ClassNameValue;
            highlight?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    wrapper: string;
    highlight: string;
}, import("tailwind-variants").TVReturnType<unknown, {
    wrapper: string;
    highlight: string;
}, undefined, unknown, unknown, undefined>>;
/**
 * Mask style definition.
 *
 * Slots:
 * - `top` — top fade overlay.
 * - `bottom` — bottom fade overlay.
 */
declare const mask: import("tailwind-variants").TVReturnType<{
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            bottom?: import("tailwind-merge").ClassNameValue;
            top?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {
    [x: string]: {
        [x: string]: import("tailwind-merge").ClassNameValue | {
            bottom?: import("tailwind-merge").ClassNameValue;
            top?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    top: string;
    bottom: string;
}, undefined, {
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            bottom?: import("tailwind-merge").ClassNameValue;
            top?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    top: string;
    bottom: string;
}, import("tailwind-variants").TVReturnType<unknown, {
    top: string;
    bottom: string;
}, undefined, unknown, unknown, undefined>>;
/**
 * Combined `tailwind-variants` slots for the wheel picker group root,
 * indicator, and mask.
 */
export declare const wheelPickerGroupClassNames: import("../../helpers/internal/types").CombinedStyles<{
    root: import("tailwind-variants").TVReturnType<{
        isDisabled: {
            true: string;
            false: string;
        };
    }, undefined, "flex-row overflow-hidden", {
        isDisabled: {
            true: string;
            false: string;
        };
    }, undefined, import("tailwind-variants").TVReturnType<{
        isDisabled: {
            true: string;
            false: string;
        };
    }, undefined, "flex-row overflow-hidden", unknown, unknown, undefined>>;
    indicator: import("tailwind-variants").TVReturnType<{
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                wrapper?: import("tailwind-merge").ClassNameValue;
                highlight?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {
        [x: string]: {
            [x: string]: import("tailwind-merge").ClassNameValue | {
                wrapper?: import("tailwind-merge").ClassNameValue;
                highlight?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        wrapper: string;
        highlight: string;
    }, undefined, {
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                wrapper?: import("tailwind-merge").ClassNameValue;
                highlight?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        wrapper: string;
        highlight: string;
    }, import("tailwind-variants").TVReturnType<unknown, {
        wrapper: string;
        highlight: string;
    }, undefined, unknown, unknown, undefined>>;
    mask: import("tailwind-variants").TVReturnType<{
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                bottom?: import("tailwind-merge").ClassNameValue;
                top?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {
        [x: string]: {
            [x: string]: import("tailwind-merge").ClassNameValue | {
                bottom?: import("tailwind-merge").ClassNameValue;
                top?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        top: string;
        bottom: string;
    }, undefined, {
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                bottom?: import("tailwind-merge").ClassNameValue;
                top?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        top: string;
        bottom: string;
    }, import("tailwind-variants").TVReturnType<unknown, {
        top: string;
        bottom: string;
    }, undefined, unknown, unknown, undefined>>;
}>;
export declare const styleSheet: {
    indicatorHighlight: {
        borderCurve: "continuous";
    };
};
/** Slot type for the indicator style definition. */
export type WheelPickerGroupIndicatorSlots = keyof ReturnType<typeof indicator>;
/** Slot type for the mask style definition. */
export type WheelPickerGroupMaskSlots = keyof ReturnType<typeof mask>;
export {};
//# sourceMappingURL=wheel-picker-group.styles.d.ts.map