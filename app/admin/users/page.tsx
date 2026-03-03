import { UserRole, UserStatus, UserType } from "@/graphql/types.generated";
import FindManyUserForAdminAction from "@/actions/admin/user/findManyUser/FindManyUserForAdminAction";
import AdminUserList from "@/components/pages/user/list/AdminUserList";
import { UserFragment } from "@/graphql/graphql.generated";

export const dynamic = "force-dynamic";

async function AdminUsersPage(props: {
    searchParams: Promise<Record<string, string | undefined>>;
}) {
    const searchParams = await props.searchParams;

    const page = parseInt(searchParams.page || "1", 10);
    const size = 10;

    const role = searchParams.role as UserRole | undefined;
    const status = searchParams.status as UserStatus | undefined;
    const type = searchParams.type as UserType | undefined;
    const keyword = searchParams.keyword;

    let result = { list: [] as UserFragment[], total: 0, page: 1, size: 10 };

    try {
        const actionResult = await FindManyUserForAdminAction({
            page,
            size,
            role,
            status,
            type,
            keyword,
        });

        if (actionResult) {
            result = actionResult;
        }
    } catch (error) {
        console.error("데이터 로드 실패:", error);
    }

    return (
        <AdminUserList
            list={result.list}
            total={result.total}
            page={result.page}
            size={result.size}
        />
    );
}

export default AdminUsersPage;
