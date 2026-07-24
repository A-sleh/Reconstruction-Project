import ApiInstance from "@/config/api-instance";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, WorkSiteResourcesController } from ".";
import { OrderRequest, WorkSiteResourcesStatistics, Resources } from "./types";

// Re-export moved hooks from category-bank
export {
  useBankCategories,
  useResourcesInfinite,
} from "@/features/category-bank/api/quertes";

// ==========================================
// Site-Specific Fetchers (NOT moved — belong to site-resources)
// ==========================================
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

// ==========================================
// Site-Specific Hooks
// ==========================================
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
