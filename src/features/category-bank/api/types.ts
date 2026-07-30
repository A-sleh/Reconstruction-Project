import { Paginated } from "@/types";

// ============================================================================
// Shared Enums & Types
// ============================================================================
export type BankItemStatus = "Pending" | "Rejected" | "Resolved" | "Accepted" | "All";

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
export interface BankItemRequestsResponse extends Paginated<BankItemRequest> {}

// ============================================================================
// Request Filters & Payload Interfaces
// ============================================================================
export interface GetBankItemFilters {
  PageNumber?: number;
  PageSize?: number;
  Search?: string;
  Status?: BankItemStatus;
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

// ============================================================================
// Bank Categories & Resources (moved from site-resources/api)
// ============================================================================
export interface Category {
  id: number;
  name: string;
}

export interface CategoryPayload {
  name: string;
}

export interface BankCategories {
  categories: Category[];
}

export interface PureResource {
  id: number;
  name: string;
  imageURL: string;
  description: string;
  category: Category;
  price: number;
  isAvailable: boolean;
  unit: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  serviceType: Category;
}

export interface Resources extends Paginated<PureResource> {}
export interface Services extends Paginated<Service> {}
