"use server";

import { LoginDocument, LoginMutation, LoginMutationVariables } from "@/graphql/graphql.generated";
import { GraphQLMutation } from "@/providers/apollo/apollo-server";
import { cookies } from "next/headers";
import { LoginFormValues } from "@/actions/auth/login/LoginSchema";

export async function LoginAction(data: LoginFormValues): Promise<LoginMutation> {
    const variables: LoginMutationVariables = {
        username: data.username,
        password: data.password,
    };

    const response = await GraphQLMutation<LoginMutation>(LoginDocument, variables);

    const accessToken = response.login.accessToken;
    const refreshToken = response.login.refreshToken;

    if (accessToken) {
        const cookieStore = await cookies();
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax" as const,
            path: "/",
            maxAge: data.autoLogin ? 60 * 60 * 24 * 30 : undefined,
        };

        cookieStore.set("access_token", accessToken, cookieOptions);
        cookieStore.set("refresh_token", refreshToken, cookieOptions);
    }

    return response;
}
