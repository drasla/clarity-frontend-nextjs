import { z } from "zod";

export const ChangePasswordSchema = z
    .object({
        oldPassword: z.string().min(1, "기존 비밀번호를 입력해주세요."),
        newPassword: z.string().min(8, "새 비밀번호는 8자 이상이어야 합니다."),
        newPasswordConfirm: z.string().min(1, "새 비밀번호 확인을 입력해주세요."),
    })
    .refine(data => data.newPassword === data.newPasswordConfirm, {
        path: ["newPasswordConfirm"],
        message: "새 비밀번호가 일치하지 않습니다.",
    });

export type ChangePasswordValues = z.infer<typeof ChangePasswordSchema>;
