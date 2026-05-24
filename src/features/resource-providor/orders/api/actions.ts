import ApiInstance from "@/config/api-instance";
import { InvestorRequestController, MUTATION_KEYS, RejectPayload } from ".";
import { useMutation } from "@tanstack/react-query";
import { errorToast, successToast } from "@/components/common/Toast";
import i18n from "@/lib/i18n";

const approveInvestorRequestApi = async (id: number | string) => {
  const { data } = await ApiInstance.post(
    `/${InvestorRequestController.InvestorRequest}/${id}/approve`,
  );
  return data;
};
const cancelInvestorRequestApi = async (
  id: number | string,
  payLoad: RejectPayload,
) => {
  const { data } = await ApiInstance.post(
    `/${InvestorRequestController.InvestorRequest}/${id}/cancel`,
    payLoad,
  );
  return data;
};

export const useApproveInvestorRequest = () => {
  return useMutation({
    mutationFn: (id: number | string) => approveInvestorRequestApi(id),
    mutationKey: MUTATION_KEYS.investorRequest.approve(),
    onSuccess: (_: any) => {
      successToast(i18n.t("resourceProvidor.investor-request.approve-success"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t("resourceProvidor.investor-request.approve-error");
      errorToast(message);
    },
  });
};

export const useCancelInvestorRequest = () => {
  return useMutation({
    mutationFn: (params: { id: number | string; payload: RejectPayload }) =>
      cancelInvestorRequestApi(params.id, params.payload),
    mutationKey: MUTATION_KEYS.investorRequest.cancel(),
    onSuccess: (_: any) => {
      successToast(i18n.t("resourceProvidor.investor-request.cancel-success"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t("resourceProvidor.investor-request.cancel-error");
      errorToast(message);
    },
  });
};
