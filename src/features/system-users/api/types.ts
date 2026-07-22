import { Paginated } from "@/types";

// ============================================================================
// Enums
// ============================================================================
export type SystemUserRole = "Provider" | "Investor" | "Engineer";

// ============================================================================
// Core Entities
// ============================================================================
export interface SystemUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: SystemUserRole;
  personalIdentifier: string;
  avatarUrl: string;
  isActive: boolean;
}

// ============================================================================
// API Response Wrappers
// ============================================================================
export interface SystemUsersResponse extends Paginated<SystemUser> {}

export interface SystemUserStats {
  investors: number;
  resourceProviders: number;
  serviceProviders: number;
  engineers: number;
}

// ============================================================================
// Query Filters
// ============================================================================
export interface GetAllSystemUsersFilters {
  Search?: string;
  Role?: SystemUserRole;
  PageNumber?: number;
  PageSize?: number;
}
