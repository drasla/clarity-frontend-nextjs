"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";
import {
    RiDashboardLine,
    RiServerLine,
    RiBankCardLine,
    RiQuestionAnswerLine,
    RiUserSettingsLine,
    RiLogoutBoxRLine,
} from "react-icons/ri";
import { useAuthStore } from "@/store/useAuthStore";
import Image from "next/image";
import { Backdrop } from "@/components/ui/backdrop/Backdrop";
import LogoutAction from "@/actions/auth/logout/LogoutAction";

const USER_MENUS = [
    { label: "대시보드", href: "/user", icon: RiDashboardLine },
    { label: "나의 서비스", href: "/user/services", icon: RiServerLine },
    { label: "결제 내역", href: "/user/billing", icon: RiBankCardLine },
    { label: "1:1 문의 내역", href: "/user/inquiries", icon: RiQuestionAnswerLine },
    { label: "회원 정보 수정", href: "/user/profile", icon: RiUserSettingsLine },
];

interface UserSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
    const pathname = usePathname();
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
                    ["w-64", "h-full", "flex", "flex-col", "shrink-0"],
                    ["bg-background-default", "border-r", " border-divider-main"],
                    ["transform", "transition-transform", "duration-300", "ease-in-out"],
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    ["md:relative", "md:translate-x-0", "md:flex"],
                )}>
                <div className="h-15 flex items-center px-6 border-b border-divider-main shrink-0">
                    <Link href="/" className="text-xl font-black text-primary-main tracking-wider">
                        <Image
                            src={"/assets/images/logo_horizontal_light.png"}
                            alt={"Logo"}
                            width={180}
                            height={26}
                        />
                    </Link>
                </div>

                <div className="p-6 border-b border-divider-main/50">
                    <p className="text-sm text-text-secondary mb-1">환영합니다!</p>
                    <p className="text-lg font-bold text-text-primary truncate">
                        {user?.name || "고객"}님
                    </p>
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
                    {USER_MENUS.map(menu => {
                        const isActive =
                            menu.href === "/user"
                                ? pathname === "/user"
                                : pathname.startsWith(menu.href);

                        return (
                            <Link
                                key={menu.href}
                                href={menu.href}
                                onClick={onClose}
                                className={twMerge(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary-main/10 text-primary-main font-bold"
                                        : "text-text-secondary hover:bg-background-paper hover:text-text-primary",
                                )}>
                                <menu.icon
                                    className={twMerge(
                                        "w-5 h-5",
                                        isActive ? "text-primary-main" : "text-text-disabled",
                                    )}
                                />
                                {menu.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-divider-main shrink-0">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-text-secondary hover:bg-error-main/10 hover:text-error-main transition-colors">
                        <RiLogoutBoxRLine className="w-5 h-5" />
                        로그아웃
                    </button>
                </div>
            </aside>
        </>
    );
}

export default UserSidebar;
