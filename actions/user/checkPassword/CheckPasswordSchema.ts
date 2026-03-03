import { z } from "zod";

export const CheckPasswordSchema = z.object({
    password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export type CheckPasswordValues = z.infer<typeof CheckPasswordSchema>;
