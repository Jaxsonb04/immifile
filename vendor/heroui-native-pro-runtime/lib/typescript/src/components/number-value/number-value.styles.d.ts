/**
 * Root style definition with two slots:
 *
 * - `container`: the outer `View` that lays out the prefix, value, and
 *   suffix inline.
 * - `value`: the `Text` rendering the formatted numeric string. Provides a
 *   default text color so the value is legible without extra styling.
 */
declare const root: import("tailwind-variants").TVReturnType<{
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            value?: import("tailwind-merge").ClassNameValue;
            container?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {
    [x: string]: {
        [x: string]: import("tailwind-merge").ClassNameValue | {
            value?: import("tailwind-merge").ClassNameValue;
            container?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    container: string;
    value: string;
}, undefined, {
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            value?: import("tailwind-merge").ClassNameValue;
            container?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    container: string;
    value: string;
}, import("tailwind-variants").TVReturnType<unknown, {
    container: string;
    value: string;
}, undefined, unknown, unknown, undefined>>;
/**
 * `NumberValue` class-name slots.
 *
 * Exposes the per-part `tv` instances so consumers can reuse them to build
 * variations that visually align with the default `NumberValue` styling.
 *
 * @example
 * ```tsx
 * import { numberValueClassNames } from 'heroui-native-pro';
 *
 * const { container, value } = numberValueClassNames.root();
 * ```
 */
export declare const numberValueClassNames: import("../../helpers/internal/types").CombinedStyles<{
    root: import("tailwind-variants").TVReturnType<{
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                value?: import("tailwind-merge").ClassNameValue;
                container?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {
        [x: string]: {
            [x: string]: import("tailwind-merge").ClassNameValue | {
                value?: import("tailwind-merge").ClassNameValue;
                container?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        container: string;
        value: string;
    }, undefined, {
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                value?: import("tailwind-merge").ClassNameValue;
                container?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        container: string;
        value: string;
    }, import("tailwind-variants").TVReturnType<unknown, {
        container: string;
        value: string;
    }, undefined, unknown, unknown, undefined>>;
    value: ((slotProps?: ({
        [x: string]: string | number | undefined;
        [x: number]: string | number | undefined;
    } & import("tailwind-variants").ClassProp<import("tailwind-merge").ClassNameValue>) | ({
        [x: string]: string | number | undefined;
        [x: number]: string | number | undefined;
    } & import("tailwind-variants").ClassProp<import("tailwind-merge").ClassNameValue>) | ({
        [x: string]: string | number | undefined;
        [x: number]: string | number | undefined;
    } & import("tailwind-variants").ClassProp<import("tailwind-merge").ClassNameValue>) | ({
        [x: string]: string | number | undefined;
        [x: number]: string | number | undefined;
    } & import("tailwind-variants").ClassProp<import("tailwind-merge").ClassNameValue>) | ({
        [x: string]: string | number | undefined;
        [x: number]: string | number | undefined;
    } & import("tailwind-variants").ClassProp<import("tailwind-merge").ClassNameValue>) | ({} & import("tailwind-variants").ClassProp<import("tailwind-merge").ClassNameValue>) | undefined) => string) & ((slotProps?: ({
        [x: string]: string | number | undefined;
        [x: number]: string | number | undefined;
    } & import("tailwind-variants").ClassProp<import("tailwind-merge").ClassNameValue>) | ({
        [x: string]: string | number | undefined;
        [x: number]: string | number | undefined;
    } & import("tailwind-variants").ClassProp<import("tailwind-merge").ClassNameValue>) | ({
        [x: string]: string | number | undefined;
        [x: number]: string | number | undefined;
    } & import("tailwind-variants").ClassProp<import("tailwind-merge").ClassNameValue>) | ({
        [x: string]: string | number | undefined;
        [x: number]: string | number | undefined;
    } & import("tailwind-variants").ClassProp<import("tailwind-merge").ClassNameValue>) | ({
        [x: string]: string | number | undefined;
        [x: number]: string | number | undefined;
    } & import("tailwind-variants").ClassProp<import("tailwind-merge").ClassNameValue>) | ({} & import("tailwind-variants").ClassProp<import("tailwind-merge").ClassNameValue>) | undefined) => string);
    prefix: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "", unknown, unknown, undefined>>;
    suffix: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "", unknown, unknown, undefined>>;
}>;
/** Slot names available on the `root` tv instance. */
export type RootSlots = keyof ReturnType<typeof root>;
/**
 * StyleSheet for native-only style properties that cannot be expressed via
 * Tailwind classes. The `value` entry applies `fontVariant: tabular-nums`
 * so digits render in fixed-width cells and columns of numbers line up
 * vertically — mirroring the web component's `font-variant-numeric:
 * tabular-nums` rule.
 */
export declare const numberValueStyleSheet: {
    value: {
        fontVariant: "tabular-nums"[];
    };
};
export {};
//# sourceMappingURL=number-value.styles.d.ts.map