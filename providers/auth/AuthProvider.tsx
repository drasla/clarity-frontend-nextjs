"use client";

import { User } from "@/graphql/types.generated";
import { ReactNode, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import LogoutAction from "@/actions/auth/logout/LogoutAction";

interface AuthProviderProps {
    user: User | null;
    hasToken: boolean;
    children: ReactNode;
}

function AuthProvider({ user, hasToken, children }: AuthProviderProps) {
    const initialized = useRef(false);

    if (!initialized.current) {
        useAuthStore.getState().setUser(user);
        initialized.current = true;
    }

    useEffect(() => {
        useAuthStore.getState().setUser(user);
    }, [user]);

    useEffect(() => {
        if (hasToken && !user) {
            LogoutAction().catch(console.error);
            useAuthStore.getState().logout();
        }
    }, [hasToken, user]);

    return <>{children}</>;
}

export default AuthProvider;
