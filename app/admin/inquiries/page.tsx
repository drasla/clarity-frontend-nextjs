import { FindManyInquiriesForAdminAction } from "@/actions/inquiry/findManyAdmin/FindManyInquiriesForAdminAction";
import SharedInquiryList from "@/components/pages/inquiry/SharedInquiryList";
import { InquiryFragment } from "@/graphql/graphql.generated";

async function AdminInquiriesPage(props: {
    searchParams: Promise<Record<string, string | undefined>>;
}) {
    const searchParams = await props.searchParams;

    const page = parseInt(searchParams.page || "1", 10);
    const size = 10;
    const category = searchParams.category as any;
    const status = searchParams.status as any;
    const keyword = searchParams.keyword;
    const domain = searchParams.domain;

    let result = { list: [] as InquiryFragment[], total: 0, page: 1, size: 10 };

    try {
        const actionResult = await FindManyInquiriesForAdminAction({
            page,
            size,
            category: category || undefined,
            status: status || undefined,
            keyword: keyword || undefined,
            domain: domain || undefined,
        });

        if (actionResult) {
            result = actionResult;
        }
    } catch (error) {
        console.error("데이터 로드 실패:", error);
    }

    return (
        <SharedInquiryList
            title="문의 관리"
            description="고객들이 남긴 1:1 문의를 확인하고 답변을 작성할 수 있습니다."
            list={result.list}
            total={result.total}
            page={result.page}
            size={result.size}
            basePath="/admin/inquiries"
            showWriteButton={false}
        />
    );
}

export default AdminInquiriesPage;
