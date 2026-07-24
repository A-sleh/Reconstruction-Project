import ApiInstance from "@/config/api-instance";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  QUERY_KEYS,
  WorkSiteResourcesController,
} from ".";
import { BankCategories, OrderRequest, Resources, WorkSiteResourcesStatistics } from "./types";

const fetchWorkSiteResourceApi = async ({
  CategoryId,
  PageNumber = 1,
  PageSize = 10,
  Search,
  WorkSiteId,
}: {
  CategoryId: number | undefined;
  Search: string;
  PageSize: number;
  PageNumber: number;
  WorkSiteId: number | string;
}): Promise<Resources> => {
  const { data } = await ApiInstance.get<Resources>(
    `/${WorkSiteResourcesController.WorkSiteResources}`,
    {
      params: {
        ResourceCategoryId: CategoryId,
        PageNumber,
        PageSize,
        Search,
        WorkSiteId,
      },
    },
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
    `/${WorkSiteResourcesController.Resources}`,
    {
      params: { ResourceCategoryId: CategoryId, PageNumber, PageSize, Search },
    },
  );
  return data;
};

const fetchResourceCategoriesAPI = async (): Promise<BankCategories> => {
  const { data } = await ApiInstance.get<BankCategories>(
    `/${WorkSiteResourcesController.BankCategories}`,
  );
  return data;
};


const fetchOrderResourceRequestApi = async (): Promise<OrderRequest[]> => {
  const { data } = await ApiInstance.get<OrderRequest[]>(
    `/${WorkSiteResourcesController.OrderRequest}`,
  );
  return data;
};

const fetchWorkSiteResourcesStatisticsAPI =
  async (): Promise<WorkSiteResourcesStatistics> => {
    const { data } = await ApiInstance.get<WorkSiteResourcesStatistics>(
      `/${WorkSiteResourcesController.WorkSiteResourcesStatistics}`,
    );
    return data;
  };

export const useResorceOrders = () => {
  return useQuery<OrderRequest[], unknown>({
    queryKey: QUERY_KEYS.orders,
    queryFn: fetchOrderResourceRequestApi,
  });
};


export const useResourceStatistics = () => {
  return useQuery<WorkSiteResourcesStatistics, unknown>({
    queryKey: QUERY_KEYS.statistics,
    queryFn: fetchWorkSiteResourcesStatisticsAPI,
  });
};

export const useBankCategories = () => {
  return useQuery<BankCategories, unknown>({
    queryKey: QUERY_KEYS.bankCategories,
    queryFn: fetchResourceCategoriesAPI,
  });
};

export const useRWorkSiteResourcesInfinite = ({
  search,
  categoryId,
  workSiteId,
}: {
  search: string;
  workSiteId: number | string;
  categoryId: number | "all";
}) => {
  return useInfiniteQuery<Resources, unknown>({
    queryKey: [...QUERY_KEYS.resources, workSiteId, search, categoryId],

    queryFn: async ({ pageParam = 1 }) => {
      return await fetchWorkSiteResourceApi({
        Search: search,
        CategoryId: categoryId === "all" ? undefined : (categoryId as number),
        PageNumber: pageParam as number,
        PageSize: 10,
        WorkSiteId: workSiteId,
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
