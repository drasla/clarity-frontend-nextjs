"use server";

import {
    ModifyEmailTemplateSchema,
    ModifyEmailTemplateValues,
} from "@/actions/emailTemplate/modify/ModifyEmailTemplateSchema";
import { GraphQLMutation } from "@/providers/apollo/apollo-server";
import {
    ModifyEmailTemplateDocument,
    ModifyEmailTemplateMutation,
} from "@/graphql/graphql.generated";

async function ModifyEmailTemplateAction(id: number, data: ModifyEmailTemplateValues) {
    const parsed = ModifyEmailTemplateSchema.safeParse(data);
    if (!parsed.success) throw new Error("입력값이 올바르지 않습니다.");

    try {
        const response = await GraphQLMutation<ModifyEmailTemplateMutation>(
            ModifyEmailTemplateDocument,
            {
                id,
                input: parsed.data,
            },
        );
        return { success: true, template: response.modifyEmailTemplate };
    } catch (error: any) {
        console.error("ModifyEmailTemplateAction Error:", error);
        throw new Error(error.message || "템플릿 수정 중 오류가 발생했습니다.");
    }
}

export default ModifyEmailTemplateAction;
