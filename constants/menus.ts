"use client";

import { ElementType } from "react";
import { HiOutlineCog, HiOutlineServer, HiOutlineTicket, HiOutlineUser } from "react-icons/hi";
import {
    RiBankCardLine,
    RiDashboardLine,
    RiQuestionAnswerLine,
    RiServerLine,
    RiUserSettingsLine,
} from "react-icons/ri";

export interface NavMenu {
    label: string;
    href: string;
}

export interface SidebarMenu {
    label: string;
    href: string;
    icon: ElementType;
}

export const MAIN_NAV_MENUS: NavMenu[] = [
    { label: "도메인", href: "/domain" },
    { label: "호스팅", href: "/hosting" },
    { label: "골든샵", href: "/goldenshop" },
    { label: "보안인증서", href: "/certificate" },
    { label: "이메일", href: "/email" },
    { label: "고객센터", href: "/center" },
];

export const USER_SIDEBAR_MENUS: SidebarMenu[] = [
    { label: "대시보드", href: "/user", icon: RiDashboardLine },
    { label: "나의 서비스", href: "/user/services", icon: RiServerLine },
    { label: "결제 내역", href: "/user/billing", icon: RiBankCardLine },
    { label: "1:1 문의 내역", href: "/user/inquiries", icon: RiQuestionAnswerLine },
    { label: "회원 정보 수정", href: "/user/profile", icon: RiUserSettingsLine },
];

export const ADMIN_SIDEBAR_MENUS: SidebarMenu[] = [
    { label: "관리자 대시보드", href: "/admin", icon: HiOutlineUser },
    { label: "서비스 관리", href: "/admin/services", icon: HiOutlineServer },
    { label: "문의 관리 (CS)", href: "/admin/inquiries", icon: HiOutlineTicket },
    { label: "시스템 설정", href: "/admin/settings", icon: HiOutlineCog },
];