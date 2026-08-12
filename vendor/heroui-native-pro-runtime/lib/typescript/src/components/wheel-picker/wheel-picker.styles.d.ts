/**
 * Root style definition.
 *
 * Slots:
 * - `container` — outer viewport wrapping the FlatList and overlays.
 * - `contentContainer` — FlatList `contentContainerStyle` carrier; receives
 *   the vertical centering padding (computed at runtime from
 *   `itemHeight` and `visibleCount`).
 * - `item` — per-row animated container.
 * - `itemLabel` — default label text inside a row.
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The `item` slot animates:
 * - `opacity` - Distance-based fade
 * - `transform` (scale) - Distance-based scale
 *
 * The `itemLabel` slot animates `color` via `interpolateColor`. Defaults
 * to theme `[foreground, accent-soft-foreground]`; override with
 * `animation.labelColor` on the root.
 *
 * To customize the animation ranges, use the `animation` prop on `WheelPicker`:
 * ```tsx
 * <WheelPicker
 *   animation={{
 *     opacity: { value: [0.1, 1] },
 *     scale: { value: [0.7, 1] },
 *     labelColor: { value: ['#888', '#000'] },
 *   }}
 * />
 * ```
 *
 * To disable animated styles entirely, set `animation="disabled"` on the root.
 */
declare const root: import("tailwind-variants").TVReturnType<{
    isDisabled: {
        true: {
            container: string;
        };
        false: {};
    };
}, {
    container: string;
    contentContainer: string;
    item: string;
    itemLabel: string;
}, undefined, {
    isDisabled: {
        true: {
            container: string;
        };
        false: {};
    };
}, {
    container: string;
    contentContainer: string;
    item: string;
    itemLabel: string;
}, import("tailwind-variants").TVReturnType<{
    isDisabled: {
        true: {
            container: string;
        };
        false: {};
    };
}, {
    container: string;
    contentContainer: string;
    item: string;
    itemLabel: string;
}, undefined, unknown, unknown, undefined>>;
/**
 * Indicator style definition.
 *
 * Slots:
 * - `wrapper` — absolutely-positioned band centered on the wheel viewport.
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
 * Combined `tailwind-variants` slots for the wheel picker root, indicator, and mask.
 */
export declare const wheelPickerClassNames: import("../../helpers/internal/types").CombinedStyles<{
    root: import("tailwind-variants").TVReturnType<{
        isDisabled: {
            true: {
                container: string;
            };
            false: {};
        };
    }, {
        container: string;
        contentContainer: string;
        item: string;
        itemLabel: string;
    }, undefined, {
        isDisabled: {
            true: {
                container: string;
            };
            false: {};
        };
    }, {
        container: string;
        contentContainer: string;
        item: string;
        itemLabel: string;
    }, import("tailwind-variants").TVReturnType<{
        isDisabled: {
            true: {
                container: string;
            };
            false: {};
        };
    }, {
        container: string;
        contentContainer: string;
        item: string;
        itemLabel: string;
    }, undefined, unknown, unknown, undefined>>;
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
/** Slot type for the root style definition. */
export type WheelPickerRootSlots = keyof ReturnType<typeof root>;
/** Slot type for the indicator style definition. */
export type WheelPickerIndicatorSlots = keyof ReturnType<typeof indicator>;
/** Slot type for the mask style definition. */
export type WheelPickerMaskSlots = keyof ReturnType<typeof mask>;
export {};
//# sourceMappingURL=wheel-picker.styles.d.ts.map