"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
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
        <div className="flex h-screen w-full bg-background-paper overflow-hidden">
            <SharedSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                menus={menus}
                basePath={basePath}
            />

            <div className="flex flex-col flex-1 w-full h-full overflow-hidden relative">
                <header className="md:hidden h-15 bg-background-default border-b border-divider-main flex items-center justify-between px-4 shrink-0">
                    <Image
                        src={"/assets/images/logo_horizontal_light.png"}
                        alt={"Logo"}
                        width={180}
                        height={26}
                    />
                    <button
                        className="p-2 text-text-secondary"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <HiMenu className="w-7 h-7" />
                    </button>
                </header>

                <main
                    className={twMerge(
                        ["flex-1", "p-4", "md:p-8", "lg:p-10", "flex", "flex-col"],
                        "overflow-y-auto",
                    )}>
                    <div
                        className={twMerge(
                            ["w-full", "max-w-6xl", "mx-auto", "flex-1"],
                            ["flex", "flex-col"],
                        )}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default SharedDashboardLayout;
