import { useInfiniteQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { LandController, QUERY_KEYS } from ".";
import type { GetAllLandsFilters, LandsResponse } from "./types";

const getAllLands = async (filters: GetAllLandsFilters) => {
  const { data } = await ApiInstance.get<LandsResponse>(
    `/${LandController.GetAllLands}`,
    { params: { ...filters } },
  );
  return data;
};

export const useLandsInfinite = (filters: GetAllLandsFilters) => {
  return useInfiniteQuery<LandsResponse, Error>({
    queryKey: QUERY_KEYS.lands.list(filters),
    queryFn: async ({ pageParam = 0 }) => {
      return await getAllLands({
        ...filters,
        PageNumber: pageParam as number,
        PageSize: filters.PageSize ?? 10,
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
