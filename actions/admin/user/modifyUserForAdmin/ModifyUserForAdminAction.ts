"use server";

import { GraphQLMutation } from "@/providers/apollo/apollo-server";
import { ModifyUserForAdminSchema, ModifyUserForAdminValues } from "./ModifyUserForAdminSchema";
import {
    ModifyUserForAdminDocument,
    ModifyUserForAdminMutation,
} from "@/graphql/graphql.generated";

export async function ModifyUserForAdminAction(id: string, data: ModifyUserForAdminValues) {
    if (!id) throw new Error("회원 ID가 필요합니다.");

    const parsed = ModifyUserForAdminSchema.safeParse(data);
    if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || "입력값이 올바르지 않습니다.");
    }

    const inputData = { ...parsed.data };
    if (!inputData.password) {
        delete inputData.password;
    }

    try {
        const response = await GraphQLMutation<ModifyUserForAdminMutation>(
            ModifyUserForAdminDocument,
            {
                id,
                input: inputData,
            },
        );

        if (!response.modifyUserForAdmin) {
            throw new Error("회원정보 수정에 실패했습니다.");
        }

        return {
            success: true,
            user: response.modifyUserForAdmin,
        };
    } catch (error: any) {
        console.error("ModifyUserForAdminAction Error:", error);
        throw new Error(error.message || "회원정보 수정 중 서버 오류가 발생했습니다.");
    }
}

export default ModifyUserForAdminAction;