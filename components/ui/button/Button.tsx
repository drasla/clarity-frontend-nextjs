import React, { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import {
    StylesButtonColorClasses,
    StylesColorType,
    StylesSizeClasses,
    StylesSizeType,
} from "@/components/ui/common";

type ButtonVariant = "contained" | "outlined" | "text";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    color?: StylesColorType;
    size?: StylesSizeType;
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

        return (
            <button
                ref={ref}
                disabled={disabled}
                className={twMerge(
                    baseStyles,
                    StylesSizeClasses[size],
                    StylesButtonColorClasses[variant][color],
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
