import { useInfiniteQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { BankItemController, QUERY_KEYS } from ".";
import { BankItemRequestsResponse, BankItemStatus } from "./types";

// ==========================================
// API Fetchers
// ==========================================
const getBankItemRequests = async (
  pageNumber: number,
  pageSize: number,
  filters?: { Search?: string; Status?: BankItemStatus },
) => {
  const { data } = await ApiInstance.get<BankItemRequestsResponse>(
    `/${BankItemController.GetAllRequests}`,
    {
      params: { PageNumber: pageNumber, PageSize: pageSize, ...filters },
    }
  );
  return data;
};

// ==========================================
// Custom Infinite Query Hooks
// ==========================================
export const useBankItemRequests = ({
  pageSize = 10,
  search,
  status,
}: {
  pageSize?: number;
  search?: string;
  status?: BankItemStatus;
} = {}) => {
  return useInfiniteQuery<BankItemRequestsResponse, Error>({
    queryKey: [...QUERY_KEYS.bankItems.all, pageSize, search ?? "", status ?? ""],

    queryFn: async ({ pageParam = 0 }) => {
      return await getBankItemRequests(pageParam as number, pageSize, {
        Search: search || undefined,
        Status: status || undefined,
      });
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) {
        return lastPage.pageNum + 1;
      }
      return undefined;
    },
  });
};