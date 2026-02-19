import { PropsWithChildren } from "react";
import { Viewport } from "next";
import "../styles/globals.css";
import { ApolloProvider } from "@/providers/apollo/apolloProvider";
import ThemeProvider from "@/providers/theme/themeProvider";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

async function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang={"ko"} suppressHydrationWarning={true}>
            <body>
                <ThemeProvider
                    attribute={"class"}
                    defaultTheme={"system"}
                    enableSystem={true}
                    disableTransitionOnChange={false}>
                    <ApolloProvider>
                        {children}
                    </ApolloProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

export default RootLayout;
