import { PropsWithChildren } from "react";
import { Viewport } from "next";
import "../styles/globals.css";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
};

async function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang={"ko"}>
            <body>{children}</body>
        </html>
    );
}

export default RootLayout;
