import type { GetAgentTicketsFilters } from "./types";

const BASE_AGENT_ROUTE = "agent";

export enum AgentController {
  Stats = `${BASE_AGENT_ROUTE}/stats`,
  Tickets = `${BASE_AGENT_ROUTE}/tickets`,
  TicketMessages = `${BASE_AGENT_ROUTE}/tickets/{ticket_id}/messages`,
  TicketStatus = `${BASE_AGENT_ROUTE}/tickets/{ticket_id}/status`,
  CannedResponses = `${BASE_AGENT_ROUTE}/canned-responses`,
  CustomerTickets = `${BASE_AGENT_ROUTE}/customers/{customer_id}/tickets`,
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
};

export const MUTATION_KEYS = {
  agent: {
    sendMessage: (ticketId: string) =>
      ["agent", "tickets", ticketId, "messages"] as const,
    updateStatus: (ticketId: string) =>
      ["agent", "tickets", ticketId, "status"] as const,
  },
};
