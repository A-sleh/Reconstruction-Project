import { Paginated } from "@/types";
import { WorkSite } from "../../work-sites/api";
import { Resource } from "./actions";

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

interface Category {
  id: number;
  name: string;
}

interface PureResource {
  id: number;
  name: string;
  imageURL: string;
  description: string;
  category: Category;
  price: number;
  unit: UnitType;
}
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

export interface BankCategories {
  categories: Category[];
}

export interface Resources extends Paginated<PureResource> {}

export interface ResourcesPayload {
  resources: Resource[];
  workSiteId: number | string;
}

export enum WorkSiteResourcesController {
  BankCategories = "bank/get-bank-categories",
  Resources = "bank/get-resources",
  WorkSiteResources = "worksite/get-resource",
  AddResources = "worksite/add-resources",
  delelteResource = "worksite/delete-item",
  WorkSiteResourcesStatistics = "worksite/order-statistic",
  updateWorkSite = "worksite/update-resource",

  OrderRequest = "orders",
}

export const QUERY_KEYS = {
  resource: (id: any) => ["resourceProvidor", "workSite", "resource", id],
  resources: ["resourceProvidor", "workSite", "resources"],
  bankCategories: ["resourceProvidor", "resorces", "bank-categories"],
  statistics: ["resourceProvidor", "resorces", "statistics"],
  orders: ["resourceProvidor", "resorces", "orders"],
};

export const MUTATION_KEYS = {
  resource: {
    create: () => ["resourceProvidor", "workSites", "resource", "create"],
    update: () => ["resourceProvidor", "workSites", "resource", "update"],
    delete: () => ["resourceProvidor", "workSite", "resource", "delete"],
  },
};
