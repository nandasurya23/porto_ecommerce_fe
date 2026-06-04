import type { StateStorage } from "zustand/middleware";

function createMemoryStorage(): StateStorage {
  const memory = new Map<string, string>();

  return {
    getItem: (name: string) => memory.get(name) ?? null,
    setItem: (name: string, value: string) => {
      memory.set(name, value);
    },
    removeItem: (name: string) => {
      memory.delete(name);
    },
  };
}

export function createSafeStorage(): StateStorage {
  if (typeof window === "undefined") {
    return createMemoryStorage();
  }

  return window.localStorage;
}
