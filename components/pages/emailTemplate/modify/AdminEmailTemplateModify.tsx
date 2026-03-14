"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import EmailEditor, { EditorRef } from "react-email-editor";

import { FindOneEmailTemplateByIdQuery } from "@/graphql/graphql.generated";
import { Input } from "@/components/ui/input/Input";
import { Button } from "@/components/ui/button/Button";
import { AlertModal, AlertType } from "@/components/ui/modal/AlertModal";
import {
    ModifyEmailTemplateSchema,
    ModifyEmailTemplateValues,
} from "@/actions/emailTemplate/modify/ModifyEmailTemplateSchema";
import ModifyEmailTemplateAction from "@/actions/emailTemplate/modify/ModifyEmailTemplateAction";
import PageHeader from "@/components/ui/header/PageHeader";
import Card from "@/components/ui/card/Card";

type EmailTemplateData = FindOneEmailTemplateByIdQuery["findOneEmailTemplateById"];

interface AdminEmailTemplateDetailProps {
    initialData: EmailTemplateData;
}

function AdminEmailTemplateModify({ initialData }: AdminEmailTemplateDetailProps) {
    const router = useRouter();
    const emailEditorRef = useRef<EditorRef>(null);
    const [isEditorLoaded, setIsEditorLoaded] = useState(false);

    const [alertConfig, setAlertConfig] = useState<{
        isOpen: boolean;
        type: AlertType;
        title: string;
        message: string;
        onClose: VoidFunction;
    }>({ isOpen: false, type: "none", title: "", message: "", onClose: () => {} });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ModifyEmailTemplateValues>({
        resolver: zodResolver(ModifyEmailTemplateSchema),
    });

    // 초기값 세팅
    useEffect(() => {
        if (initialData) {
            reset({
                templateCode: initialData.templateCode,
                subject: initialData.subject,
                description: initialData.description,
            });
        }
    }, [initialData, reset]);

    const handleEditorLoad = () => {
        setIsEditorLoaded(true);
        if (initialData?.design && initialData.design !== "TEMP") {
            try {
                const designJson = JSON.parse(initialData.design);

                if (
                    designJson &&
                    typeof designJson === "object" &&
                    Object.keys(designJson).length > 0
                ) {
                    emailEditorRef.current?.editor?.loadDesign(designJson);
                }
            } catch (error) {
                console.error("디자인 JSON 파싱 실패 (기존 데이터가 유효하지 않음):", error);
            }
        }
    };

    const onSubmit = async (data: ModifyEmailTemplateValues) => {
        const unlayer = emailEditorRef.current?.editor;
        if (!unlayer || !isEditorLoaded) {
            return setAlertConfig({
                isOpen: true,
                type: "error",
                title: "에디터 오류",
                message: "에디터가 아직 준비되지 않았습니다.",
                onClose: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
            });
        }

        unlayer.exportHtml(async (exportData: { design: any; html: string }) => {
            const { html, design } = exportData;
            const finalData = {
                ...data,
                html,
                design: JSON.stringify(design),
            };

            try {
                const result = await ModifyEmailTemplateAction(initialData.id, finalData);
                if (result.success) {
                    setAlertConfig({
                        isOpen: true,
                        type: "success",
                        title: "수정 완료",
                        message: "이메일 템플릿이 성공적으로 수정되었습니다.",
                        onClose: () => {
                            setAlertConfig(prev => ({ ...prev, isOpen: false }));
                            router.refresh();
                        },
                    });
                }
            } catch (error: any) {
                setAlertConfig({
                    isOpen: true,
                    type: "error",
                    title: "수정 실패",
                    message: error.message,
                    onClose: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
                });
            }
        });
    };

    return (
        <div className={twMerge(["w-full", "max-w-6xl", "mx-auto"])}>
            <PageHeader
                title="이메일 템플릿 수정"
                description={`최종 수정: ${dayjs(initialData.updatedAt).format("YYYY-MM-DD HH:mm")} | 등록: ${dayjs(initialData.createdAt).format("YYYY-MM-DD HH:mm")}`}
                action={
                    <Button
                        type="button"
                        variant="outlined"
                        onClick={() => router.push("/admin/templates/email")}>
                        목록으로
                    </Button>
                }
            />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className={twMerge(["w-full", "flex", "flex-col", "gap-6"])}>
                <Card>
                    <h2
                        className={twMerge(
                            ["pb-3", "mb-6"],
                            ["border-b", "border-divider-main/30"],
                            ["font-bold", "text-lg", "text-text-primary"],
                        )}>
                        기본 설정
                    </h2>

                    <div className={twMerge(["grid", "grid-cols-1", "md:grid-cols-2", "gap-6"])}>
                        <Input
                            label="템플릿 코드"
                            fullWidth
                            error={!!errors.templateCode}
                            helperText={errors.templateCode?.message}
                            {...register("templateCode")}
                        />
                        <Input
                            label="사용 가능한 변수 (백엔드 제공)"
                            fullWidth
                            readOnly
                            disabled
                            value={initialData.variables || "등록된 변수가 없습니다."}
                        />
                        <div className={twMerge(["md:col-span-2"])}>
                            <Input
                                label="메일 제목"
                                fullWidth
                                error={!!errors.subject}
                                helperText={errors.subject?.message}
                                {...register("subject")}
                            />
                        </div>
                        <div className={twMerge(["md:col-span-2"])}>
                            <Input
                                label="설명 (관리자용)"
                                fullWidth
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                {...register("description")}
                            />
                        </div>
                    </div>
                </Card>

                <Card className={twMerge(["p-0", "md:p-0", "overflow-hidden"])}>
                    <div
                        className={twMerge(
                            ["p-4", "border-b", "border-divider-main/30"],
                            ["font-bold", "text-lg", "text-text-primary"],
                        )}>
                        이메일 디자인
                    </div>
                    <div
                        className={twMerge(["w-full", "flex", "flex-col", "bg-[#f5f5f5]"])}
                        style={{ height: "700px" }}>
                        <EmailEditor
                            ref={emailEditorRef}
                            minHeight={700}
                            style={{ flex: 1, width: "100%", height: "100%" }}
                            onLoad={handleEditorLoad}
                            options={{ locale: "ko-KR" }}
                        />
                    </div>
                </Card>

                <Card>
                    <div className={twMerge(["flex", "items-center", "justify-end"])}>
                        <Button
                            type="submit"
                            size="large"
                            disabled={isSubmitting || !isEditorLoaded}>
                            {isSubmitting ? "저장 중..." : "수정 완료"}
                        </Button>
                    </div>
                </Card>
            </form>

            <AlertModal
                isOpen={alertConfig.isOpen}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={alertConfig.onClose}
                buttonText="확인"
            />
        </div>
    );
}

export default AdminEmailTemplateModify;
