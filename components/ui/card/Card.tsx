import { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    className?: string;
}

function Card({ children, className, ...props }: CardProps){
    return (
        <div
            className={twMerge(
                ["w-full", "p-6", "md:p-8"],
                ["bg-background-paper", "rounded-xl"],
                ["border", "border-divider-main", "shadow-lg"],
                className,
            )}
            {...props}>
            {children}
        </div>
    );
}

export default Card;