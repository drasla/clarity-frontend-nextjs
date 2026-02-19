import { LoginDocument, LoginMutation, LoginMutationVariables } from "@/graphql/graphql.generated";
import { getClient } from "@/providers/apollo/apollo-server";
import { cookies } from "next/headers";

export type AuthResponse =
    | { success: true; data: LoginMutation }
    | { success: false; message: string };

async function LoginAction(variables: LoginMutationVariables): Promise<AuthResponse> {
    try {
        const { data } = await getClient().mutate<LoginMutation>({
            mutation: LoginDocument,
            variables,
        });

        const accessToken = data?.login.accessToken;
        const refreshToken = data?.login.refreshToken;

        const token = data?.login;

        if (!token?.accessToken || !token?.refreshToken) {
            throw new Error("토큰 발급에 실패했습니다.");
        }

        const cookieStore = await cookies();

        cookieStore.set("accessToken", token.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60,
        });

        cookieStore.set("refreshToken", token.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 14,
        });

        return { success: true, data };
    } catch (error) {
        console.error("Login Error:", error.message);
        return {
            success: false,
            message: error.message || "이메일 또는 비밀번호가 올바르지 않습니다.",
        };
    }
}
