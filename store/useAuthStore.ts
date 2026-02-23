import { User } from "@/graphql/types.generated";
import { create } from "zustand";

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    setUser: (user: User | null) => void;
    logout: VoidFunction;
}

export const useAuthStore = create<AuthStore>(set => ({
    user: null,
    isAuthenticated: false,
    isInitialized: false,

    setUser: user =>
        set({
            user,
            isAuthenticated: !!user,
            isInitialized: true,
        }),
    logout: () =>
        set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
        }),
}));
