"use client";

import type * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { differenceInSeconds } from "date-fns";
import { ArrowLeft, CheckCircle2, Clock3, Copy, Info, XCircle } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";
import { useOrderDetailQuery } from "@/features/orders/queries";
import { usePaymentByOrderQuery } from "@/features/payments/queries";
import { useSimulatePaymentMutation } from "@/features/payments/mutations";

const DEMO_BANNER = "Demo Environment - Simulated Payment Gateway";

export default function PaymentPage(): React.JSX.Element {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const orderQuery = useOrderDetailQuery(params.id);
  const paymentQuery = usePaymentByOrderQuery(params.id);
  const simulateMutation = useSimulatePaymentMutation();

  const order = orderQuery.data;
  const payment = paymentQuery.data;

  return (
    <div className="container-shell py-8">
      <div className="page-shell">
        <DemoBanner />

      {orderQuery.isLoading || paymentQuery.isLoading ? (
        <StateCard title="Memuat payment simulation..." />
      ) : null}
      {orderQuery.isError || paymentQuery.isError ? (
        <StateCard
          title="Gagal memuat payment detail."
          actionLabel="Coba lagi"
          onAction={() => void orderQuery.refetch()}
        />
      ) : null}
      {!orderQuery.isLoading && !order ? (
        <StateCard title="Order not found" description="Cannot continue payment." actionLabel="Back to order detail" onAction={() => router.push(`/orders/${params.id}`)} />
      ) : null}

        {order && payment ? (
          <div className="mx-auto w-full max-w-2xl pb-8">
          <div className="mb-6 text-center">
            <h1 className="text-[clamp(2.3rem,4vw,3.25rem)] font-black tracking-[-0.08em] text-slate-950">
              SOLE_OPERATIONS
            </h1>
            <p className="mt-2 text-base text-slate-600">Secure Payment Simulation</p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-white shadow-none">
            <PaymentHeader payment={payment} />

            <div className="border-t border-border bg-white p-5 sm:p-7">
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Order Number" value={order.orderNumber} />
                <Field label="Payment Method" value={formatPaymentMethod(payment.method)} />
                <CodeBlock
                  label="Payment Code"
                  code={payment.code}
                  onCopy={async () => {
                    try {
                      await navigator.clipboard.writeText(payment.code);
                      toast.success("Payment code copied.");
                    } catch {
                      toast.error("Failed to copy payment code.");
                    }
                  }}
                />
              </div>

              <div className="mt-6 rounded-lg border border-border bg-white p-4">
                <h2 className="mb-3 flex items-center gap-2 text-[1.1rem] font-semibold tracking-[-0.04em] text-slate-950">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600">
                    <Info className="h-3.5 w-3.5" />
                  </span>
                  How to Pay
                </h2>
                <ol className="list-decimal space-y-2 pl-5 text-[15px] leading-7 text-slate-600">
                  <li>Open your mobile banking app or ATM.</li>
                  <li>Select Transfer &gt; Virtual Account.</li>
                  <li>Enter the Payment Code above.</li>
                  <li>Verify the amount ({formatCurrency(payment.amount)}) and confirm payment.</li>
                </ol>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-emerald-700 bg-emerald-600 px-4 text-[15px] font-semibold normal-case tracking-normal text-white transition hover:bg-emerald-700 disabled:opacity-60"
                  onClick={() =>
                    simulateMutation.mutate(
                      { orderId: order.id, status: "PAID" },
                      {
                        onSuccess: () => {
                          toast.success("Payment simulated successfully.");
                          router.refresh();
                        },
                      },
                    )
                  }
                  disabled={simulateMutation.isPending}
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Simulate Payment Success
                </button>
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-red-700 bg-red-600 px-4 text-[15px] font-semibold normal-case tracking-normal text-white transition hover:bg-red-700 disabled:opacity-60"
                  onClick={() =>
                    simulateMutation.mutate(
                      { orderId: order.id, status: "FAILED" },
                      {
                        onSuccess: () => {
                          toast.error("Payment simulated as failed.");
                          router.refresh();
                        },
                      },
                    )
                  }
                  disabled={simulateMutation.isPending}
                >
                  <XCircle className="h-5 w-5" />
                  Simulate Payment Failed
                </button>
              </div>
            </div>

            <div className="border-t border-border bg-slate-50 p-4 text-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-none border-0 px-0 py-0 text-[15px] font-medium normal-case tracking-normal text-slate-500 transition hover:text-slate-950"
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to order detail
              </button>
            </div>
          </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DemoBanner(): React.JSX.Element {
  return (
    <div className="fixed left-0 top-0 z-50 w-full border-b border-[#b85d10] bg-[#c86410] px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-white shadow-sm">
      {DEMO_BANNER}
    </div>
  );
}

function PaymentHeader({ payment }: { payment: { amount: number; expiryAt: string } }): React.JSX.Element {
  const timeLeft = useCountdown(payment.expiryAt);

  return (
    <div className="border-b border-border bg-[#f3f4f5] px-5 py-6 text-center sm:px-7">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total Amount Due</p>
      <div className="mt-3 text-[clamp(3rem,5vw,4.7rem)] font-black tracking-[-0.07em] text-slate-950">
        {formatCurrency(payment.amount)}
      </div>
      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#ffe2df] px-3 py-1.5 text-[12px] font-semibold text-[#a61b13]">
        <Clock3 className="h-4 w-4" />
        {timeLeft}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div>
      <p className="text-[12px] uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="mt-1 text-[15px] font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  );
}

function CodeBlock({
  label,
  code,
  onCopy,
}: {
  label: string;
  code: string;
  onCopy: () => void;
}): React.JSX.Element {
  return (
    <div className="sm:col-span-2">
      <p className="text-[12px] uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <div className="mt-1 flex items-center justify-between gap-4 rounded-lg border border-border bg-white px-4 py-3">
        <span className="text-[clamp(1.5rem,2vw,2.2rem)] font-black tracking-[-0.06em] text-slate-950">{code}</span>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 text-[15px] font-semibold text-blue-600 transition hover:text-slate-950"
        >
          <Copy className="h-4 w-4" />
          Copy
        </button>
      </div>
    </div>
  );
}

function StateCard({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}): React.JSX.Element {
  return (
    <div className="mx-auto w-full max-w-2xl rounded-xl border border-border bg-white p-6 text-slate-950">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-sm border border-border bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function formatPaymentMethod(method: string): string {
  const value = method.trim().toUpperCase();
  if (value === "BANK_TRANSFER") return "Bank Transfer (Virtual Account)";
  if (value === "VIRTUAL_ACCOUNT") return "Bank Transfer (Virtual Account)";
  if (value === "QRIS_SIMULATION") return "QRIS";
  if (value === "COD") return "Cash on Delivery";
  return value.replaceAll("_", " ");
}

function useCountdown(expiryAt: string): string {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return useMemo(() => {
    const seconds = differenceInSeconds(new Date(expiryAt), new Date(now));
    if (seconds <= 0) {
      return "Expired";
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `Expires in ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, [expiryAt, now]);
}
