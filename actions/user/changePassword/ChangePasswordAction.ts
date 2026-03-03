"use server";

import { GraphQLMutation } from "@/providers/apollo/apollo-server";
import { ChangePasswordSchema, ChangePasswordValues } from "./ChangePasswordSchema";
import { ChangePasswordDocument, ChangePasswordMutation } from "@/graphql/graphql.generated";

async function ChangePasswordAction(data: ChangePasswordValues) {
    const parsed = ChangePasswordSchema.safeParse(data);

    if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || "입력값이 올바르지 않습니다.");
    }

    try {
        const response = await GraphQLMutation<ChangePasswordMutation>(ChangePasswordDocument, {
            input: {
                oldPassword: parsed.data.oldPassword,
                newPassword: parsed.data.newPassword,
            },
        });

        if (!response.changePassword) {
            throw new Error("기존 비밀번호가 일치하지 않거나 변경에 실패했습니다.");
        }

        return {
            success: true,
        };
    } catch (error: any) {
        console.error("ChangePasswordAction Error:", error);
        throw new Error(error.message || "비밀번호 변경 중 서버 오류가 발생했습니다.");
    }
}

export default ChangePasswordAction;
