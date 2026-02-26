"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InquiryFragment } from "@/graphql/graphql.generated";
import { FindOneInquiryAction } from "@/actions/inquiry/findOne/FindOneInquiryAction";
import { HexagonLoader } from "@/components/ui/loader/HexagonLoader";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button/Button";
import { InquiryStatus } from "@/graphql/types.generated";
import dayjs from "dayjs";
import { HiDownload, HiOutlinePaperClip } from "react-icons/hi";

function UserInquiryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const inquiryId = parseInt(params.id as string, 10);

    const [isLoading, setIsLoading] = useState(true);
    const [inquiryData, setInquiryData] = useState<InquiryFragment | null>(null);

    useEffect(() => {
        const fetchInquiry = async () => {
            if (isNaN(inquiryId)) return;

            try {
                const data = await FindOneInquiryAction({ id: inquiryId });
                setInquiryData(data);
            } catch (error: any) {
                alert("문의 내역을 불러오는데 실패했거나 권한이 없습니다.");
                router.push("/user/inquiries");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInquiry().then(() => {});
    }, [inquiryId, router]);

    useEffect(() => {
        console.log(inquiryData);
    }, [inquiryData]);

    if (isLoading) {
        return (
            <div
                className={twMerge(
                    ["w-full", "min-h-[50vh]"],
                    ["flex", "flex-col", "items-center", "justify-center", "gap-4"],
                )}>
                <HexagonLoader className="w-16 h-16" />
                <span
                    className={twMerge([
                        "text-text-secondary",
                        "text-sm",
                        "font-medium",
                        "animate-pulse",
                    ])}>
                    문의 내역을 불러오는 중입니다...
                </span>
            </div>
        );
    }

    if (!inquiryData) return null;

    return (
        <main className="w-full max-w-5xl mx-auto py-10 px-4 md:px-0">
            <div className="mb-6 flex items-center justify-between gap-5">
                <div className={twMerge(["flex-1"])}>
                    <h1 className="text-2xl font-bold text-text-primary">나의 1:1 문의</h1>
                    <p className="text-sm text-text-secondary">
                        작성하신 문의 내용과 답변을 확인할 수 있습니다.
                    </p>
                </div>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={() => router.push("/user/inquiries")}>
                    목록으로
                </Button>
            </div>

            <div className="bg-background-default border border-divider-main rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 md:p-8 border-b border-divider-main bg-background-paper">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-divider-main/20 text-text-secondary text-sm font-bold rounded-md">
                            {inquiryData.category}
                        </span>
                        <span
                            className={twMerge(
                                "px-3 py-1 text-sm font-bold rounded-md",
                                inquiryData.status === InquiryStatus.Completed
                                    ? "bg-primary-main/10 text-primary-main"
                                    : "bg-background-default border border-divider-main text-text-secondary",
                            )}>
                            {inquiryData.status === InquiryStatus.Completed
                                ? "답변완료"
                                : "답변대기"}
                        </span>
                    </div>

                    <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-5">
                        {inquiryData.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-secondary">
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
                    className="p-6 md:p-8 prose prose-sm sm:prose-base max-w-none text-text-primary min-h-[200px]"
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
                                    className={twMerge([
                                        "flex",
                                        "items-center",
                                        "justify-between",
                                        "p-3 border border-divider-main rounded-xl bg-background-default hover:border-primary-main hover:bg-primary-main/5 transition-colors group",
                                    ])}>
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

            {inquiryData.status === InquiryStatus.Completed && inquiryData.answer && (
                <div className="mt-8 bg-primary-main/5 border border-primary-main/30 rounded-2xl overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-main" />

                    <div className="p-6 md:p-8 border-b border-primary-main/10 bg-primary-main/10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h3 className="text-lg font-bold text-primary-dark flex items-center gap-2">
                                관리자 답변
                            </h3>
                            {inquiryData.answeredAt && (
                                <span className="text-sm text-text-secondary">
                                    {dayjs(inquiryData.answeredAt).format("YYYY.MM.DD HH:mm")}
                                </span>
                            )}
                        </div>
                    </div>

                    <div
                        className="p-6 md:p-8 prose prose-sm sm:prose-base max-w-none text-text-primary"
                        dangerouslySetInnerHTML={{ __html: inquiryData.answer }}
                    />
                </div>
            )}
        </main>
    );
}

export default UserInquiryDetailPage;
