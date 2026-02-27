"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input/Input";
import { Select } from "@/components/ui/select/Select";
import { InquiryCategory, InquiryStatus } from "@/graphql/types.generated";
import { Pagination } from "@/components/ui/pagination/Pagenation";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table/Table";
import { INQUIRY_CATEGORY_MAP, INQUIRY_STATUS_MAP } from "@/constants/inquiry";
import { InquiryFragment } from "@/graphql/graphql.generated";
import { SyntheticEvent } from "react";

interface SharedInquiryListProps {
    title: string;
    description: string;
    list: InquiryFragment[];
    total: number;
    page: number;
    size: number;
    basePath: string;
    showWriteButton?: boolean;
}

export default function SharedInquiryList({
    title,
    description,
    list,
    total,
    page,
    size,
    basePath,
    showWriteButton = false,
}: SharedInquiryListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateSearchParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        if (key !== "page") params.set("page", "1");

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleSearch = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateSearchParams("keyword", formData.get("keyword") as string);
    };

    return (
        <div className="w-full">
            <div
                className={twMerge(
                    ["mb-6", "flex", "flex-col", "md:flex-row"],
                    ["md:items-end", "justify-between", "gap-4"],
                )}>
                <div>
                    <h1
                        className={twMerge(
                            ["text-2xl", "md:text-3xl", "font-bold", "text-text-primary"],
                            ["mb-2"],
                        )}>
                        {title}
                    </h1>
                    <p className={twMerge(["text-sm", "text-text-secondary", "mt-1"])}>
                        {description}
                    </p>
                </div>
                {showWriteButton && (
                    <Link href={`${basePath}/write`}>
                        <Button>새 문의 작성</Button>
                    </Link>
                )}
            </div>

            <div
                className={twMerge(
                    ["mb-4", "p-4", "bg-background-paper", "border", "border-divider-main"],
                    ["rounded-xl", "flex", "flex-col", "md:flex-row", "md:items-center", "gap-3"],
                )}>
                <div className={twMerge(["flex", "w-full", "md:w-auto", "gap-3", "shrink-0"])}>
                    <Select
                        fullWidth
                        className={"md:w-40 bg-background-default"}
                        value={searchParams.get("category") || ""}
                        onChange={e => updateSearchParams("category", e.target.value)}>
                        <option value="">전체 유형</option>
                        <option value={InquiryCategory.Domain}>도메인</option>
                        <option value={InquiryCategory.Hosting}>호스팅</option>
                        <option value={InquiryCategory.GoldenShop}>골든샵</option>
                        <option value={InquiryCategory.Ssl}>보안인증서 (SSL)</option>
                        <option value={InquiryCategory.Email}>이메일</option>
                        <option value={InquiryCategory.Etc}>기타</option>
                    </Select>

                    <Select
                        fullWidth
                        className={"md:w-32 bg-background-default"}
                        value={searchParams.get("status") || ""}
                        onChange={e => updateSearchParams("status", e.target.value)}>
                        <option value="">전체 상태</option>
                        <option value={InquiryStatus.Pending}>답변대기</option>
                        <option value={InquiryStatus.Completed}>답변완료</option>
                    </Select>
                </div>

                <form
                    onSubmit={handleSearch}
                    className={twMerge(
                        ["w-full", "md:w-auto", "md:max-w-md", "md:ml-auto"],
                        ["flex", "gap-2"],
                    )}>
                    <Input
                        name="keyword"
                        fullWidth
                        placeholder="제목 또는 내용 검색"
                        defaultValue={searchParams.get("keyword") || ""}
                        className={"bg-background-default"}
                    />
                    <Button
                        type="submit"
                        variant="outlined"
                        className={"bg-background-default shrink-0"}>
                        검색
                    </Button>
                </form>
            </div>

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
                        const itemNumber = total - (page - 1) * size - index;
                        const statusInfo = INQUIRY_STATUS_MAP[inquiry.status as InquiryStatus];

                        return (
                            <TableRow key={inquiry.id} href={`${basePath}/${inquiry.id}`}>
                                <TableCell
                                    className={twMerge(
                                        ["hidden", "md:table-cell"],
                                        ["text-center", "text-text-secondary"],
                                    )}>
                                    {itemNumber}
                                </TableCell>

                                <TableCell
                                    className={twMerge(
                                        ["md:table-cell", "md:text-center", "mb-2", "md:mb-0"],
                                        ["flex", "justify-between", "items-center"],
                                    )}>
                                    <span
                                        className={twMerge(
                                            ["md:hidden", "px-2", "py-1", "rounded"],
                                            "bg-divider-main/20",
                                            ["text-text-secondary", "text-xs", "font-bold"],
                                        )}>
                                        {INQUIRY_CATEGORY_MAP[inquiry.category as InquiryCategory]}
                                    </span>
                                    <span
                                        className={twMerge(
                                            ["px-3", "py-1", "text-xs", "md:text-sm", "font-bold"],
                                            ["rounded-md", "whitespace-nowrap"],
                                            statusInfo.bg,
                                            statusInfo.color,
                                        )}>
                                        {statusInfo.label}
                                    </span>
                                </TableCell>

                                <TableCell
                                    className={twMerge(
                                        ["text-left", "font-medium", "mb-2", "md:mb-0", "truncate"],
                                        ["group-hover:text-primary-main", "transition-colors"],
                                    )}>
                                    <div className={twMerge(["flex", "items-center", "gap-2"])}>
                                        <span
                                            className={twMerge(
                                                ["hidden", "md:inline-block", "shrink-0"],
                                                ["px-2", "py-1"],
                                                ["text-text-secondary", "text-xs", "font-bold"],
                                                ["bg-divider-main/20", "rounded"],
                                            )}>
                                            {
                                                INQUIRY_CATEGORY_MAP[
                                                    inquiry.category as InquiryCategory
                                                ]
                                            }
                                        </span>
                                        <span className="truncate">{inquiry.title}</span>
                                    </div>
                                </TableCell>

                                <TableCell
                                    className={twMerge(
                                        ["text-left", "md:text-center"],
                                        ["text-text-secondary", "text-xs", "md:text-sm"],
                                    )}>
                                    <div
                                        className={twMerge([
                                            "flex",
                                            "flex-col",
                                            "md:inline-block",
                                        ])}>
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
                <Pagination total={total} page={page} size={size} />
            </div>
        </div>
    );
}
