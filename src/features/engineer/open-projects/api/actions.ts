import { useMutation, useQueryClient } from "@tanstack/react-query";
import i18n from "i18next";
import { MUTATION_KEYS, QUERY_KEYS, submitApplication } from "./index";
import type { ApplyToProjectPayload } from "./types";
import { successToast, errorToast } from "@/components/common/Toast";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const err = error as { response?: { data?: { message?: string } } };
    return err.response?.data?.message ?? "";
  }
  return "";
}

export const useSubmitApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.openProjects.apply(),
    mutationFn: (payload: ApplyToProjectPayload) => submitApplication(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.openProjects.all,
      });
      successToast(i18n.t("openProjects.toast.applySuccess"));
    },
    onError: (error: Error) => {
      errorToast(
        getErrorMessage(error) || i18n.t("openProjects.toast.applyError"),
      );
    },
  });
};
