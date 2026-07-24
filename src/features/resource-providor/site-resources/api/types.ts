import { Paginated } from "@/types";
import { WorkSite } from "../../work-sites/api";
import { Resource } from "./actions";

// Re-export moved types from category-bank
export type { Category, PureResource, Resources, BankCategories } from "@/features/category-bank/api/types";

export type OrderRequestStatus = "pending" | "approved" | "rejected";
export type ResourceAvailability = "in-stock" | "low-stock" | "out-of-stock";
export type UnitType =
  | "Piece"
  | "Box"
  | "Bag"
  | "Roll"
  | "Kilogram"
  | "Ton"
  | "Liter"
  | "Meter"
  | "SquareMeter"
  | "CubicMeter"
  | "Hour"
  | "Day";

export const unitTypes: UnitType[] = [
  "Piece",
  "Box",
  "Bag",
  "Roll",
  "Kilogram",
  "Ton",
  "Liter",
  "Meter",
  "SquareMeter",
  "CubicMeter",
  "Hour",
  "Day",
];
export const availabilities: ResourceAvailability[] = [
  "in-stock",
  "low-stock",
  "out-of-stock",
];
export const initialCategories: string[] = [
  "Raw Materials",
  "Heavy Equipment",
  "Hand Tools",
  "Vehicles",
  "Safety Gear",
  "Electrical",
  "Plumbing",
  "Labor",
];

export interface OrderRequest {
  id: string;
  siteId: string;
  name: string;
  description: string;
  image: string;
  unitType: UnitType;
  pricePerUnit: number;
  proposedCategory: string;
  quantity: number;
  requestedBy: string;
  requestedAt: string;
  status: OrderRequestStatus;
  rejectionReason?: string;
}

export interface SiteDetailsWithResources extends WorkSite {
  resources: Resource[];
}

export interface WorkSiteResourcesStatistics {
  amountInvoiced: number;
  quantityInvoiced: number;
  amountTotal: number;
  totalOrdered: number;
  fulfillRate: number;
  fulfillCount: number;
}

export interface ResourcesPayload {
  resources: Resource[];
  workSiteId: number | string;
}

export interface DeleteWorksiteItemParams {
  Id: number;
  ItemType: string;
}
