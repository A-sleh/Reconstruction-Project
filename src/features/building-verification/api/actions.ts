import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { successToast, errorToast } from "@/components/common/Toast";
import i18n from "i18next";
import {
  PropertyVerificationController,
  QUERY_KEYS,
  MUTATION_KEYS,
} from ".";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const err = error as { response?: { data?: { message?: string } } };
    return err.response?.data?.message ?? "";
  }
  return "";
}

const approveProperty = async (propertyId: string) => {
  const { data } = await ApiInstance.post(
    `/${PropertyVerificationController.Approve}`,
    {},
    { params: { propertyId } },
  );
  return data;
};

const rejectProperty = async (propertyId: string, reason: string) => {
  const { data } = await ApiInstance.post(
    `/${PropertyVerificationController.Reject}`,
    { reason },
    { params: { propertyId } },
  );
  return data;
};

export const useVerifyProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.propertyVerification.verify(),
    mutationFn: async ({
      propertyId,
      decision,
      reason,
    }: {
      propertyId: string;
      decision: "APPROVED" | "REJECTED";
      reason?: string;
    }) => {
      if (decision === "APPROVED") {
        return approveProperty(propertyId);
      }
      return rejectProperty(propertyId, reason ?? "");
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.propertyVerification.all,
      });
      if (variables.decision === "APPROVED") {
        successToast(
          i18n.t("buildingVerification.toast.approveSuccess"),
        );
      } else {
        successToast(
          i18n.t("buildingVerification.toast.rejectSuccess"),
        );
      }
    },
    onError: (error: unknown, variables) => {
      const message =
        getErrorMessage(error) ||
        (variables.decision === "APPROVED"
          ? i18n.t("buildingVerification.toast.approveError")
          : i18n.t("buildingVerification.toast.rejectError"));
      errorToast(message);
    },
  });
};
