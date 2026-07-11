import { useOrderDetails } from "@/features/orders/api/query";

export const useFetchRequestDetails = (id: string | number) => {
  return useOrderDetails({ OrderId: Number(id) });
};
