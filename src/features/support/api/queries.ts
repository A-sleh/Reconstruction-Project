import { useQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { AgentController, KbController, QUERY_KEYS, TicketController } from ".";
import type {
  AgentStats,
  AgentTicketsResponse,
  CannedResponsesResponse,
  CustomerTicketsResponse,
  GetAgentTicketsFilters,
  KbCategoriesResponse,
  KbCategoryArticlesResponse,
  KbPopularFaqsResponse,
  KbSearchResponse,
  TicketDetails,
  TicketThread,
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
// User Ticket Thread
// ==========================================
const getTicketThread = async (ticketId: string): Promise<TicketThread> => {
  const { data } = await ApiInstance.get<TicketThread>(
    `/${TicketController.Thread.replace("{ticket_id}", ticketId)}`,
  );
  return data;
};

// ==========================================
// Knowledge Base & FAQ
// ==========================================
const searchKb = async (query: string): Promise<KbSearchResponse> => {
  const { data } = await ApiInstance.get<KbSearchResponse>(
    `/${KbController.Search}`,
    { params: { query } },
  );
  return data;
};

const getKbCategories = async (): Promise<KbCategoriesResponse> => {
  const { data } = await ApiInstance.get<KbCategoriesResponse>(
    `/${KbController.Categories}`,
  );
  return data;
};

const getKbPopularFaqs = async (): Promise<KbPopularFaqsResponse> => {
  const { data } = await ApiInstance.get<KbPopularFaqsResponse>(
    `/${KbController.PopularFaqs}`,
  );
  return data;
};

const getKbCategoryArticles = async (
  categoryId: string,
): Promise<KbCategoryArticlesResponse> => {
  const { data } = await ApiInstance.get<KbCategoryArticlesResponse>(
    `/${KbController.CategoryArticles.replace("{category_id}", categoryId)}`,
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

export const useTicketThread = (ticketId: string) => {
  return useQuery<TicketThread, Error>({
    queryKey: QUERY_KEYS.ticketThread(ticketId),
    queryFn: () => getTicketThread(ticketId),
    enabled: !!ticketId,
  });
};

export const useKbSearch = (query: string) => {
  return useQuery<KbSearchResponse, Error>({
    queryKey: QUERY_KEYS.kb.search(query),
    queryFn: () => searchKb(query),
    enabled: !!query.trim(),
  });
};

export const useKbCategories = () => {
  return useQuery<KbCategoriesResponse, Error>({
    queryKey: QUERY_KEYS.kb.categories,
    queryFn: getKbCategories,
  });
};

export const useKbPopularFaqs = () => {
  return useQuery<KbPopularFaqsResponse, Error>({
    queryKey: QUERY_KEYS.kb.popularFaqs,
    queryFn: getKbPopularFaqs,
  });
};

export const useKbCategoryArticles = (categoryId: string) => {
  return useQuery<KbCategoryArticlesResponse, Error>({
    queryKey: QUERY_KEYS.kb.categoryArticles(categoryId),
    queryFn: () => getKbCategoryArticles(categoryId),
    enabled: !!categoryId,
  });
};
