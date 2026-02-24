"use client";

import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { useRouter } from "next/navigation";

interface TableProps {
    children: ReactNode;
    className?: string;
}

export const Table = ({ children, className }: TableProps) => {
    return (
        <div
            className={twMerge(
                ["bg-background-default", "border", "border-divider-main", "rounded-2xl"],
                ["overflow-hidden"],
                className,
            )}>
            <table className={twMerge(["w-full", "border-collapse", "text-left"])}>
                {children}
            </table>
        </div>
    );
};

interface Column {
    label: string;
    className?: string;
}

export const TableHeader = ({ columns, className }: { columns: Column[]; className?: string }) => {
    return (
        <thead
            className={twMerge(
                ["hidden", "md:table-header-group"],
                ["bg-background-paper", "border-b", "border-divider-main"],
                className,
            )}>
            <tr>
                {columns.map((col, idx) => (
                    <th
                        key={idx}
                        className={twMerge(
                            ["p-4", "text-sm", "font-bold", "text-center", "align-middle"],
                            ["text-text-secondary", "whitespace-nowrap"],
                            col.className,
                        )}>
                        {col.label}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

interface BodyProps {
    children: ReactNode;
    isEmpty: boolean;
    emptyMessage?: string;
}

export const TableBody = ({
    children,
    isEmpty,
    emptyMessage = "등록된 내역이 없습니다.",
}: BodyProps) => {
    if (isEmpty) {
        return (
            <tbody>
                <tr>
                    <td colSpan={100} className="p-16 text-center">
                        <div
                            className={twMerge([
                                "flex",
                                "flex-col",
                                "items-center",
                                "justify-center",
                            ])}>
                            <span className="text-4xl mb-4 opacity-50">📂</span>
                            <p className="text-text-secondary text-lg">{emptyMessage}</p>
                        </div>
                    </td>
                </tr>
            </tbody>
        );
    }

    return (
        <tbody
            className={twMerge(["divide-y", "divide-divider-main", "block", "md:table-row-group"])}>
            {children}
        </tbody>
    );
};

interface RowProps {
    children: ReactNode;
    href?: string;
    className?: string;
}

export const TableRow = ({ children, href, className }: RowProps) => {
    const router = useRouter();

    const handleClick = () => {
        if (href) router.push(href);
    };

    return (
        <tr
            onClick={handleClick}
            className={twMerge(
                ["flex", "flex-col", "md:table-row", "p-4", "md:p-0", "transition-colors"],
                href ? ["cursor-pointer", "hover:bg-background-paper", "group"] : "",
                className,
            )}>
            {children}
        </tr>
    );
};

interface CellProps {
    children: ReactNode;
    className?: string;
}

export const TableCell = ({ children, className }: CellProps) => {
    return (
        <td
            className={twMerge(
                ["block", "md:table-cell", "md:p-4", "md:align-middle", "text-sm", "md:text-base"],
                className,
            )}>
            {children}
        </td>
    );
};
