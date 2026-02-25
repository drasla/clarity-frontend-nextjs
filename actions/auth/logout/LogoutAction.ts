"use server";

import { cookies } from "next/headers";

async function LogoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
}

export default LogoutAction;