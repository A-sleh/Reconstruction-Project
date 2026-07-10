import { Paginated } from "@/types";

// ============================================================================
// Shared Enums & Types
// ============================================================================
export type BankItemStatus = "Pending" | string; // Extend this union as more statuses are added

// ============================================================================
// Core Entities
// ============================================================================
export interface BankItemRequest {
  id: number;
  itemName: string;
  description: string;
  providerId: number;
  providerName: string;
  categoryId: number;
  categoryName: string;
  itemType: string;
  status: BankItemStatus;
  providerNote: string;
  adminNote: string;
  resourceId: number;
  serviceId: number;
  requestedAt: string; // ISO Date string
}

// ============================================================================
// API Response Wrappers
// ============================================================================
export interface BankItemRequestsResponse {
  data: BankItemRequest[];
  pageNum: number;
  pageSize: number;
  hasNextPage: boolean;
  totalRows: number;
  isSucceeded: boolean;
  message: string;
}

// ============================================================================
// Request Filters & Payload Interfaces
// ============================================================================
export interface GetBankItemFilters {
  PageNumber?: number;
  PageSize?: number;
  // Add any query parameters required by the API route here
}

export interface ResolveRequestParams {
  requestId: number;
  existingBankItemId: number;
  tagName: string;
}

export interface RejectRequestParams {
  requestId: number;
  adminNote: string;
}

export interface ApproveRequestParams {
  RequestId: number; // Query parameter
}

export interface AddRequestParams {
  itemName: string;
  description: string;
  note: string;
  categoryId: number;
}