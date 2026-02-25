export interface NavMenu {
    label: string;
    href: string;
}

export const MAIN_NAV_MENUS: NavMenu[] = [
    { label: "도메인", href: "/domain" },
    { label: "호스팅", href: "/hosting" },
    { label: "골든샵", href: "/goldenshop" },
    { label: "보안인증서", href: "/certificate" },
    { label: "이메일", href: "/email" },
    { label: "고객센터", href: "/center" },
];
