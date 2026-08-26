import { Paginated } from "@/types";

export const WORK_SHOP_STATUSES = ["open", "in-progress", "closed"] as const;

export type WorkShopStatus = (typeof WORK_SHOP_STATUSES)[number];

export interface WorkShop {
  id: number;
  title: string;
  description: string;
  workerNumber: number;
  leaderPhoneNumber: string;
  payedPrice: number;
  requirePrice: number;
  createdAt: Date;
  status: WorkShopStatus;
}

export interface WorkShopPayload {
  title: string;
  description: string;
  workerNumber: number;
  leaderPhoneNumber: string;
  status: WorkShopStatus;
  payedPrice: number;
}

export interface UpdateWorkShopPayload extends WorkShopPayload {
  id: number;
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

export interface WorkshopInvoices {
  invoices: InvoicePayload[];
}

export interface GetAllWorkShopsFilters {
  Search?: string;
  fromDate?: string;
  toDate?: string;
  PageNumber?: number;
  PageSize?: number;
}

export interface GetAllInvoicesFilters {
  fromDate?: string;
  toDate?: string;
}

export type GetAllWorkShopsResponse = Paginated<WorkShop>;

export interface AddInvoicePayload extends Omit<InvoicePayload, "id"> {
  workShopId: number;
}

export interface WorkShopInovcesHistory {
  toWorkShop: string;
  date: Date;
  amount: number;
  modifyedBy: string;
}

export type GetAllWorkShopInvoicesResponse = Paginated<WorkShopInovcesHistory>;
