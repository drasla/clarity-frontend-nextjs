import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    variant?: "text" | "rectangular" | "circular";
    width?: string | number;
    height?: string | number;
    className?: string;
}

function Skeleton({ variant = "text", width, height, className, ...props }: SkeletonProps) {
    return (
        <div
            className={twMerge(
                ["animate-pulse", "bg-divider-main/30"],
                variant === "text" && ["rounded-md"],
                variant === "rectangular" && ["rounded-xl"],
                variant === "circular" && ["rounded-full"],
                className,
            )}
            style={{
                width: width,
                height: height || (variant === "text" ? "1.2em" : undefined),
                ...props.style,
            }}
            {...props}
        />
    );
}

export default Skeleton;
