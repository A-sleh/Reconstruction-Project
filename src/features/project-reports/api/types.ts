import { OrderItem } from "@/features/orders/api/types";
import { Paginated } from "@/types";

export interface GetAllReportProjectFilters {
  search?: string;
  fromDate?: string;
  toDate?: string;
  ProjectReportType?: ProjectReportType;
}

export type ProjectReportType =
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "progress"
  | "services-order"
  | "resources-order";

export interface ProjectReportPayload {
  title: string;
  description: string;
  attachments: number[];
  type: ProjectReportType;
  order?: OrderItem[];
}

export interface ProjectReportResponse {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  attachments: ProjectAttachment[];
  type: ProjectReportType;
  createdAt: string;
  updatedAt: string;
  order?: OrderItem[];
}

export interface ProjectAttachment {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
}

export interface ProjectReportUpdatePayload {
  id?: number;
  title?: string;
  description?: string;
  attachments?: number[];
  type?: ProjectReportType;
}

export type ProjectReports = Paginated<ProjectReportResponse>;

// ============================================================================
// Backend report contract
// POST /api/report/create-progress
// POST /api/report/create-achievement
// POST /api/report/create-needs-and-requests
// GET  /api/report/get-by-id?ReportId={id}
// ============================================================================

export type ReportType = "Progress" | "Achievement" | "NeedsAndRequests";

export type BuildingPartType =
  | "Foundation"
  | "Column"
  | "Floor"
  | "Wall"
  | "Roof"
  | "Stairway"
  | "Other";

export interface ReportAttachmentInput {
  id: number;
  description?: string;
}

export interface CreateReportBase {
  projectId: number;
  title: string;
  description: string;
  content: string;
  reportDate: string;
  attachments: ReportAttachmentInput[];
  type: ReportType;
}

export type CreateProgressReportPayload = CreateReportBase;

export interface BuildingPartInput {
  area: number;
  buildingPartType: BuildingPartType;
  parentBuildingPartId?: number;
}

export interface CreateAchievementReportPayload extends CreateReportBase {
  buildingParts: BuildingPartInput[];
}

export interface ResourceNeed {
  resourceId: number;
  totalQuantity: number;
  status: string;
}

export interface ServiceNeed {
  serviceId: number;
  totalQuantity: number;
  status: string;
}

export interface CreateNeedsAndRequestsReportPayload extends CreateReportBase {
  resourceNeeds: ResourceNeed[];
  serviceNeeds: ServiceNeed[];
}

export interface ReportFile {
  id: number;
  url: string;
}

export interface ReportAttachment {
  id: number;
  name: string;
  file: ReportFile;
  description?: string;
}

export interface AchievedBuildingPart {
  id: number;
  area: number;
  buildingPartType: BuildingPartType;
}

export interface ReportResponse {
  id: number;
  projectId: number;
  type: ReportType;
  title: string;
  description: string;
  content: string;
  reportDate: string;
  createDate: string;
  attachments: ReportAttachment[];
  achievedBuildingParts: AchievedBuildingPart[];
}
