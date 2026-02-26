"use server";

import { GraphQLMutation } from "@/providers/apollo/apollo-server";
import { CreateInquirySchema, CreateInquiryFormValues } from "./CreateInquirySchema";
import { CreateInquiryDocument, CreateInquiryMutation } from "@/graphql/graphql.generated";

export async function CreateInquiryAction(data: CreateInquiryFormValues) {
    const parsed = CreateInquirySchema.safeParse(data);

    if (!parsed.success) {
        const errorMessage = parsed.error.issues[0]?.message || "입력값이 올바르지 않습니다.";
        throw new Error(errorMessage);
    }

    try {
        const response = await GraphQLMutation<CreateInquiryMutation>(CreateInquiryDocument, {
            input: {
                category: parsed.data.category,
                title: parsed.data.title,
                domain: parsed.data.domain || null,
                email: parsed.data.email,
                phoneNumber: parsed.data.phoneNumber,
                content: parsed.data.content,
                nonMemberPw: parsed.data.nonMemberPw || null,
                attachments: parsed.data.attachments || [],
            },
        });

        if (!response.createInquiry) {
            throw new Error("문의 등록에 실패했습니다.");
        }

        return {
            success: true,
            inquiryId: response.createInquiry.id,
        };
    } catch (error: any) {
        console.error("CreateInquiryAction Error:", error);
        throw new Error(error.message || "서버 통신 중 오류가 발생했습니다.");
    }
}
