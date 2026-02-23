import z from "zod";

export const LoginFormSchema = z.object({
    username: z.string().min(1, "아이디를 입력해주세요."),
    password: z.string().min(1, "비밀번호를 입력해주세요."),
    autoLogin: z.boolean(),
});

export type LoginFormValues = z.infer<typeof LoginFormSchema>;
