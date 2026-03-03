"use server";

import { GraphQLQuery } from "@/providers/apollo/apollo-server";
import {
    FindManyEmailTemplatesDocument,
    FindManyEmailTemplatesQuery,
} from "@/graphql/graphql.generated";
import {
    FindManyEmailTemplatesSchema,
    FindManyEmailTemplatesValues,
} from "@/actions/emailTemplate/findManyEmailTemplates/FindManyEmailTemplatesSchema";

async function FindManyEmailTemplatesAction(params: FindManyEmailTemplatesValues) {
    const parsed = FindManyEmailTemplatesSchema.safeParse(params);

    if (!parsed.success) {
        throw new Error("잘못된 검색 파라미터입니다.");
    }

    try {
        const { page, size, keyword } = parsed.data;

        const response = await GraphQLQuery<FindManyEmailTemplatesQuery>(
            FindManyEmailTemplatesDocument,
            {
                page: { page, size },
                search: { keyword },
            },
        );

        return response.findManyEmailTemplates;
    } catch (error: any) {
        console.error("FindManyEmailTemplatesAction Error:", error);
        throw new Error("이메일 템플릿 목록을 불러오는 중 서버 오류가 발생했습니다.");
    }
}

export default FindManyEmailTemplatesAction;
