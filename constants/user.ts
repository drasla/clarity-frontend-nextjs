import { UserRole, UserStatus, UserType } from "@/graphql/types.generated";

export const USER_STATUS_MAP: Record<
    UserStatus,
    { label: string; color: "success" | "warning" | "error" }
> = {
    [UserStatus.Active]: { label: "정상", color: "success" },
    [UserStatus.Suspended]: { label: "정지", color: "warning" },
    [UserStatus.Withdrawn]: { label: "탈퇴", color: "error" },
};

export const USER_TYPE_MAP: Record<UserType, string> = {
    [UserType.Personal]: "개인",
    [UserType.Business]: "사업자",
};

export const USER_ROLE_MAP: Record<UserRole, string> = {
    [UserRole.User]: "일반 회원",
    [UserRole.Admin]: "관리자",
};
