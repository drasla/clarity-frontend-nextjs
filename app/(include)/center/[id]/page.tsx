"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input/Input";
import { FindOneInquiryAction } from "@/actions/inquiry/findOne/FindOneInquiryAction";
import { InquiryStatus } from "@/graphql/types.generated";
import { InquiryFragment } from "@/graphql/graphql.generated";

export default function InquiryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const inquiryId = parseInt(params.id as string, 10);

    const [isLoading, setIsLoading] = useState(true);
    const [needsPassword, setNeedsPassword] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [inquiryData, setInquiryData] = useState<InquiryFragment | null>(null);

    const fetchInquiry = async (pw?: string) => {
        setIsLoading(true);
        try {
            const data = await FindOneInquiryAction({
                id: inquiryId,
                password: pw,
            });
            setInquiryData(data);
            setNeedsPassword(false);
        } catch (error: any) {
            const msg = error.message || "";
            if (
                msg.includes("비밀번호") ||
                msg.includes("권한") ||
                msg.includes("찾을 수 없습니다")
            ) {
                setNeedsPassword(true);
                if (pw) alert("비밀번호가 일치하지 않습니다.");
            } else {
                alert("데이터를 불러오는데 실패했습니다.");
                router.push("/center");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isNaN(inquiryId)) {
            fetchInquiry().then(() => {});
        }
    }, [inquiryId]);

    const handlePasswordSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!passwordInput.trim()) {
            alert("비밀번호를 입력해 주세요.");
            return;
        }
        fetchInquiry(passwordInput).then(() => {});
    };

    if (isLoading && !inquiryData && !needsPassword) {
        return (
            <div className="w-full max-w-4xl mx-auto py-24 flex justify-center">
                <span className="text-text-secondary">불러오는 중...</span>
            </div>
        );
    }

    if (needsPassword) {
        return (
            <main className="w-full max-w-xl mx-auto py-24 px-4">
                <div className="bg-background-default border border-divider-main rounded-2xl p-8 md:p-10 text-center">
                    <h2 className="text-2xl font-bold text-text-primary mb-2">비밀번호 확인</h2>
                    <p className="text-text-secondary mb-8">
                        비회원으로 작성하신 문의입니다.
                        <br />
                        작성 시 입력한 비밀번호를 입력해 주세요.
                    </p>

                    <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                        <Input
                            type="password"
                            fullWidth
                            placeholder="비밀번호를 입력해 주세요"
                            value={passwordInput}
                            onChange={e => setPasswordInput(e.target.value)}
                            className="text-center"
                            autoFocus
                        />
                        <div className="flex gap-2 mt-2">
                            <Button
                                type="button"
                                variant="outlined"
                                fullWidth
                                onClick={() => router.back()}>
                                취소
                            </Button>
                            <Button type="submit" fullWidth disabled={isLoading}>
                                {isLoading ? "확인 중..." : "확인"}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        );
    }

    if (!inquiryData) return null;

    return (
        <main className="w-full max-w-7xl mx-auto py-12 px-4 md:px-0">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-text-primary">1:1 문의 상세</h1>
                <Button variant="outlined" size="small" onClick={() => router.push("/center")}>
                    목록으로
                </Button>
            </div>

            <div className="bg-background-default border border-divider-main rounded-2xl overflow-hidden">
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
                    <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-4">
                        {inquiryData.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-secondary">
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
                    className="p-6 md:p-8 prose prose-sm sm:prose-base max-w-none text-text-primary min-h-50"
                    dangerouslySetInnerHTML={{ __html: inquiryData.content }}
                />

                {inquiryData.attachments.length > 0 && (
                    <div className="p-6 border-t border-divider-main bg-background-paper/50">
                        <h3 className="text-sm font-bold text-text-primary mb-3">첨부파일</h3>
                        <div className="flex flex-col gap-2">
                            {inquiryData.attachments.map(file => (
                                <a
                                    key={file.id}
                                    href={file.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-primary-main hover:underline flex items-center gap-2">
                                    📎 {file.originalName}
                                    <span className="text-text-disabled text-xs">
                                        ({(file.size / 1024 / 1024).toFixed(2)}MB)
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {inquiryData.status === InquiryStatus.Completed && inquiryData.answer && (
                <div className="mt-8 bg-primary-main/5 border border-primary-main/20 rounded-2xl overflow-hidden shadow-sm relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-main" />

                    <div className="p-6 md:p-8 border-b border-primary-main/10">
                        <h3 className="text-lg font-bold text-primary-dark flex items-center gap-2">
                            <span>관리자 답변</span>
                            {inquiryData.answeredAt && (
                                <span className="text-xs font-normal text-text-secondary mt-1">
                                    ({dayjs(inquiryData.answeredAt).format("YYYY.MM.DD HH:mm")})
                                </span>
                            )}
                        </h3>
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
