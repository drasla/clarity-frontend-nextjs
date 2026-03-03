"use server";

import { GraphQLQuery } from "@/providers/apollo/apollo-server";
import { CheckPasswordSchema, CheckPasswordValues } from "./CheckPasswordSchema";
import { CheckPasswordDocument, CheckPasswordQuery } from "@/graphql/graphql.generated";

async function CheckPasswordAction(data: CheckPasswordValues) {
    const parsed = CheckPasswordSchema.safeParse(data);

    if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || "입력값이 올바르지 않습니다.");
    }

    try {
        const response = await GraphQLQuery<CheckPasswordQuery>(CheckPasswordDocument, {
            password: parsed.data.password,
        });

        return {
            success: true,
            isMatched: response.checkPassword,
        };
    } catch (error: any) {
        console.error("CheckPasswordAction Error:", error);
        throw new Error(error.message || "비밀번호 확인 중 서버 오류가 발생했습니다.");
    }
}

export default CheckPasswordAction;
