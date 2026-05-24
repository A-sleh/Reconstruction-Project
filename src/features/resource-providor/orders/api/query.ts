import ApiInstance from "@/config/api-instance";
import {
  InvestorRequest,
  InvestorRequestController,
  InvestorRequestStat,
  QUERY_KEYS,
} from ".";
import { useQuery } from "@tanstack/react-query";

const fetchInvestorRequestsApi = async (): Promise<InvestorRequest[]> => {
  // Mock API call - replace with real API integration
  const { data } = await ApiInstance.get<InvestorRequest[]>(
    `/${InvestorRequestController.InvestorRequest}`,
  );
  return data;
};

const fetchInvestorRequestsStatApi = async (): Promise<InvestorRequestStat> => {
  // Mock API call - replace with real API integration
  const { data } = await ApiInstance.get<InvestorRequestStat>(
    `/${InvestorRequestController.InvestorRequestStat}`,
  );
  return data;
};

export const useInvestoryRequests = () => {
  return useQuery<InvestorRequest[], unknown>({
    queryKey: QUERY_KEYS.investorReqeust,
    queryFn: fetchInvestorRequestsApi,
  });
};

export const useInvestoryRequestsStat = () => {
  return useQuery<InvestorRequestStat, unknown>({
    queryKey: QUERY_KEYS.investorReqeustStat,
    queryFn: fetchInvestorRequestsStatApi
  });
};