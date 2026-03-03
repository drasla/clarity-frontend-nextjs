import AdminEmailTemplateList from "@/components/pages/emailTemplate/list/AdminEmailTemplateList";
import { EmailTemplateFragment } from "@/graphql/graphql.generated";
import FindManyEmailTemplatesAction from "@/actions/emailTemplate/findManyEmailTemplates/FindManyEmailTemplatesAction";

export const dynamic = "force-dynamic";

async function AdminEmailTemplatesPage(props: {
    searchParams: Promise<Record<string, string | undefined>>;
}) {
    const searchParams = await props.searchParams;

    const page = parseInt(searchParams.page || "1", 10);
    const size = 10;
    const keyword = searchParams.keyword;

    let result = { list: [] as EmailTemplateFragment[], total: 0, page: 1, size: 10 };

    try {
        const actionResult = await FindManyEmailTemplatesAction({
            page,
            size,
            keyword,
        });

        if (actionResult) {
            result = actionResult;
        }
    } catch (error) {
        console.error("이메일 템플릿 데이터 로드 실패:", error);
    }

    return (
        <AdminEmailTemplateList
            list={result.list}
            total={result.total}
            page={result.page}
            size={result.size}
        />
    );
}

export default AdminEmailTemplatesPage;
