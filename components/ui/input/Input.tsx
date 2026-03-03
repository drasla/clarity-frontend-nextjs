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
            placeholder,
            disabled,
            ...props
        },
        ref,
    ) => {
        const generatedId = useId();
        const inputId = id || generatedId;
        const activeColor = error ? "error" : color;
        const hasPlaceholder = Boolean(placeholder);

        const legendWidthClass = label
            ? twMerge([
                  "peer-focus:[&>legend]:max-w-full",
                  hasPlaceholder
                      ? ["[&>legend]:max-w-full"]
                      : ["peer-[:not(:placeholder-shown)]:[&>legend]:max-w-full"],
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
                    fullWidth ? "w-full" : ["inline-flex", "w-fit"],
                )}>
                <div className={"relative"}>
                    <input
                        id={inputId}
                        ref={ref}
                        placeholder={placeholder || " "}
                        onChange={handleChange}
                        className={twMerge(
                            ["relative", "peer", "z-10", "w-full"],
                            ["rounded-md", "bg-transparent", "outline-none", "border-none"],
                            ["transition-all", "duration-200"],
                            disabled ? ["cursor-not-allowed", "text-text-disabled"] : [],
                            StylesSizeClasses[size],
                            className,
                        )}
                        {...props}
                    />

                    <fieldset
                        aria-hidden="true"
                        className={twMerge(
                            ["absolute", "inset-0", "pointer-events-none", "z-11"],
                            ["rounded-md", "border", "border-divider-main"],
                            ["transition-colors", "duration-200"],
                            "peer-focus:border-2",
                            StylesFieldColorClasses[activeColor].field,
                            disabled ? ["opacity-60", "bg-background-default/50"] : [],
                            legendWidthClass,
                        )}>
                        <legend
                            className={twMerge(
                                ["ml-2", "h-0", "max-w-[0.01px]"],
                                ["text-xs", "overflow-hidden"],
                            )}>
                            <span className={twMerge(["opacity-0", "px-1"])}>{label}</span>
                        </legend>
                    </fieldset>

                    {label && (
                        <label
                            htmlFor={inputId}
                            className={twMerge(
                                ["absolute", "left-3", "origin-left", "cursor-text"],
                                ["px-1", "pointer-events-none", "z-12"],
                                ["transition-all", "duration-200", "-translate-y-1/2"],
                                disabled ? ["cursor-not-allowed"] : ["cursor-text"],
                                hasPlaceholder
                                    ? ["top-0", "scale-75"]
                                    : [
                                          "top-0",
                                          "scale-75",
                                          "peer-placeholder-shown:top-1/2",
                                          "peer-placeholder-shown:scale-100",
                                          "peer-focus:top-0",
                                          "peer-focus:scale-75",
                                      ],
                                disabled
                                    ? ["text-text-disabled"]
                                    : activeColor !== "error"
                                      ? ["text-text-secondary"]
                                      : [],
                                !disabled && StylesFieldColorClasses[activeColor].label,
                            )}>
                            {label}
                        </label>
                    )}
                </div>
                {helperText && (
                    <span
                        className={twMerge(
                            ["mx-3", "text-xs"],
                            error ? ["text-error-main"] : ["text-text-secondary"],
                            disabled ? ["opacity-60"] : [],
                        )}>
                        {helperText}
                    </span>
                )}
            </div>
        );
    },
);

Input.displayName = "Input";
