"use server";

import { GraphQLQuery } from "@/providers/apollo/apollo-server";
import {
    FindManyInquiriesForAdminSchema,
    FindManyInquiriesForAdminFormValues,
} from "./FindManyInquiriesForAdminSchema";
import {
    FindManyInquiriesForAdminDocument,
    FindManyInquiriesForAdminQuery,
} from "@/graphql/graphql.generated";

export async function FindManyInquiriesForAdminAction(data: FindManyInquiriesForAdminFormValues) {
    const parsed = FindManyInquiriesForAdminSchema.safeParse(data);

    if (!parsed.success) {
        console.error("Zod Validation Error:", parsed.error);
        throw new Error("올바르지 않은 검색 조건입니다.");
    }

    const { page, size, category, status, keyword, domain } = parsed.data;

    try {
        const response = await GraphQLQuery<FindManyInquiriesForAdminQuery>(FindManyInquiriesForAdminDocument, {
            page: {
                page,
                size,
            },
            search: {
                ...(category ? { category } : {}),
                ...(status ? { status } : {}),
                ...(keyword ? { keyword } : {}),
                ...(domain ? { domain } : {}),
            },
        });

        if (!response.findManyInquiriesForAdmin) {
            throw new Error("데이터를 불러오지 못했습니다.");
        }

        return response.findManyInquiriesForAdmin;
    } catch (error: any) {
        console.error("FindManyInquiriesForAdminAction Error:", error);
        throw new Error(error.message || "문의 목록을 불러오는 중 오류가 발생했습니다.");
    }
}
