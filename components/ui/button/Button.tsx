import React, { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type MuiColor = "primary" | "secondary" | "error" | "warning" | "info" | "success";
type ButtonVariant = "contained" | "outlined" | "text";
type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    color?: MuiColor;
    size?: ButtonSize;
    fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = "contained",
            color = "primary",
            size = "medium",
            fullWidth = false,
            className,
            disabled,
            ...props
        },
        ref,
    ) => {
        const baseStyles = twMerge(
            ["inline-flex", "items-center", "justify-center"],
            ["rounded-md", "transition-all", "duration-200", "font-bold"],
            ["focus-visible:outline-none", "focus-visible:ring-2", "focus-visible:ring-offset-2"],
            ["disabled:pointer-events-none", "disabled:opacity-50", "active:scale-[0.98]"],
        );

        const sizeStyles = {
            small: twMerge(["px-3", "py-2", "text-sm"]),
            medium: twMerge(["px-4", "py-3", "text-base"]),
            large: twMerge(["px-5", "py-4", "text-lg"]),
        };

        const variantColorStyles = {
            contained: {
                primary: twMerge([
                    ["bg-primary-main", "text-primary-contrast"],
                    ["hover:bg-primary-dark", "hover:shadow"],
                    "focus-visible:ring-primary-main",
                ]),
                secondary: twMerge(
                    ["bg-secondary-main", "text-secondary-contrast"],
                    ["hover:bg-secondary-dark", "hover:shadow"],
                    "focus-visible:ring-secondary-main",
                ),
                error: twMerge(
                    ["bg-error-main", "text-error-contrast"],
                    ["hover:bg-error-dark", "hover:shadow"],
                    "focus-visible:ring-error-main",
                ),
                warning: twMerge(
                    ["bg-warning-main", "text-warning-contrast"],
                    ["hover:bg-warning-dark", "hover:shadow"],
                    "focus-visible:ring-warning-main",
                ),
                info: twMerge(
                    ["bg-info-main", "text-info-contrast"],
                    ["hover:bg-info-dark", "hover:shadow"],
                    "focus-visible:ring-info-main",
                ),
                success: twMerge(
                    ["bg-success-main", "text-success-contrast"],
                    ["hover:bg-success-dark", "hover:shadow"],
                    "focus-visible:ring-success-main",
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
                info: twMerge(
                    ["text-info-main", "hover:bg-info-main/10"],
                    "focus-visible:ring-info-main",
                ),
                success: twMerge(
                    ["text-success-main", "hover:bg-success-main/10"],
                    "focus-visible:ring-success-main",
                ),
            },
        };

        return (
            <button
                ref={ref}
                disabled={disabled}
                className={twMerge(
                    baseStyles,
                    sizeStyles[size],
                    variantColorStyles[variant][color],
                    fullWidth && ["w-full"],
                    className,
                )}
                {...props}>
                {children}
            </button>
        );
    },
);

Button.displayName = "Button";
