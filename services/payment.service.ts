import { apiFetch } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";
import { addDays } from "date-fns";
import type { Payment } from "@/types/payment";
import type { BackendPayment } from "@/types/backend";

function mapPayment(item: BackendPayment): Payment {
  return {
    id: item.id,
    orderId: item.order_id,
    orderNumber: item.order_number,
    code: item.payment_code,
    method: item.method,
    amount: item.amount,
    expiryAt: item.expired_at ?? addDays(new Date(item.created_at), 1).toISOString(),
    status: item.status,
  };
}

export async function fetchPayments(): Promise<Payment[]> {
  const response = await apiFetch<BackendPayment[]>(endpoints.adminPayments, {
    method: "GET",
  });
  return response.data.map(mapPayment);
}

export async function fetchPaymentByOrderId(orderId: string): Promise<Payment | null> {
  try {
    const payments = await fetchPayments();
    return payments.find((payment) => payment.orderId === orderId) ?? null;
  } catch {
    return null;
  }
}

export function simulatePaymentSuccessRequest(orderId: string) {
  return apiFetch<Record<string, unknown>>(`${endpoints.payments}/${orderId}/simulate-success`, {
    method: "POST",
  });
}

export function simulatePaymentFailedRequest(orderId: string) {
  return apiFetch<Record<string, unknown>>(`${endpoints.payments}/${orderId}/simulate-failed`, {
    method: "POST",
  });
}

export function expirePaymentRequest(orderId: string) {
  return apiFetch<Record<string, unknown>>(`${endpoints.payments}/${orderId}/expire`, {
    method: "POST",
  });
}
