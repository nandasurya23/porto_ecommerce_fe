import { apiFetch } from "@/services/api-client";
import { endpoints } from "@/services/endpoints";
import type { Address } from "@/types/address";
import type { BackendAddress } from "@/types/backend";

function mapAddress(item: BackendAddress): Address {
  return {
    id: item.id,
    userId: item.user_id,
    receiverName: item.receiver_name,
    phone: item.phone,
    province: item.province,
    city: item.city,
    district: item.district ?? null,
    postalCode: item.postal_code ?? null,
    fullAddress: item.full_address,
    isDefault: item.is_default,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

export async function fetchAddresses(): Promise<Address[]> {
  const response = await apiFetch<BackendAddress[]>(endpoints.addresses, {
    method: "GET",
  });
  return response.data.map(mapAddress);
}

export function createAddressRequest(payload: {
  receiverName: string;
  phone: string;
  province: string;
  city: string;
  district?: string;
  postalCode?: string;
  fullAddress: string;
  isDefault?: boolean;
}) {
  return apiFetch<Address>(endpoints.addresses, {
    method: "POST",
    body: JSON.stringify({
      receiver_name: payload.receiverName,
      phone: payload.phone,
      province: payload.province,
      city: payload.city,
      district: payload.district ?? "",
      postal_code: payload.postalCode ?? "",
      full_address: payload.fullAddress,
      is_default: payload.isDefault ?? false,
    }),
  });
}
