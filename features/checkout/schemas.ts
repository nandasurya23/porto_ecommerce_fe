import { z } from "zod";

export const checkoutSchema = z.object({
  receiverName: z.string().min(2, "Nama penerima wajib diisi."),
  phone: z.string().min(6, "Nomor telepon wajib diisi."),
  province: z.string().min(2, "Provinsi wajib diisi."),
  city: z.string().min(2, "Kota wajib diisi."),
  district: z.string().optional(),
  postalCode: z.string().optional(),
  fullAddress: z.string().min(10, "Alamat lengkap wajib diisi."),
  paymentMethod: z.enum(["BANK_TRANSFER", "VIRTUAL_ACCOUNT", "QRIS_SIMULATION", "COD"]),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
