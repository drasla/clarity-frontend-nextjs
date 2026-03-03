import { z } from "zod";

export const FindManyEmailTemplatesSchema = z.object({
    page: z.number().default(1),
    size: z.number().default(10),
    keyword: z.string().optional().nullable(),
});

export type FindManyEmailTemplatesValues = z.infer<typeof FindManyEmailTemplatesSchema>;
