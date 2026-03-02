import { FindManyMyInquiriesAction } from "@/actions/inquiry/findManyMy/FindManyMyInquiriesAction";
import { InquiryFragment } from "@/graphql/graphql.generated";
import SharedInquiryList from "@/components/pages/inquiry/list/SharedInquiryList";

export default async function UserInquiriesPage(props: {
    searchParams: Promise<Record<string, string | undefined>>;
}) {
    const searchParams = await props.searchParams;

    const page = parseInt(searchParams.page || "1", 10);
    const size = 10;

    let result = { list: [] as InquiryFragment[], total: 0, page: 1, size: 10 };

    try {
        const actionResult = await FindManyMyInquiriesAction({
            page,
            size,
        });

        if (actionResult) {
            result = actionResult;
        }
    } catch (error: any) {
        console.error("데이터 로드 실패:", error);
    }

    return (
        <SharedInquiryList
            title="1:1 문의 내역"
            description="고객님께서 남겨주신 문의와 답변을 확인할 수 있습니다."
            list={result.list}
            total={result.total}
            page={result.page}
            size={result.size}
            basePath="/user/inquiries"
            showWriteButton={true}
        />
    );
}
