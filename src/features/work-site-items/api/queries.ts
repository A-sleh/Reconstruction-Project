import ApiInstance from "@/config/api-instance";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, WorkSiteItemsController } from ".";
import {
  OrderRequest,
  WorkSiteResourcesStatistics,
  Resources,
  Services,
} from "./types";

// ==========================================
// Site-Specific Fetchers (NOT moved — belong to site-resources)
// ==========================================

const fetchWorkSiteResourcesStatisticsAPI =
  async (): Promise<WorkSiteResourcesStatistics> => {
    const { data } = await ApiInstance.get<WorkSiteResourcesStatistics>(
      `/${WorkSiteItemsController.WorkSiteResourcesStatistics}`,
    );
    return data;
  };

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
    `/${WorkSiteItemsController.WorkSiteResources}`,
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
    `/${WorkSiteItemsController.WorkSiteServices}`,
    {
      params: { ResourceCategoryId: CategoryId, PageNumber, PageSize, Search },
    },
  );
  return data;
};

// ==========================================
// Site-Specific Hooks
// ==========================================
export const useResourceStatistics = () => {
  return useQuery<WorkSiteResourcesStatistics, unknown>({
    queryKey: QUERY_KEYS.statistics,
    queryFn: fetchWorkSiteResourcesStatisticsAPI,
  });
};

export const useWorkSiteResourcesInfinite = ({
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
