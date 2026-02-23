"use client";

import { twMerge } from "tailwind-merge";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { LogoutAction } from "@/app/(include)/auth/logout/LogoutAction";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MobileMenu from "@/components/layouts/MobileMenu";
import { HiMenu, HiX } from "react-icons/hi";
import { Button } from "@/components/ui/button/Button";

const NAV_MENUS = [
    { label: "도메인", href: "/domain" },
    { label: "호스팅", href: "/hosting" },
    { label: "골든샵", href: "/goldenshop" },
    { label: "보안인증서", href: "/certificate" },
    { label: "이메일", href: "/email" },
    { label: "고객센터", href: "/center" },
];

function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuthStore();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        await LogoutAction();
        logout();
        router.push("/");
    };

    return (
        <>
            <div
                className={twMerge(
                    ["sticky", "top-0", "w-full", "h-15", "backdrop-blur-xl", "z-30"],
                    ["flex", "justify-center", "box-border"],
                    ["border-b", "border-divider-main"],
                )}>
                <header
                    className={twMerge(
                        ["w-full", "max-w-7xl", "px-3"],
                        ["flex", "justify-between", "items-center"],
                    )}>
                    <Link href={"/"} className={"shrink-0"}>
                        <Image
                            src={"/assets/images/logo_horizontal_light.png"}
                            alt={"Logo"}
                            width={180}
                            height={26}
                        />
                    </Link>
                    <nav
                        className={twMerge(
                            ["hidden", "md:flex", "items-center", "gap-8"],
                            ["font-medium", "text-text-primary"],
                        )}>
                        {NAV_MENUS.map(menu => (
                            <Link
                                key={menu.label}
                                href={menu.href}
                                className="hover:text-primary-main transition-colors">
                                {menu.label}
                            </Link>
                        ))}
                    </nav>

                    <div
                        className={twMerge(
                            ["flex", "items-center", "gap-4"],
                            ["text-sm", "font-medium"],
                        )}>
                        <div className={twMerge(["hidden", "md:flex", "items-center", "gap-4"])}>
                            {isAuthenticated ? (
                                <>
                                    <span className="text-text-primary">
                                        <strong className="font-bold text-primary-main">
                                            {user?.name}
                                        </strong>
                                        님
                                    </span>
                                    <span className="w-px h-3 bg-divider-main" aria-hidden="true" />
                                    <button
                                        onClick={handleLogout}
                                        className={twMerge([
                                            "text-text-secondary",
                                            "hover:text-text-primary",
                                            "transition-colors",
                                        ])}>
                                        로그아웃
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={"/auth/login"}
                                        className={twMerge([
                                            "text-text-secondary",
                                            "hover:text-text-primary",
                                            "transition-colors",
                                        ])}>
                                        로그인
                                    </Link>
                                    <span className="w-px h-3 bg-divider-main" aria-hidden="true" />
                                    <Link
                                        href={"/auth/register"}
                                        className={twMerge([
                                            "text-text-secondary",
                                            "hover:text-text-primary",
                                            "transition-colors",
                                        ])}>
                                        회원가입
                                    </Link>
                                </>
                            )}
                        </div>

                        <Button
                            variant="text"
                            color="primary"
                            size="small"
                            className="md:hidden p-2 min-w-0"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label="메뉴 열기">
                            {isMobileMenuOpen ? (
                                <HiX className="w-7 h-7" />
                            ) : (
                                <HiMenu className="w-7 h-7" />
                            )}
                        </Button>
                    </div>
                </header>
            </div>
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                navMenus={NAV_MENUS}
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
            />
        </>
    );
}

export default Header;
