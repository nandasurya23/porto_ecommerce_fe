"use client";

import type * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { appName } from "@/constants/theme";
import { useAuthStore } from "@/stores/auth-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useLogoutMutation } from "@/features/auth/mutations";

export function StoreHeader(): React.JSX.Element {
  const user = useAuthStore((state) => state.user);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <div className="container-shell flex h-14 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-[1.2rem] font-black tracking-[-0.08em] text-slate-950">{appName.toUpperCase()}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <HeaderNavLink href="/#new-arrivals" active={pathname === "/"}>
            New Arrivals
          </HeaderNavLink>
          <HeaderNavLink href="/products" active={pathname.startsWith("/products")}>
            Products
          </HeaderNavLink>
          <HeaderNavLink href="/men" active={pathname.startsWith("/men")}>
            Men
          </HeaderNavLink>
          <HeaderNavLink href="/women" active={pathname.startsWith("/women")}>
            Women
          </HeaderNavLink>
          <HeaderNavLink href="/collections" active={pathname.startsWith("/collections")}>
            Collections
          </HeaderNavLink>
        </nav>
        <div className="flex items-center gap-2 text-slate-950">
          <IconAction href="/cart" label="Cart">
            <div className="relative flex items-center justify-center">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-orange-600" />
            </div>
          </IconAction>
          <IconAction href="/wishlist" label={`Wishlist${wishlistCount ? ` (${wishlistCount})` : ""}`}>
            <div className="relative flex items-center justify-center">
              <Heart className={`h-5 w-5 ${wishlistCount > 0 ? "fill-current" : ""}`} />
              {wishlistCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-slate-950 px-1 text-[10px] font-bold leading-none text-white">
                  {wishlistCount}
                </span>
              ) : null}
            </div>
          </IconAction>
          {user ? (
            <IconAction href="/orders" label={user.name}>
              <UserRound className="h-5 w-5" />
            </IconAction>
          ) : (
            <IconAction href="/login" label="Login">
              <UserRound className="h-5 w-5" />
            </IconAction>
          )}
        </div>
      </div>
    </header>
  );
}

export function LogoutButton(): React.JSX.Element {
  const { mutate: logout, isPending } = useLogoutMutation();

  return (
    <Button variant="ghost" size="sm" onClick={() => logout()} disabled={isPending} aria-label="Logout">
      <UserRound className="h-4 w-4" />
      Logout
    </Button>
  );
}

export function StoreFooter(): React.JSX.Element {
  return (
    <footer className="mt-auto w-full bg-slate-950 px-6 py-6 text-white md:px-8 md:py-8">
      <div className="container-shell flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-[1.05rem] font-black tracking-[-0.08em] text-white">SOLE_OPERATIONS</div>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-white/65 md:gap-6">
          <FooterLink href="/products">Terms of Service</FooterLink>
          <FooterLink href="/products">Privacy Policy</FooterLink>
          <FooterLink href="/login">Contact Support</FooterLink>
          <FooterLink href="/warehouse">Global Logistics</FooterLink>
        </nav>
        <div className="text-xs text-white/45">© 2024 Sole Operations Platform. All rights reserved.</div>
      </div>
    </footer>
  );
}

export function StoreLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <div className="min-h-screen bg-bg text-slate-950">
      <StoreHeader />
      <main className="w-full">{children}</main>
      <StoreFooter />
    </div>
  );
}

export function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "bg-slate-950 text-white shadow-[0_10px_25px_rgba(15,23,42,0.16)]"
          : "text-fg-muted hover:bg-muted/80 hover:text-fg",
      )}
    >
      {children}
    </Link>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <Link href={href} className="transition hover:text-white">
      {children}
    </Link>
  );
}

function IconAction({ href, label, children }: { href: string; label: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent transition hover:bg-muted"
    >
      {children}
    </Link>
  );
}

function HeaderNavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <Link
      href={href}
      className={`rounded-none px-4 py-2 text-[13px] font-medium transition ${
        active ? "text-slate-950 underline decoration-slate-950 decoration-2 underline-offset-8" : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
      }`}
    >
      {children}
    </Link>
  );
}

export function AdminSidebar({ activePath = "/admin" }: { activePath?: string }): React.JSX.Element {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-white/85 px-4 py-5 backdrop-blur lg:block">
      <div className="mb-6 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">Operations</p>
        <div className="flex items-center gap-2 font-semibold tracking-tight">
          <LayoutDashboard className="h-4 w-4" />
          <span>Admin</span>
        </div>
      </div>
      <div className="space-y-1">
        <NavLink href="/admin" active={activePath === "/admin"}>
          Dashboard
        </NavLink>
        <NavLink href="/admin/products" active={activePath.startsWith("/admin/products")}>
          Products
        </NavLink>
        <NavLink href="/admin/inventory" active={activePath.startsWith("/admin/inventory")}>
          Inventory
        </NavLink>
        <NavLink href="/admin/orders" active={activePath.startsWith("/admin/orders")}>
          Orders
        </NavLink>
        <NavLink href="/admin/payments" active={activePath.startsWith("/admin/payments")}>
          Payments
        </NavLink>
        <NavLink href="/admin/reports" active={activePath.startsWith("/admin/reports")}>
          Reports
        </NavLink>
      </div>
    </aside>
  );
}

export function WarehouseSidebar({ activePath = "/warehouse" }: { activePath?: string }): React.JSX.Element {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-white/90 px-4 py-5 lg:block">
      <div className="mb-6 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg-muted">Fulfillment</p>
        <div className="flex items-center gap-2 font-semibold tracking-tight">
          <LayoutDashboard className="h-4 w-4" />
          <span>Warehouse</span>
        </div>
      </div>
      <div className="space-y-1">
        <NavLink href="/warehouse" active={activePath === "/warehouse"}>
          Dashboard
        </NavLink>
        <NavLink href="/warehouse/orders" active={activePath.startsWith("/warehouse/orders")}>
          Orders
        </NavLink>
        <NavLink href="/warehouse/shipments" active={activePath.startsWith("/warehouse/shipments")}>
          Shipments
        </NavLink>
      </div>
    </aside>
  );
}
