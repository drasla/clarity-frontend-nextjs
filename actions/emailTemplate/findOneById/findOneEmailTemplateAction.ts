"use server";

import { GraphQLQuery } from "@/providers/apollo/apollo-server";
import {
    FindOneEmailTemplateByIdDocument,
    FindOneEmailTemplateByIdQuery,
} from "@/graphql/graphql.generated";

async function FindOneEmailTemplateByIdAction(id: number) {
    try {
        const response = await GraphQLQuery<FindOneEmailTemplateByIdQuery>(
            FindOneEmailTemplateByIdDocument,
            { id },
        );
        return response.findOneEmailTemplateById;
    } catch (error) {
        console.error("FindOneEmailTemplateByIdAction Error:", error);
        throw new Error("이메일 템플릿 상세 정보를 불러오는 중 오류가 발생했습니다.");
    }
}

export default FindOneEmailTemplateByIdAction;
