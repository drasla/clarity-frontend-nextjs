"use client";

import { User } from "@/graphql/types.generated";
import { useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";

function AuthProvider({ user }: { user: User | null }) {
    const initialized = useRef(false);

    if (!initialized.current) {
        useAuthStore.getState().setUser(user);
        initialized.current = true;
    }

    return null;
}

export default AuthProvider;
