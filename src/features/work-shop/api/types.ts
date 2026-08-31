import { Paginated } from "@/types";

export const WORK_SHOP_STATUSES = [
  "Pending",
  "InProgress",
  "Completed",
  "Canceled",
] as const;

export type WorkShopStatus = (typeof WORK_SHOP_STATUSES)[number];

/** Shared shape used inside add/update workshop payloads. */
export interface WorkShopPayload {
  id: number;
  jobTitle: string;
  memberNumber: number;
  totalCost: number;
  startWorkDate: string;
  endWorkDate: string;
  supervisorPhoneNumber: string;
  description: string;
  status: WorkShopStatus;
}

/** Workshop returned by GET /api/project/get-project-workshops. */
export interface WorkShop {
  id: number;
  name: string;
  totalCost: number;
  costPaid: number;
  remaining: number;
  memberNumber: number;
  startWorkDate: string;
  endWorkDate: string;
  supervisorPhoneNumber: string;
  description: string;
  status: WorkShopStatus;
}

export interface WorkShopsTotals {
  totalCost: number;
  totalPaid: number;
  totalRemaining: number;
}

export interface GetAllWorkShopsResponse extends Paginated<WorkShop> {
  totals: WorkShopsTotals;
}

export interface GetAllWorkShopsFilters {
  ProjectId?: number;
  Search?: string;
  fromDate?: string;
  toDate?: string;
  PageNumber?: number;
  PageSize?: number;
}

// ============================================================================
// Mutation payloads
// ============================================================================
export interface AddWorkShopsPayload {
  projectId: number;
  workShops: WorkShopPayload[];
}

export interface UpdateWorkShopPayload {
  workshop: WorkShopPayload;
}

export interface DeleteWorkShopParams {
  id: number;
}

export interface AddWorkShopPaymentPayload {
  projectId: number;
  workshopId: number;
  amount: number;
  paymentDate: string;
}

// ============================================================================
// Invoice types (payment-history endpoint is not available yet)
// ============================================================================
export interface WorkshopInvoices {
  invoices: InvoicePayload[];
}

export interface WorkShopInvoice {
  id: number;
  data: Date;
  description: string;
  payedAmount: number;
}

export interface InvoicePayload extends WorkShopInvoice {
  attachments: number[];
}

export interface AddInvoicePayload {
  projectId: number;
  workshopId: number;
  amount: number;
  paymentDate: Date;
}

export interface WorkShopInovcesHistory {
  toWorkShop: string;
  date: Date;
  amount: number;
  modifyedBy: string;
}

export interface GetAllInvoicesFilters {
  fromDate?: string;
  toDate?: string;
}
