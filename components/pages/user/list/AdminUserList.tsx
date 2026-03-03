"use client";

import { SyntheticEvent } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import { UserRole, UserStatus, UserType } from "@/graphql/types.generated";
import { FindManyUserForAdminQuery } from "@/graphql/graphql.generated";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/input/Input";
import { Select } from "@/components/ui/select/Select";
import { Pagination } from "@/components/ui/pagination/Pagenation";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table/Table";
import Chip from "@/components/ui/chip/Chip";
import PageHeader from "@/components/ui/header/PageHeader";
import Card from "@/components/ui/card/Card";
import { USER_ROLE_MAP, USER_STATUS_MAP, USER_TYPE_MAP } from "@/constants/user";

type UserListItem = FindManyUserForAdminQuery["findManyUserForAdmin"]["list"][number];

interface AdminUserListProps {
    list: UserListItem[];
    total: number;
    page: number;
    size: number;
}

function AdminUserList({ list, total, page, size }: AdminUserListProps) {
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
                title="회원 관리"
                description="가입된 모든 회원의 정보를 조회하고 관리할 수 있습니다."
            />

            <Card
                className={twMerge(
                    ["p-3", "md:p-3", "mb-5"],
                    ["flex", "flex-col", "md:flex-row", "md:items-center", "gap-3"],
                )}>
                <div className={twMerge(["flex", "w-full", "md:w-auto", "gap-3", "shrink-0"])}>
                    <Select
                        fullWidth
                        className={twMerge(["md:w-32"])}
                        value={searchParams.get("role") || ""}
                        onChange={e => updateSearchParams("role", e.target.value)}>
                        <option value="">전체 권한</option>
                        <option value={UserRole.User}>일반 회원</option>
                        <option value={UserRole.Admin}>관리자</option>
                    </Select>

                    <Select
                        fullWidth
                        className={twMerge(["md:w-32"])}
                        value={searchParams.get("status") || ""}
                        onChange={e => updateSearchParams("status", e.target.value)}>
                        <option value="">전체 상태</option>
                        <option value={UserStatus.Active}>정상</option>
                        <option value={UserStatus.Suspended}>정지</option>
                        <option value={UserStatus.Withdrawn}>탈퇴</option>
                    </Select>

                    <Select
                        fullWidth
                        className={twMerge(["md:w-32"])}
                        value={searchParams.get("type") || ""}
                        onChange={e => updateSearchParams("type", e.target.value)}>
                        <option value="">회원 유형</option>
                        <option value={UserType.Personal}>개인</option>
                        <option value={UserType.Business}>사업자</option>
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
                        placeholder="이름, 아이디, 이메일 검색"
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
                        { label: "유형", className: "w-24 text-center" },
                        { label: "권한", className: "w-24 text-center" },
                        { label: "상태", className: "w-24 text-center" },
                        { label: "이름 (아이디)", className: "text-left" },
                        { label: "연락처", className: "w-40 text-center" },
                        { label: "가입일", className: "w-32 text-center" },
                    ]}
                />

                <TableBody isEmpty={list.length === 0}>
                    {list.map((user, index) => {
                        const itemNumber = total - (page - 1) * size - index;
                        const statusInfo = USER_STATUS_MAP[user.status as UserStatus];

                        return (
                            <TableRow key={user.id} href={`/admin/users/${user.id}`}>
                                <TableCell
                                    className={twMerge([
                                        "hidden",
                                        "md:table-cell",
                                        "text-center",
                                        "text-text-secondary",
                                    ])}>
                                    {itemNumber}
                                </TableCell>

                                <TableCell
                                    className={twMerge([
                                        "hidden",
                                        "md:table-cell",
                                        "text-center",
                                        "text-text-secondary",
                                        "text-sm",
                                    ])}>
                                    {USER_TYPE_MAP[user.type as UserType]}
                                </TableCell>

                                <TableCell
                                    className={twMerge(
                                        ["hidden", "md:table-cell"],
                                        ["text-center", "text-text-secondary", "text-sm"],
                                    )}>
                                    {USER_ROLE_MAP[user.role as UserRole]}
                                </TableCell>

                                <TableCell className={twMerge(["md:table-cell", "md:text-center"])}>
                                    <Chip
                                        label={statusInfo.label}
                                        color={statusInfo.color}
                                        variant="soft"
                                        size="small"
                                    />
                                </TableCell>

                                <TableCell
                                    className={twMerge(
                                        ["text-left", "font-medium", "mb-1", "md:mb-0", "truncate"],
                                        ["group-hover:text-primary-main", "transition-colors"],
                                    )}>
                                    <div className={twMerge(["flex", "flex-col"])}>
                                        <span className={twMerge(["truncate"])}>
                                            {user.name}{" "}
                                            <span
                                                className={twMerge([
                                                    "text-text-secondary",
                                                    "text-sm",
                                                    "font-normal",
                                                ])}>
                                                ({user.username})
                                            </span>
                                        </span>
                                        <span
                                            className={twMerge([
                                                "text-xs",
                                                "text-text-secondary",
                                                "md:hidden",
                                            ])}>
                                            {USER_TYPE_MAP[user.type as UserType]} ·{" "}
                                            {USER_ROLE_MAP[user.role as UserRole]}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell
                                    className={twMerge(
                                        ["text-left", "md:text-center"],
                                        ["text-text-secondary", "text-sm"],
                                    )}>
                                    {user.phoneNumber}
                                </TableCell>

                                <TableCell
                                    className={twMerge(
                                        ["text-left", "md:text-center"],
                                        ["text-text-secondary", "text-sm"],
                                    )}>
                                    {dayjs(user.createdAt).format("YYYY.MM.DD")}
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

export default AdminUserList;
