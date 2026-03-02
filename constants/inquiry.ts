import { InquiryCategory, InquiryStatus } from "@/graphql/types.generated";
import { ChipColor, ChipVariant } from "@/components/ui/common";

export const INQUIRY_CATEGORY_MAP: Record<InquiryCategory, string> = {
    [InquiryCategory.Domain]: "도메인",
    [InquiryCategory.Hosting]: "호스팅",
    [InquiryCategory.GoldenShop]: "골든샵",
    [InquiryCategory.Ssl]: "보안인증서",
    [InquiryCategory.Email]: "이메일",
    [InquiryCategory.UserInfo]: "회원정보",
    [InquiryCategory.Etc]: "기타",
};

export const INQUIRY_STATUS_MAP: Record<
    InquiryStatus,
    { label: string; color: ChipColor; variant: ChipVariant }
> = {
    [InquiryStatus.Pending]: {
        label: "답변대기",
        color: "warning",
        variant: "soft",
    },
    [InquiryStatus.Completed]: {
        label: "답변완료",
        color: "success",
        variant: "soft",
    },
};