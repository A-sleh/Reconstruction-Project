import { useMutation } from "@tanstack/react-query";
import i18n from "i18next";
import { MUTATION_KEYS, sendMessage } from "./index";
import type { SendMessagePayload, SendMessageResponse } from "./types";
import { successToast, errorToast } from "@/components/common/Toast";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const err = error as { response?: { data?: { message?: string } } };
    return err.response?.data?.message ?? "";
  }
  return "";
}

export const useSendMessage = () =>
  useMutation<SendMessageResponse, Error, SendMessagePayload>({
    mutationKey: MUTATION_KEYS.conversations.sendMessage(),
    mutationFn: (payload: SendMessagePayload) => sendMessage(payload),
    onSuccess: () => {
      successToast(i18n.t("conversations.toast.sent"));
    },
    onError: (error: Error) => {
      errorToast(getErrorMessage(error) || i18n.t("conversations.toast.sent"));
    },
  });