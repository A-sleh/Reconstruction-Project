/**
 * ==========================================
 * WORK SITE STATISTICS - TYPESCRIPT INTERFACES
 * ==========================================
 */

// 1. Site Statistics Interface
export type SiteStatus = "active" | "on-hold" | "completed";

export interface SiteStat {
  id: number;
  name: string;
  status: SiteStatus;
  progress: number; // Percentage (0 - 100)
}

// 2. Resource Statistics Interface
export type ResourceAvailability = "in-stock" | "low-stock" | "out-of-stock";

export interface ResourceStat {
  id: number;
  siteId: number;
  name: string;
  category: string;
  pricePerUnit: number;
  quantity: number;
  availability: ResourceAvailability;
}

// 3. Order Requests Interface
export type OrderStatus = "pending" | "approved" | "rejected";

export interface OrderRequestStat {
  id: string;
  status: OrderStatus;
  date: string; // ISO Date string (e.g., "2026-05-20")
}

// 4. Detailed Delivery Requests & Invoices Interfaces
export type RequestStatus = "completed" | "partial" | "pending" | "rejected";

export interface RequestResource {
  resourceId: number;
  quantity: number;
  delivered: number;
}

export interface RequestInvoice {
  id: string;
  amount: number;
  date: string; // ISO Date string
}

export interface RequestStat {
  id: string;
  status: RequestStatus;
  resources: RequestResource[];
  invoices: RequestInvoice[];
}

export interface ResourceProvidorStat {
  avgProgress: number;
  fulfillmentRate: number;
  lowStock: number;
  pendingOrders: number;
  totalInventoryValue: number;
  totalInvoiced: number;
}

/**
 * ==========================================
 * MASTER RESPONSE INTERFACE
 * ==========================================
 * This represents the complete JSON root structure returned by your API.
 */
export interface WorkSiteStatistics {
  sitesStat: SiteStat[];
  resourcesStat: ResourceStat[];
  orderRequestsStat: OrderRequestStat[];
  requestsStat: RequestStat[];
}

// Constants & Endpoint configurations
export enum SiteController {
  resorceProvidorStat = "service-providor-stat",
  SitesOnly = "workSites-statistics-sites",
  ResourcesOnly = "workSites-statistics-resources",
  OrdersOnly = "workSites-statistics-orders",
  RequestsOnly = "workSites-statistics-requests",
}

// Highly specific Query Keys for fine-grained cache control
export const QUERY_KEYS = {
  statistics: {
    all: ["resourceProvider", "statistics"] as const,
    resourceProvidorStat: [
      "resourceProvider",
      "statistics",
      "dashboard",
    ] as const,
    sites: () => ["resourceProvider", "statistics", "sites"] as const,
    resources: () => ["resourceProvider", "statistics", "resources"] as const,
    orders: () => ["resourceProvider", "statistics", "orders"] as const,
    requests: () => ["resourceProvider", "statistics", "requests"] as const,
  },
};
