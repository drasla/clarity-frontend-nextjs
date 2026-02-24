"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import {
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiArrowLeftDoubleFill,
    RiArrowRightDoubleFill,
} from "react-icons/ri";

export interface PaginationProps {
    total: number;
    page: number;
    size?: number;
    block?: number;
}

export const Pagination = ({ total, page, size = 10, block = 5 }: PaginationProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const totalPages = Math.ceil(total / size);

    if (totalPages <= 1) return null;

    const currentBlock = Math.ceil(page / block);
    const startPage = (currentBlock - 1) * block + 1;
    let endPage = startPage + block - 1;
    if (endPage > totalPages) endPage = totalPages;

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        return `${pathname}?${params.toString()}`;
    };

    const navButtonClass = (disabled: boolean) =>
        twMerge(
            "flex items-center justify-center w-9 h-9 rounded-md transition-colors",
            disabled
                ? "text-divider-main cursor-not-allowed pointer-events-none"
                : "text-text-secondary hover:bg-background-paper hover:text-primary-main active:scale-95",
        );

    return (
        <nav
            className="flex items-center justify-center gap-1 sm:gap-2 mt-10"
            aria-label="Pagination">
            <Link
                href={createPageUrl(1)}
                className={twMerge(navButtonClass(page === 1), "hidden sm:flex")}
                aria-label="First Page">
                <RiArrowLeftDoubleFill className="w-5 h-5" />
            </Link>

            <Link
                href={createPageUrl(page - 1)}
                className={navButtonClass(page === 1)}
                aria-label="Previous Page">
                <RiArrowLeftSLine className="w-5 h-5" />
            </Link>

            <div className="flex items-center gap-1 sm:gap-2 mx-1 sm:mx-2">
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(p => {
                    const isActive = p === page;
                    return (
                        <Link
                            key={p}
                            href={createPageUrl(p)}
                            className={twMerge(
                                "flex items-center justify-center w-9 h-9 rounded-md text-sm md:text-base font-bold transition-all active:scale-95",
                                isActive
                                    ? "bg-primary-main text-primary-contrast shadow-md"
                                    : "text-text-secondary hover:bg-background-paper hover:text-primary-main",
                            )}
                            aria-current={isActive ? "page" : undefined}>
                            {p}
                        </Link>
                    );
                })}
            </div>

            <Link
                href={createPageUrl(page + 1)}
                className={navButtonClass(page === totalPages)}
                aria-label="Next Page">
                <RiArrowRightSLine className="w-5 h-5" />
            </Link>

            <Link
                href={createPageUrl(totalPages)}
                className={twMerge(navButtonClass(page === totalPages), "hidden sm:flex")}
                aria-label="Last Page">
                <RiArrowRightDoubleFill className="w-5 h-5" />
            </Link>
        </nav>
    );
};
