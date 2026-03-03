"use client";

import { SyntheticEvent } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import { FindManyEmailTemplatesQuery } from "@/graphql/graphql.generated";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input/Input";
import { Pagination } from "@/components/ui/pagination/Pagenation";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table/Table";
import Chip from "@/components/ui/chip/Chip";
import PageHeader from "@/components/ui/header/PageHeader";
import Card from "@/components/ui/card/Card";

type EmailTemplateListItem = FindManyEmailTemplatesQuery["findManyEmailTemplates"]["list"][number];

interface AdminEmailTemplateListProps {
    list: EmailTemplateListItem[];
    total: number;
    page: number;
    size: number;
}

function AdminEmailTemplateList({
    list,
    total,
    page,
    size,
}: AdminEmailTemplateListProps) {
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
        <div className={twMerge(["w-full"])}>
            <PageHeader
                title="이메일 템플릿 관리"
                description="시스템에서 자동으로 발송되는 이메일 폼을 관리하고 수정할 수 있습니다."
                action={
                    <Link href="/admin/templates/email/create">
                        <Button variant="contained" color="primary">
                            새 템플릿 작성
                        </Button>
                    </Link>
                }
            />

            <Card
                className={twMerge(
                    ["p-3", "md:p-3", "mb-5"],
                    ["flex", "flex-col", "md:flex-row", "md:items-center", "justify-end", "gap-3"],
                )}>
                <form
                    onSubmit={handleSearch}
                    className={twMerge(["w-full", "md:w-auto", "md:max-w-md"], ["flex", "gap-2"])}>
                    <Input
                        name="keyword"
                        fullWidth
                        placeholder="템플릿 코드, 제목, 설명 검색"
                        defaultValue={searchParams.get("keyword") || ""}
                    />
                    <Button type="submit" variant="outlined" className={twMerge(["shrink-0"])}>
                        검색
                    </Button>
                </form>
            </Card>

            <Table>
                <TableHeader
                    columns={[
                        { label: "번호", className: "w-20 text-center" },
                        { label: "템플릿 코드", className: "w-40 text-left" },
                        { label: "메일 제목", className: "text-left" },
                        { label: "설명", className: "w-64 text-left hidden lg:table-cell" },
                        { label: "최종 수정일", className: "w-32 text-center" },
                    ]}
                />

                <TableBody isEmpty={list.length === 0}>
                    {list.map((template, index) => {
                        const itemNumber = total - (page - 1) * size - index;

                        return (
                            <TableRow
                                key={template.id}
                                href={`/admin/email-templates/${template.id}`}>
                                <TableCell
                                    className={twMerge([
                                        "hidden",
                                        "md:table-cell",
                                        "text-center",
                                        "text-text-secondary",
                                    ])}>
                                    {itemNumber}
                                </TableCell>

                                <TableCell className={twMerge(["text-left", "font-medium"])}>
                                    <Chip
                                        label={template.templateCode}
                                        color="default"
                                        variant="soft"
                                        size="small"
                                    />
                                </TableCell>

                                <TableCell
                                    className={twMerge(
                                        ["text-left", "font-medium", "mb-1", "md:mb-0", "truncate"],
                                        ["group-hover:text-primary-main", "transition-colors"],
                                    )}>
                                    <span className={twMerge(["truncate", "block"])}>
                                        {template.subject}
                                    </span>
                                    {template.description && (
                                        <span
                                            className={twMerge([
                                                "text-xs",
                                                "text-text-secondary",
                                                "lg:hidden",
                                                "truncate",
                                                "block",
                                                "mt-1",
                                            ])}>
                                            {template.description}
                                        </span>
                                    )}
                                </TableCell>

                                <TableCell
                                    className={twMerge([
                                        "hidden",
                                        "lg:table-cell",
                                        "text-left",
                                        "text-text-secondary",
                                        "text-sm",
                                        "truncate",
                                    ])}>
                                    {template.description || "-"}
                                </TableCell>

                                <TableCell
                                    className={twMerge([
                                        "text-left",
                                        "md:text-center",
                                        "text-text-secondary",
                                        "text-sm",
                                    ])}>
                                    {dayjs(template.updatedAt).format("YYYY.MM.DD")}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            <div className={twMerge(["mt-8"])}>
                <Pagination total={total} page={page} size={size} />
            </div>
        </div>
    );
}

export default AdminEmailTemplateList;
