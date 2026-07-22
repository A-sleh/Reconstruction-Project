import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { SystemUserController, QUERY_KEYS } from ".";
import type {
  GetAllSystemUsersFilters,
  SystemUsersResponse,
  SystemUserStats,
} from "./types";

// ==========================================
// 1. API Fetchers
// ==========================================

const getAllSystemUsers = async (filters: GetAllSystemUsersFilters) => {
  const { data } = await ApiInstance.get<SystemUsersResponse>(
    `/${SystemUserController.GetAll}`,
    { params: { ...filters } },
  );
  return data;
};

const getSystemUserStats = async (): Promise<SystemUserStats> => {
  const { data } = await ApiInstance.get<SystemUserStats>(
    `/${SystemUserController.GetStats}`,
  );
  return data;
};

// ==========================================
// 2. Custom Query Hooks
// ==========================================

export const useSystemUsersInfinite = (
  filters: Omit<GetAllSystemUsersFilters, "PageNumber" | "PageSize"> & {
    PageSize?: number;
  },
) => {
  return useInfiniteQuery<SystemUsersResponse, Error>({
    queryKey: QUERY_KEYS.systemUsers.list(filters),
    queryFn: async ({ pageParam = 1 }) => {
      return await getAllSystemUsers({
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

export const useSystemUserStats = () => {
  return useQuery<SystemUserStats, Error>({
    queryKey: QUERY_KEYS.systemUsers.stats(),
    queryFn: getSystemUserStats,
  });
};
