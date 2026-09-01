import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { successToast, errorToast } from "@/components/common/Toast";
import i18n from "i18next";
import {
  EngineerRequestsController,
  QUERY_KEYS,
  MUTATION_KEYS,
} from ".";
import type { InviteDecision } from "./types";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const err = error as { response?: { data?: { message?: string } } };
    return err.response?.data?.message ?? "";
  }
  return "";
}

const acceptInvite = async (inviteId: string) => {
  const { data } = await ApiInstance.post(
    `/${EngineerRequestsController.AcceptInvite}`,
    {},
    { params: { inviteId } },
  );
  return data;
};

const declineInvite = async (inviteId: string, reason: string) => {
  const { data } = await ApiInstance.post(
    `/${EngineerRequestsController.DeclineInvite}`,
    { reason },
    { params: { inviteId } },
  );
  return data;
};

export const useRespondInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.engineerRequests.respondInvite(),
    mutationFn: async ({
      inviteId,
      decision,
      reason,
    }: {
      inviteId: string;
      decision: InviteDecision;
      reason?: string;
    }) => {
      if (decision === "ACCEPTED") {
        return acceptInvite(inviteId);
      }
      return declineInvite(inviteId, reason ?? "");
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.engineerRequests.all,
      });
      if (variables.decision === "ACCEPTED") {
        successToast(i18n.t("engineerRequests.toast.acceptSuccess"));
      } else {
        successToast(i18n.t("engineerRequests.toast.declineSuccess"));
      }
    },
    onError: (error: unknown, variables) => {
      const message =
        getErrorMessage(error) ||
        (variables.decision === "ACCEPTED"
          ? i18n.t("engineerRequests.toast.acceptError")
          : i18n.t("engineerRequests.toast.declineError"));
      errorToast(message);
    },
  });
};

const cancelJoinRequest = async (requestId: string) => {
  const { data } = await ApiInstance.post(
    `/${EngineerRequestsController.CancelJoinRequest}`,
    {},
    { params: { requestId } },
  );
  return data;
};

export const useCancelJoinRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.engineerRequests.cancelJoinRequest(),
    mutationFn: async ({ requestId }: { requestId: string }) => {
      return cancelJoinRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.engineerRequests.all,
      });
      successToast(i18n.t("engineerRequests.toast.cancelSuccess"));
    },
    onError: (error: unknown) => {
      const message =
        getErrorMessage(error) || i18n.t("engineerRequests.toast.cancelError");
      errorToast(message);
    },
  });
};
