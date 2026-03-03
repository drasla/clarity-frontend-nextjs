"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { twMerge } from "tailwind-merge";
import EmailEditor, { EditorRef } from "react-email-editor";

import { Input } from "@/components/ui/input/Input";
import { Button } from "@/components/ui/button/Button";
import { AlertModal, AlertType } from "@/components/ui/modal/AlertModal";
import {
    CreateEmailTemplateSchema,
    CreateEmailTemplateValues,
} from "@/actions/emailTemplate/create/CreateEmailTemplateSchema";
import CreateEmailTemplateAction from "@/actions/emailTemplate/create/CreateEmailTemplateAction";
import PageHeader from "@/components/ui/header/PageHeader";
import Card from "@/components/ui/card/Card";

export default function AdminEmailTemplateWrite() {
    const router = useRouter();
    const emailEditorRef = useRef<EditorRef>(null);

    const [alertConfig, setAlertConfig] = useState<{
        isOpen: boolean;
        type: AlertType;
        title: string;
        message: string;
        onClose: VoidFunction;
    }>({
        isOpen: false,
        type: "none",
        title: "",
        message: "",
        onClose: () => {},
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateEmailTemplateValues>({
        resolver: zodResolver(CreateEmailTemplateSchema),
        defaultValues: {
            templateCode: "",
            subject: "",
            description: "",
            variables: "",
            html: "TEMP",
            design: "{}"
        },
    });

    const onSubmit = async (data: CreateEmailTemplateValues) => {
        const unlayer = emailEditorRef.current?.editor;

        if (!unlayer) {
            return setAlertConfig({
                isOpen: true,
                type: "error",
                title: "에디터 오류",
                message: "에디터가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.",
                onClose: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
            });
        }

        unlayer.exportHtml(async (exportData: { design: any; html: string }) => {
            const { html } = exportData;

            const finalData = {
                ...data,
                html,
                design: JSON.stringify(exportData.design),
            };

            try {
                const result = await CreateEmailTemplateAction(finalData);

                if (result.success) {
                    setAlertConfig({
                        isOpen: true,
                        type: "success",
                        title: "생성 완료",
                        message: "새 이메일 템플릿이 성공적으로 저장되었습니다.",
                        onClose: () => {
                            setAlertConfig(prev => ({ ...prev, isOpen: false }));
                            router.push("/admin/templates/email");
                            router.refresh();
                        },
                    });
                }
            } catch (error: any) {
                setAlertConfig({
                    isOpen: true,
                    type: "error",
                    title: "생성 실패",
                    message: error.message || "템플릿 저장 중 오류가 발생했습니다.",
                    onClose: () => setAlertConfig(prev => ({ ...prev, isOpen: false })),
                });
            }
        });
    };

    return (
        <div className={twMerge(["w-full", "max-w-6xl", "mx-auto"])}>
            <PageHeader
                title="새 이메일 템플릿 작성"
                description="드래그 앤 드롭으로 모든 기기에서 완벽하게 보이는 이메일을 디자인하세요."
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
                            placeholder="예: WELCOME_EMAIL, PW_RESET"
                            error={!!errors.templateCode}
                            helperText={errors.templateCode?.message}
                            {...register("templateCode")}
                        />
                        <Input
                            label="사용될 변수 (참고용)"
                            fullWidth
                            placeholder="예: {{name}}, {{code}}"
                            error={!!errors.variables}
                            helperText={
                                errors.variables?.message ||
                                "디자인 시 텍스트에 중괄호 두 개를 넣어 변수로 사용하세요."
                            }
                            {...register("variables")}
                        />
                        <div className={twMerge(["md:col-span-2"])}>
                            <Input
                                label="메일 제목"
                                fullWidth
                                placeholder="고객에게 표시될 실제 이메일 제목입니다."
                                error={!!errors.subject}
                                helperText={errors.subject?.message}
                                {...register("subject")}
                            />
                        </div>
                        <div className={twMerge(["md:col-span-2"])}>
                            <Input
                                label="설명 (관리자용)"
                                fullWidth
                                placeholder="이 템플릿이 언제 어떻게 발송되는지 간단히 메모해두세요."
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
                    <div className={twMerge(["w-full", "flex", "flex-col", "h-175", "bg-[#f5f5f5]"])}>
                        <EmailEditor
                            ref={emailEditorRef}
                            minHeight={700}
                            style={{ flex: 1, height: "100%", width: "100%" }}
                            options={{
                                locale: "ko-KR",
                            }}
                        />
                    </div>
                </Card>

                <Card>
                    <div className={twMerge(["flex", "items-center", "justify-end"])}>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "저장 중..." : "템플릿 저장"}
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
