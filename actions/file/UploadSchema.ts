import { z } from "zod";

export const UploadFileSchema = z.object({
    file: z
        .custom<File>(val => val instanceof File, "파일을 선택해주세요.")
        .refine(file => file.size > 0, "빈 파일은 업로드할 수 없습니다.")
        .refine(file => file.size <= 10 * 1024 * 1024, "파일 크기는 10MB를 초과할 수 없습니다."), // 예: 5MB 제한
    directory: z.string().optional(),
});

export type UploadFileValues = z.infer<typeof UploadFileSchema>;
