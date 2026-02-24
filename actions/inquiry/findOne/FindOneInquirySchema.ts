import { z } from "zod";

export const FindOneInquirySchema = z.object({
    id: z.number().int().positive("유효한 문의 번호가 아닙니다."),
    password: z.string().optional(),
});

export type FindOneInquiryValues = z.infer<typeof FindOneInquirySchema>;
