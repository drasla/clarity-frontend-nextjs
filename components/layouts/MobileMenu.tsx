"use client";

import { User } from "@/graphql/types.generated";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { Backdrop } from "@/components/ui/backdrop/Backdrop";

export interface NavMenu {
    label: string;
    href: string;
}

interface MobileMenuProps {
    isOpen: boolean;
    onClose: VoidFunction;
    navMenus: NavMenu[];
    isAuthenticated: boolean;
    user: User | null;
    onLogout: VoidFunction;
}

function MobileMenu({
    isOpen,
    onClose,
    navMenus,
    isAuthenticated,
    user,
    onLogout,
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
                            <div className="flex flex-col gap-4">
                                <span className="text-text-primary text-lg">
                                    <strong className="font-bold text-primary-main">
                                        {user?.name}
                                    </strong>
                                    님 환영합니다!
                                </span>
                                <button
                                    onClick={() => {
                                        onLogout();
                                        onClose();
                                    }}
                                    className="w-full py-2.5 bg-background-default border border-divider-main text-text-primary rounded-md hover:bg-divider-main transition-colors font-medium">
                                    로그아웃
                                </button>
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
