import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { BuildingController, QUERY_KEYS } from ".";
import type {
  GetAllBuildingsFilters,
  BuildingDetails,
  BuildingsResponse,
} from "./types";

const getAllBuildings = async (filters: GetAllBuildingsFilters) => {
  const { data } = await ApiInstance.get<BuildingsResponse>(
    `/${BuildingController.GetAll}`,
    { params: { ...filters } },
  );
  return data;
};

const getBuildingById = async (buildingId: number): Promise<BuildingDetails> => {
  const { data } = await ApiInstance.get<BuildingDetails>(
    `/${BuildingController.GetById}`,
    { params: { buildingId } },
  );
  return data;
};

export const useBuildingsInfinite = (
  filters: Omit<GetAllBuildingsFilters, "PageNumber" | "PageSize"> & {
    PageSize?: number;
  },
) => {
  return useInfiniteQuery<BuildingsResponse, Error>({
    queryKey: QUERY_KEYS.buildings.list(filters),
    queryFn: async ({ pageParam = 0 }) => {
      return await getAllBuildings({
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

export const useBuildingDetails = (buildingId: number) => {
  return useQuery<BuildingDetails, Error>({
    queryKey: QUERY_KEYS.buildings.detail(buildingId),
    queryFn: () => getBuildingById(buildingId),
    enabled: !!buildingId,
  });
};
