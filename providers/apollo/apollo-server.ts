import {
    ApolloClient,
    InMemoryCache,
    registerApolloClient,
} from "@apollo/client-integration-nextjs";
import { HttpLink } from "@apollo/client";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_API || "http://localhost:8080/api";

export const { getClient } = registerApolloClient(() => {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: GRAPHQL_ENDPOINT,
        }),
    });
});
