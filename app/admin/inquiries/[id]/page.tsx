"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InquiryFragment } from "@/graphql/graphql.generated";
import { FindOneInquiryAction } from "@/actions/inquiry/findOne/FindOneInquiryAction";
import { HexagonLoader } from "@/components/ui/loader/HexagonLoader";
import { InquiryStatus } from "@/graphql/types.generated";
import { Editor } from "@/components/ui/editor/Editor";
import { Button } from "@/components/ui/button/Button";
import SharedInquiryDetail from "@/components/pages/inquiry/detail/SharedInquiryDetail";
import AnswerInquiryAction from "@/actions/inquiry/answer/AnswerInquiryAction";
import { twMerge } from "tailwind-merge";

export default function AdminInquiryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const inquiryId = parseInt(params.id as string, 10);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inquiryData, setInquiryData] = useState<InquiryFragment | null>(null);
    const [answerContent, setAnswerContent] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const fetchInquiry = async () => {
        if (isNaN(inquiryId)) return;
        try {
            const data = await FindOneInquiryAction({ id: inquiryId });
            setInquiryData(data);
        } catch (error) {
            alert("데이터 로드 실패");
            router.push("/admin/inquiries");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiry().then(() => {});
    }, [inquiryId, router]);

    const handleEditStart = () => {
        if (inquiryData?.answer) {
            setAnswerContent(inquiryData.answer);
        }
        setIsEditing(true);
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        setAnswerContent("");
    };

    const handleAnswerSubmit = async () => {
        if (!answerContent.trim() || answerContent === "<p></p>") {
            alert("답변 내용을 입력해주세요.");
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await AnswerInquiryAction({
                id: inquiryId,
                answer: answerContent,
                status: InquiryStatus.Completed,
            });

            if (result.success) {
                alert(isEditing ? "답변이 수정되었습니다." : "답변이 성공적으로 등록되었습니다.");
                setInquiryData(result.inquiry);
                setIsEditing(false);
                setAnswerContent("");
                router.refresh();
            }
        } catch (error: any) {
            alert(error.message || "답변 등록 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div
                className={twMerge(
                    ["w-full", "py-24"],
                    ["flex", "flex-col", "items-center", "justify-center", "gap-4"],
                )}>
                <HexagonLoader className="w-16 h-16" />
                <span className="text-text-secondary">로딩 중...</span>
            </div>
        );
    }

    if (!inquiryData) return null;

    const editButtonNode =
        inquiryData.status === InquiryStatus.Completed && !isEditing ? (
            <Button variant="outlined" size="small" onClick={handleEditStart}>
                답변 수정하기
            </Button>
        ) : null;

    return (
        <SharedInquiryDetail
            title="문의 상세 및 답변"
            description="고객의 문의 내용을 확인하고 답변을 작성해주세요."
            inquiryData={inquiryData}
            basePath="/admin/inquiries"
            isEditingAnswer={isEditing}
            answerActionNode={editButtonNode}>
            {(inquiryData.status === InquiryStatus.Pending || isEditing) && (
                <div
                    className={twMerge(
                        ["mt-8", "p-6", "md:p-8", "bg-background-paper"],
                        ["border", "border-divider-main", "rounded-2xl"],
                    )}>
                    <h3 className={twMerge(["text-lg", "font-bold", "text-text-primary", "mb-4"])}>
                        {isEditing ? "답변 수정" : "답변 작성"}
                    </h3>
                    <Editor
                        content={answerContent}
                        onChange={html => setAnswerContent(html)}
                        enableImageUpload={true}
                        placeholder="답변 내용을 자세히 입력해주세요."
                        className={"bg-background-default"}
                    />
                    <div className="mt-4 flex justify-end gap-3">
                        {isEditing && (
                            <Button
                                type="button"
                                variant="outlined"
                                onClick={handleEditCancel}
                                disabled={isSubmitting}>
                                수정 취소
                            </Button>
                        )}
                        <Button
                            type="button"
                            disabled={!answerContent.trim() || isSubmitting}
                            onClick={handleAnswerSubmit}>
                            {isSubmitting
                                ? "처리 중..."
                                : isEditing
                                  ? "수정 완료"
                                  : "답변 등록하기"}
                        </Button>
                    </div>
                </div>
            )}
        </SharedInquiryDetail>
    );
}
