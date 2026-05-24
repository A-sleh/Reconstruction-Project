import ApiInstance from "@/config/api-instance";
import { InvestorRequest } from "../../orders/api";
import { InvestorRequestDetailsController, QUERY_KEYS } from ".";
import { useQuery } from "@tanstack/react-query";

const fetchRequestDetailsApi = async (
  id: string | number,
): Promise<InvestorRequest> => {
  const { data } = await ApiInstance.get<InvestorRequest>(
    `/${InvestorRequestDetailsController.InvestorRequestDetails}/${id}`,
  );
  return data;
};

export const useFetchRequestDetails = (id: string | number) => {
  return useQuery<InvestorRequest, unknown>({
    queryKey: QUERY_KEYS.investorReqeust(id),
    queryFn: () => fetchRequestDetailsApi(id),
  });
};
