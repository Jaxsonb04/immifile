/**
 * Root style definition (with slots for container and inner wrapper).
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * - `opacity` - Animated for disabled state transitions (applied to container)
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
}, undefined, unknown, unknown, undefined>>;
/**
 * UnderlayContent style definition.
 * Right-anchored clip wrapper that hides content to the left of the thumb.
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * - `width` - Animated to clip content at the thumb's leading edge (applied to container and content container)
 */
declare const underlayContent: import("tailwind-variants").TVReturnType<{
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            container?: import("tailwind-merge").ClassNameValue;
            contentContainer?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {
    [x: string]: {
        [x: string]: import("tailwind-merge").ClassNameValue | {
            container?: import("tailwind-merge").ClassNameValue;
            contentContainer?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    container: string;
    contentContainer: string;
}, undefined, {
    [key: string]: {
        [key: string]: import("tailwind-merge").ClassNameValue | {
            container?: import("tailwind-merge").ClassNameValue;
            contentContainer?: import("tailwind-merge").ClassNameValue;
        };
    };
} | {}, {
    container: string;
    contentContainer: string;
}, import("tailwind-variants").TVReturnType<unknown, {
    container: string;
    contentContainer: string;
}, undefined, unknown, unknown, undefined>>;
/**
 * OverlayContent style definition.
 * Uses overflow-hidden clip wrapper to reveal content from left to right.
 *
 * @note ANIMATED PROPERTIES (cannot be set via className):
 * - `width` - Animated to clip content at the thumb's trailing edge (applied to container and content container)
 */
declare const overlayContent: import("tailwind-variants").TVReturnType<{
    variant: {
        default: {
            contentContainer: string;
        };
        accent: {
            contentContainer: string;
        };
        success: {
            contentContainer: string;
        };
        danger: {
            contentContainer: string;
        };
    };
}, {
    container: string;
    contentContainer: string;
}, undefined, {
    variant: {
        default: {
            contentContainer: string;
        };
        accent: {
            contentContainer: string;
        };
        success: {
            contentContainer: string;
        };
        danger: {
            contentContainer: string;
        };
    };
}, {
    container: string;
    contentContainer: string;
}, import("tailwind-variants").TVReturnType<{
    variant: {
        default: {
            contentContainer: string;
        };
        accent: {
            contentContainer: string;
        };
        success: {
            contentContainer: string;
        };
        danger: {
            contentContainer: string;
        };
    };
}, {
    container: string;
    contentContainer: string;
}, undefined, unknown, unknown, undefined>>;
export declare const slideButtonClassNames: import("../../helpers/internal/types").CombinedStyles<{
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
    }, undefined, unknown, unknown, undefined>>;
    underlayContent: import("tailwind-variants").TVReturnType<{
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                container?: import("tailwind-merge").ClassNameValue;
                contentContainer?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {
        [x: string]: {
            [x: string]: import("tailwind-merge").ClassNameValue | {
                container?: import("tailwind-merge").ClassNameValue;
                contentContainer?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        container: string;
        contentContainer: string;
    }, undefined, {
        [key: string]: {
            [key: string]: import("tailwind-merge").ClassNameValue | {
                container?: import("tailwind-merge").ClassNameValue;
                contentContainer?: import("tailwind-merge").ClassNameValue;
            };
        };
    } | {}, {
        container: string;
        contentContainer: string;
    }, import("tailwind-variants").TVReturnType<unknown, {
        container: string;
        contentContainer: string;
    }, undefined, unknown, unknown, undefined>>;
    overlayContent: import("tailwind-variants").TVReturnType<{
        variant: {
            default: {
                contentContainer: string;
            };
            accent: {
                contentContainer: string;
            };
            success: {
                contentContainer: string;
            };
            danger: {
                contentContainer: string;
            };
        };
    }, {
        container: string;
        contentContainer: string;
    }, undefined, {
        variant: {
            default: {
                contentContainer: string;
            };
            accent: {
                contentContainer: string;
            };
            success: {
                contentContainer: string;
            };
            danger: {
                contentContainer: string;
            };
        };
    }, {
        container: string;
        contentContainer: string;
    }, import("tailwind-variants").TVReturnType<{
        variant: {
            default: {
                contentContainer: string;
            };
            accent: {
                contentContainer: string;
            };
            success: {
                contentContainer: string;
            };
            danger: {
                contentContainer: string;
            };
        };
    }, {
        container: string;
        contentContainer: string;
    }, undefined, unknown, unknown, undefined>>;
    thumb: import("tailwind-variants").TVReturnType<{} | {} | {}, undefined, "absolute h-full aspect-video rounded-4xl items-center justify-center bg-surface shadow-sm z-10", {} | {}, undefined, import("tailwind-variants").TVReturnType<unknown, undefined, "absolute h-full aspect-video rounded-4xl items-center justify-center bg-surface shadow-sm z-10", unknown, unknown, undefined>>;
    label: import("tailwind-variants").TVReturnType<{
        variant: {
            default: string;
            accent: string;
            success: string;
            danger: string;
        };
    }, undefined, "text-sm font-medium", {
        variant: {
            default: string;
            accent: string;
            success: string;
            danger: string;
        };
    }, undefined, import("tailwind-variants").TVReturnType<{
        variant: {
            default: string;
            accent: string;
            success: string;
            danger: string;
        };
    }, undefined, "text-sm font-medium", unknown, unknown, undefined>>;
}>;
export declare const slideButtonStyleSheet: {
    root: {
        borderCurve: "continuous";
    };
};
/** Slot type for the root style definition. */
export type SlideButtonRootSlots = keyof ReturnType<typeof root>;
/** Slot type for the underlay content style definition. */
export type SlideButtonUnderlayContentSlots = keyof ReturnType<typeof underlayContent>;
/** Slot type for the overlay content style definition. */
export type SlideButtonOverlayContentSlots = keyof ReturnType<typeof overlayContent>;
export {};
//# sourceMappingURL=slide-button.styles.d.ts.map