import { z } from "zod";
import { UserType } from "@/graphql/types.generated";

export const ModifyUserSchema = z.object({
    name: z.string().min(1, "이름을 입력해주세요.").optional(),
    email: z.email("올바른 이메일 형식이 아닙니다.").optional(),
    phoneNumber: z.string().min(1, "휴대폰 번호를 입력해주세요.").optional(),
    landlineNumber: z.string().optional().nullable(),

    agreeEmail: z.boolean().optional(),
    agreeSms: z.boolean().optional(),
    type: z.enum(UserType).optional(),

    bizCeo: z.string().optional().nullable(),
    bizRegNumber: z.string().optional().nullable(),
    bizType: z.string().optional().nullable(),
    bizItem: z.string().optional().nullable(),
    bizZipCode: z.string().optional().nullable(),
    bizAddress1: z.string().optional().nullable(),
    bizAddress2: z.string().optional().nullable(),
    bizLicenseUrl: z.string().optional().nullable(),
});

export type ModifyUserValues = z.infer<typeof ModifyUserSchema>;
