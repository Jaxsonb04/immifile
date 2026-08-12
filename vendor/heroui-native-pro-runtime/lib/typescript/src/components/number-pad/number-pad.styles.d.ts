/** Combined Tailwind class definitions for all NumberPad parts. */
export declare const numberPadClassNames: import("../../helpers/internal/types").CombinedStyles<{
    root: import("tailwind-variants").TVReturnType<{
        isDisabled: {
            true: string;
            false: string;
        };
    }, undefined, "flex-col gap-2 w-full", {
        isDisabled: {
            true: string;
            false: string;
        };
    }, undefined, import("tailwind-variants").TVReturnType<{
        isDisabled: {
            true: string;
            false: string;
        };
    }, undefined, "flex-col gap-2 w-full", unknown, unknown, undefined>>;
    row: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "flex-row items-stretch gap-1.5 w-full min-h-16", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "flex-row items-stretch gap-1.5 w-full min-h-16", unknown, unknown, undefined>>;
    key: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, string[], {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, string[], unknown, unknown, undefined>>;
    keyLabel: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "text-foreground font-semibold text-center text-3xl", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "text-foreground font-semibold text-center text-3xl", unknown, unknown, undefined>>;
    backspace: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "bg-transparent", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "bg-transparent", unknown, unknown, undefined>>;
    spacerActive: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "bg-transparent", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "bg-transparent", unknown, unknown, undefined>>;
    spacerInactive: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "flex-1", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "flex-1", unknown, unknown, undefined>>;
}>;
export declare const numberPadStyleSheet: {
    keyContainer: {
        borderCurve: "continuous";
    };
    keyLabel: {
        fontVariant: "tabular-nums"[];
    };
};
//# sourceMappingURL=number-pad.styles.d.ts.map