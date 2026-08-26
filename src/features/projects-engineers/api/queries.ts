import ApiInstance from "@/config/api-instance";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { ProjectsEngineersController, QUERY_KEYS } from "./";
import type { Engineers, GetAllEngineersFilters } from "./types";

const getAllEngineers = async (
  filters: GetAllEngineersFilters,
): Promise<Engineers> => {
  const { data } = await ApiInstance.get<Engineers>(
    `/${ProjectsEngineersController.GetAll}`,
    { params: { ...filters } },
  );
  return data;
};

export const useEngineers = (filters: GetAllEngineersFilters) => {
  return useQuery<Engineers, Error>({
    queryKey: QUERY_KEYS.engineers.list(filters),
    queryFn: () => getAllEngineers(filters),
  });
};

export const useEngineersInfinite = (
  filters: Omit<GetAllEngineersFilters, "PageNumber" | "PageSize"> & {
    PageSize?: number;
  },
) => {
  return useInfiniteQuery<Engineers, Error>({
    queryKey: QUERY_KEYS.engineers.list(filters),
    queryFn: async ({ pageParam = 1 }) => {
      return await getAllEngineers({
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
