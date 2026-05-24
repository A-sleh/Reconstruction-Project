import ApiInstance from "@/config/api-instance";
import { useQuery } from "@tanstack/react-query";
import {
  QUERY_KEYS,
  WorkSiteResourcesController,
  SiteDetailsWithResources,
  WorkSiteResourcesStatistics,
  OrderRequest,
} from ".";

const fetchWorkSiteDetailsAPI = async (
  id: string | number,
): Promise<SiteDetailsWithResources> => {
  const { data } = await ApiInstance.get<SiteDetailsWithResources>(
    `/${WorkSiteResourcesController.WorkSite}/${id}`,
  );
  return data;
};

const fetchOrderResourceRequestApi = async (): Promise<OrderRequest[]> => {
  const { data } = await ApiInstance.get<OrderRequest[]>(
    `/${WorkSiteResourcesController.OrderRequest}`,
  );
  return data;
};

const fetchWorkSiteResourcesStatisticsAPI =
  async (): Promise<WorkSiteResourcesStatistics> => {
    const { data } = await ApiInstance.get<WorkSiteResourcesStatistics>(
      `/${WorkSiteResourcesController.WorkSiteResourcesStatistics}`,
    );
    return data;
  };

export const useResorceOrders = () => {
  return useQuery<OrderRequest[], unknown>({
    queryKey: QUERY_KEYS.orders,
    queryFn: fetchOrderResourceRequestApi,
  });
};

export const useResources = (id: any) => {
  return useQuery<SiteDetailsWithResources, unknown>({
    queryKey: QUERY_KEYS.resource(id),
    queryFn: () => fetchWorkSiteDetailsAPI(id),
  });
};

export const useResourceStatistics = () => {
  return useQuery<WorkSiteResourcesStatistics, unknown>({
    queryKey: QUERY_KEYS.statistics,
    queryFn: fetchWorkSiteResourcesStatisticsAPI,
  });
};
