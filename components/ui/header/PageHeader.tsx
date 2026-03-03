import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface PageHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

function PageHeader({ title, description, action, className }: PageHeaderProps) {
    return (
        <div
            className={twMerge(
                ["flex", "flex-col", "md:flex-row"],
                ["md:items-center", "justify-between", "gap-4", "md:gap-6"],
                ["mb-6", "md:mb-8"],
                className,
            )}>
            <div className={twMerge(["flex", "flex-col", "min-w-0", "flex-1"])}>
                <h1
                    className={twMerge(
                        ["text-xl", "md:text-2xl", "font-bold", "tracking-tight"],
                        ["text-text-primary"],
                        description ? ["mb-1", "md:mb-1.5"] : [],
                    )}>
                    {title}
                </h1>

                {description && (
                    <p className={twMerge(["text-sm", "md:text-base"], ["text-text-secondary"])}>
                        {description}
                    </p>
                )}
            </div>

            {action && (
                <div
                    className={twMerge(
                        ["flex", "items-center", "shrink-0", "gap-3"],
                        ["mt-2", "md:mt-0"],
                    )}>
                    {action}
                </div>
            )}
        </div>
    );
}

export default PageHeader;
