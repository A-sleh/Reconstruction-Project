import type { Role } from "@/types";

export type TicketPriority = "urgent" | "high" | "medium" | "low";

export type TicketStatus =
  | "open"
  | "in_progress"
  | "pending_customer"
  | "resolved"
  | "closed";

export type SenderType = "customer" | "agent";

// ============================================================================
// 1. Agent Dashboard / Stats
// ============================================================================
export interface AgentStats {
  open_tickets: number;
  pending_customer: number;
  urgent_tickets: number;
  resolved_today: number;
}

// ============================================================================
// 2. Agent Inbox
// ============================================================================
export interface AgentTicket {
  ticket_id: string;
  customer_name: string;
  customer_role: Role;
  subject: string;
  priority: TicketPriority;
  status: TicketStatus;
  sla_due_in_minutes: number;
}

export interface AgentTicketsResponse {
  data: AgentTicket[];
  total: number;
  page: number;
}

export interface GetAgentTicketsFilters {
  status?: TicketStatus;
  priority?: TicketPriority;
  search?: string;
  page?: number;
  limit?: number;
}

// ============================================================================
// 3. Ticket Details Workspace
// ============================================================================
export interface TicketCustomer {
  id: string;
  name: string;
  role: Role;
  email: string;
  join_date: string;
  previous_tickets_count: number;
}

export interface TicketMessage {
  id: number;
  sender_type: SenderType;
  sender_name: string;
  content: string;
  is_internal_note: boolean;
  created_at: string;
}

export interface TicketDetails {
  ticket_id: string;
  subject: string;
  department: string;
  status: TicketStatus;
  priority: TicketPriority;
  customer: TicketCustomer;
  messages: TicketMessage[];
}

// ============================================================================
// 4. Ticket Actions
// ============================================================================
export interface SendTicketMessagePayload {
  content: string;
  is_internal_note: boolean;
}

export interface UpdateTicketStatusPayload {
  status: TicketStatus;
}

// ============================================================================
// 5. Canned Responses
// ============================================================================
export interface CannedResponse {
  id: string;
  title: string;
  content: string;
}

export interface CannedResponsesResponse {
  data: CannedResponse[];
}

// ============================================================================
// 6. Customer History
// ============================================================================
export interface CustomerTicket {
  ticket_id: string;
  subject: string;
  status: TicketStatus;
  resolved_at: string | null;
}

export interface CustomerTicketsResponse {
  data: CustomerTicket[];
}

// ============================================================================
// 7. User Ticket Thread View (CSAT)
// ============================================================================
export interface UserTicketMessage {
  id: number;
  sender_type: SenderType;
  sender_name: string;
  avatar_initial: string;
  content: string;
  created_at: string;
}

export interface TicketThread {
  ticket_id: string;
  subject: string;
  department: string;
  priority: TicketPriority;
  status: TicketStatus;
  can_rate: boolean;
  messages: UserTicketMessage[];
}

export interface SendUserMessagePayload {
  content: string;
}

export interface CsatPayload {
  rating: number;
  feedback_comment?: string;
}

export interface CsatResponse {
  status: string;
  message: string;
}

// ============================================================================
// 8. Knowledge Base & FAQ Portal
// ============================================================================
export interface KbSearchResult {
  article_id: number;
  title: string;
  category: string;
  snippet: string;
}

export interface KbSearchResponse {
  results: KbSearchResult[];
}

export interface KbCategory {
  id: string;
  title: string;
  description: string;
  articles_count: number;
  icon: string;
}

export interface KbCategoriesResponse {
  categories: KbCategory[];
}

export interface KbFaq {
  id: number;
  question: string;
  answer: string;
}

export interface KbPopularFaqsResponse {
  faqs: KbFaq[];
}

export interface KbCategoryArticle {
  id: number;
  title: string;
  views_count: number;
}

export interface KbCategoryArticlesResponse {
  category_id: string;
  category_title: string;
  articles: KbCategoryArticle[];
}
