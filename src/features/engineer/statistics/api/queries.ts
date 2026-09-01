import { useQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { EngineerStatisticsController, QUERY_KEYS } from "./";
import { mockEngineerStatistics } from "../mockData";
import type { EngineerStatistics } from "./types";

const getEngineerStatistics = async (): Promise<EngineerStatistics> => {
  const { data } = await ApiInstance.get<EngineerStatistics>(
    `/${EngineerStatisticsController.Overview}`,
  );
  return data;
};

export const useEngineerStatistics = () => {
  return useQuery<EngineerStatistics, Error>({
    queryKey: QUERY_KEYS.engineerStatistics.overview(),
    queryFn: getEngineerStatistics,
    staleTime: 5 * 60 * 1000,
    placeholderData: mockEngineerStatistics,
  });
};