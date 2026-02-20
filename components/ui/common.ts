import { twMerge } from "tailwind-merge";

export type StylesColorType = "primary" | "secondary" | "error" | "warning" | "info" | "success";
export type StylesSizeType = "small" | "medium" | "large";
export type StylesButtonVariantType = "contained" | "outlined" | "text";

export const StylesSizeClasses = {
    small: twMerge(["px-3", "py-2", "text-sm"]),
    medium: twMerge(["px-4", "py-3", "text-base"]),
    large: twMerge(["px-5", "py-4", "text-lg"]),
};

export const StylesFieldColorClasses: Record<StylesColorType, { field: string; label: string }> = {
    primary: {
        field: twMerge(
            ["focus:border-primary-main", "focus:ring-primary-main"],
            ["peer-focus:border-primary-main"],
        ),
        label: "peer-focus:text-primary-main",
    },
    secondary: {
        field: twMerge(
            ["focus:border-secondary-main", "focus:ring-secondary-main"],
            ["peer-focus:border-secondary-main"],
        ),
        label: "peer-focus:text-secondary-main",
    },
    error: {
        field: twMerge(
            ["border-error-main", "focus:border-error-main", "focus:ring-error-main"],
            ["text-error-main", "peer-focus:border-error-main"],
        ),
        label: twMerge(["text-error-main", "peer-focus:text-error-main"]),
    },
    warning: {
        field: twMerge(
            ["focus:border-warning-main", "focus:ring-warning-main"],
            ["peer-focus:border-warning-main"],
        ),
        label: "peer-focus:text-warning-main",
    },
    info: {
        field: twMerge(
            ["focus:border-info-main", "focus:ring-info-main"],
            ["peer-focus:border-info-main"],
        ),
        label: "peer-focus:text-info-main",
    },
    success: {
        field: twMerge(
            ["focus:border-success-main", "focus:ring-success-main"],
            ["peer-focus:border-success-main"],
        ),
        label: "peer-focus:text-success-main",
    },
};

export const StylesButtonColorClasses: Record<
    StylesButtonVariantType,
    Record<StylesColorType, string>
> = {
    contained: {
        primary: twMerge(
            ["bg-primary-main", "text-primary-contrast", "hover:bg-primary-dark"],
            ["hover:shadow", "focus-visible:ring-primary-main"],
        ),
        secondary: twMerge(
            ["bg-secondary-main", "text-secondary-contrast", "hover:bg-secondary-dark"],
            ["hover:shadow", "focus-visible:ring-secondary-main"],
        ),
        error: twMerge(
            ["bg-error-main", "text-error-contrast", "hover:bg-error-dark"],
            ["hover:shadow", "focus-visible:ring-error-main"],
        ),
        warning: twMerge(
            ["bg-warning-main", "text-warning-contrast", "hover:bg-warning-dark"],
            ["hover:shadow", "focus-visible:ring-warning-main"],
        ),
        info: twMerge(
            ["bg-info-main", "text-info-contrast", "hover:bg-info-dark"],
            ["hover:shadow", "focus-visible:ring-info-main"],
        ),
        success: twMerge(
            ["bg-success-main", "text-success-contrast", "hover:bg-success-dark"],
            ["hover:shadow", "focus-visible:ring-success-main"],
        ),
    },
    outlined: {
        primary: twMerge(
            ["border", "border-primary-main", "text-primary-main"],
            ["hover:bg-primary-main/10", "focus-visible:ring-primary-main"],
        ),
        secondary: twMerge(
            ["border", "border-secondary-main", "text-secondary-main"],
            ["hover:bg-secondary-main/10", "focus-visible:ring-secondary-main"],
        ),
        error: twMerge(
            ["border", "border-error-main", "text-error-main"],
            ["hover:bg-error-main/10", "focus-visible:ring-error-main"],
        ),
        warning: twMerge(
            ["border", "border-warning-main", "text-warning-main"],
            ["hover:bg-warning-main/10", "focus-visible:ring-warning-main"],
        ),
        info: twMerge(
            ["border", "border-info-main", "text-info-main"],
            ["hover:bg-info-main/10", "focus-visible:ring-info-main"],
        ),
        success: twMerge(
            ["border", "border-success-main", "text-success-main"],
            ["hover:bg-success-main/10", "focus-visible:ring-success-main"],
        ),
    },
    text: {
        primary: twMerge(
            ["text-primary-main", "hover:bg-primary-main/10"],
            "focus-visible:ring-primary-main",
        ),
        secondary: twMerge(
            ["text-secondary-main", "hover:bg-secondary-main/10"],
            "focus-visible:ring-secondary-main",
        ),
        error: twMerge(
            ["text-error-main", "hover:bg-error-main/10"],
            "focus-visible:ring-error-main",
        ),
        warning: twMerge(
            ["text-warning-main", "hover:bg-warning-main/10"],
            "focus-visible:ring-warning-main",
        ),
        info: twMerge(["text-info-main", "hover:bg-info-main/10", "focus-visible:ring-info-main"]),
        success: twMerge(
            ["text-success-main", "hover:bg-success-main/10"],
            "focus-visible:ring-success-main",
        ),
    },
};

