import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { EngineerVerificationController, QUERY_KEYS } from ".";
import type {
  EngineerVerificationResponse,
  EngineerVerificationStats,
  GetEngineerVerificationsFilters,
} from "./types";

const getAllEngineerVerifications = async (
  filters: GetEngineerVerificationsFilters,
) => {
  const { data } = await ApiInstance.get<EngineerVerificationResponse>(
    `/${EngineerVerificationController.GetAll}`,
    { params: { ...filters } },
  );
  return data;
};

const getEngineerVerificationStats = async (): Promise<EngineerVerificationStats> => {
  const { data } = await ApiInstance.get<EngineerVerificationStats>(
    `/${EngineerVerificationController.GetStats}`,
  );
  return data;
};

export const useEngineerVerificationInfinite = (
  filters: Partial<GetEngineerVerificationsFilters> = {},
) => {
  return useInfiniteQuery<EngineerVerificationResponse, Error>({
    queryKey: QUERY_KEYS.engineerVerification.list(filters),
    queryFn: async ({ pageParam = 1 }) => {
      return await getAllEngineerVerifications({
        ...filters,
        page: pageParam as number,
        limit: filters.limit ?? 10,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const currentCount = lastPage.data?.length ?? 0;
      if (currentCount < (filters.limit ?? 10)) {
        return undefined;
      }
      return allPages.length + 1;
    },
  });
};

export const useEngineerVerificationStats = () => {
  return useQuery<EngineerVerificationStats, Error>({
    queryKey: QUERY_KEYS.engineerVerification.stats(),
    queryFn: getEngineerVerificationStats,
  });
};
