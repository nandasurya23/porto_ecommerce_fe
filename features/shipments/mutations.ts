"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShipmentRequest, updateShipmentStatusRequest } from "@/services/shipment.service";
import type { Shipment } from "@/types/shipment";

export function useUpdateShipmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      orderId: string;
      shipmentId?: string;
      courier: string;
      trackingNumber: string;
      status: Shipment["status"];
      serviceName?: string;
    }) => {
      let shipmentId = payload.shipmentId;

      if (!shipmentId) {
        if (payload.status !== "WAITING_FOR_PICKUP") {
          throw new Error("Buat shipment terlebih dahulu sebelum mengubah status ke selain WAITING_FOR_PICKUP.");
        }

        const created = await createShipmentRequest(payload.orderId, {
          courier: payload.courier,
          serviceName: payload.serviceName,
          trackingNumber: payload.trackingNumber,
        });
        const createdId = created.data.id;
        return createdId;
      }

      await updateShipmentStatusRequest(shipmentId, {
        status: payload.status,
        trackingNumber: payload.trackingNumber,
      });

      return shipmentId;
    },
    onSuccess: async (_result, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["shipments"] });
      await queryClient.invalidateQueries({ queryKey: ["shipments", variables.orderId] });
      await queryClient.invalidateQueries({ queryKey: ["orders", variables.orderId] });
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
