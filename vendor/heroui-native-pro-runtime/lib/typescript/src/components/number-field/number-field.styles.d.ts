/**
 * DecrementButton style definition
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The following property in the `contentContainer` slot is animated:
 * - `transform` (scale) - Animated for press feedback
 *
 * To customize, use the `animation` prop on `NumberField.DecrementButton`:
 * ```tsx
 * <NumberField.DecrementButton
 *   animation={{
 *     scale: { value: [1, 0.88], timingConfig: { duration: 150 } },
 *   }}
 * />
 * ```
 *
 * To disable, set `animation={false}` on `NumberField.DecrementButton`.
 */
declare const decrementButton: import("tailwind-variants").TVReturnType<{
    isDisabled: {
        true: {
            container: string;
        };
    };
}, {
    container: string;
    contentContainer: string;
}, undefined, {
    isDisabled: {
        true: {
            container: string;
        };
    };
}, {
    container: string;
    contentContainer: string;
}, import("tailwind-variants").TVReturnType<{
    isDisabled: {
        true: {
            container: string;
        };
    };
}, {
    container: string;
    contentContainer: string;
}, undefined, unknown, unknown, undefined>>;
/**
 * IncrementButton style definition
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * The following property in the `contentContainer` slot is animated:
 * - `transform` (scale) - Animated for press feedback
 *
 * To customize, use the `animation` prop on `NumberField.IncrementButton`:
 * ```tsx
 * <NumberField.IncrementButton
 *   animation={{
 *     scale: { value: [1, 0.88], timingConfig: { duration: 150 } },
 *   }}
 * />
 * ```
 *
 * To disable, set `animation={false}` on `NumberField.IncrementButton`.
 */
declare const incrementButton: import("tailwind-variants").TVReturnType<{
    isDisabled: {
        true: {
            container: string;
        };
    };
}, {
    container: string;
    contentContainer: string;
}, undefined, {
    isDisabled: {
        true: {
            container: string;
        };
    };
}, {
    container: string;
    contentContainer: string;
}, import("tailwind-variants").TVReturnType<{
    isDisabled: {
        true: {
            container: string;
        };
    };
}, {
    container: string;
    contentContainer: string;
}, undefined, unknown, unknown, undefined>>;
export declare const numberFieldClassNames: import("../../helpers/internal/types").CombinedStyles<{
    root: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "gap-1.5", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "gap-1.5", unknown, unknown, undefined>>;
    decrementButton: import("tailwind-variants").TVReturnType<{
        isDisabled: {
            true: {
                container: string;
            };
        };
    }, {
        container: string;
        contentContainer: string;
    }, undefined, {
        isDisabled: {
            true: {
                container: string;
            };
        };
    }, {
        container: string;
        contentContainer: string;
    }, import("tailwind-variants").TVReturnType<{
        isDisabled: {
            true: {
                container: string;
            };
        };
    }, {
        container: string;
        contentContainer: string;
    }, undefined, unknown, unknown, undefined>>;
    incrementButton: import("tailwind-variants").TVReturnType<{
        isDisabled: {
            true: {
                container: string;
            };
        };
    }, {
        container: string;
        contentContainer: string;
    }, undefined, {
        isDisabled: {
            true: {
                container: string;
            };
        };
    }, {
        container: string;
        contentContainer: string;
    }, import("tailwind-variants").TVReturnType<{
        isDisabled: {
            true: {
                container: string;
            };
        };
    }, {
        container: string;
        contentContainer: string;
    }, undefined, unknown, unknown, undefined>>;
}>;
export declare const numberFieldStyleSheet: {
    buttonBorderCurve: {
        borderCurve: "continuous";
    };
};
export type DecrementButtonSlots = keyof ReturnType<typeof decrementButton>;
export type IncrementButtonSlots = keyof ReturnType<typeof incrementButton>;
export {};
//# sourceMappingURL=number-field.styles.d.ts.map