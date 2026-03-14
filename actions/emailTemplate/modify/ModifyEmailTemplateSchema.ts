import { z } from "zod";

export const ModifyEmailTemplateSchema = z.object({
    templateCode: z.string().optional(),
    subject: z.string().optional(),
    description: z.string().optional().nullable(),
    html: z.string().optional(),
    design: z.string().optional(),
});

export type ModifyEmailTemplateValues = z.infer<typeof ModifyEmailTemplateSchema>;
