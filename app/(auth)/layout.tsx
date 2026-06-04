"use client";

import type * as React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { appName } from "@/constants/theme";
import { ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }): React.JSX.Element | null {
  const router = useRouter();
  const { user, hydrated } = useAuthStore();

  useEffect(() => {
    if (hydrated && user) {
      router.replace(user.role === "WAREHOUSE" ? "/warehouse" : user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? "/admin" : "/");
    }
  }, [hydrated, router, user]);

  if (!hydrated) {
    return <div className="container-shell py-10 text-sm text-fg-muted">Loading...</div>;
  }

  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center px-4 py-10">
      <div className="container-shell grid w-full gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="hero-panel overflow-hidden">
          <div className="grid min-h-full gap-8 p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_16px_30px_rgba(15,23,42,0.16)]">
                <span className="text-lg font-black">F</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-fg-muted">Footwear operations</p>
                <p className="text-lg font-semibold">{appName}</p>
              </div>
            </div>
            <div className="space-y-4">
              <Badge tone="accent" className="w-fit">
                Storefront + operations
              </Badge>
              <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
                Retail-grade shopping UI for customers, admins, and warehouse teams.
              </h1>
              <p className="max-w-xl text-sm leading-7 text-fg-muted sm:text-base">
                Sign in to manage shopping, orders, inventory, payments, and fulfillment in one polished workspace.
              </p>
            </div>
            <div className="grid gap-3 border-t border-border pt-6 text-sm text-fg-muted sm:grid-cols-3">
              <Feature icon={<ShoppingBag className="h-4 w-4" />} label="Customer flow" description="Shop, cart, checkout, track." />
              <Feature icon={<Sparkles className="h-4 w-4" />} label="Admin ops" description="Products, inventory, payments." />
              <Feature icon={<ShieldCheck className="h-4 w-4" />} label="Warehouse" description="Pack, ship, update tracking." />
            </div>
            <div className="grid gap-3 rounded-2xl border border-border bg-white/70 p-4 text-sm text-fg-muted sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg">Optimized for speed</p>
                <p className="mt-1 leading-6">Cleaner hierarchy, faster scanning, fewer distractions.</p>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-white">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/70">Checkout first</p>
                  <p className="text-sm font-semibold">Modern commerce flow</p>
                </div>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </section>
        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Access account</CardTitle>
              <CardDescription>Masuk atau daftar untuk mengakses platform.</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, label, description }: { icon: React.ReactNode; label: string; description: string }): React.JSX.Element {
  return (
    <div className="space-y-2 rounded-2xl border border-border bg-white/70 p-4">
      <div className="flex items-center gap-2 text-slate-950">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white">{icon}</span>
        <p className="font-semibold">{label}</p>
      </div>
      <p className="text-sm leading-6 text-fg-muted">{description}</p>
    </div>
  );
}
