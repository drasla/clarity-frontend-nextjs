"use server";

import { GraphQLQuery } from "@/providers/apollo/apollo-server";
import { FindManyMyInquiriesSchema, FindManyMyInquiriesValues } from "./FindManyMyInquiriesSchema";
import { FindManyMyInquiriesDocument, FindManyMyInquiriesQuery } from "@/graphql/graphql.generated";

export async function FindManyMyInquiriesAction(data: FindManyMyInquiriesValues) {
    const parsed = FindManyMyInquiriesSchema.safeParse(data);

    if (!parsed.success) {
        const errorMessage = parsed.error.issues[0]?.message || "잘못된 요청입니다.";
        throw new Error(errorMessage);
    }

    try {
        // 2. 백엔드 GraphQL Query 호출
        const response = await GraphQLQuery<FindManyMyInquiriesQuery>(FindManyMyInquiriesDocument, {
            page: {
                page: parsed.data.page,
                size: parsed.data.size,
            },
        });

        if (!response.findManyMyInquiries) {
            throw new Error("문의 내역을 불러오지 못했습니다.");
        }

        return response.findManyMyInquiries;
    } catch (error: any) {
        console.error("FindManyMyInquiriesAction Error:", error);

        if (error.message.includes("Unauthorized") || error.message.includes("인증")) {
            throw new Error("로그인이 필요하거나 세션이 만료되었습니다.");
        }

        throw new Error(error.message || "나의 문의 내역을 불러오는 중 오류가 발생했습니다.");
    }
}
