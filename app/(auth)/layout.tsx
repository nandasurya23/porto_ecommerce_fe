"use client";

import type * as React from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { appName } from "@/constants/theme";
import { LoadingAuthSkeleton } from "@/components/ui/loading-skeletons";
import { Building2 } from "lucide-react";

const AUTH_HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDPG97joOvnsJmKXW_R3FLoRzSXuz4wHzfiF4171vWwCodGwcF2415Xgwi2sc1A1z0vrtthjKv7aVWeeua3klCV5cGVh2sYQqDt0nQBpHNlKej8JXccsUELKpy0CU-oP0ycCkUqVA3D2Zl7naSaKWsAEYuzF-KJLQpqZWkEvux8BUaQqM79CKSzEYLLNStYRwiexENKBBZS0dw1-X6EKXVn2tVkaumC0SzxdbbzLuDkTG1lTYfz2kyQ2jA-nFc6HAezn1YMA2gBeho";

export default function AuthLayout({ children }: { children: React.ReactNode }): React.JSX.Element | null {
  const router = useRouter();
  const pathname = usePathname();
  const { user, hydrated } = useAuthStore();
  const isRegister = pathname.startsWith("/register");

  useEffect(() => {
    if (hydrated && user) {
      router.replace(user.role === "WAREHOUSE" ? "/warehouse" : user.role === "ADMIN" || user.role === "SUPER_ADMIN" ? "/admin" : "/");
    }
  }, [hydrated, router, user]);

  if (!hydrated) {
    return <LoadingAuthSkeleton />;
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest lg:flex">
      <section className="relative hidden overflow-hidden bg-surface-container lg:flex lg:w-1/2">
        <div
          className="absolute inset-0 bg-cover bg-center"
          aria-hidden="true"
          style={{ backgroundImage: `url('${AUTH_HERO_IMAGE}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-10">
          <div className="max-w-md space-y-5 text-white">
            <h1 className="text-[clamp(3.2rem,5vw,4.5rem)] font-black tracking-[-0.04em] text-white">
              {appName}
            </h1>
            <p className="max-w-md text-[15px] leading-7 text-white/90">
              Precision logistics for premium footwear. Secure, scalable, and beautifully engineered.
            </p>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen w-full items-center justify-center bg-surface-container-lowest px-4 py-8 sm:px-6 lg:w-1/2 lg:px-10 lg:py-12">
        <div className="w-full max-w-[560px] space-y-8">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-border-strong bg-slate-950 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-fg-muted">Footwear operations</p>
              <p className="text-lg font-semibold text-slate-950">{appName}</p>
            </div>
          </div>

          <div className="space-y-3 text-center lg:text-left">
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-border-strong bg-slate-950 text-white">
                <Building2 className="h-6 w-6" />
              </div>
              <h2 className="font-sans text-[clamp(2rem,3vw,2.75rem)] font-bold tracking-[-0.05em] text-slate-950">
                {isRegister ? "Register" : "Log In"}
              </h2>
            </div>
            <p className="mx-auto max-w-xl text-[15px] leading-7 text-slate-600 lg:mx-0">
              {isRegister
                ? "Create your account to browse products, checkout, and track orders."
                : "Welcome back. Enter your credentials to access the operational dashboard."}
            </p>
          </div>

          <div className="w-full">{children}</div>
        </div>
      </section>
    </div>
  );
}
