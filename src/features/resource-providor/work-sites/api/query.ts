import ApiInstance from "@/config/api-instance";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, SiteController, WorkSite, WorkSiteStatistics } from ".";


export const fetchWorkSitesAPI = async (): Promise<WorkSite[]> => {
  const { data } = await ApiInstance.get<WorkSite[]>(
    `/${SiteController.WorkSites}`,
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

export const useWorkSites = () => {
  return useQuery<WorkSite[], unknown>({
    queryKey: QUERY_KEYS.workSites(),
    queryFn: fetchWorkSitesAPI,
  });
};

export const useWorkSitesStatistics = () => {
  return useQuery<WorkSiteStatistics, unknown>({
    queryKey: QUERY_KEYS.statistics,
    queryFn: fetchWorkSitesStatisticsAPI,
  });
};
