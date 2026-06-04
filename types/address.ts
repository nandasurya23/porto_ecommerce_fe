export type Address = {
  id: string;
  userId: string;
  receiverName: string;
  phone: string;
  province: string;
  city: string;
  district?: string | null;
  postalCode?: string | null;
  fullAddress: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};
