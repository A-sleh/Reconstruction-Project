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
