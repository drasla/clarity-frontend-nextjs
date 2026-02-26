import { z } from "zod";
import { InquiryCategory, InquiryStatus } from "@/graphql/types.generated";

export const FindManyInquiriesForAdminSchema = z.object({
    page: z.number().int().min(1).default(1),
    size: z.number().int().min(1).default(10),

    category: z.enum(InquiryCategory).optional().nullable(),
    status: z.enum(InquiryStatus).optional().nullable(),
    keyword: z.string().optional().nullable(),
    domain: z.string().optional().nullable(),
});

export type FindManyInquiriesForAdminFormValues = z.infer<typeof FindManyInquiriesForAdminSchema>;
