"use client";

import type * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas";
import { useLoginMutation } from "@/features/auth/mutations";
import { toast } from "sonner";

export default function LoginPage(): React.JSX.Element {
  const router = useRouter();
  const mutation = useLoginMutation();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "customer@example.com",
      password: "password123",
    },
  });

  return (
    <form
      className="space-y-5"
      onSubmit={form.handleSubmit((values) =>
        mutation.mutate(values, {
          onSuccess: (result) => {
            toast.success("Login berhasil.");
            router.push(
              result.data.user.role === "WAREHOUSE"
                ? "/warehouse"
                : result.data.user.role === "ADMIN" || result.data.user.role === "SUPER_ADMIN"
                  ? "/admin"
                  : "/",
            );
          },
          onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Login gagal.");
          },
        }),
      )}
    >
      <div className="space-y-1">
        <p className="page-eyebrow">Sign in</p>
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">Welcome back</h2>
        <p className="text-sm text-fg-muted">Use your account to access storefront, admin, or warehouse areas.</p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-950">Email</label>
        <Input type="email" {...form.register("email")} />
        {form.formState.errors.email ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p> : null}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-950">Password</label>
        <Input type="password" {...form.register("password")} />
        {form.formState.errors.password ? (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.password.message}</p>
        ) : null}
      </div>
      <Button className="w-full" type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Signing in..." : "Login"}
      </Button>
      <p className="text-center text-sm text-fg-muted">
        Belum punya akun?{" "}
        <a href="/register" className="font-medium text-primary">
          Register
        </a>
      </p>
    </form>
  );
}
