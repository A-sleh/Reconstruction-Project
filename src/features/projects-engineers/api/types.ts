import { Paginated } from "@/types";

interface IBaseFilters {
  search?: string;
  fromDate?: Date;
  toDate?: Date;
}

export const ENGINEER_SPECS = [
  "Structural Engineering",
  "Civil Engineering",
  "Architectural Design",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Site Supervision",
] as const;

export interface GetAllEngineersFilters extends IBaseFilters {
  spec?: string;
  yearsOfExperiance?: number;
  rate?: number;
  numberOfCompletedProjects?: number;
  isAvilable?: boolean;
  PageNumber?: number;
  PageSize?: number;
}

export interface EngineerSummery {
  id: number;
  fullName: string;
  imageUrl: string;
  spec: string;
  yearsOfExperiance: number;
  contactNumber: string;
  numberOfCompletedProjects: number;
  location: string;
  address: string;
  rate: number;
  isAvilable: boolean;
}

export type Engineers = Paginated<EngineerSummery>;

export interface GetEmploingRequestsFilters extends IBaseFilters {
  status?: EmploingRequestStatus;
}

export enum EmploingRequestStatus {
  PENDING,
  REJECTED,
  APPROVED,
  CANCELED,
}

export interface EmploingRequests {
  id: number;
  requestNote: string;
  engineer: EngineerSummery;
  status: EmploingRequestStatus;
  rejectedCause: string;
  approvedDate: Date;
  createdAt: Date;
}

export type EmploingRequestsPaginated = Paginated<EmploingRequests>;

export interface GetEmploersActionsLogsFilters extends IBaseFilters {
  action?: string;
}

export const ENGINEERS_PROJECT_ACTIONS = [
  "checked_in",
  "checked_out",
  "daily_report",
  "progress_update",
  "site_photos",
  "task_completed",
  "material_request",
  "invoice_added",
] as const;

export type EngineersProjectAction = (typeof ENGINEERS_PROJECT_ACTIONS)[number];

export interface EmploersActionsLogs {
  id: number;
  engineerId: EngineerSummery;
  action: EngineersProjectAction;
  description: string;
  workSite: string;
  createdAt: Date;
}

export type EmploersActionsLogsPaginated = Paginated<EmploersActionsLogs>;

export interface GetProjectEngineersPermissionsFilters extends IBaseFilters {
  permissions?: Partial<ProjectEngineerPermissionFlags>;
}

export interface Permissions {
  canViewLogs: boolean;
  canViewRequests: boolean;
  canAddEngineer: boolean;
  canRemoveEngineer: boolean;
  canApproveRequest: boolean;
  canRejectRequest: boolean;
}

export interface ProjectEngineersPermissions {
  id: number;
  projectId: number;
  permissions: Permissions;
  engineer: EngineerSummery;
}

export type ProjectEngineersPermissionsPaginated =
  Paginated<ProjectEngineersPermissions>;

// ============================================================================
// Project Engineer Permissions (module-level, per project)
// GET /api/project/get-project-members-permissions
// PUT /api/project/update-project-engineer-permissions
// ============================================================================

export interface ProjectEngineerPermissionFlags {
  canOrderResources: boolean;
  canOrderServices: boolean;
  canAddWorkshopRegistry: boolean;
  canAddOrderPayments: boolean;
  canAddWorkshopPayments: boolean;
  canManageMembers: boolean;
  canCreateReports: boolean;
  canInteractWithOrderStatus: boolean;
}

export const PROJECT_ENGINEER_PERMISSION_KEYS: (keyof ProjectEngineerPermissionFlags)[] =
  [
    "canOrderResources",
    "canOrderServices",
    "canAddWorkshopRegistry",
    "canAddOrderPayments",
    "canAddWorkshopPayments",
    "canManageMembers",
    "canCreateReports",
    "canInteractWithOrderStatus",
  ];

export interface ProjectEngineerPermissions
  extends ProjectEngineerPermissionFlags {
  projectId: number;
  engineerId: number;
}

export interface ProjectMemberPermission {
  engineerId: number;
  engineerName: string;
  permissions: ProjectEngineerPermissions;
}

export interface GetProjectMembersPermissionsParams {
  ProjectId: number;
}

export type UpdateProjectEngineerPermissionsPayload =
  ProjectEngineerPermissionFlags & {
    projectId: number;
    engineerId: number;
  };
