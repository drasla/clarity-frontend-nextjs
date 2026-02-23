import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const accessToken = request.cookies.get("access_token")?.value;
    const isAuthenticated = !!accessToken;

    if (pathname.startsWith("/auth/")) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
    }

    if (pathname.startsWith("/admin")) {
        if (!isAuthenticated) {
            const loginUrl = new URL("/auth/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|.*\\.png$).*)"],
};
