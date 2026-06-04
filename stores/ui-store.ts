import { create } from "zustand";

type UiState = {
  cartDrawerOpen: boolean;
  sidebarCollapsed: boolean;
  setCartDrawerOpen: (value: boolean) => void;
  setSidebarCollapsed: (value: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  cartDrawerOpen: false,
  sidebarCollapsed: false,
  setCartDrawerOpen: (value) => set({ cartDrawerOpen: value }),
  setSidebarCollapsed: (value) => set({ sidebarCollapsed: value }),
}));
