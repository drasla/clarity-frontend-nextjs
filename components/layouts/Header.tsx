"use client";

import { twMerge } from "tailwind-merge";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MobileMenu from "@/components/layouts/MobileMenu";
import {
    HiChevronDown,
    HiMenu,
    HiOutlineLogout,
    HiOutlineMoon,
    HiOutlineServer,
    HiOutlineShieldCheck,
    HiOutlineSun,
    HiOutlineUser,
    HiX,
} from "react-icons/hi";
import { Button } from "@/components/ui/button/Button";
import LogoutAction from "@/actions/auth/logout/LogoutAction";
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@/components/ui/dropdown/Dropdown";
import { useTheme } from "next-themes";
import { MAIN_NAV_MENUS } from "@/constants/menus";
import { UserRole } from "@/graphql/types.generated";

function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuthStore();
    const { theme, setTheme } = useTheme();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setMounted(true);
    }, [pathname]);

    const handleLogout = async () => {
        await LogoutAction();
        logout();
        router.push("/");
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
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
                        {MAIN_NAV_MENUS.map(menu => (
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
                                <Dropdown>
                                    <DropdownTrigger>
                                        <div className="flex items-center gap-1 cursor-pointer hover:bg-background-default px-3 py-1.5 rounded-lg transition-colors">
                                            <span className="text-text-primary">
                                                <strong className="font-bold text-primary-main">
                                                    {user?.name}
                                                </strong>
                                                님
                                            </span>
                                            <HiChevronDown className="w-4 h-4 text-text-secondary" />
                                        </div>
                                    </DropdownTrigger>

                                    <DropdownMenu>
                                        <DropdownItem href="/user" icon={HiOutlineServer}>
                                            나의 서비스 관리
                                        </DropdownItem>
                                        <DropdownItem href="/user/profile" icon={HiOutlineUser}>
                                            회원정보 수정
                                        </DropdownItem>

                                        {user?.role === UserRole.Admin && (
                                            <DropdownItem
                                                href="/admin"
                                                icon={HiOutlineShieldCheck}
                                                className="text-success-main font-bold">
                                                관리자 모드
                                            </DropdownItem>
                                        )}

                                        <div className="w-full h-px bg-divider-main" />
                                        <DropdownItem
                                            onClick={toggleTheme}
                                            icon={
                                                mounted && theme === "dark"
                                                    ? HiOutlineSun
                                                    : HiOutlineMoon
                                            }>
                                            {mounted && theme === "dark"
                                                ? "라이트 모드"
                                                : "다크 모드"}
                                        </DropdownItem>
                                        <DropdownItem
                                            onClick={handleLogout}
                                            icon={HiOutlineLogout}
                                            className="text-error-main hover:text-error-main hover:bg-error-main/10">
                                            로그아웃
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
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
                navMenus={MAIN_NAV_MENUS}
                isAuthenticated={isAuthenticated}
                user={user}
                onLogout={handleLogout}
                theme={theme}
                toggleTheme={toggleTheme}
                mounted={mounted}
            />
        </>
    );
}

export default Header;
