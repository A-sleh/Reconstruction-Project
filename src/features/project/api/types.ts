import { Paginated } from "@/types";

// ============================================================================
// Enums
// ============================================================================
export type ProjectStatus =
  | "Initializing"
  | "InProgress"
  | "Suspended"
  | "Canceled"
  | "Done";

export const PROJECT_STATUSES: ProjectStatus[] = [
  "Initializing",
  "InProgress",
  "Suspended",
  "Canceled",
  "Done",
];

// ============================================================================
// Core Entities
// ============================================================================
export interface ProjectListItem {
  id: number;
  name: string;
  buildingId: number;
  investorId: number;
  date: string;
  endDate: string;
  status: ProjectStatus;
}

// ============================================================================
// API Response Wrappers
// ============================================================================
export type ProjectsResponse = Paginated<ProjectListItem>;

// ============================================================================
// Mutation Payloads
// ============================================================================
export interface DeleteProjectParams {
  id: number;
}

export interface UpdateProjectPayload {
  id: number;
  name: string;
  date: string;
  endDate: string;
  status: ProjectStatus;
}

export interface CreateProjectPayload {
  name: string;
  buildingId: number;
  date: string;
  endDate: string;
  status: ProjectStatus;
}

// ============================================================================
// Query Filters
// ============================================================================
export interface GetAllProjectsFilters {
  BuildingId?: number;
  InvestorId?: number;
  Search?: string;
  Status?: ProjectStatus;
  PageNumber?: number;
  PageSize?: number;
}

// ============================================================================
// GET /api/project/get-by-id
// ============================================================================
export interface ProjectByIdParams {
  ProjectId: number;
}
