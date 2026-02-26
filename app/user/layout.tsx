"use client";

import { PropsWithChildren } from "react";
import { USER_SIDEBAR_MENUS } from "@/constants/menus";
import SharedDashboardLayout from "@/components/layouts/dashboard/DashboardLayout";

function UserLayout({ children }: PropsWithChildren) {
    return (
        <SharedDashboardLayout menus={USER_SIDEBAR_MENUS} basePath="/user">
            {children}
        </SharedDashboardLayout>
    );
}

export default UserLayout;
