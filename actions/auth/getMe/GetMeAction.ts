"use server";

import { GetMeDocument, GetMeQuery } from "@/graphql/graphql.generated";
import { GraphQLQuery } from "@/providers/apollo/apollo-server";

export async function GetMeAction() {
    try {
        const response = await GraphQLQuery<GetMeQuery>(GetMeDocument);
        return response.me || null;
    } catch (error) {
        return null;
    }
}
