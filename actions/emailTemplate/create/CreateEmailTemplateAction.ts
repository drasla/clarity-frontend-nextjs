"use server";

import { GraphQLMutation } from "@/providers/apollo/apollo-server";
import { CreateEmailTemplateSchema, CreateEmailTemplateValues } from "./CreateEmailTemplateSchema";
import {
    CreateEmailTemplateDocument,
    CreateEmailTemplateMutation,
} from "@/graphql/graphql.generated";

async function CreateEmailTemplateAction(data: CreateEmailTemplateValues) {
    const parsed = CreateEmailTemplateSchema.safeParse(data);

    if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || "입력값이 올바르지 않습니다.");
    }

    try {
        const response = await GraphQLMutation<CreateEmailTemplateMutation>(
            CreateEmailTemplateDocument,
            { input: parsed.data },
        );

        if (!response.createEmailTemplate) {
            throw new Error("템플릿 생성에 실패했습니다.");
        }

        return {
            success: true,
            template: response.createEmailTemplate,
        };
    } catch (error: any) {
        console.error("CreateEmailTemplateAction Error:", error);
        throw new Error(error.message || "템플릿 생성 중 서버 오류가 발생했습니다.");
    }
}

export default CreateEmailTemplateAction;