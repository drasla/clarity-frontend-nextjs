"use server";

import { GraphQLQuery } from "@/providers/apollo/apollo-server";
import {
    FindManyUserForAdminDocument,
    FindManyUserForAdminQuery,
} from "@/graphql/graphql.generated";
import {
    UserSearchInputForAdminSchema,
    UserSearchInputForAdminValues,
} from "@/actions/admin/user/findManyUser/UserSearchInputForAdminSchema";

async function FindManyUserForAdminAction(params: UserSearchInputForAdminValues) {
    const parsed = UserSearchInputForAdminSchema.safeParse(params);
    if (!parsed.success) throw new Error("잘못된 검색 파라미터입니다.");

    try {
        const { page, size, ...search } = parsed.data;

        const response = await GraphQLQuery<FindManyUserForAdminQuery>(
            FindManyUserForAdminDocument,
            {
                page: { page, size },
                search,
            },
        );

        return response.findManyUserForAdmin;
    } catch (error: any) {
        console.error("FindManyUserForAdminAction Error:", error);
        throw new Error("회원 목록을 불러오는 중 오류가 발생했습니다.");
    }
}

export default FindManyUserForAdminAction;