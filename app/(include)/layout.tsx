import { PropsWithChildren } from "react";
import Header from "@/components/layouts/Header";

function IncludeLayout({ children }: PropsWithChildren) {
    return (
        <>
            <Header />
            {children}
        </>
    );
}

export default IncludeLayout;
