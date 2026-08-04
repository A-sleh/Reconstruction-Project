import ApiInstance from "@/config/api-instance";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { BankItemController, QUERY_KEYS } from ".";
import {
  BankCategories,
  BankItemRequestsResponse,
  BankItemStatus,
  BankStatResponse,
  Resources,
  Services,
  TagsResponse,
} from "./types";

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
    },
  );
  return data;
};

const getUserBankItemRequests = async (
  pageNumber: number,
  pageSize: number,
  filters?: { Search?: string; Status?: BankItemStatus },
) => {
  const { data } = await ApiInstance.get<BankItemRequestsResponse>(
    `/${BankItemController.GetAllRequestsOfCurrentUser}`,
    {
      params: { PageNumber: pageNumber, PageSize: pageSize, ...filters },
    },
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
    queryKey: [
      ...QUERY_KEYS.bankItems.all,
      pageSize,
      search ?? "",
      status ?? "",
    ],

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

export const useUserBankItemRequests = ({
  pageSize = 10,
  search,
  status,
}: {
  pageSize?: number;
  search?: string;
  status?: BankItemStatus;
} = {}) => {
  return useInfiniteQuery<BankItemRequestsResponse, Error>({
    queryKey: [
      ...QUERY_KEYS.bankItems.user,
      pageSize,
      search ?? "",
      status ?? "",
    ],

    queryFn: async ({ pageParam = 0 }) => {
      return await getUserBankItemRequests(pageParam as number, pageSize, {
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

// ==========================================
// Tags Queries
// ==========================================
const fetchResourceTags = async (
  search: string,
  pageNumber: number,
  pageSize: number,
): Promise<TagsResponse> => {
  const { data } = await ApiInstance.get<TagsResponse>(
    `/${BankItemController.ResourceTags}`,
    { params: { search, PageNumber: pageNumber, PageSize: pageSize } },
  );
  return data;
};

const fetchServiceTags = async (
  search: string,
  pageNumber: number,
  pageSize: number,
): Promise<TagsResponse> => {
  const { data } = await ApiInstance.get<TagsResponse>(
    `/${BankItemController.ServiceTags}`,
    { params: { search, PageNumber: pageNumber, PageSize: pageSize } },
  );
  return data;
};

export const useResourceTags = (search: string) => {
  return useInfiniteQuery<TagsResponse, unknown>({
    queryKey: QUERY_KEYS.resourceTags(search),
    queryFn: async ({ pageParam = 1 }) =>
      fetchResourceTags(search, pageParam as number, 10),
    enabled: search.length > 0,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) {
        return lastPage.pageNum + 1;
      }
      return undefined;
    },
  });
};

export const useServiceTags = (search: string) => {
  return useInfiniteQuery<TagsResponse, unknown>({
    queryKey: QUERY_KEYS.serviceTags(search),
    queryFn: async ({ pageParam = 1 }) =>
      fetchServiceTags(search, pageParam as number, 10),
    enabled: search.length > 0,
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
