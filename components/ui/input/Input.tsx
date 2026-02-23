import { ChangeEvent, forwardRef, InputHTMLAttributes, useId } from "react";
import { twMerge } from "tailwind-merge";
import {
    StylesColorType,
    StylesFieldColorClasses,
    StylesSizeClasses,
    StylesSizeType,
} from "@/components/ui/common";
import {
    AutoFormatBizRegNum,
    AutoFormatLandlineNumber,
    AutoFormatPhoneNumber,
} from "@/utils/formatting/formatting";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    label?: string;
    size?: StylesSizeType;
    color?: StylesColorType;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
    formatType?: "phone" | "bizRegNum" | "landline";
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
            formatType,
            className,
            id,
            onChange,
            ...props
        },
        ref,
    ) => {
        const generatedId = useId();
        const inputId = id || generatedId;
        const activeColor = error ? "error" : color;

        const legendWidthClass = label
            ? twMerge([
                  "peer-focus:[&>legend]:max-w-full",
                  "peer-[:not(:placeholder-shown)]:[&>legend]:max-w-full",
              ])
            : "";

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            if (formatType) {
                const value = e.target.value;
                if (formatType === "phone") {
                    e.target.value = AutoFormatPhoneNumber(value);
                } else if (formatType === "bizRegNum") {
                    e.target.value = AutoFormatBizRegNum(value);
                } else if (formatType === "landline") {
                    e.target.value = AutoFormatLandlineNumber(value);
                }
            }

            if (onChange) {
                onChange(e);
            }
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
                        onChange={handleChange}
                        className={twMerge(
                            ["relative", "peer", "z-10", "w-full"],
                            ["rounded-md", "bg-transparent", "outline-none", "border-none"],
                            ["transition-all", "duration-200"],
                            StylesSizeClasses[size],
                            className,
                        )}
                        {...props}
                    />

                    <fieldset
                        aria-hidden="true"
                        className={twMerge(
                            ["absolute", "inset-0", "pointer-events-none"],
                            ["rounded-md", "border", "border-divider-main"],
                            ["transition-colors", "duration-200"],
                            "peer-focus:border-2",
                            StylesFieldColorClasses[activeColor].field,
                            legendWidthClass,
                        )}>
                        <legend
                            className={twMerge([
                                "ml-2",
                                "text-xs",
                                "overflow-hidden",
                                "h-0",
                                "max-w-[0.01px]",
                            ])}>
                            <span className={twMerge(["opacity-0", "px-1"])}>{label}</span>
                        </legend>
                    </fieldset>

                    {label && (
                        <label
                            htmlFor={inputId}
                            className={twMerge(
                                ["absolute", "left-3", "origin-left", "cursor-text"],
                                ["px-1", "pointer-events-none", "z-20"],
                                ["transition-all", "duration-200", "scale-75", "-translate-y-1/2"],
                                [
                                    "peer-placeholder-shown:top-1/2",
                                    "peer-placeholder-shown:-translate-y-1/2",
                                    "peer-placeholder-shown:scale-100",
                                ],
                                [
                                    "top-0",
                                    "peer-focus:top-0",
                                    "peer-focus:-translate-y-1/2",
                                    "peer-focus:scale-75",
                                ],
                                activeColor !== "error" && "text-text-secondary",
                                StylesFieldColorClasses[activeColor].label,
                            )}>
                            {label}
                        </label>
                    )}
                </div>
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
        );
    },
);

Input.displayName = "Input";
