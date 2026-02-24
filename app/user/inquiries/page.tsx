import Link from "next/link";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button/Button";
import { FindManyMyInquiriesAction } from "@/actions/inquiry/findManyMy/FindManyMyInquiriesAction";
import { InquiryCategory, InquiryStatus } from "@/graphql/types.generated";
import { twMerge } from "tailwind-merge";
import { Pagination } from "@/components/ui/pagination/Pagenation";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table/Table";

const CATEGORY_MAP: Record<InquiryCategory, string> = {
    [InquiryCategory.Domain]: "도메인",
    [InquiryCategory.Hosting]: "호스팅",
    [InquiryCategory.GoldenShop]: "골든샵",
    [InquiryCategory.Ssl]: "보안인증서",
    [InquiryCategory.Email]: "이메일",
    [InquiryCategory.UserInfo]: "회원정보",
    [InquiryCategory.Etc]: "기타",
};

const STATUS_MAP: Record<InquiryStatus, { label: string; color: string; bg: string }> = {
    [InquiryStatus.Pending]: {
        label: "답변대기",
        color: "text-text-secondary",
        bg: "bg-background-default border border-divider-main",
    },
    [InquiryStatus.Completed]: {
        label: "답변완료",
        color: "text-primary-main",
        bg: "bg-primary-main/10",
    },
};

export default async function UserInquiriesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; size?: string }>;
}) {
    const resolvedParams = await searchParams;
    const currentPage = parseInt(resolvedParams.page || "1", 10);
    const size = parseInt(resolvedParams.size || "10", 10);

    let list: any[] = [];
    let total = 0;
    let errorMessage = "";

    try {
        const data = await FindManyMyInquiriesAction({
            page: currentPage,
            size: size,
        });
        list = data.list;
        total = data.total;
    } catch (error: any) {
        errorMessage = error.message || "데이터를 불러오는데 실패했습니다.";
    }

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                        1:1 문의 내역
                    </h1>
                    <p className="text-text-secondary">
                        고객님께서 남겨주신 문의와 답변을 확인할 수 있습니다.
                    </p>
                </div>
                <Link href="/user/inquiries/write">
                    <Button>새 문의 작성</Button>
                </Link>
            </div>

            {errorMessage && (
                <div className="p-6 mb-6 bg-error-main/10 text-error-main rounded-xl border border-error-main/20 text-center">
                    {errorMessage}
                </div>
            )}

            <Table>
                <TableHeader
                    columns={[
                        { label: "번호", className: "w-20 text-center" },
                        { label: "상태", className: "w-32 text-center" },
                        { label: "제목", className: "text-left" },
                        { label: "작성일 (답변일)", className: "w-48 text-center" },
                    ]}
                />

                <TableBody isEmpty={list.length === 0}>
                    {list.map((inquiry, index) => {
                        const itemNumber = total - (currentPage - 1) * size - index;
                        const statusInfo = STATUS_MAP[inquiry.status as InquiryStatus];

                        return (
                            <TableRow key={inquiry.id} href={`/center/${inquiry.id}`}>
                                <TableCell className="hidden md:table-cell text-center text-text-secondary">
                                    {itemNumber}
                                </TableCell>

                                <TableCell className="flex justify-between items-center md:table-cell md:text-center mb-2 md:mb-0">
                                    <span className="md:hidden px-2 py-1 bg-divider-main/20 text-text-secondary rounded text-xs font-bold">
                                        {CATEGORY_MAP[inquiry.category as InquiryCategory]}
                                    </span>
                                    <span
                                        className={twMerge(
                                            "px-3 py-1 text-xs md:text-sm font-bold rounded-md whitespace-nowrap",
                                            statusInfo.bg,
                                            statusInfo.color,
                                        )}>
                                        {statusInfo.label}
                                    </span>
                                </TableCell>

                                <TableCell className="text-left font-medium group-hover:text-primary-main transition-colors truncate mb-2 md:mb-0">
                                    <div className="flex items-center gap-2">
                                        <span className="hidden md:inline-block px-2 py-1 bg-divider-main/20 text-text-secondary rounded text-xs font-bold shrink-0">
                                            {CATEGORY_MAP[inquiry.category as InquiryCategory]}
                                        </span>
                                        <span className="truncate">{inquiry.title}</span>
                                    </div>
                                </TableCell>

                                <TableCell className="text-left md:text-center text-text-secondary text-xs md:text-sm">
                                    <div className="flex flex-col md:inline-block">
                                        <span>{dayjs(inquiry.createdAt).format("YYYY.MM.DD")}</span>
                                        {inquiry.answeredAt && (
                                            <span className="text-primary-main/70 md:ml-2">
                                                (답변: {dayjs(inquiry.answeredAt).format("MM.DD")})
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <div className="mt-8">
                <Pagination total={total} page={currentPage} size={size} />
            </div>
        </div>
    );
}
