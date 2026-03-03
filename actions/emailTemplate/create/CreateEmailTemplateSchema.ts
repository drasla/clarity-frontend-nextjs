import { z } from "zod";

export const CreateEmailTemplateSchema = z.object({
    templateCode: z.string().min(1, "템플릿 코드를 입력해주세요. (예: WELCOME_EMAIL)"),
    subject: z.string().min(1, "메일 제목을 입력해주세요."),
    description: z.string().optional().nullable(),
    variables: z.string().optional().nullable(),
    html: z.string().min(1, "이메일 본문을 작성해주세요."),
    design: z.string().min(1, "디자인 데이터가 없습니다."),
});

export type CreateEmailTemplateValues = z.infer<typeof CreateEmailTemplateSchema>;
