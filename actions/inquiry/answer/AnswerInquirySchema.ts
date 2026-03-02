import { z } from "zod";
import { InquiryStatus } from "@/graphql/types.generated";

export const AnswerInquirySchema = z.object({
    id: z.number().int().positive("유효하지 않은 문의 ID입니다."),
    answer: z.string().min(1, "답변 내용을 입력해주세요."),
    status: z.enum(InquiryStatus).default(InquiryStatus.Completed),
});

export type AnswerInquiryFormValues = z.infer<typeof AnswerInquirySchema>;
