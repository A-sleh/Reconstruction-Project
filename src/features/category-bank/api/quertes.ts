import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { BankItemController, QUERY_KEYS } from ".";
import { BankItemRequestsResponse, BankItemStatus, BankCategories, Resources, Services, BankStatResponse } from "./types";

// ==========================================
// Bank Item Requests Fetcher
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
// Bank Categories & Resources Fetchers
// ==========================================
const fetchResourceCategoriesAPI = async (): Promise<BankCategories> => {
  const { data } = await ApiInstance.get<BankCategories>(
    `/${BankItemController.BankCategories}`,
  );
  return data;
};


const fetchResourceApi = async ({
  CategoryId,
  PageNumber = 1,
  PageSize = 10,
  Search,
}: {
  CategoryId: number;
  Search: string;
  PageSize: number;
  PageNumber: number;
}): Promise<Resources> => {
  const { data } = await ApiInstance.get<Resources>(
    `/${BankItemController.Resources}`,
    {
      params: { ResourceCategoryId: CategoryId, PageNumber, PageSize, Search },
    },
  );
  return data;
};


const fetchServiceApi = async ({
  CategoryId,
  PageNumber = 1,
  PageSize = 10,
  Search,
}: {
  CategoryId: number;
  Search: string;
  PageSize: number;
  PageNumber: number;
}): Promise<Services> => {
  const { data } = await ApiInstance.get<Services>(
    `/${BankItemController.Services}`,
    {
      params: { ResourceCategoryId: CategoryId, PageNumber, PageSize, Search },
    },
  );
  return data;
};

// ==========================================
// Bank Item Requests Hook
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

// ==========================================
// Bank Stat Hook
// ==========================================
const fetchBankStat = async (): Promise<BankStatResponse> => {
  const { data } = await ApiInstance.get<BankStatResponse>(
    `/${BankItemController.BankStat}`,
  );
  return data;
};

export const useBankStat = () => {
  return useQuery<BankStatResponse, unknown>({
    queryKey: QUERY_KEYS.bankStat,
    queryFn: fetchBankStat,
  });
};

// ==========================================
// Bank Categories Hook
// ==========================================
export const useBankCategories = () => {
  return useQuery<BankCategories, unknown>({
    queryKey: QUERY_KEYS.bankCategories,
    queryFn: fetchResourceCategoriesAPI,
  });
};

// ==========================================
// Resources Infinite Queries
// ==========================================
export const useResourcesInfinite = ({
  search,
  categoryId,
}: {
  search: string;
  categoryId: number | "all";
}) => {
  return useInfiniteQuery<Resources, unknown>({
    queryKey: [...QUERY_KEYS.resources, search, categoryId],

    queryFn: async ({ pageParam = 1 }) => {
      const parsedCategoryId =
        categoryId === "all" ? undefined : (categoryId as number);

      return await fetchResourceApi({
        Search: search,
        CategoryId: parsedCategoryId as number,
        PageNumber: pageParam as number,
        PageSize: 10,
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


export const useServicesInfinite = ({
  search,
  categoryId,
}: {
  search: string;
  categoryId: number | "all";
}) => {
  return useInfiniteQuery<Services, unknown>({
    queryKey: [...QUERY_KEYS.services, search, categoryId],

    queryFn: async ({ pageParam = 1 }) => {
      const parsedCategoryId =
        categoryId === "all" ? undefined : (categoryId as number);

      return await fetchServiceApi({
        Search: search,
        CategoryId: parsedCategoryId as number,
        PageNumber: pageParam as number,
        PageSize: 10,
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
