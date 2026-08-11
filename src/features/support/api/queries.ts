import { useQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { AgentController, QUERY_KEYS } from ".";
import type {
  AgentStats,
  AgentTicketsResponse,
  CannedResponsesResponse,
  CustomerTicketsResponse,
  GetAgentTicketsFilters,
  TicketDetails,
} from "./types";

// ==========================================
// API Fetchers
// ==========================================
const getAgentStats = async (): Promise<AgentStats> => {
  const { data } = await ApiInstance.get<AgentStats>(
    `/${AgentController.Stats}`,
  );
  return data;
};

const getAgentTickets = async (
  filters: GetAgentTicketsFilters,
): Promise<AgentTicketsResponse> => {
  const { data } = await ApiInstance.get<AgentTicketsResponse>(
    `/${AgentController.Tickets}`,
    { params: filters },
  );
  return data;
};

const getTicketDetails = async (ticketId: string): Promise<TicketDetails> => {
  const { data } = await ApiInstance.get<TicketDetails>(
    `/${AgentController.Tickets}/${ticketId}`,
  );
  return data;
};

const getCannedResponses = async (): Promise<CannedResponsesResponse> => {
  const { data } = await ApiInstance.get<CannedResponsesResponse>(
    `/${AgentController.CannedResponses}`,
  );
  return data;
};

const getCustomerTickets = async (
  customerId: string,
): Promise<CustomerTicketsResponse> => {
  const { data } = await ApiInstance.get<CustomerTicketsResponse>(
    `/${AgentController.CustomerTickets.replace("{customer_id}", customerId)}`,
  );
  return data;
};

// ==========================================
// Custom Query Hooks
// ==========================================
export const useAgentStats = () => {
  return useQuery<AgentStats, Error>({
    queryKey: QUERY_KEYS.agent.stats,
    queryFn: getAgentStats,
  });
};

export const useAgentTickets = (filters: GetAgentTicketsFilters = {}) => {
  return useQuery<AgentTicketsResponse, Error>({
    queryKey: QUERY_KEYS.agent.tickets(filters),
    queryFn: () => getAgentTickets(filters),
  });
};

export const useTicketDetails = (ticketId: string) => {
  return useQuery<TicketDetails, Error>({
    queryKey: QUERY_KEYS.agent.ticketDetails(ticketId),
    queryFn: () => getTicketDetails(ticketId),
    enabled: !!ticketId,
  });
};

export const useCannedResponses = () => {
  return useQuery<CannedResponsesResponse, Error>({
    queryKey: QUERY_KEYS.agent.cannedResponses,
    queryFn: getCannedResponses,
  });
};

export const useCustomerTickets = (customerId: string) => {
  return useQuery<CustomerTicketsResponse, Error>({
    queryKey: QUERY_KEYS.agent.customerTickets(customerId),
    queryFn: () => getCustomerTickets(customerId),
    enabled: !!customerId,
  });
};
