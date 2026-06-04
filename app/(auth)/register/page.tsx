"use client";

import type * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas";
import { useRegisterMutation } from "@/features/auth/mutations";

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
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">Register</h2>
        <p className="text-sm text-fg-muted">Create a customer account to browse, checkout, and track orders.</p>
      </div>

      <Field label="Full Name" error={form.formState.errors.name?.message}>
        <IconInput icon={<UserRound className="h-4 w-4" />} inputProps={{ id: "name", placeholder: "John Doe", autoComplete: "name", ...form.register("name") }} />
      </Field>

      <Field label="Email Address" error={form.formState.errors.email?.message}>
        <IconInput
          icon={<Mail className="h-4 w-4" />}
          inputProps={{ id: "email", type: "email", placeholder: "john@kineticops.com", autoComplete: "email", ...form.register("email") }}
        />
      </Field>

      <Field label="Password" error={form.formState.errors.password?.message}>
        <IconInput
          icon={<LockKeyhole className="h-4 w-4" />}
          inputProps={{ id: "password", type: "password", placeholder: "••••••••", autoComplete: "new-password", ...form.register("password") }}
        />
      </Field>

      <Button
        className="h-12 w-full rounded-sm border-slate-950 bg-slate-950 normal-case tracking-normal text-[15px] font-semibold text-white hover:bg-slate-800"
        type="submit"
        disabled={mutation.isPending}
      >
        <span>{mutation.isPending ? "Creating account..." : "Create Account"}</span>
        <ArrowRight className="h-4 w-4" />
      </Button>

      <p className="text-center text-[15px] text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-slate-950 transition hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-4">
        <label className="block text-[12px] font-medium text-slate-600">{label}</label>
        {hint ? <span className="text-[12px] text-slate-500">{hint}</span> : null}
      </div>
      <div className="relative">{children}</div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

function IconInput({
  icon,
  inputProps,
}: {
  icon: React.ReactNode;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}): React.JSX.Element {
  const { className, ...props } = inputProps;

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
      <Input className={`h-10 rounded-sm border-border-muted pl-10 pr-3 text-[15px] placeholder:text-slate-400 focus:border-slate-950 ${className ?? ""}`} {...props} />
    </div>
  );
}
