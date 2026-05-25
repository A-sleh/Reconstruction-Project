// ==========================================
// 1. SITES STATS QUERY

import ApiInstance from "@/config/api-instance";
import { useQuery } from "@tanstack/react-query";
import { OrderRequestStat, QUERY_KEYS, RequestStat, ResourceProvidorStat, ResourceStat, SiteController, SiteStat } from ".";

// ==========================================
export const fetchSitesStatAPI = async (): Promise<SiteStat[]> => {
  const { data } = await ApiInstance.get<SiteStat[]>(`/${SiteController.SitesOnly}`);
  return data;
};

export const useSitesStat = () => {
  return useQuery<SiteStat[], Error>({
    queryKey: QUERY_KEYS.statistics.sites(),
    queryFn: fetchSitesStatAPI,
  });
};

// ==========================================
// 2. RESOURCES STATS QUERY
// ==========================================
export const fetchResourcesStatAPI = async (): Promise<ResourceStat[]> => {
  const { data } = await ApiInstance.get<ResourceStat[]>(`/${SiteController.ResourcesOnly}`);
  return data;
};

export const useResourcesStat = () => {
  return useQuery<ResourceStat[], Error>({
    queryKey: QUERY_KEYS.statistics.resources(),
    queryFn: fetchResourcesStatAPI,
  });
};

// ==========================================
// 3. ORDER REQUESTS STATS QUERY
// ==========================================
export const fetchOrderRequestsStatAPI = async (): Promise<OrderRequestStat[]> => {
  const { data } = await ApiInstance.get<OrderRequestStat[]>(`/${SiteController.OrdersOnly}`);
  return data;
};

export const useOrderRequestsStat = () => {
  return useQuery<OrderRequestStat[], Error>({
    queryKey: QUERY_KEYS.statistics.orders(),
    queryFn: fetchOrderRequestsStatAPI,
  });
};

// ==========================================
// 4. REQUESTS STATS QUERY
// ==========================================
export const fetchRequestsStatAPI = async (): Promise<RequestStat[]> => {
  const { data } = await ApiInstance.get<RequestStat[]>(`/${SiteController.RequestsOnly}`);
  return data;
};

export const useRequestsStat = () => {
  return useQuery<RequestStat[], Error>({
    queryKey: QUERY_KEYS.statistics.requests(),
    queryFn: fetchRequestsStatAPI,
  });
};

// ==========================================
// 5. Resrouce Providor Dashboard STATS QUERY
// ==========================================
export const fetchResourceProvidorStatAPI = async (): Promise<ResourceProvidorStat> => {
  const { data } = await ApiInstance.get<ResourceProvidorStat>(`/${SiteController.resorceProvidorStat}`);
  return data;
};

export const useResourceProvidorStat = () => {
  return useQuery<ResourceProvidorStat, Error>({
    queryKey: QUERY_KEYS.statistics.resourceProvidorStat,
    queryFn: fetchResourceProvidorStatAPI,
  });
};