import { z } from "zod";
import { UserType } from "@/graphql/types.generated";

const baseSchema = z.object({
    username: z.string().min(1, "아이디를 입력해주세요."),
    password: z.string().min(1, "비밀번호를 입력해주세요."),
    passwordConfirm: z.string().min(1, "비밀번호를 한 번 더 입력해주세요."),
    name: z.string().min(1, "이름(또는 사업자명)을 입력해주세요."),
    email: z.email("올바른 이메일 형식이 아닙니다."),
    phoneNumber: z.string().min(1, "휴대전화 번호를 입력해주세요."),
    landlineNumber: z.string().optional(),
    agreeEmail: z.boolean(),
    agreeSMS: z.boolean(),
});

const personalSchema = baseSchema.extend({
    userType: z.literal(UserType.Personal),
});

const businessSchema = baseSchema.extend({
    userType: z.literal(UserType.Business),
    bizInfo: z.object({
        bizCEO: z.string().min(1, "대표자명을 입력해주세요."),
        bizRegNumber: z.string().min(1, "사업자등록번호를 입력해주세요."),
        bizType: z.string().min(1, "업태를 입력해주세요."),
        bizItem: z.string().min(1, "종목을 입력해주세요."),
        bizZipCode: z.string().min(1, "우편번호를 입력해주세요."),
        bizAddress1: z.string().min(1, "기본 주소를 입력해주세요."),
        bizAddress2: z.string().optional(),
    }),
});

export const RegisterFormSchema = z
    .discriminatedUnion("userType", [personalSchema, businessSchema])
    .refine(data => data.password === data.passwordConfirm, {
        message: "비밀번호가 일치하지 않습니다.",
        path: ["passwordConfirm"],
    });

export type RegisterFormValues = z.infer<typeof RegisterFormSchema>;
