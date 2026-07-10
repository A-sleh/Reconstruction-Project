import { useQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { BankItemController, QUERY_KEYS } from ".";
import { BankItemRequestsResponse, GetBankItemFilters } from "./types";

// ==========================================
// API Fetchers
// ==========================================
const getBankItemRequests = async (filters: GetBankItemFilters) => {
  const { data } = await ApiInstance.get<BankItemRequestsResponse>(
    `/${BankItemController.GetAllRequests}`,
    {
      params: { ...filters },
    }
  );
  return data;
};

// ==========================================
// Custom Query Hooks
// ==========================================
export const useBankItemRequests = (filters: GetBankItemFilters) => {
  return useQuery<BankItemRequestsResponse, Error>({
    queryKey: QUERY_KEYS.bankItems.list(filters),
    queryFn: () => getBankItemRequests(filters),
  });
};