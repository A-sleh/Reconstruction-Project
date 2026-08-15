import { WorkSite } from "@/data/resource-providor/mockData";
import { Resource } from "./actions";
import { Paginated } from "@/types";
import { Category } from "./types";

// Re-export moved types from category-bank
export type {
  Category,
  BankCategories,
} from "@/features/category-bank/api/types";

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

export interface ServiceItem {
  serviceBankId: number;
  imageId: number;
  price: number;
  description: string;
}

export interface ServicesPayload {
  services: ServiceItem[];
  workSiteId: string | number;
}

export interface DeleteWorksiteItemParams {
  Id: number;
  ItemType: string;
}

export interface PureResource {
  id: number;
  name: string;
  imageURL: string;
  description: string;
  category: Category;
  price: number;
  isAvailable: boolean;
  unit: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  serviceType: Category;
}

export interface Resources extends Paginated<PureResource> {}
export interface Services extends Paginated<Service> {}

// ============================================================================
// Available Items (worksite/get-available-items)
// ============================================================================
export type AvailableItemType = "Resource" | "Service";

export interface AvailableItem {
  id: number;
  bankId: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  isAvailable: boolean;
  imageUrl: string;
  itemType: AvailableItemType;
  categoryId: number;
  categoryName: string;
  tags: string[];
  workSiteId: number;
  workSiteName: string;
  providerId: number;
  providerName: string;
}

export interface GetAvailableItemsParams {
  SearchTerm?: string;
  CategoryId?: number;
  Type?: AvailableItemType;
  PageNumber?: number;
  PageSize?: number;
}

export interface AvailableItemsResponse extends Paginated<AvailableItem> {}
