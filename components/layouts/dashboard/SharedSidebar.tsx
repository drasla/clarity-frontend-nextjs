"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { RiCloseLine, RiLogoutBoxRLine } from "react-icons/ri";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { Backdrop } from "@/components/ui/backdrop/Backdrop";
import LogoutAction from "@/actions/auth/logout/LogoutAction";
import { SidebarMenu } from "@/constants/menus";
import SidebarMenuItem from "@/components/layouts/dashboard/SidebarMenuItem";

interface SharedSidebarProps {
    isOpen: boolean;
    onClose: VoidFunction;
    menus: SidebarMenu[];
    basePath: string;
}

function SharedSidebar({ isOpen, onClose, menus, basePath }: SharedSidebarProps) {
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        if (confirm("로그아웃 하시겠습니까?")) {
            await LogoutAction();
            logout();
            window.location.href = "/";
        }
    };

    return (
        <>
            {isOpen && <Backdrop isOpen={isOpen} onClick={onClose} />}

            <aside
                className={twMerge(
                    ["fixed", "inset-y-0", "left-0", "z-50"],
                    ["flex", "flex-col", "shrink-0"],
                    ["w-full", "lg:w-64", "h-full"],
                    ["bg-background-paper"],
                    ["lg:border-r", "border-divider-main"],
                    ["transform", "transition-transform", "duration-300", "ease-in-out"],
                    isOpen ? ["translate-x-0"] : ["-translate-x-full"],
                    ["lg:relative", "lg:translate-x-0", "lg:flex"],
                )}>
                <div
                    className={twMerge(
                        ["flex", "items-center", "justify-between", "shrink-0"],
                        ["h-16", "lg:h-20", "px-6"],
                    )}>
                    <Link href="/" className={twMerge(["transition-transform", "hover:scale-105"])}>
                        <Image
                            src={"/assets/images/logo_horizontal_light.png"}
                            alt={"Logo"}
                            width={150}
                            height={22}
                        />
                    </Link>
                    <button
                        type="button"
                        onClick={onClose}
                        className={twMerge(
                            ["lg:hidden", "p-2", "-mr-2"],
                            ["text-text-secondary", "rounded-full"],
                            ["transition-colors", "hover:bg-background-paper"],
                        )}>
                        <RiCloseLine className={twMerge(["w-6", "h-6"])} />
                    </button>
                </div>

                <div className={twMerge(["px-5", "mb-6", "mt-4"])}>
                    <div
                        className={twMerge(
                            ["flex", "items-center", "gap-3", "p-4"],
                            ["bg-background-default", "rounded-xl"],
                            ["border", "border-divider-main/50"],
                        )}>
                        <div
                            className={twMerge(
                                ["flex", "items-center", "justify-center", "shrink-0"],
                                ["w-10", "h-10", "rounded-full"],
                                ["bg-primary-main/10"],
                            )}>
                            <span
                                className={twMerge(["text-sm", "font-bold", "text-primary-main"])}>
                                {user?.name?.charAt(0) || "U"}
                            </span>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <p
                                className={twMerge(
                                    ["text-sm", "font-bold", "text-text-primary"],
                                    "truncate",
                                )}>
                                {user?.name || "고객"}님
                            </p>
                            <p className={twMerge(["text-xs", "text-text-secondary", "truncate"])}>
                                {user?.role === "ADMIN" ? "최고 관리자" : "일반 회원"}
                            </p>
                        </div>
                    </div>
                </div>

                <nav
                    className={twMerge(
                        ["flex-1", "flex", "flex-col"],
                        ["overflow-y-auto", "scrollbar-hide"],
                        ["px-4", "gap-1.5"],
                    )}>
                    <p
                        className={twMerge(
                            ["px-2", "mt-4", "mb-2"],
                            ["text-xs", "font-bold", "uppercase", "tracking-wider"],
                            ["text-text-disabled"],
                        )}>
                        Menu
                    </p>

                    {menus.map((menu, index) => (
                        <SidebarMenuItem
                            key={`${menu.href || menu.label}-${index}`}
                            menu={menu}
                            basePath={basePath}
                            onClose={onClose}
                        />
                    ))}
                </nav>

                <div className="p-4 mt-auto shrink-0">
                    <button
                        onClick={handleLogout}
                        className={twMerge(
                            ["flex", "items-center", "w-full", "gap-3"],
                            ["px-3", "py-3"],
                            ["text-sm", "font-medium", "text-text-secondary", "rounded-xl"],
                            ["transition-colors"],
                            ["hover:bg-error-main/10", "hover:text-error-main"],
                        )}>
                        <RiLogoutBoxRLine className={twMerge(["w-5", "h-5"])} />
                        로그아웃
                    </button>
                </div>
            </aside>
        </>
    );
}

export default SharedSidebar;
