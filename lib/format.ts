import { format } from "date-fns";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string | number | Date): string {
  return format(new Date(value), "dd MMM yyyy");
}

export function formatDateTime(value: string | number | Date): string {
  return format(new Date(value), "dd MMM yyyy, HH:mm");
}
