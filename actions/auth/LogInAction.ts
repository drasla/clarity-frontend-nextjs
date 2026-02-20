import { LoginDocument, LoginMutation, LoginMutationVariables } from "@/graphql/graphql.generated";
import { getClient, GraphQLMutation } from "@/providers/apollo/apollo-server";
import { cookies } from "next/headers";

async function LoginAction(variables: LoginMutationVariables): Promise<LoginMutation> {
    const data = await GraphQLMutation<LoginMutation>(LoginDocument, variables);
    const token = data.login;

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

    return data;
}
