"use client";

import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiAttachmentLine, RiCloseLine } from "react-icons/ri";

import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input/Input";
import { Select } from "@/components/ui/select/Select";
import { Editor } from "@/components/ui/editor/Editor";
import { useAuthStore } from "@/store/useAuthStore";
import { InquiryCategory } from "@/graphql/types.generated";
import { UploadFileAction } from "@/actions/file/UploadAction";
import { CreateInquiryAction } from "@/actions/inquiry/create/CreateInquiryAction";
import {
    CreateInquiryFormValues,
    CreateInquirySchema,
} from "@/actions/inquiry/create/CreateInquirySchema";
import { twMerge } from "tailwind-merge";

const INQUIRY_CATEGORIES = [
    { value: InquiryCategory.Domain, label: "도메인" },
    { value: InquiryCategory.Hosting, label: "호스팅" },
    { value: InquiryCategory.GoldenShop, label: "골든샵" },
    { value: InquiryCategory.Ssl, label: "보안인증서 (SSL)" },
    { value: InquiryCategory.Email, label: "이메일" },
    { value: InquiryCategory.Etc, label: "기타" },
];

export default function UserInquiryWritePage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<CreateInquiryFormValues>({
        resolver: zodResolver(CreateInquirySchema),
        defaultValues: {
            category: InquiryCategory.Domain,
            title: "",
            domain: "",
            email: user?.email || "",
            phoneNumber: user?.phoneNumber || "",
            content: "",
        },
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const validFiles = files.filter(file => {
            if (file.size > 10 * 1024 * 1024) {
                alert(`${file.name}의 용량이 10MB를 초과합니다.`);
                return false;
            }
            return true;
        });

        setSelectedFiles(prev => {
            const merged = [...prev, ...validFiles];
            if (merged.length > 5) {
                alert("첨부파일은 최대 5개까지만 등록 가능합니다.");
                return merged.slice(0, 5);
            }
            return merged;
        });

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: CreateInquiryFormValues) => {
        setIsUploading(true);
        try {
            let uploadedAttachments: any[] = [];

            if (selectedFiles.length > 0) {
                const uploadPromises = selectedFiles.map(file =>
                    UploadFileAction({ file, directory: "inquiry" }),
                );

                const uploadResults = await Promise.all(uploadPromises);

                uploadedAttachments = uploadResults.map(res => ({
                    extension: res.extension,
                    originalName: res.originalName,
                    size: res.size,
                    storedName: res.storedName,
                    url: res.url,
                }));
            }

            const payload = {
                ...data,
                attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
            };

            const result = await CreateInquiryAction(payload);

            if (result.success) {
                alert("문의가 정상적으로 접수되었습니다.");
                router.push("/user/inquiries");
            }
        } catch (error: any) {
            console.error(error);
            alert(error.message || "문의 접수 중 오류가 발생했습니다.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-8">
                <h1
                    className={twMerge(
                        ["text-2xl", "md:text-3xl", "mb-2"],
                        ["font-bold", "text-text-primary"],
                    )}>
                    새 문의 작성
                </h1>
                <p className="text-text-secondary">
                    궁금한 점이나 불편한 사항을 남겨주시면 빠르게 답변해 드리겠습니다.
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
                        <Select fullWidth {...register("category")}>
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
                            fullWidth
                            placeholder="예: goldennet.com"
                            {...register("domain")}
                            error={!!errors.domain?.message}
                            helperText={errors.domain?.message}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">제목 *</label>
                    <Input
                        type="text"
                        fullWidth
                        placeholder="문의 제목을 입력해 주세요"
                        {...register("title")}
                        error={!!errors.title?.message}
                        helperText={errors.title?.message}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-background-paper rounded-xl border border-divider-main/50">
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-sm text-text-secondary">
                            답변 받을 이메일
                        </label>
                        <Input
                            type="email"
                            fullWidth
                            readOnly
                            disabled
                            className="bg-background-default text-text-secondary cursor-not-allowed"
                            {...register("email")}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-sm text-text-secondary">연락처</label>
                        <Input
                            type="tel"
                            fullWidth
                            readOnly
                            disabled
                            formatType="phone"
                            className="bg-background-default text-text-secondary cursor-not-allowed"
                            {...register("phoneNumber")}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-bold text-sm">문의 내용 *</label>
                    <Editor
                        content={getValues("content")}
                        onChange={html => setValue("content", html, { shouldValidate: true })}
                        placeholder="문의 내용을 자세히 적어주세요."
                        onImageUpload={async file => {
                            const res = await UploadFileAction({
                                file,
                                directory: "inquiry_inline",
                            });
                            return res.url;
                        }}
                    />
                    {errors.content && (
                        <span className="text-error-main text-xs">{errors.content.message}</span>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <label className="font-bold text-sm">첨부 파일 (선택)</label>
                        <Button
                            type="button"
                            variant="outlined"
                            size="small"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1">
                            <RiAttachmentLine className="w-4 h-4" /> 파일 선택
                        </Button>
                    </div>

                    <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.hwp"
                        onChange={handleFileChange}
                    />

                    {selectedFiles.length > 0 ? (
                        <ul className="mt-2 flex flex-col gap-2">
                            {selectedFiles.map((file, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-background-paper border border-divider-main rounded-lg text-sm">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <RiAttachmentLine className="w-4 h-4 text-text-secondary shrink-0" />
                                        <span className="truncate text-text-primary font-medium">
                                            {file.name}
                                        </span>
                                        <span className="text-xs text-text-disabled shrink-0">
                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(idx)}
                                        className="p-1 text-text-disabled hover:text-error-main transition-colors shrink-0"
                                        aria-label="파일 제거">
                                        <RiCloseLine className="w-5 h-5" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 bg-background-paper border border-dashed border-divider-main rounded-lg text-center text-sm text-text-disabled mt-2">
                            이미지, PDF, Word, Excel, HWP 파일을 첨부할 수 있습니다. (최대 5개, 개당
                            10MB 이하)
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-4 border-t border-divider-main pt-6">
                    <Button
                        type="button"
                        variant="outlined"
                        color="primary"
                        onClick={() => router.back()}
                        disabled={isUploading}>
                        취소
                    </Button>
                    <Button type="submit" className="w-40" disabled={isUploading}>
                        {isUploading ? "파일 업로드 및 등록 중..." : "문의 접수하기"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
