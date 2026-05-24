import { WorkSite } from "../../work-sites/api";

export type OrderRequestStatus = "pending" | "approved" | "rejected";
export type ResourceAvailability = "in-stock" | "low-stock" | "out-of-stock";
export type UnitType =
  | "kg"
  | "ton"
  | "m"
  | "m²"
  | "m³"
  | "liter"
  | "piece"
  | "box"
  | "hour";

export const unitTypes: UnitType[] = [
  "kg",
  "ton",
  "m",
  "m²",
  "m³",
  "liter",
  "piece",
  "box",
  "hour",
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

export interface Resource {
  id: string;
  siteId: string | number;
  name: string;
  description: string;
  image: string;
  unitType: UnitType;
  pricePerUnit: number;
  category: string;
  quantity: number;
  availability: ResourceAvailability;
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
  totalResources: number;
  categories: number;
  inventoryValue: number;
  pendingOrders: number;
}

export enum WorkSiteResourcesController {
  WorkSite = "workSites",
  WorkSiteResourcesStatistics = "workSites-resources-statistics",
  OrderRequest = "orders",
}

export const QUERY_KEYS = {
  resource: (id: any) => ["resourceProvidor", "workSite","resource", id],
  statistics: ["resourceProvidor", "resorces", "statistics"],
  orders: ["resourceProvidor", "resorces", "orders"]
};

export const MUTATION_KEYS = {
  resource: {
    create: () => ["resourceProvidor", "workSites", "resource", "create"],
    update: () => ["resourceProvidor", "workSites", "resource", "update"],
    delete: () => ["resourceProvidor", "workSite", "resource", "delete"],
  },
};
