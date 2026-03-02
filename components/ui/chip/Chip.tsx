import { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { ChipColor, ChipVariant, StylesSizeType } from "@/components/ui/common";

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
    label: ReactNode;
    color?: ChipColor;
    variant?: ChipVariant;
    size?: StylesSizeType;
    icon?: ReactNode;
}

const ChipSizeClasses: Record<StylesSizeType, string> = {
    small: twMerge(["px-2", "py-0.5", "text-xs"]),
    medium: twMerge(["px-2.5", "py-1", "text-xs", "md:text-sm"]),
    large: twMerge(["px-3", "py-1.5", "text-sm", "md:text-base"]),
};

const ChipColorClasses: Record<ChipVariant, Record<ChipColor, string>> = {
    soft: {
        primary: twMerge(["bg-primary-main/10", "text-primary-main"]),
        secondary: twMerge(["bg-secondary-main/10", "text-secondary-main"]),
        error: twMerge(["bg-error-main/10", "text-error-main"]),
        warning: twMerge(["bg-warning-main/10", "text-warning-main"]),
        info: twMerge(["bg-info-main/10", "text-info-main"]),
        success: twMerge(["bg-success-main/10", "text-success-main"]),
        default: twMerge(["bg-divider-main/30", "text-text-secondary"]),
    },
    outlined: {
        primary: twMerge(["bg-transparent border", "border-primary-main", "text-primary-main"]),
        secondary: twMerge([
            "bg-transparent border",
            "border-secondary-main",
            "text-secondary-main",
        ]),
        error: twMerge(["bg-transparent", "border", "border-error-main", "text-error-main"]),
        warning: twMerge(["bg-transparent", "border", "border-warning-main", "text-warning-main"]),
        info: twMerge(["bg-transparent", "border", "border-info-main", "text-info-main"]),
        success: twMerge(["bg-transparent", "border", "border-success-main", "text-success-main"]),
        default: twMerge([
            "bg-background-default",
            "border",
            "border-divider-main",
            "text-text-secondary",
        ]),
    },
    filled: {
        primary: twMerge(["bg-primary-main", "text-primary-contrast"]),
        secondary: twMerge(["bg-secondary-main", "text-secondary-contrast"]),
        error: twMerge(["bg-error-main", "text-error-contrast"]),
        warning: twMerge(["bg-warning-main", "text-warning-contrast"]),
        info: twMerge(["bg-info-main", "text-info-contrast"]),
        success: twMerge(["bg-success-main", "text-success-contrast"]),
        default: twMerge(["bg-text-secondary", "text-background-paper"]),
    },
};

function Chip({
    label,
    color = "default",
    variant = "soft",
    size = "medium",
    icon,
    className,
    ...props
}: ChipProps) {
    return (
        <span
            className={twMerge(
                ["inline-flex", "items-center", "justify-center", "rounded-md", "gap-1.5"],
                ["font-bold", "whitespace-nowrap"],
                ChipSizeClasses[size],
                ChipColorClasses[variant][color],
                className,
            )}
            {...props}>
            {icon && <span className="shrink-0">{icon}</span>}
            <span>{label}</span>
        </span>
    );
}

export default Chip;
