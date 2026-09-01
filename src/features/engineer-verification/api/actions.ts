import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { successToast, errorToast } from "@/components/common/Toast";
import i18n from "i18next";
import { EngineerVerificationController, QUERY_KEYS, MUTATION_KEYS } from ".";
import type { EngineerVerifyDecision } from "./types";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const err = error as { response?: { data?: { message?: string } } };
    return err.response?.data?.message ?? "";
  }
  return "";
}

const approveEngineer = async (engineerId: string) => {
  const { data } = await ApiInstance.post(
    `/${EngineerVerificationController.Approve}`,
    {},
    { params: { engineerId } },
  );
  return data;
};

const rejectEngineer = async (engineerId: string, reason: string) => {
  const { data } = await ApiInstance.post(
    `/${EngineerVerificationController.Reject}`,
    { reason },
    { params: { engineerId } },
  );
  return data;
};

export const useVerifyEngineer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.engineerVerification.verify(),
    mutationFn: async ({
      engineerId,
      decision,
      reason,
    }: {
      engineerId: string;
      decision: EngineerVerifyDecision;
      reason?: string;
    }) => {
      if (decision === "REJECTED") {
        return await rejectEngineer(engineerId, reason ?? "");
      }
      return await approveEngineer(engineerId);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.engineerVerification.all,
      });
      if (variables.decision === "REJECTED") {
        successToast(i18n.t("engineerVerification.toast.rejectSuccess"));
      } else {
        successToast(i18n.t("engineerVerification.toast.approveSuccess"));
      }
    },
    onError: (error: unknown, variables) => {
      const message =
        getErrorMessage(error) ||
        (variables.decision === "REJECTED"
          ? i18n.t("engineerVerification.toast.rejectError")
          : i18n.t("engineerVerification.toast.approveError"));
      errorToast(message);
    },
  });
};
