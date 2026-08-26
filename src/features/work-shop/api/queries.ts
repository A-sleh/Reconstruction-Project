import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { WorkShopController, QUERY_KEYS } from ".";
import type {
  GetAllWorkShopsFilters,
  GetAllWorkShopsResponse,
  WorkshopInvoices,
} from "./types";

const getAllWorkShops = async (
  filters: GetAllWorkShopsFilters,
): Promise<GetAllWorkShopsResponse> => {
  const { data } = await ApiInstance.get<GetAllWorkShopsResponse>(
    `/${WorkShopController.GetAll}`,
    { params: { ...filters } },
  );
  return data;
};

const getWorkShopInvoices = async (
  workShopId: number,
): Promise<WorkshopInvoices> => {
  const { data } = await ApiInstance.get<WorkshopInvoices>(
    `/${WorkShopController.GetInvoices}`,
    { params: { WorkShopId: workShopId } },
  );
  return data;
};

export const useWorkShops = (filters: GetAllWorkShopsFilters) => {
  return useQuery<GetAllWorkShopsResponse, Error>({
    queryKey: QUERY_KEYS.workShops.list(filters),
    queryFn: () => getAllWorkShops(filters),
  });
};

export const useWorkShopsInfinite = (
  filters: Omit<GetAllWorkShopsFilters, "PageNumber" | "PageSize"> & {
    PageSize?: number;
  },
) => {
  return useInfiniteQuery<GetAllWorkShopsResponse, Error>({
    queryKey: QUERY_KEYS.workShops.list(filters),
    queryFn: async ({ pageParam = 1 }) => {
      return await getAllWorkShops({
        ...filters,
        PageNumber: pageParam as number,
        PageSize: filters.PageSize ?? 10,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) {
        return lastPage.pageNum + 1;
      }
      return undefined;
    },
  });
};

export const useWorkShopInvoices = (workShopId: number) => {
  return useQuery<WorkshopInvoices, Error>({
    queryKey: QUERY_KEYS.workShops.invoices(workShopId),
    queryFn: () => getWorkShopInvoices(workShopId),
    enabled: !!workShopId,
  });
};
