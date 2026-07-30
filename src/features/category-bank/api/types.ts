import { Paginated } from "@/types";

// ============================================================================
// Shared Enums & Types
// ============================================================================
export type BankItemStatus =
  | "Pending"
  | "Rejected"
  | "Resolved"
  | "Accepted"
  | "All";

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
  tags: Tag[];
  price: number;
  isAvailable: boolean;
  unit: string;
}

export interface Service {
  id: number;
  name: string;
  tags: Tag[];
  description: string;
  serviceType: Category;
}

export interface Resources extends Paginated<PureResource> {}
export interface Services extends Paginated<Service> {}

export interface BankStatResponse {
  totalResourcesBank: number;
  totalServicesBank: number;
  totalUpcomingRequest: number;
}

// ============================================================================
// Tags
// ============================================================================
export interface Tag {
  id: number;
  name: string;
}

export type TagsResponse = Tag[];

export interface AddResourceTagsParams {
  resourceId: number;
  tags: { name: string }[];
}

export interface AddServiceTagsParams {
  serviceId: number;
  tags: { name: string }[];
}

export interface RemoveResourceTagsParams {
  resourceId: number;
  tags: { name: string }[];
}

export interface RemoveServiceTagsParams {
  serviceId: number;
  tags: { name: string }[];
}

// ============================================================================
// Bank Item CRUD
// ============================================================================
export interface CreateServicePayload {
  name: string;
  description: string;
  serviceTypeId: number;
}

export interface UpdateServicePayload {
  id: number;
  name: string;
  description: string;
  serviceTypeId: number;
}

export interface CreateResourcePayload {
  name: string;
  description: string;
  categoryId: number;
}

export interface UpdateResourcePayload {
  id: number;
  name: string;
  description: string;
  categoryId: number;
}
