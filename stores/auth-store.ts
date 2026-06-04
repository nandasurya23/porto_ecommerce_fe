import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createSafeStorage } from "@/lib/storage";
import type { AuthState, AuthUser } from "@/types/auth";

type AuthActions = {
  setUser: (user: AuthUser | null, token?: string | null) => void;
  setHydrated: (value: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hydrated: false,
      setUser: (user, token = null) => set({ user, token }),
      setHydrated: (value) => set({ hydrated: value }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "porto-auth-store",
      storage: createJSONStorage(() => createSafeStorage()),
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
