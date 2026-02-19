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

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_API || "http://localhost:8080/api";

export const { getClient } = registerApolloClient(() => {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: GRAPHQL_ENDPOINT,
        }),
    });
});

export async function GraphQLMutation<TData, TVariables extends OperationVariables = {}>(
    mutation: TypedDocumentNode<TData, TVariables>,
    variables?: TVariables,
): Promise<TData> {
    try {
        const { data } = await getClient().mutate<TData, TVariables>({
            mutation,
            variables: variables as TVariables,
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

function parseGraphQLError(error: unknown): string {
    if (CombinedGraphQLErrors.is(error)) {
        return error.errors[0]?.message ?? "서버에서 오류가 발생했습니다.";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "알 수 없는 오류가 발생했습니다.";
}
