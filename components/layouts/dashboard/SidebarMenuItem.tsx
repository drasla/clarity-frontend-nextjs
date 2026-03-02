"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { IoChevronDown } from "react-icons/io5";
import { SidebarMenu } from "@/constants/menus";

interface SidebarMenuItemProps {
    menu: SidebarMenu;
    basePath: string;
    depth?: number;
    onClose?: () => void;
}

export function SidebarMenuItem({ menu, basePath, depth = 0, onClose }: SidebarMenuItemProps) {
    const pathname = usePathname();
    const hasChildren = !!(menu.children && menu.children.length > 0);

    const isActive = menu.href
        ? menu.href === basePath
            ? pathname === basePath
            : pathname.startsWith(menu.href)
        : false;

    const isChildActive =
        hasChildren &&
        menu.children?.some(child =>
            child.href
                ? child.href === basePath
                    ? pathname === basePath
                    : pathname.startsWith(child.href)
                : false,
        );

    const [isOpen, setIsOpen] = useState(isChildActive || false);

    useEffect(() => {
        if (isChildActive) setIsOpen(true);
    }, [isChildActive, pathname]);

    const handleToggle = () => setIsOpen(prev => !prev);

    const itemClassName = twMerge(
        ["flex", "items-center", "justify-between", "w-full"],
        ["py-2.5", "pr-3", "mb-1"],
        depth === 0 ? ["pl-3"] : ["pl-10"],
        ["rounded-xl"],
        ["text-sm", "font-medium"],
        ["transition-all", "duration-200"],
        isActive || (isChildActive && !isOpen)
            ? ["bg-primary-main/10", "text-primary-main", "font-bold"]
            : ["text-text-secondary", "hover:bg-background-paper", "hover:text-text-primary"],
    );

    if (hasChildren) {
        return (
            <div className={twMerge(["flex", "flex-col", "w-full"])}>
                <button type="button" onClick={handleToggle} className={itemClassName}>
                    <div className={twMerge(["flex", "items-center", "gap-3"])}>
                        {menu.icon && (
                            <menu.icon
                                className={twMerge(
                                    ["w-5", "h-5"],
                                    isChildActive ? ["text-primary-main"] : ["text-text-secondary"],
                                )}
                            />
                        )}
                        <span>{menu.label}</span>
                    </div>

                    <IoChevronDown
                        className={twMerge(
                            ["w-4", "h-4"],
                            ["transition-transform", "duration-300"],
                            isOpen ? ["rotate-180"] : ["rotate-0"],
                            isChildActive ? ["text-primary-main"] : ["text-text-secondary"],
                        )}
                    />
                </button>

                <div
                    className={twMerge(
                        ["grid", "w-full"],
                        ["transition-all", "duration-300", "ease-in-out"],
                        isOpen
                            ? ["grid-rows-[1fr]", "opacity-100"]
                            : ["grid-rows-[0fr]", "opacity-0"],
                    )}>
                    <div className={twMerge(["overflow-hidden", "flex", "flex-col"])}>
                        {menu.children?.map((child, index) => (
                            <SidebarMenuItem
                                key={`${child.href}-${index}`}
                                menu={child}
                                basePath={basePath}
                                depth={depth + 1}
                                onClose={onClose}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Link href={menu.href || "#"} onClick={onClose} className={itemClassName}>
            <div className={twMerge(["flex", "items-center", "gap-3"])}>
                {depth === 0 && menu.icon && (
                    <menu.icon
                        className={twMerge(
                            ["w-5", "h-5"],
                            isActive ? ["text-primary-main"] : ["text-text-secondary"],
                        )}
                    />
                )}

                {depth > 0 && (
                    <div
                        className={twMerge(
                            ["w-5", "h-5"],
                            ["flex", "items-center", "justify-center"],
                        )}>
                        <span
                            className={twMerge(
                                ["w-1.5", "h-1.5", "rounded-full"],
                                ["transition-all", "duration-200"],
                                isActive ? ["bg-primary-main", "scale-125"] : ["bg-text-disabled"],
                            )}
                        />
                    </div>
                )}
                <span>{menu.label}</span>
            </div>
        </Link>
    );
}
