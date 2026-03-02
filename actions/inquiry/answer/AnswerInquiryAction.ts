"use server";

import { GraphQLMutation } from "@/providers/apollo/apollo-server";
import { AnswerInquirySchema, AnswerInquiryFormValues } from "./AnswerInquirySchema";
import { AnswerInquiryDocument, AnswerInquiryMutation } from "@/graphql/graphql.generated";

async function AnswerInquiryAction(data: AnswerInquiryFormValues) {
    const parsed = AnswerInquirySchema.safeParse(data);

    if (!parsed.success) {
        const errorMessage = parsed.error.issues[0]?.message || "입력값이 올바르지 않습니다.";
        throw new Error(errorMessage);
    }

    try {
        const response = await GraphQLMutation<AnswerInquiryMutation>(AnswerInquiryDocument, {
            id: parsed.data.id,
            input: {
                answer: parsed.data.answer,
                status: parsed.data.status,
            },
        });

        if (!response.answerInquiry) {
            throw new Error("답변 등록에 실패했습니다.");
        }

        return {
            success: true,
            inquiry: response.answerInquiry,
        };
    } catch (error: any) {
        console.error("AnswerInquiryAction Error:", error);
        throw new Error(error.message || "서버 통신 중 오류가 발생했습니다.");
    }
}

export default AnswerInquiryAction;