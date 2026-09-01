import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { PropertyVerificationController, QUERY_KEYS } from ".";
import type {
  GetPropertyVerificationsFilters,
  PropertyVerificationResponse,
  PropertyVerificationStats,
} from "./types";

const getPropertyVerifications = async (
  filters: GetPropertyVerificationsFilters,
): Promise<PropertyVerificationResponse> => {
  const { data } = await ApiInstance.get<PropertyVerificationResponse>(
    `/${PropertyVerificationController.GetAll}`,
    { params: { ...filters } },
  );
  return data;
};

const getPropertyVerificationStats =
  async (): Promise<PropertyVerificationStats> => {
    const { data } = await ApiInstance.get<PropertyVerificationStats>(
      `/${PropertyVerificationController.GetStats}`,
    );
    return data;
  };

export const usePropertyVerificationInfinite = (
  filters: Omit<GetPropertyVerificationsFilters, "page" | "limit"> & {
    limit?: number;
  },
) => {
  return useInfiniteQuery<PropertyVerificationResponse, Error>({
    queryKey: QUERY_KEYS.propertyVerification.list(filters),
    queryFn: async ({ pageParam = 1 }) => {
      return await getPropertyVerifications({
        ...filters,
        page: pageParam as number,
        limit: filters.limit ?? 10,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.data.length;
      if (loaded < lastPage.total) {
        return Math.ceil(loaded / (filters.limit ?? 10)) + 1;
      }
      return undefined;
    },
  });
};

export const usePropertyVerificationStats = () => {
  return useQuery<PropertyVerificationStats, Error>({
    queryKey: QUERY_KEYS.propertyVerification.stats(),
    queryFn: getPropertyVerificationStats,
  });
};
