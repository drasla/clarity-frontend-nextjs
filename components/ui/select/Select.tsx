import { forwardRef, SelectHTMLAttributes, useId } from "react";
import { twMerge } from "tailwind-merge";
import {
    StylesColorType,
    StylesFieldColorClasses,
    StylesSizeClasses,
    StylesSizeType,
} from "@/components/ui/common";
import { IoChevronDown } from "react-icons/io5";

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface SelectProps extends Omit<
    SelectHTMLAttributes<HTMLSelectElement>,
    "size" | "color"
> {
    label?: string;
    size?: StylesSizeType;
    color?: StylesColorType;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
    options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            label,
            size = "medium",
            color = "primary",
            error = false,
            helperText,
            fullWidth = false,
            options,
            children,
            className,
            id,
            required = true,
            ...props
        },
        ref,
    ) => {
        const generatedId = useId();
        const selectId = id || generatedId;
        const activeColor = error ? "error" : color;

        const selectLegendWidthClass = label
            ? twMerge(["peer-focus:[&>legend]:max-w-full", "peer-valid:[&>legend]:max-w-full"])
            : "";

        return (
            <div
                className={twMerge(
                    ["flex", "flex-col", "gap-1"],
                    fullWidth ? "w-full" : ["inline-flex", "w-fit", "min-w-50"],
                )}>
                <div className="relative">
                    <select
                        id={selectId}
                        ref={ref}
                        required={required}
                        className={twMerge(
                            ["relative", "peer", "z-10", "w-full", "appearance-none", "pr-10"],
                            ["rounded-md", "bg-transparent", "outline-none", "border-none"],
                            ["transition-all", "duration-200"],
                            StylesSizeClasses[size],
                            className,
                        )}
                        {...props}>
                        <option value="" disabled hidden></option>
                        {options
                            ? options.map(opt => (
                                  <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                  </option>
                              ))
                            : children}
                    </select>

                    <fieldset
                        aria-hidden="true"
                        className={twMerge(
                            ["absolute", "inset-0", "pointer-events-none"],
                            ["rounded-md", "border", "border-divider-main"],
                            ["transition-colors", "duration-200"],
                            "peer-focus:border-2",
                            StylesFieldColorClasses[activeColor].field,
                            selectLegendWidthClass, // 💡 Select 전용 노치 클래스 적용
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

                    <div
                        className={twMerge(
                            ["absolute", "inset-y-0", "right-0", "z-20"],
                            ["flex", "items-center", "px-3", "text-text-secondary"],
                            ["pointer-events-none"],
                        )}>
                        <IoChevronDown className="h-4 w-4" />
                    </div>

                    {label && (
                        <label
                            htmlFor={selectId}
                            className={twMerge(
                                ["absolute", "left-3", "origin-left", "cursor-pointer"],
                                ["px-1", "pointer-events-none", "z-20"],
                                ["transition-all", "duration-200", "scale-75", "-translate-y-1/2"],
                                [
                                    "peer-invalid:top-1/2",
                                    "peer-invalid:-translate-y-1/2",
                                    "peer-invalid:scale-100",
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
                            "mx-3 text-xs",
                            activeColor === "error" ? "text-error-main" : "text-text-secondary",
                        )}>
                        {helperText}
                    </span>
                )}
            </div>
        );
    },
);

Select.displayName = "Select";
