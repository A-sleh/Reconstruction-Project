import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { successToast, errorToast } from "@/components/common/Toast";
import i18n from "i18next";
import { AgentController, QUERY_KEYS, MUTATION_KEYS, TicketController } from ".";
import type {
  CsatPayload,
  CsatResponse,
  SendTicketMessagePayload,
  SendUserMessagePayload,
  TicketDetails,
  TicketThread,
  UpdateTicketStatusPayload,
} from "./types";

// ==========================================
// API Fetchers
// ==========================================
const sendTicketMessage = async (
  ticketId: string,
  payload: SendTicketMessagePayload,
): Promise<TicketDetails> => {
  const { data } = await ApiInstance.post<TicketDetails>(
    `/${AgentController.TicketMessages.replace("{ticket_id}", ticketId)}`,
    payload,
  );
  return data;
};

const updateTicketStatus = async (
  ticketId: string,
  payload: UpdateTicketStatusPayload,
): Promise<TicketDetails> => {
  const { data } = await ApiInstance.patch<TicketDetails>(
    `/${AgentController.TicketStatus.replace("{ticket_id}", ticketId)}`,
    payload,
  );
  return data;
};

// ==========================================
// User Ticket Thread Actions
// ==========================================
const sendUserMessage = async (
  ticketId: string,
  payload: SendUserMessagePayload,
): Promise<TicketThread> => {
  const { data } = await ApiInstance.post<TicketThread>(
    `/${TicketController.Messages.replace("{ticket_id}", ticketId)}`,
    payload,
  );
  return data;
};

const submitCsat = async (
  ticketId: string,
  payload: CsatPayload,
): Promise<CsatResponse> => {
  const { data } = await ApiInstance.post<CsatResponse>(
    `/${TicketController.Csat.replace("{ticket_id}", ticketId)}`,
    payload,
  );
  return data;
};

// ==========================================
// Error helpers
// ==========================================
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const err = error as { response?: { data?: { message?: string } } };
    return err.response?.data?.message ?? "";
  }
  return "";
}

// ==========================================
// Custom Mutation Hooks
// ==========================================
export const useSendTicketMessage = (ticketId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.agent.sendMessage(ticketId),
    mutationFn: (payload: SendTicketMessagePayload) =>
      sendTicketMessage(ticketId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.agent.ticketDetails(ticketId),
      });
      successToast(
        i18n.t("support.agent.messageSent", "Message sent successfully"),
      );
    },
    onError: (error) => {
      const message =
        getErrorMessage(error) ||
        i18n.t("support.agent.messageSendError", "Failed to send message");
      errorToast(message);
    },
  });
};

export const useUpdateTicketStatus = (ticketId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.agent.updateStatus(ticketId),
    mutationFn: (payload: UpdateTicketStatusPayload) =>
      updateTicketStatus(ticketId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.agent.tickets(),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.agent.ticketDetails(ticketId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.agent.stats,
      });
      successToast(
        i18n.t("support.agent.statusUpdated", "Ticket status updated successfully"),
      );
    },
    onError: (error) => {
      const message =
        getErrorMessage(error) ||
        i18n.t("support.agent.statusUpdateError", "Failed to update ticket status");
      errorToast(message);
    },
  });
};

// ==========================================
// User Ticket Thread Hooks
// ==========================================
export const useSendUserMessage = (ticketId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.ticket.sendUserMessage(ticketId),
    mutationFn: (payload: SendUserMessagePayload) =>
      sendUserMessage(ticketId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ticketThread(ticketId),
      });
      successToast(
        i18n.t("support.thread.messageSent", "Message sent successfully"),
      );
    },
    onError: (error) => {
      const message =
        getErrorMessage(error) ||
        i18n.t("support.thread.messageSendError", "Failed to send message");
      errorToast(message);
    },
  });
};

export const useSubmitCsat = (ticketId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.ticket.submitCsat(ticketId),
    mutationFn: (payload: CsatPayload) => submitCsat(ticketId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ticketThread(ticketId),
      });
      successToast(
        i18n.t("support.csat.submitSuccess", "Thanks! Your rating has been recorded successfully."),
      );
    },
    onError: (error) => {
      const message =
        getErrorMessage(error) ||
        i18n.t("support.csat.submitError", "Failed to submit your rating");
      errorToast(message);
    },
  });
};
