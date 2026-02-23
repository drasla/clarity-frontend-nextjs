import { PropsWithChildren } from "react";
import { Viewport } from "next";
import "../styles/globals.css";
import { ApolloProvider } from "@/providers/apollo/apolloProvider";
import ThemeProvider from "@/providers/theme/themeProvider";
import AuthProvider from "@/providers/auth/AuthProvider";
import { GetMeAction } from "@/actions/auth/getMe/GetMeAction";
import { cookies } from "next/headers";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

async function RootLayout({ children }: PropsWithChildren) {
    const cookieStore = await cookies();
    const hasToken = cookieStore.has("access_token");
    const user = hasToken ? await GetMeAction() : null;

    return (
        <html lang={"ko"} suppressHydrationWarning={true}>
            <body>
                <ThemeProvider
                    attribute={"class"}
                    defaultTheme={"system"}
                    enableSystem={true}
                    disableTransitionOnChange={false}>
                    <ApolloProvider>
                        <AuthProvider user={user} />
                        {children}
                    </ApolloProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

export default RootLayout;
