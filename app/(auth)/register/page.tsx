"use client";

import type * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas";
import { useRegisterMutation } from "@/features/auth/mutations";
import { toast } from "sonner";

export default function RegisterPage(): React.JSX.Element {
  const router = useRouter();
  const mutation = useRegisterMutation();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <form
      className="space-y-5"
      onSubmit={form.handleSubmit((values) =>
        mutation.mutate(values, {
          onSuccess: () => {
            toast.success("Akun berhasil dibuat.");
            router.push("/");
          },
          onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Register gagal.");
          },
        }),
      )}
    >
      <div className="space-y-1">
        <p className="page-eyebrow">Create account</p>
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">Register new user</h2>
        <p className="text-sm text-fg-muted">Create a customer account to browse, checkout, and track orders.</p>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-950">Name</label>
        <Input {...form.register("name")} />
        {form.formState.errors.name ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.name.message}</p> : null}
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
        {mutation.isPending ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-center text-sm text-fg-muted">
        Sudah punya akun?{" "}
        <a href="/login" className="font-medium text-primary">
          Login
        </a>
      </p>
    </form>
  );
}
