"use client";

import type * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Building2, Lock, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/format";
import { checkoutSchema, type CheckoutFormValues } from "@/features/checkout/schemas";
import { useCheckoutMutation } from "@/features/checkout/mutations";
import { useCartQuery } from "@/features/cart/queries";
import { useCartStore } from "@/stores/cart-store";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%23e5e7eb'/%3E%3Cpath d='M40 102h78l12-24H52L40 102Z' fill='%23cbd5e1'/%3E%3Cpath d='M48 72h35l12 12H44l4-12Z' fill='%239ca3af'/%3E%3C/svg%3E";

const SHIPPING_OPTIONS = [
  {
    label: "Standard Delivery",
    detail: "3-5 Business Days",
    price: "Free",
  },
  {
    label: "Express Courier",
    detail: "1-2 Business Days",
    price: "Rp15.000",
  },
];

const PAYMENT_OPTIONS: Array<{
  value: CheckoutFormValues["paymentMethod"];
  label: string;
  detail?: string;
  icon: React.ReactNode;
}> = [
  {
    value: "BANK_TRANSFER",
    label: "Bank Transfer",
    detail: "Transfer instructions will be provided on the next step after placing your order. Please ensure payment is made within 24 hours.",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    value: "QRIS_SIMULATION",
    label: "QRIS",
    icon: <QrCode className="h-5 w-5" />,
  },
];

export default function CheckoutPage(): React.JSX.Element {
  const router = useRouter();
  const cartQuery = useCartQuery();
  const localItems = useCartStore((state) => state.items);
  const checkoutMutation = useCheckoutMutation();
  const items = cartQuery.data ?? localItems;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = items.length > 0 ? 25000 : 0;
  const total = subtotal + shipping;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      receiverName: "",
      phone: "",
      province: "",
      city: "",
      district: "",
      postalCode: "",
      fullAddress: "",
      paymentMethod: "BANK_TRANSFER",
    },
  });

  const selectedPayment = form.watch("paymentMethod");

  if (cartQuery.isLoading) {
    return (
      <div className="container-shell py-6">
        <div className="page-shell py-6">
        <LoadingState label="Memuat cart untuk checkout..." />
        </div>
      </div>
    );
  }

  if (cartQuery.isError) {
    return (
      <div className="container-shell py-6">
        <div className="page-shell py-6">
        <ErrorState message="Gagal memuat cart untuk checkout." onRetry={() => void cartQuery.refetch()} />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page-shell py-6">
        <EmptyState
          title="Your cart is empty"
          description="Add items to your cart before continuing to checkout."
          actionLabel="Back to cart"
          onAction={() => router.push("/cart")}
        />
      </div>
    );
  }

  function onSubmit(values: CheckoutFormValues) {
    checkoutMutation.mutate(values, {
      onSuccess: (order) => {
        toast.success("Order created.");
        router.push(`/orders/${order.order_id}/payment`);
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Gagal memproses checkout.");
      },
    });
  }

  return (
    <div className="container-shell py-6">
      <div className="page-shell py-6">
      <header className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <p className="page-eyebrow">Checkout</p>
          <h1 className="text-[clamp(1.9rem,2.8vw,3rem)] font-black tracking-[-0.06em] text-slate-950">
            Secure checkout
          </h1>
        </div>
        <div className="hidden items-center gap-2 text-sm font-medium text-slate-700 md:flex">
          <Lock className="h-4 w-4" />
          Secure Checkout
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <div className="space-y-6 lg:col-span-8">
          <CheckoutCard number="1" title="Shipping Address" active>
            <form id="checkout-form" className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
              <Field label="Receiver name" error={form.formState.errors.receiverName?.message}>
                <Input
                  {...form.register("receiverName")}
                  placeholder="Enter receiver name"
                  className="!h-12 !rounded-none !border-slate-300 !text-[15px] !text-slate-950 placeholder:!text-slate-400 focus:!border-slate-950"
                />
              </Field>

              <Field label="Phone" error={form.formState.errors.phone?.message}>
                <Input
                  {...form.register("phone")}
                  placeholder="Phone number for delivery updates"
                  className="!h-12 !rounded-none !border-slate-300 !text-[15px] !text-slate-950 placeholder:!text-slate-400 focus:!border-slate-950"
                />
              </Field>

              <Field label="Province" error={form.formState.errors.province?.message}>
                <Input
                  {...form.register("province")}
                  placeholder="Province"
                  className="!h-12 !rounded-none !border-slate-300 !text-[15px] !text-slate-950 placeholder:!text-slate-400 focus:!border-slate-950"
                />
              </Field>

              <Field label="City" error={form.formState.errors.city?.message}>
                <Input
                  {...form.register("city")}
                  placeholder="City"
                  className="!h-12 !rounded-none !border-slate-300 !text-[15px] !text-slate-950 placeholder:!text-slate-400 focus:!border-slate-950"
                />
              </Field>

              <Field label="District" error={form.formState.errors.district?.message}>
                <Input
                  {...form.register("district")}
                  placeholder="District (optional)"
                  className="!h-12 !rounded-none !border-slate-300 !text-[15px] !text-slate-950 placeholder:!text-slate-400 focus:!border-slate-950"
                />
              </Field>

              <Field label="Postal code" error={form.formState.errors.postalCode?.message}>
                <Input
                  {...form.register("postalCode")}
                  placeholder="Postal code (optional)"
                  className="!h-12 !rounded-none !border-slate-300 !text-[15px] !text-slate-950 placeholder:!text-slate-400 focus:!border-slate-950"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Address" error={form.formState.errors.fullAddress?.message}>
                  <Textarea
                    {...form.register("fullAddress")}
                    placeholder="Street address, apartment, suite, building, floor, etc."
                    className="min-h-28 !rounded-none !border-slate-300 !text-[15px] !text-slate-950 placeholder:!text-slate-400 focus:!border-slate-950"
                  />
                </Field>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  className="!h-12 !rounded-none !border-slate-300 !bg-white !text-[15px] !font-semibold !uppercase !tracking-[0.08em] hover:!bg-slate-50"
                  onClick={() => router.push("/cart")}
                >
                  Back to cart
                </Button>
              </div>
            </form>
          </CheckoutCard>

          <CheckoutCard number="2" title="Shipping Method" muted>
            <div className="space-y-3">
              {SHIPPING_OPTIONS.map((option) => (
                <div key={option.label} className="flex items-center justify-between rounded-none border border-border bg-white px-4 py-4">
                  <div className="flex items-center gap-4">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    </span>
                    <div className="leading-tight">
                      <p className="text-[15px] font-semibold text-slate-950">{option.label}</p>
                      <p className="text-xs text-slate-500">{option.detail}</p>
                    </div>
                  </div>
                  <span className="text-[15px] font-medium text-slate-950">{option.price}</span>
                </div>
              ))}
            </div>
          </CheckoutCard>

          <CheckoutCard number="3" title="Payment" muted={false}>
            <p className="mb-4 text-sm text-slate-500">All transactions are secure and encrypted.</p>
            <div className="overflow-hidden rounded-none border border-border">
              {PAYMENT_OPTIONS.map((option) => {
                const selected = selectedPayment === option.value;
                const isBankTransfer = option.value === "BANK_TRANSFER";

                return (
                  <div key={option.value} className={selected ? "bg-slate-50" : "bg-white"}>
                    <label
                      className={`flex cursor-pointer items-center justify-between border-b border-border px-4 py-4 transition ${selected ? "bg-slate-50" : "bg-white"}`}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          value={option.value}
                          {...form.register("paymentMethod")}
                          className="h-5 w-5 border-slate-300 text-slate-950 focus:ring-slate-950"
                        />
                        <span className="text-[15px] font-semibold text-slate-950">{option.label}</span>
                      </div>
                      <span className="text-slate-500">{option.icon}</span>
                    </label>

                    {isBankTransfer ? (
                      <div className="border-b border-border bg-white px-4 py-4 text-sm leading-7 text-slate-500">
                        {option.detail}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </CheckoutCard>
        </div>

        <aside className="lg:col-span-4">
          <Card className="lg:sticky lg:top-28">
            <CardContent className="space-y-5 p-6">
              <div className="border-b border-border pb-3">
                <h2 className="text-[1.65rem] font-semibold tracking-[-0.05em] text-slate-950">Order Summary</h2>
              </div>

              <div className="max-h-[360px] space-y-4 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-border bg-slate-100">
                      <Image
                        src={item.image || PLACEHOLDER_IMAGE}
                        alt={item.productName}
                        width={64}
                        height={64}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold leading-tight text-slate-950">{item.productName}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Size: {item.size} | Color: {item.color}
                      </p>
                    </div>

                    <div className="shrink-0 text-[15px] font-medium text-slate-950">{formatCurrency(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Discount code or gift card"
                    className="!h-12 !rounded-none !border-slate-300 !text-[15px] !text-slate-950 placeholder:!text-slate-400 focus:!border-slate-950"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="!h-12 !rounded-none !border-slate-300 !bg-white !px-5 !text-[15px] !font-semibold !uppercase !tracking-[0.08em] hover:!bg-slate-50"
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <div className="space-y-3 border-t border-border pt-4 text-sm">
                <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
                <SummaryRow label="Shipping" value={formatCurrency(shipping)} />
                <SummaryRow label="Estimated taxes" value={formatCurrency(0)} />
              </div>

              <div className="flex items-end justify-between border-t border-border pt-4">
                <div>
                  <p className="text-[1.15rem] font-semibold tracking-[-0.05em] text-slate-950">Total</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">USD</p>
                </div>
                <div className="text-[2rem] font-black tracking-[-0.06em] text-slate-950">{formatCurrency(total)}</div>
              </div>

              <Button
                type="submit"
                form="checkout-form"
                className="!h-12 !w-full !rounded-none !border-slate-950 !bg-slate-950 !text-[15px] !font-semibold !uppercase !tracking-[0.08em]"
                disabled={checkoutMutation.isPending}
              >
                Pay now
              </Button>

              <p className="flex items-center justify-center gap-2 text-center text-xs uppercase tracking-[0.16em] text-slate-500">
                <Lock className="h-3.5 w-3.5" />
                Secure encrypted transaction
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
      </div>
    </div>
  );
}

function CheckoutCard({
  number,
  title,
  children,
  active = false,
  muted = false,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  active?: boolean;
  muted?: boolean;
}): React.JSX.Element {
  return (
    <Card className={muted ? "bg-white/80" : "bg-white"}>
      <CardContent className="space-y-5 p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <StepBadge active={active}>{number}</StepBadge>
          <h2 className={`text-[1.65rem] font-semibold tracking-[-0.05em] ${muted ? "text-slate-500" : "text-slate-950"}`}>
            {title}
          </h2>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

function StepBadge({ active, children }: { active?: boolean; children: React.ReactNode }): React.JSX.Element {
  return (
    <span
      className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${
        active ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-slate-100 text-slate-400"
      }`}
    >
      {children}
    </span>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-slate-700">{label}</span>
      {children}
      {error ? <span className="mt-1.5 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-950">{value}</span>
    </div>
  );
}
