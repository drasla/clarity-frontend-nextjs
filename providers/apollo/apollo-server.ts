import {
    ApolloClient,
    InMemoryCache,
    registerApolloClient,
} from "@apollo/client-integration-nextjs";
import {
    CombinedGraphQLErrors,
    HttpLink,
    OperationVariables,
    TypedDocumentNode,
} from "@apollo/client";
import { cookies, headers } from "next/headers";
import { RefreshTokenDocument } from "@/graphql/graphql.generated";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_API || "http://localhost:8080/api";

export const { getClient } = registerApolloClient(() => {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: GRAPHQL_ENDPOINT,
        }),
    });
});

async function getApolloContext() {
    const headerStore = await headers();
    const cookieStore = await cookies();

    const forwardedFor = headerStore.get("x-forwarded-for");
    const realIp = headerStore.get("x-real-ip");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || "";
    const userAgent = headerStore.get("user-agent") || "";
    const accessToken = cookieStore.get("access_token")?.value;

    return {
        headers: {
            ...(clientIp && { "X-Forwarded-For": clientIp }),
            ...(clientIp && { "X-Real-IP": clientIp }),
            ...(userAgent && { "User-Agent": userAgent }),
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
    };
}

function parseGraphQLError(error: unknown): string {
    if (CombinedGraphQLErrors.is(error)) {
        return error.errors[0]?.message ?? "서버에서 오류가 발생했습니다.";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "알 수 없는 오류가 발생했습니다.";
}


async function handleTokenRefreshAndRetry<T>(
    executeOperation: (forceToken?: string) => Promise<T>
): Promise<T> {
    try {
        return await executeOperation();
    } catch (error: unknown) {
        const errorMessage = parseGraphQLError(error);

        if (errorMessage.includes("401") || errorMessage.includes("invalid or expired token")) {
            const cookieStore = await cookies();
            const refreshToken = cookieStore.get("refresh_token")?.value;

            if (refreshToken) {
                try {
                    const { data } = await getClient().mutate({
                        mutation: RefreshTokenDocument,
                        variables: { token: refreshToken },
                    });

                    if (data?.refreshToken) {
                        const { accessToken, refreshToken: newRefreshToken } = data.refreshToken;

                        try {
                            cookieStore.set("access_token", accessToken, {
                                path: "/",
                                httpOnly: true,
                            });
                            cookieStore.set("refresh_token", newRefreshToken, {
                                path: "/",
                                httpOnly: true,
                            });
                        } catch (e) {
                            console.warn(
                                "SSR 중에는 쿠키를 변경할 수 없습니다. (현재 요청에만 새 토큰 적용)",
                            );
                        }

                        return await executeOperation(accessToken);
                    }
                } catch (refreshError) {
                    try {
                        cookieStore.delete("access_token");
                        cookieStore.delete("refresh_token");
                    } catch (e) {}
                    throw new Error("세션이 만료되었습니다. 다시 로그인해 주세요.");
                }
            } else {
                try {
                    cookieStore.delete("access_token");
                } catch (e) {}
                throw new Error("로그인이 필요합니다.");
            }
        }

        throw new Error(errorMessage);
    }
}

export async function GraphQLMutation<TData, TVariables extends OperationVariables = {}>(
    mutation: TypedDocumentNode<TData, TVariables>,
    variables?: TVariables,
): Promise<TData> {
    const execute = async (forceToken?: string) => {
        const context = await getApolloContext();
        if (forceToken) {
            context.headers.Authorization = `Bearer ${forceToken}`;
        }

        const { data } = await getClient().mutate<TData, TVariables>({
            mutation,
            variables: variables as TVariables,
            context,
        });

        if (!data) throw new Error("서버로부터 데이터를 응답받지 못했습니다.");
        return data;
    };

    return handleTokenRefreshAndRetry(execute);
}

export async function GraphQLQuery<TData, TVariables extends OperationVariables = {}>(
    query: TypedDocumentNode<TData, TVariables>,
    variables?: TVariables,
): Promise<TData> {
    const execute = async (forceToken?: string) => {
        const context = await getApolloContext();
        if (forceToken) {
            context.headers.Authorization = `Bearer ${forceToken}`;
        }

        const { data } = await getClient().query<TData, TVariables>({
            query,
            variables: variables as TVariables,
            fetchPolicy: "network-only",
            context,
        });

        if (!data) throw new Error("데이터를 불러오지 못했습니다.");
        return data;
    };

    return handleTokenRefreshAndRetry(execute);
}