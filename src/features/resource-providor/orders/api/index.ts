export type RequestStatus = "pending" | "partial" | "completed" | "rejected";

export interface RequestedResource {
  id: string;
  name: string;
  quantity: number;
  delivered: number;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  date: string;
}

export interface HistoryEntry {
  id: string;
  date: string;
  message: string;
}

export interface InvestorRequest {
  id: string;
  investor: string;
  email: string;
  requestDate: string;
  status: RequestStatus;
  rejectionReason?: string;
  resources: RequestedResource[];
  invoices: Invoice[];
  history: HistoryEntry[];
}

export interface InvestorRequestStat {
  pending: number;
  partial: number;
  completed: number;
  total: number;
}

export type RejectPayload = {
    reason: string
}

export enum InvestorRequestController {
  InvestorRequest = "investo-request",
  InvestorRequestStat = "investo-request-stat",
}

export const QUERY_KEYS = {
  investorReqeust: ["resourceProvidor", "investor", "requests"],
  investorReqeustStat: ["resourceProvidor", "investor", "requests", "stat"],
};

export const MUTATION_KEYS = {
  investorRequest: {
    approve: () => ["resourceProvidor", "investor", "requests", "approve"],
    cancel: () => ["resourceProvidor", "investor", "requests", "cancel"],
    delete: () => ["resourceProvidor", "workSite", "resource", "delete"],
  },
};
