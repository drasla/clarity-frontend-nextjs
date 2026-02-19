import { forwardRef, InputHTMLAttributes, useId } from "react";
import { twMerge } from "tailwind-merge";

type MuiColor = "primary" | "secondary" | "error" | "warning" | "info" | "success";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    label?: string;
    size?: "small" | "medium" | "large";
    color?: MuiColor;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            size = "medium",
            color = "primary",
            error,
            helperText,
            fullWidth = false,
            className,
            id,
            ...props
        },
        ref,
    ) => {
        const generatedId = useId();
        const inputId = id || generatedId;

        const activeColor = error ? "error" : color;
        const sizeStyles = {
            small: twMerge(["px-3", "py-2", "text-sm"]),
            medium: twMerge(["px-4", "py-3", "text-base"]),
            large: twMerge(["px-5", "py-4", "text-lg"]),
        };
        const colorStyles = {
            primary: {
                input: "focus:border-primary-main focus:ring-primary-main",
                label: "peer-focus:text-primary-main",
            },
            secondary: {
                input: "focus:border-secondary-main focus:ring-secondary-main",
                label: "peer-focus:text-secondary-main",
            },
            error: {
                input: "border-error-main focus:border-error-main focus:ring-error-main text-error-main",
                label: "text-error-main peer-focus:text-error-main",
            },
            warning: {
                input: "focus:border-warning-main focus:ring-warning-main",
                label: "peer-focus:text-warning-main",
            },
            info: {
                input: "focus:border-info-main focus:ring-info-main",
                label: "peer-focus:text-info-main",
            },
            success: {
                input: "focus:border-success-main focus:ring-success-main",
                label: "peer-focus:text-success-main",
            },
        };

        return (
            <div
                className={twMerge(
                    ["flex", "flex-col", "gap-1"],
                    fullWidth ? "w-full" : ["inline-flex", "w-fit", "min-w-50"],
                )}>
                <div className={"relative"}>
                    <input
                        id={inputId}
                        ref={ref}
                        placeholder={" "}
                        className={twMerge(
                            ["peer", "w-full", "rounded-md", "border", "outline-none"],
                            ["bg-transparent", "text-text-primary"],
                            ["focus:ring-1", "border-divider-main", "hover:border-divider-hover"],
                            ["transition-all", "duration-200"],
                            sizeStyles[size],
                            colorStyles[activeColor].input,
                            className,
                        )}
                        {...props}
                    />

                    {label && (
                        <label
                            htmlFor={inputId}
                            className={twMerge(
                                [
                                    "absolute",
                                    "left-3",
                                    "origin-left",
                                    "-translate-y-1/2",
                                    "cursor-text",
                                    "px-1",
                                ],
                                ["transition-all", "duration-200", "scale-75"],
                                ["bg-background-default"],
                                [
                                    "peer-placeholder-shown:top-1/2",
                                    "peer-placeholder-shown:-translate-y-1/2",
                                ],
                                ["peer-placeholder-shown:scale-100"],
                                [
                                    "top-0",
                                    "peer-focus:top-0",
                                    "peer-focus:-translate-y-1/2",
                                    "peer-focus:scale-75",
                                ],
                                activeColor !== "error" && "text-text-secondary",
                                colorStyles[activeColor].label,
                            )}>
                            {label}
                        </label>
                    )}

                    {helperText && (
                        <span
                            className={twMerge(
                                ["mx-3", "text-xs"],
                                error ? ["text-red-500"] : ["text-gray-500", "dark:text-gray-400"],
                            )}>
                            {helperText}
                        </span>
                    )}
                </div>
            </div>
        );
    },
);

Input.displayName = "Input";
