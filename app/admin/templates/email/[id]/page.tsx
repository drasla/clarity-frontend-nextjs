import { notFound } from "next/navigation";
import FindOneEmailTemplateByIdAction from "@/actions/emailTemplate/findOneById/findOneEmailTemplateAction";
import AdminEmailTemplateModify from "@/components/pages/emailTemplate/modify/AdminEmailTemplateModify";

export const dynamic = "force-dynamic";

async function AdminEmailTemplateDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const templateId = parseInt(params.id, 10);

    if (isNaN(templateId)) {
        notFound();
    }

    try {
        // 서버 액션을 통해 템플릿 상세 정보(html, design 등)를 불러옵니다.
        const template = await FindOneEmailTemplateByIdAction(templateId);

        if (!template) {
            notFound();
        }

        return <AdminEmailTemplateModify initialData={template} />;
    } catch (error) {
        console.error("이메일 템플릿 상세 데이터 로드 실패:", error);

        return (
            <div className="flex flex-col items-center justify-center w-full h-[50vh] gap-4">
                <p className="text-error-main text-lg font-bold">
                    템플릿 정보를 불러오는 중 오류가 발생했습니다.
                </p>
                <p className="text-text-secondary text-sm">
                    잠시 후 다시 시도하거나 목록으로 돌아가주세요.
                </p>
            </div>
        );
    }
}

export default AdminEmailTemplateDetailPage;
