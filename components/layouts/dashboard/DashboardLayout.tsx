"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HiMenu } from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import SharedSidebar from "./SharedSidebar";
import { SidebarMenu } from "@/constants/menus";

interface SharedDashboardLayoutProps extends PropsWithChildren {
    menus: SidebarMenu[];
    basePath: string;
}

function SharedDashboardLayout({ menus, basePath, children }: SharedDashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    return (
        <div
            className={twMerge(
                ["flex", "h-screen", "w-full"],
                ["overflow-hidden", "bg-background-default"],
                ["font-sans"],
            )}>
            <SharedSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                menus={menus}
                basePath={basePath}
            />

            <div
                className={twMerge(
                    ["w-full", "h-full", "flex", "flex-col", "flex-1", "relative"],
                    ["overflow-hidden"],
                )}>
                <header
                    className={twMerge(
                        ["flex", "items-center", "justify-between", "shrink-0"],
                        ["h-16", "lg:h-20", "px-4", "lg:px-8"],
                        ["sticky", "top-0", "left-0", "right-0", "z-40"],
                        ["bg-background-paper", "backdrop-blur-md"],
                        ["border-b", "border-divider-main/50"],
                        ["transition-all", "duration-300"],
                    )}>
                    <div className={twMerge(["flex", "items-center", "gap-4"])}>
                        <button
                            className={twMerge(
                                ["lg:hidden", "p-2", "-ml-2"],
                                ["text-text-secondary", "rounded-full"],
                                ["transition-colors", "hover:bg-background-paper"],
                            )}
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <HiMenu className={twMerge(["w-6", "h-6"])} />
                        </button>
                    </div>

                    <div className={twMerge(["flex", "items-center", "gap-4"])}>
                        <div
                            className={twMerge(
                                ["flex", "items-center", "justify-center", "shrink-0"],
                                ["w-9", "h-9"],
                                ["bg-divider-main/50", "rounded-full", "cursor-pointer"],
                                ["text-xs", "font-bold", "text-text-secondary"],
                                ["transition-colors", "hover:bg-divider-main"],
                            )}>
                            ME
                        </div>
                    </div>
                </header>

                <main className={twMerge(["flex-1", "w-full"], ["overflow-y-auto"])}>
                    <div
                        className={twMerge(
                            ["w-full", "max-w-7xl", "mx-auto"],
                            ["p-4", "md:p-6", "lg:p-10"],
                            ["animate-in", "fade-in", "duration-500"],
                        )}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SharedDashboardLayout;
