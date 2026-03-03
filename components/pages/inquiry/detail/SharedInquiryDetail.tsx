"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import { HiDownload, HiOutlinePaperClip } from "react-icons/hi";
import { Button } from "@/components/ui/button/Button";
import { InquiryCategory, InquiryStatus } from "@/graphql/types.generated";
import { InquiryFragment } from "@/graphql/graphql.generated";
import { INQUIRY_CATEGORY_MAP, INQUIRY_STATUS_MAP } from "@/constants/inquiry";
import PageHeader from "@/components/ui/header/PageHeader";
import Chip from "@/components/ui/chip/Chip";

interface SharedInquiryDetailProps {
    title: string;
    description: string;
    inquiryData: InquiryFragment;
    basePath: string;
    children?: ReactNode;
    isEditingAnswer?: boolean;
    answerActionNode?: ReactNode;
}

function SharedInquiryDetail({
    title,
    description,
    inquiryData,
    basePath,
    children,
    isEditingAnswer = false,
    answerActionNode,
}: SharedInquiryDetailProps) {
    const router = useRouter();
    const statusInfo = INQUIRY_STATUS_MAP[inquiryData.status as InquiryStatus];

    return (
        <div className="w-full">
            <PageHeader
                title={title}
                description={description}
                action={
                    <Button variant="outlined" size="small" onClick={() => router.push(basePath)}>
                        목록으로
                    </Button>
                }
            />

            <div
                className={twMerge(
                    ["bg-background-default", "border", "border-divider-main"],
                    ["rounded-2xl", "overflow-hidden", "shadow-sm"],
                )}>
                <div
                    className={twMerge(
                        ["p-6", "md:p-8", "border-b"],
                        ["border-divider-main", "bg-background-paper"],
                    )}>
                    <div className={twMerge(["flex", "items-center", "gap-3", "mb-4"])}>
                        <Chip
                            label={INQUIRY_CATEGORY_MAP[inquiryData.category as InquiryCategory]}
                            color="default"
                            variant="soft"
                        />
                        <Chip
                            label={statusInfo.label}
                            color={statusInfo.color}
                            variant={statusInfo.variant}
                        />
                    </div>

                    <h2
                        className={twMerge(
                            ["text-xl", "md:text-2xl", "mb-5"],
                            ["font-bold", "text-text-primary"],
                        )}>
                        {inquiryData.title}
                    </h2>

                    <div
                        className={twMerge(
                            ["flex", "flex-wrap", "items-center", "gap-x-6", "gap-y-2"],
                            ["text-sm", "text-text-secondary"],
                        )}>
                        <p>
                            <strong>작성자:</strong> {inquiryData.email}
                        </p>
                        <p>
                            <strong>작성일:</strong>{" "}
                            {dayjs(inquiryData.createdAt).format("YYYY.MM.DD HH:mm")}
                        </p>
                        {inquiryData.domain && (
                            <p>
                                <strong>관련 도메인:</strong> {inquiryData.domain}
                            </p>
                        )}
                    </div>
                </div>

                <div
                    className={twMerge(
                        ["p-6", "md:p-8", "prose", "prose-sm", "sm:prose-base", "max-w-none"],
                        ["text-text-primary", "min-h-50"],
                    )}
                    dangerouslySetInnerHTML={{ __html: inquiryData.content }}
                />

                {inquiryData.attachments && inquiryData.attachments.length > 0 && (
                    <div className="px-6 md:px-8 py-5 border-t border-divider-main bg-background-paper/50">
                        <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-1.5">
                            <HiOutlinePaperClip className="w-4 h-4" /> 첨부파일 (
                            {inquiryData.attachments.length}개)
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {inquiryData.attachments.map(file => (
                                <a
                                    key={file.id}
                                    href={file.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    download={file.originalName}
                                    className="flex items-center justify-between p-3 border border-divider-main rounded-xl bg-background-default hover:border-primary-main hover:bg-primary-main/5 transition-colors group">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-8 h-8 rounded-lg bg-divider-main/20 flex items-center justify-center shrink-0">
                                            <HiOutlinePaperClip className="w-4 h-4 text-text-secondary" />
                                        </div>
                                        <div className="flex flex-col truncate">
                                            <span className="text-sm font-medium text-text-primary truncate group-hover:text-primary-main transition-colors">
                                                {file.originalName}
                                            </span>
                                            <span className="text-xs text-text-disabled">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                        </div>
                                    </div>
                                    <HiDownload className="w-5 h-5 text-text-secondary group-hover:text-primary-main transition-colors shrink-0 ml-2" />
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {!isEditingAnswer &&
                inquiryData.status === InquiryStatus.Completed &&
                inquiryData.answer && (
                    <div className="mt-8 bg-primary-main/5 border border-primary-main/30 rounded-2xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-main" />

                        <div className="p-6 md:p-8 border-b border-primary-main/10 bg-primary-main/10">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <h3 className="text-lg font-bold text-primary-dark flex items-center gap-2">
                                    관리자 답변
                                </h3>
                                <div className="flex items-center gap-3">
                                    {inquiryData.answeredAt && (
                                        <span className="text-sm text-text-secondary">
                                            {dayjs(inquiryData.answeredAt).format(
                                                "YYYY.MM.DD HH:mm",
                                            )}
                                        </span>
                                    )}
                                    {answerActionNode}
                                </div>
                            </div>
                        </div>

                        <div
                            className="p-6 md:p-8 prose prose-sm sm:prose-base max-w-none text-text-primary"
                            dangerouslySetInnerHTML={{ __html: inquiryData.answer }}
                        />
                    </div>
                )}

            {children}
        </div>
    );
}

export default SharedInquiryDetail;
