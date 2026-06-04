export type UserRole = "CUSTOMER" | "ADMIN" | "WAREHOUSE" | "SUPER_ADMIN";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  hydrated: boolean;
};
