"use server";

import { GraphQLMutation } from "@/providers/apollo/apollo-server";
import { ModifyUserSchema, ModifyUserValues } from "./ModifyUserSchema";
import { ModifyUserDocument, ModifyUserMutation } from "@/graphql/graphql.generated";

async function ModifyUserAction(data: ModifyUserValues) {
    const parsed = ModifyUserSchema.safeParse(data);

    if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || "입력값이 올바르지 않습니다.");
    }

    try {
        const response = await GraphQLMutation<ModifyUserMutation>(ModifyUserDocument, {
            input: parsed.data,
        });

        if (!response.modifyUser) {
            throw new Error("회원정보 수정에 실패했습니다.");
        }

        return {
            success: true,
            user: response.modifyUser,
        };
    } catch (error: any) {
        console.error("ModifyUserAction Error:", error);
        throw new Error(error.message || "회원정보 수정 중 서버 오류가 발생했습니다.");
    }
}

export default ModifyUserAction;