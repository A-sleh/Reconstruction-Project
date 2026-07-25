import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { LandController, QUERY_KEYS } from ".";
import type {
  GetAllLandsFilters,
  InvestorPropertiesSummary,
  LandDetail,
  LandsResponse,
} from "./types";

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

const getInvestorProperties = async (): Promise<InvestorPropertiesSummary> => {
  const { data } = await ApiInstance.get<InvestorPropertiesSummary>(
    `/${LandController.GetInvestorProperties}`,
  );
  return data;
};

export const useInvestorProperties = () => {
  return useQuery<InvestorPropertiesSummary, Error>({
    queryKey: QUERY_KEYS.lands.investorProperties(),
    queryFn: getInvestorProperties,
  });
};

const getLandById = async (landId: string | number): Promise<LandDetail> => {
  const { data } = await ApiInstance.get<LandDetail>(
    `/${LandController.GetLandById}`,
    { params: { landId } },
  );
  return data;
};

export const useLandById = (landId: string | number) => {
  return useQuery<LandDetail, Error>({
    queryKey: QUERY_KEYS.lands.detail(landId),
    queryFn: () => getLandById(landId),
    enabled: !!landId,
  });
};
