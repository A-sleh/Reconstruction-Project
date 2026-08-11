import type { GetAgentTicketsFilters } from "./types";

const BASE_AGENT_ROUTE = "agent";
const BASE_TICKET_ROUTE = "tickets";
const BASE_KB_ROUTE = "kb";

export enum AgentController {
  Stats = `${BASE_AGENT_ROUTE}/stats`,
  Tickets = `${BASE_AGENT_ROUTE}/tickets`,
  TicketMessages = `${BASE_AGENT_ROUTE}/tickets/{ticket_id}/messages`,
  TicketStatus = `${BASE_AGENT_ROUTE}/tickets/{ticket_id}/status`,
  CannedResponses = `${BASE_AGENT_ROUTE}/canned-responses`,
  CustomerTickets = `${BASE_AGENT_ROUTE}/customers/{customer_id}/tickets`,
}

export enum TicketController {
  Thread = `${BASE_TICKET_ROUTE}/{ticket_id}`,
  Messages = `${BASE_TICKET_ROUTE}/{ticket_id}/messages`,
  Csat = `${BASE_TICKET_ROUTE}/{ticket_id}/csat`,
}

export enum KbController {
  Search = `${BASE_KB_ROUTE}/search`,
  Categories = `${BASE_KB_ROUTE}/categories`,
  PopularFaqs = `${BASE_KB_ROUTE}/faqs/popular`,
  CategoryArticles = `${BASE_KB_ROUTE}/categories/{category_id}/articles`,
}

export const QUERY_KEYS = {
  agent: {
    stats: ["agent", "stats"] as const,
    tickets: (filters?: GetAgentTicketsFilters) =>
      ["agent", "tickets", filters ?? "all"] as const,
    ticketDetails: (ticketId: string) =>
      ["agent", "tickets", ticketId] as const,
    cannedResponses: ["agent", "canned-responses"] as const,
    customerTickets: (customerId: string) =>
      ["agent", "customers", customerId, "tickets"] as const,
  },
  ticketThread: (ticketId: string) => ["tickets", ticketId] as const,
  kb: {
    search: (query: string) => ["kb", "search", query] as const,
    categories: ["kb", "categories"] as const,
    popularFaqs: ["kb", "faqs", "popular"] as const,
    categoryArticles: (categoryId: string) =>
      ["kb", "categories", categoryId, "articles"] as const,
  },
};

export const MUTATION_KEYS = {
  agent: {
    sendMessage: (ticketId: string) =>
      ["agent", "tickets", ticketId, "messages"] as const,
    updateStatus: (ticketId: string) =>
      ["agent", "tickets", ticketId, "status"] as const,
  },
  ticket: {
    sendUserMessage: (ticketId: string) =>
      ["tickets", ticketId, "messages"] as const,
    submitCsat: (ticketId: string) =>
      ["tickets", ticketId, "csat"] as const,
  },
};
