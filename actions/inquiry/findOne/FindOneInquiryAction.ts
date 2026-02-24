"use server";

import { GraphQLQuery } from "@/providers/apollo/apollo-server";
import { FindOneInquirySchema, FindOneInquiryValues } from "./FindOneInquirySchema";
import { FindOneInquiryByIdDocument, FindOneInquiryByIdQuery } from "@/graphql/graphql.generated";

export async function FindOneInquiryAction(data: FindOneInquiryValues) {
    const parsed = FindOneInquirySchema.safeParse(data);

    if (!parsed.success) {
        const errorMessage = parsed.error.issues[0]?.message || "잘못된 요청입니다.";
        throw new Error(errorMessage);
    }

    try {
        const response = await GraphQLQuery<FindOneInquiryByIdQuery>(FindOneInquiryByIdDocument, {
            id: parsed.data.id,
            password: parsed.data.password || null,
        });

        if (!response.findOneInquiryById) {
            throw new Error("문의 내역을 찾을 수 없습니다.");
        }

        return response.findOneInquiryById;
    } catch (error: any) {
        console.error("FindOneInquiryAction Error:", error);

        if (error.message.includes("비밀번호")) {
            throw new Error("비밀번호가 일치하지 않습니다.");
        }

        throw new Error(error.message || "문의 상세 정보를 불러오는 중 오류가 발생했습니다.");
    }
}
