"use server";

import {
    RegisterDocument,
    RegisterMutation,
    RegisterMutationVariables,
} from "@/graphql/graphql.generated";
import { GraphQLMutation } from "@/providers/apollo/apollo-server";
import { UserType } from "@/graphql/types.generated";
import { RegisterFormValues } from "@/actions/auth/register/RegisterSchema";

export async function RegisterAction(data: RegisterFormValues) {
    const variables: RegisterMutationVariables = {
        input: {
            username: data.username,
            password: data.password,
            name: data.name,
            email: data.email,
            phoneNumber: data.phoneNumber,
            landlineNumber: data.landlineNumber,
            agreeEmail: data.agreeEmail,
            agreeSMS: data.agreeSMS,
            bizInfo: data.userType === UserType.Business ? data.bizInfo : null,
        },
    };

    return await GraphQLMutation<RegisterMutation>(RegisterDocument, variables);
}
