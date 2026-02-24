import { z } from "zod";

export const FindManyMyInquiriesSchema = z.object({
    page: z.number().int().positive("페이지 번호는 1 이상이어야 합니다.").default(1),
    size: z.number().int().positive().default(10),
});

export type FindManyMyInquiriesValues = z.infer<typeof FindManyMyInquiriesSchema>;
