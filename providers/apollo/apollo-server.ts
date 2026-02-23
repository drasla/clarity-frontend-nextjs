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

export async function GraphQLMutation<TData, TVariables extends OperationVariables = {}>(
    mutation: TypedDocumentNode<TData, TVariables>,
    variables?: TVariables,
): Promise<TData> {
    try {
        const context = await getApolloContext();

        const { data } = await getClient().mutate<TData, TVariables>({
            mutation,
            variables: variables as TVariables,
            context,
        });

        if (!data) {
            throw new Error("서버로부터 데이터를 응답받지 못했습니다.");
        }

        return data;
    } catch (error: unknown) {
        const errorMessage = parseGraphQLError(error);
        throw new Error(errorMessage);
    }
}

export async function GraphQLQuery<TData, TVariables extends OperationVariables = {}>(
    query: TypedDocumentNode<TData, TVariables>,
    variables?: TVariables,
): Promise<TData> {
    try {
        const context = await getApolloContext();

        const { data } = await getClient().query<TData, TVariables>({
            query,
            variables: variables as TVariables,
            fetchPolicy: "network-only",
            context,
        });

        if (!data) throw new Error("데이터를 불러오지 못했습니다.");
        return data;
    } catch (error: unknown) {
        throw new Error(parseGraphQLError(error));
    }
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
