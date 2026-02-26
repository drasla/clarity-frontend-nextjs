import { InquiryCategory, InquiryStatus } from "@/graphql/types.generated";

export const INQUIRY_CATEGORY_MAP: Record<InquiryCategory, string> = {
    [InquiryCategory.Domain]: "도메인",
    [InquiryCategory.Hosting]: "호스팅",
    [InquiryCategory.GoldenShop]: "골든샵",
    [InquiryCategory.Ssl]: "보안인증서",
    [InquiryCategory.Email]: "이메일",
    [InquiryCategory.UserInfo]: "회원정보",
    [InquiryCategory.Etc]: "기타",
};

export const INQUIRY_STATUS_MAP: Record<InquiryStatus, { label: string; color: string; bg: string }> = {
    [InquiryStatus.Pending]: {
        label: "답변대기",
        color: "text-text-secondary",
        bg: "bg-background-default border border-divider-main",
    },
    [InquiryStatus.Completed]: {
        label: "답변완료",
        color: "text-primary-main",
        bg: "bg-primary-main/10",
    },
};