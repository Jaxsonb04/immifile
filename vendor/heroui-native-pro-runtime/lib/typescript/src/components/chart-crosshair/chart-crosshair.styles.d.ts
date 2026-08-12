/**
 * RN value overlay: `container` hosts animated layout; `label` styles the default label slot classes.
 *
 * {@link ChartCrosshair.Value} must be rendered under {@link ChartCrosshair.Anchor}; the container is
 * always absolutely positioned.
 *
 * @note ANIMATED PROPERTIES (cannot be set via `className` / container slot):
 * The `container` slot receives animated styles from `ChartCrosshair.Value` for:
 * - `opacity` — driven by `isActive` from anchor context
 * - Vertical edge — `placement="top"` uses animated `bottom: -measuredHeight` (+ `offset`) so the pill sits
 *   above the anchor; `placement="bottom"` uses `top: '100%'` plus `translateY` from `offset`.
 * - `transform` — `translateX` from crosshair `x`, horizontal `offset`, and optional `chartBounds`
 *   clamp (see {@link ChartCrosshairValueProps}); with `placement="bottom"`, `translateY` from vertical `offset`.
 *
 * To nudge vertical or horizontal placement without fighting the animated style, use the `offset` prop on
 * `ChartCrosshair.Value` (`{ top, bottom, left, right }`, CSS-like additive). Avoid overriding `top` /
 * `bottom` or `transform` via `classNames.container` / `styles.container` — those are owned by the
 * animated style and will be overwritten on every frame.
 */
declare const value: import("tailwind-variants").TVReturnType<{
    variant: {
        default: {
            container: string;
        };
        ghost: {
            container: string;
        };
    };
}, {
    container: string;
    label: string;
}, undefined, {
    variant: {
        default: {
            container: string;
        };
        ghost: {
            container: string;
        };
    };
}, {
    container: string;
    label: string;
}, import("tailwind-variants").TVReturnType<{
    variant: {
        default: {
            container: string;
        };
        ghost: {
            container: string;
        };
    };
}, {
    container: string;
    label: string;
}, undefined, unknown, unknown, undefined>>;
export declare const chartCrosshairClassNames: import("../../helpers/internal/types").CombinedStyles<{
    value: import("tailwind-variants").TVReturnType<{
        variant: {
            default: {
                container: string;
            };
            ghost: {
                container: string;
            };
        };
    }, {
        container: string;
        label: string;
    }, undefined, {
        variant: {
            default: {
                container: string;
            };
            ghost: {
                container: string;
            };
        };
    }, {
        container: string;
        label: string;
    }, import("tailwind-variants").TVReturnType<{
        variant: {
            default: {
                container: string;
            };
            ghost: {
                container: string;
            };
        };
    }, {
        container: string;
        label: string;
    }, undefined, unknown, unknown, undefined>>;
    label: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "text-foreground text-[10px] font-normal min-w-10 text-center", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "text-foreground text-[10px] font-normal min-w-10 text-center", unknown, unknown, undefined>>;
}>;
export type ValueSlots = keyof ReturnType<typeof value>;
export {};
//# sourceMappingURL=chart-crosshair.styles.d.ts.map