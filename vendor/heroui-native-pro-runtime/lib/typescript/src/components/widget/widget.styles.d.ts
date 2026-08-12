/**
 * `LegendItem` is the only compound part that renders multiple elements
 * itself (wrapper > dot + label), so it owns a slotted `tv()` instance and
 * its props expose `classNames` / `styles` typed against these slots.
 */
declare const legendItem: import("tailwind-variants").TVReturnType<{
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            label?: import("tailwind-merge").ClassNameValue;
            dot?: import("tailwind-merge").ClassNameValue;
            wrapper?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {
    [x: string]: {
        [x: string]: import("tailwind-merge").ClassNameValue | {
            label?: import("tailwind-merge").ClassNameValue;
            dot?: import("tailwind-merge").ClassNameValue;
            wrapper?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    wrapper: string;
    dot: string;
    label: string;
}, undefined, {
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            label?: import("tailwind-merge").ClassNameValue;
            dot?: import("tailwind-merge").ClassNameValue;
            wrapper?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    wrapper: string;
    dot: string;
    label: string;
}, import("tailwind-variants").TVReturnType<unknown, {
    wrapper: string;
    dot: string;
    label: string;
}, undefined, unknown, unknown, undefined>>;
export declare const widgetClassNames: import("../../helpers/internal/types").CombinedStyles<{
    root: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "bg-surface-secondary rounded-2xl p-1.5", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "bg-surface-secondary rounded-2xl p-1.5", unknown, unknown, undefined>>;
    header: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "flex-row items-center justify-between gap-3 px-2 pb-1.5 pt-0.5", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "flex-row items-center justify-between gap-3 px-2 pb-1.5 pt-0.5", unknown, unknown, undefined>>;
    title: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "text-foreground text-sm font-medium", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "text-foreground text-sm font-medium", unknown, unknown, undefined>>;
    description: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "text-muted text-xs", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "text-muted text-xs", unknown, unknown, undefined>>;
    content: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "bg-surface overflow-hidden rounded-xl p-4 shadow-surface", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "bg-surface overflow-hidden rounded-xl p-4 shadow-surface", unknown, unknown, undefined>>;
    footer: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "flex-row items-center gap-3 px-2 pt-1.5 pb-0.5", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "flex-row items-center gap-3 px-2 pt-1.5 pb-0.5", unknown, unknown, undefined>>;
    legend: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "flex-row items-center gap-3", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "flex-row items-center gap-3", unknown, unknown, undefined>>;
    legendItem: import("tailwind-variants").TVReturnType<{
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                label?: import("tailwind-merge").ClassNameValue;
                dot?: import("tailwind-merge").ClassNameValue;
                wrapper?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {
        [x: string]: {
            [x: string]: import("tailwind-merge").ClassNameValue | {
                label?: import("tailwind-merge").ClassNameValue;
                dot?: import("tailwind-merge").ClassNameValue;
                wrapper?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        wrapper: string;
        dot: string;
        label: string;
    }, undefined, {
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                label?: import("tailwind-merge").ClassNameValue;
                dot?: import("tailwind-merge").ClassNameValue;
                wrapper?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        wrapper: string;
        dot: string;
        label: string;
    }, import("tailwind-variants").TVReturnType<unknown, {
        wrapper: string;
        dot: string;
        label: string;
    }, undefined, unknown, unknown, undefined>>;
}>;
/** Slot keys for the {@link Widget.LegendItem} part. */
export type LegendItemSlots = keyof ReturnType<typeof legendItem>;
/**
 * Native-only style sheet for properties Tailwind cannot express. The
 * `borderCurve` entries apply iOS continuous (squircle) corner curves to
 * the outer shell and the elevated content card.
 */
export declare const widgetStyleSheet: {
    root: {
        borderCurve: "continuous";
    };
    content: {
        borderCurve: "continuous";
    };
};
export default widgetClassNames;
//# sourceMappingURL=widget.styles.d.ts.map