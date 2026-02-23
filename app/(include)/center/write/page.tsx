"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button/Button";
import { useAuthStore } from "@/store/useAuthStore";
import { InquiryCategory } from "@/graphql/types.generated";
import { Select } from "@/components/ui/select/Select";
import { Editor } from "@/components/ui/editor/Editor";
import { useForm } from "react-hook-form";
import {
    CreateInquiryFormValues,
    CreateInquirySchema,
} from "@/actions/inquiry/create/CreateInquirySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateInquiryAction } from "@/actions/inquiry/create/CreateInquiryAction";
import { Input } from "@/components/ui/input/Input";
import { UploadFileAction } from "@/actions/file/UploadAction";
import { twMerge } from "tailwind-merge";

const INQUIRY_CATEGORIES = [
    { value: InquiryCategory.Domain, label: "도메인" },
    { value: InquiryCategory.Hosting, label: "호스팅" },
    { value: InquiryCategory.GoldenShop, label: "골든샵" },
    { value: InquiryCategory.Ssl, label: "보안인증서 (SSL)" },
    { value: InquiryCategory.Email, label: "이메일" },
    { value: InquiryCategory.Etc, label: "기타" },
];

export default function CustomerCenterWritePage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<CreateInquiryFormValues>({
        resolver: zodResolver(CreateInquirySchema),
        defaultValues: {
            category: InquiryCategory.Domain,
            title: "",
            domain: "",
            email: user?.email || "",
            phoneNumber: user?.phoneNumber || "",
            nonMemberPw: "",
            content: "",
        },
    });

    const onSubmit = async (data: CreateInquiryFormValues) => {
        try {
            const result = await CreateInquiryAction(data);

            if (result.success) {
                alert("문의가 접수되었습니다.");
                router.push("/center");
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || "문의 접수 중 오류가 발생했습니다.");
        }
    };

    const handleImageUpload = async (file: File): Promise<string> => {
        try {
            const result = await UploadFileAction({
                file,
                directory: "inquiry",
            });

            return result.url;
        } catch (error: any) {
            console.error("이미지 업로드 실패:", error);
            alert(error.message || "이미지 업로드에 실패했습니다.");
            throw error;
        }
    };

    return (
        <main className={twMerge(["w-full", "max-w-7xl", "mx-auto", "py-12", "px-4", "md:px-0"])}>
            <div className="mb-8">
                <h1 className={twMerge(["text-3xl", "font-bold", "mb-2"])}>1:1 문의 작성</h1>
                <p className="text-text-secondary">
                    상세히 남겨주시면 더 정확하고 빠른 답변이 가능합니다.
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className={twMerge(
                    ["bg-background-default", "border", "border-divider-main", "rounded-2xl"],
                    ["p-6", "md:p-10", "flex", "flex-col", "gap-6"],
                )}>
                <div className={twMerge(["grid", "grid-cols-1", "md:grid-cols-2", "gap-6"])}>
                    <div className={twMerge(["flex", "flex-col", "gap-2"])}>
                        <label className={twMerge(["font-bold", "text-sm"])}>문의 유형 *</label>
                        <Select fullWidth={true} {...register("category")}>
                            {INQUIRY_CATEGORIES.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div className={twMerge(["flex", "flex-col", "gap-2"])}>
                        <label className={twMerge(["font-bold", "text-sm"])}>
                            관련 도메인 (선택)
                        </label>
                        <Input
                            type="text"
                            fullWidth={true}
                            placeholder="예: goldennet.com"
                            {...register("domain")}
                            error={!!errors.domain?.message}
                            helperText={errors.domain?.message}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className={twMerge(["font-bold", "text-sm"])}>제목 *</label>
                    <Input
                        type="text"
                        fullWidth={true}
                        placeholder="문의 제목을 입력해 주세요"
                        {...register("title")}
                        error={!!errors.title?.message}
                        helperText={errors.title?.message}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-background-paper rounded-xl border border-divider-main/50">
                    <div className="flex flex-col gap-2">
                        <label className={twMerge(["font-bold", "text-sm"])}>이메일 *</label>
                        <Input
                            type="email"
                            fullWidth={true}
                            readOnly={isAuthenticated}
                            disabled={isAuthenticated}
                            className={
                                isAuthenticated
                                    ? "bg-background-default text-text-secondary cursor-not-allowed"
                                    : "bg-background-default"
                            }
                            {...register("email")}
                            error={!!errors.email?.message}
                            helperText={errors.email?.message}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className={twMerge(["font-bold", "text-sm"])}>연락처 *</label>
                        <Input
                            type="tel"
                            fullWidth={true}
                            placeholder="010-0000-0000"
                            readOnly={isAuthenticated}
                            disabled={isAuthenticated}
                            formatType={"phone"}
                            className={
                                isAuthenticated
                                    ? "bg-background-default text-text-secondary cursor-not-allowed"
                                    : "bg-background-default"
                            }
                            {...register("phoneNumber")}
                            error={!!errors.phoneNumber?.message}
                            helperText={errors.phoneNumber?.message}
                        />
                    </div>

                    {!isAuthenticated && (
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className={twMerge(["font-bold", "text-sm"])}>
                                문의 확인용 비밀번호 *
                            </label>
                            <Input
                                type="password"
                                fullWidth={true}
                                placeholder="답변을 확인하기 위해 사용할 비밀번호를 입력해 주세요."
                                className="border-primary-main/50 focus:border-primary-main"
                                {...register("nonMemberPw")}
                                error={!!errors.nonMemberPw?.message}
                                helperText={errors.nonMemberPw?.message}
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <label className={twMerge(["font-bold", "text-sm"])}>문의 내용 *</label>

                    <Editor
                        content={getValues("content")}
                        onChange={html => {
                            setValue("content", html, { shouldValidate: true });
                        }}
                        onImageUpload={handleImageUpload}
                        placeholder="문의 내용을 자세히 적어주세요."
                    />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <Button
                        type="button"
                        variant="outlined"
                        color="primary"
                        onClick={() => router.back()}>
                        취소
                    </Button>
                    <Button type="submit" className="w-40" disabled={isSubmitting}>
                        문의 접수하기
                    </Button>
                </div>
            </form>
        </main>
    );
}
