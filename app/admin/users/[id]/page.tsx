import { notFound } from "next/navigation";
import FindOneUserForAdminAction from "@/actions/admin/user/findOneUserForAdmin/FindOneUserForAdminAction";
import AdminUserDetail from "@/components/pages/user/detail/AdminUserDetail";

async function AdminUserDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const userId = params.id;

    if (!userId) {
        notFound();
    }

    try {
        const user = await FindOneUserForAdminAction(userId);

        if (!user) {
            notFound();
        }

        return <AdminUserDetail initialData={user} />;
    } catch (error) {
        console.error("회원 상세 조회 실패:", error);

        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-error-main">회원 정보를 불러오는 데 실패했습니다.</p>
            </div>
        );
    }
}

export default AdminUserDetailPage;
