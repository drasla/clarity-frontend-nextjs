"use client";

import { User, UserRole } from "@/graphql/types.generated";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { Backdrop } from "@/components/ui/backdrop/Backdrop";
import {
    HiOutlineLogout,
    HiOutlineMoon,
    HiOutlineServer,
    HiOutlineShieldCheck,
    HiOutlineSun,
} from "react-icons/hi";
import { NavMenu } from "@/constants/menus";
import { Button } from "@/components/ui/button/Button";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: VoidFunction;
    navMenus: NavMenu[];
    isAuthenticated: boolean;
    user: User | null;
    onLogout: VoidFunction;
    theme?: string;
    toggleTheme?: VoidFunction;
    mounted?: boolean;
}

function MobileMenu({
    isOpen,
    onClose,
    navMenus,
    isAuthenticated,
    user,
    onLogout,
    theme,
    toggleTheme,
    mounted,
}: MobileMenuProps) {
    return (
        <>
            <Backdrop isOpen={isOpen} onClick={onClose} className="top-15 md:hidden" />

            <div
                className={twMerge(
                    ["fixed", "top-15", "right-0", "md:hidden", "z-50"],
                    ["w-full", "h-[calc(100vh-60px)]", "bg-background-paper"],
                    ["transform", "transition-transform", "duration-300", "ease-in-out"],
                    ["flex", "flex-col"],
                    isOpen ? "translate-x-0" : "translate-x-full",
                )}>
                <div className="flex flex-col flex-1 py-6 px-5 gap-6 overflow-y-auto">
                    <div className="pb-6 border-b border-divider-main">
                        {isAuthenticated ? (
                            <div className="flex flex-col gap-2">
                                <span className={twMerge(["text-text-primary", "text-lg", "mb-4"])}>
                                    <strong className="font-bold text-primary-main">
                                        {user?.name}
                                    </strong>
                                    님 환영합니다!
                                </span>

                                <Link href="/user" onClick={onClose}>
                                    <Button type={"button"} color={"primary"} fullWidth={true}>
                                        <HiOutlineServer
                                            className={twMerge(["w-5", "h-5", "mr-2"])}
                                        />
                                        나의 서비스 관리
                                    </Button>
                                </Link>

                                {user?.role === UserRole.Admin && (
                                    <Link href="/admin" onClick={onClose}>
                                        <Button type={"button"} color={"success"} fullWidth={true}>
                                            <HiOutlineShieldCheck
                                                className={twMerge(["w-5", "h-5", "mr-2"])}
                                            />
                                            관리자 모드
                                        </Button>
                                    </Link>
                                )}

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            if (onLogout) onLogout();
                                            onClose();
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-background-default border border-divider-main text-text-primary rounded-xl hover:bg-divider-main transition-colors font-medium">
                                        <HiOutlineLogout className="w-5 h-5 text-text-secondary" />{" "}
                                        로그아웃
                                    </button>

                                    {toggleTheme && (
                                        <button
                                            onClick={toggleTheme}
                                            className="flex items-center justify-center w-12.5 h-12.5 bg-background-default border border-divider-main text-text-secondary rounded-xl hover:text-primary-main hover:border-primary-main transition-colors shrink-0"
                                            aria-label="테마 변경">
                                            {mounted && theme === "dark" ? (
                                                <HiOutlineSun className="w-6 h-6" />
                                            ) : (
                                                <HiOutlineMoon className="w-6 h-6" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/auth/login"
                                    onClick={onClose}
                                    className="w-full py-2.5 text-center bg-primary-main text-primary-contrast font-bold rounded-md hover:bg-primary-dark transition-colors">
                                    로그인
                                </Link>
                                <Link
                                    href="/auth/register"
                                    onClick={onClose}
                                    className="w-full py-2.5 text-center border border-primary-main text-primary-main font-bold rounded-md hover:bg-primary-main/10 transition-colors">
                                    회원가입
                                </Link>
                            </div>
                        )}
                    </div>

                    <nav className="flex flex-col gap-5 mt-2">
                        {navMenus.map(menu => (
                            <Link
                                key={menu.label}
                                href={menu.href}
                                onClick={onClose}
                                className="text-lg font-medium text-text-primary hover:text-primary-main transition-colors">
                                {menu.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
}

export default MobileMenu;
