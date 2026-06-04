export type Payment = {
  id: string;
  orderId: string;
  orderNumber?: string;
  code: string;
  method: string;
  amount: number;
  expiryAt: string;
  status: "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "CANCELLED";
};
