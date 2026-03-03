"use server";

import { GraphQLQuery } from "@/providers/apollo/apollo-server";
import { FindOneUserForAdminDocument, FindOneUserForAdminQuery } from "@/graphql/graphql.generated";

async function FindOneUserForAdminAction(id: string) {
    if (!id) throw new Error("회원 ID가 필요합니다.");

    try {
        const response = await GraphQLQuery<FindOneUserForAdminQuery>(FindOneUserForAdminDocument, {
            id,
        });
        return response.findOneUserForAdmin;
    } catch (error: any) {
        console.error("FindOneUserForAdminAction Error:", error);
        throw new Error("회원 상세 정보를 불러오는 중 오류가 발생했습니다.");
    }
}

export default FindOneUserForAdminAction;
