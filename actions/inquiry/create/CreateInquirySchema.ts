import { z } from "zod";
import { InquiryCategory } from "@/graphql/types.generated";

export const CreateInquirySchema = z.object({
    category: z.enum(InquiryCategory, {
        error: "올바른 문의 유형을 선택해주세요.",
    }),
    title: z.string().min(1, "제목을 입력해 주세요."),
    domain: z.string().optional(),
    email: z.email("올바른 이메일 형식을 입력해 주세요.").min(1, "이메일을 입력해 주세요."),
    phoneNumber: z
        .string()
        .min(1, "연락처를 입력해 주세요.")
        .regex(/^[0-9-]+$/, "숫자와 하이픈(-)만 입력 가능합니다."),
    content: z
        .string()
        .min(1, "문의 내용을 입력해 주세요.")
        .refine(val => val !== "<p></p>", { message: "문의 내용을 입력해 주세요." }),
    nonMemberPw: z.string().optional(),
});

export type CreateInquiryFormValues = z.infer<typeof CreateInquirySchema>;
