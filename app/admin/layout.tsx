import { ReactNode } from "react";
import DashboardLayout from "@/components/layouts/dashboard/DashboardLayout";
import { ADMIN_SIDEBAR_MENUS } from "@/constants/menus";

function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <DashboardLayout menus={ADMIN_SIDEBAR_MENUS} basePath="/admin">
            {children}
        </DashboardLayout>
    );
}

export default AdminLayout;
