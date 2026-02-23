import Link from "next/link";
import { Button } from "@/components/ui/button/Button";
import { GraphQLQuery } from "@/providers/apollo/apollo-server";
import {
    InquiryCategory,
    InquiryStatus,
} from "@/graphql/types.generated";
import dayjs from "dayjs";
import {
    FindManyPublicInquiriesDocument,
    FindManyPublicInquiriesQuery,
} from "@/graphql/graphql.generated";

const CATEGORY_MAP: Record<InquiryCategory, string> = {
    [InquiryCategory.Domain]: "도메인",
    [InquiryCategory.Hosting]: "호스팅",
    [InquiryCategory.GoldenShop]: "골든샵",
    [InquiryCategory.Ssl]: "보안인증서",
    [InquiryCategory.Email]: "이메일",
    [InquiryCategory.UserInfo]: "회원정보",
    [InquiryCategory.Etc]: "기타",
};

const STATUS_MAP: Record<InquiryStatus, { label: string; color: string }> = {
    [InquiryStatus.Pending]: { label: "답변대기", color: "text-text-secondary" },
    [InquiryStatus.Completed]: { label: "답변완료", color: "text-primary-main font-bold" },
};

export default async function CustomerCenterPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const resolvedParams = await searchParams;
    const currentPage = parseInt(resolvedParams.page || "1", 10);

    let inquiryData = null;
    try {
        const response = await GraphQLQuery<FindManyPublicInquiriesQuery>(FindManyPublicInquiriesDocument, {
            page: { page: currentPage, size: 10 },
        });
        inquiryData = response.findManyPublicInquiries;
    } catch (error) {
        console.error("문의 목록을 불러오는데 실패했습니다.", error);
    }

    const list = inquiryData?.list || [];
    const total = inquiryData?.total || 0;

    return (
        <main className="w-full max-w-7xl mx-auto py-12 px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary mb-2">고객센터</h1>
                    <p className="text-text-secondary">
                        궁금한 점이나 해결이 필요한 문제를 남겨주세요.
                    </p>
                </div>
                <Link href="/center/write">
                    <Button>1:1 문의하기</Button>
                </Link>
            </div>

            <div className="bg-background-default border border-divider-main rounded-xl overflow-hidden shadow-sm">
                <div className="hidden md:grid grid-cols-12 gap-4 bg-background-paper p-4 border-b border-divider-main text-sm font-bold text-text-secondary text-center">
                    <div className="col-span-1">번호</div>
                    <div className="col-span-2">분류</div>
                    <div className="col-span-4">제목</div>
                    <div className="col-span-2">작성자</div>
                    <div className="col-span-2">작성일</div>
                    <div className="col-span-1">상태</div>
                </div>

                {list.length === 0 ? (
                    <div className="p-12 text-center text-text-secondary">
                        등록된 문의가 없습니다.
                    </div>
                ) : (
                    <div className="divide-y divide-divider-main">
                        {list.map((inquiry, index) => {
                            const itemNumber = total - (currentPage - 1) * 10 - index;

                            return (
                                <Link
                                    key={inquiry.id}
                                    href={`/center/${inquiry.id}`}
                                    className="block p-4 hover:bg-background-paper transition-colors group">
                                    <div className="flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center text-sm md:text-base text-text-primary text-center">
                                        <div className="hidden md:block col-span-1 text-text-secondary">
                                            {itemNumber}
                                        </div>
                                        <div className="flex justify-between md:contents mb-2 md:mb-0">
                                            <span className="md:col-span-2 text-xs md:text-sm px-2 py-1 bg-divider-main/20 rounded text-text-secondary inline-block w-max mx-auto">
                                                {CATEGORY_MAP[inquiry.category]}
                                            </span>
                                            <span
                                                className={`md:hidden ${STATUS_MAP[inquiry.status].color}`}>
                                                {STATUS_MAP[inquiry.status].label}
                                            </span>
                                        </div>

                                        <div className="col-span-4 text-left font-medium group-hover:text-primary-main transition-colors truncate mb-2 md:mb-0">
                                            {inquiry.title}
                                        </div>

                                        <div className="flex justify-between md:contents text-text-secondary text-xs md:text-sm">
                                            <div className="md:col-span-2">

                                            </div>
                                            <div className="md:col-span-2">
                                                {dayjs(inquiry.createdAt).format("YYYY.MM.DD")}
                                            </div>
                                        </div>

                                        <div
                                            className={`hidden md:block col-span-1 ${STATUS_MAP[inquiry.status].color}`}>
                                            {STATUS_MAP[inquiry.status].label}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            {total > 10 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <Link
                        href={`/center?page=${currentPage - 1}`}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}>
                        <Button variant="outlined" size="small">
                            이전
                        </Button>
                    </Link>
                    <span className="text-text-secondary font-medium text-sm">
                        {currentPage} 페이지
                    </span>
                    <Link
                        href={`/center?page=${currentPage + 1}`}
                        className={
                            currentPage * 10 >= total ? "pointer-events-none opacity-50" : ""
                        }>
                        <Button variant="outlined" size="small">
                            다음
                        </Button>
                    </Link>
                </div>
            )}
        </main>
    );
}
