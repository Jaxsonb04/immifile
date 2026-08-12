export declare const progressBarClassNames: import("../../helpers/internal/types").CombinedStyles<{
    root: import("tailwind-variants").TVReturnType<{
        isDisabled: {
            true: string;
            false: string;
        };
    }, undefined, "w-full gap-2", {
        isDisabled: {
            true: string;
            false: string;
        };
    }, undefined, import("tailwind-variants").TVReturnType<{
        isDisabled: {
            true: string;
            false: string;
        };
    }, undefined, "w-full gap-2", unknown, unknown, undefined>>;
    labelRow: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "flex-row items-center justify-between", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "flex-row items-center justify-between", unknown, unknown, undefined>>;
    track: import("tailwind-variants").TVReturnType<{
        size: {
            sm: string;
            md: string;
            lg: string;
        };
    }, undefined, "w-full rounded-md bg-default overflow-hidden", {
        size: {
            sm: string;
            md: string;
            lg: string;
        };
    }, undefined, import("tailwind-variants").TVReturnType<{
        size: {
            sm: string;
            md: string;
            lg: string;
        };
    }, undefined, "w-full rounded-md bg-default overflow-hidden", unknown, unknown, undefined>>;
    fill: import("tailwind-variants").TVReturnType<{
        color: {
            default: string;
            accent: string;
            success: string;
            warning: string;
            danger: string;
        };
    }, undefined, "h-full rounded-md", {
        color: {
            default: string;
            accent: string;
            success: string;
            warning: string;
            danger: string;
        };
    }, undefined, import("tailwind-variants").TVReturnType<{
        color: {
            default: string;
            accent: string;
            success: string;
            warning: string;
            danger: string;
        };
    }, undefined, "h-full rounded-md", unknown, unknown, undefined>>;
    label: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "text-sm font-medium text-foreground", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "text-sm font-medium text-foreground", unknown, unknown, undefined>>;
    valueLabel: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "text-sm font-medium text-muted", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "text-sm font-medium text-muted", unknown, unknown, undefined>>;
}>;
/**
 * StyleSheet for native-only properties that cannot be expressed via Tailwind.
 */
export declare const progressBarStyleSheet: {
    track: {
        borderCurve: "continuous";
    };
    valueLabel: {
        fontVariant: "tabular-nums"[];
    };
};
//# sourceMappingURL=progress-bar.styles.d.ts.map