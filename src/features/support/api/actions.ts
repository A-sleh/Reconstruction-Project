import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { successToast, errorToast } from "@/components/common/Toast";
import i18n from "i18next";
import { AgentController, QUERY_KEYS, MUTATION_KEYS } from ".";
import type {
  SendTicketMessagePayload,
  TicketDetails,
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
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage || i18n.t("support.agent.messageSendError", "Failed to send message");
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
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage || i18n.t("support.agent.statusUpdateError", "Failed to update ticket status");
      errorToast(message);
    },
  });
};
