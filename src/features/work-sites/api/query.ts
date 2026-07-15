import { SiteController, WorkSite, WorkSiteStatistics } from "./types";
import ApiInstance from "@/config/api-instance";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from ".";

export const fetchWorkSitesAPI = async (
  filter?: string,
): Promise<WorkSite[]> => {
  const { data } = await ApiInstance.get<WorkSite[]>(
    `/${SiteController.WorkSites}`,
    {
      params: filter ? { WorkSiteType: filter } : undefined,
    },
  );
  return data;
};

export const fetchWorkSitesStatisticsAPI =
  async (): Promise<WorkSiteStatistics> => {
    const { data } = await ApiInstance.get<WorkSiteStatistics>(
      `/${SiteController.WorkSitesStatistics}`,
    );
    return data;
  };

export const useWorkSites = (filter?: string) => {
  return useQuery<WorkSite[], unknown>({
    queryKey: QUERY_KEYS.workSites(filter),
    queryFn: () => fetchWorkSitesAPI(filter),
  });
};

export const useWorkSitesStatistics = () => {
  return useQuery<WorkSiteStatistics, unknown>({
    queryKey: QUERY_KEYS.statistics,
    queryFn: fetchWorkSitesStatisticsAPI,
  });
};
