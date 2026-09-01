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

// ============================================================================
// Rich Project Details (GET /api/project/get-by-id response)
// ============================================================================
export interface ProjectLocation {
  longitude: number;
  latitude: number;
}

export interface ProjectInvestor {
  id: number;
  name: string;
}

export interface ProjectCoverImage {
  id: number;
  url: string;
}

export interface ProjectBuildingLand {
  id: number;
  name: string;
}

export interface ProjectBuildingPart {
  id: number;
  area: number;
  buildingPartType: string;
}

export interface ProjectStatistics {
  totalWorkshops: number;
  totalMembers: number;
  totalOrders: number;
  totalPayments: number;
  totalPaid: number;
  remainingPayments: number;
}

export interface ProjectBuilding {
  id: number;
  name: string;
  city: string;
  streetName: string;
  address: string;
  area: number;
  readinessLevel: string;
  orientation: string;
  zoneType: number | string;
  buildingType: string;
  location: ProjectLocation;
  coverImage: ProjectCoverImage;
  land: ProjectBuildingLand;
  border: ProjectLocation[];
  buildingParts: ProjectBuildingPart[];
}

export interface ProjectDetails extends ProjectListItem {
  investor: ProjectInvestor;
  statistics: ProjectStatistics;
  building: ProjectBuilding;
}
