"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import {
    ApolloClient,
    ApolloNextAppProvider,
    InMemoryCache,
    SSRMultipartLink,
} from "@apollo/client-integration-nextjs";
import { PropsWithChildren } from "react";

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_API || "http://localhost:8080/api";

function makeClient() {
    const httpLink = new HttpLink({
        uri: GRAPHQL_ENDPOINT,
    });

    return new ApolloClient({
        cache: new InMemoryCache(),
        link:
            typeof window === "undefined"
                ? ApolloLink.from([
                      new SSRMultipartLink({
                          stripDefer: true,
                      }),
                      httpLink,
                  ])
                : httpLink,
    });
}

export function ApolloProvider({ children }: PropsWithChildren) {
    return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}
