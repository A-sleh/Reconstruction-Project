import { MOCK_ORDERS } from "@/features/orders/data/mockOrders";
import type { WorkSite } from "@/features/work-sites/api/types";
import type {
  RequestStat,
  ResourceProvidorStat,
  ResourceStat,
  SiteStat,
} from "../api";

export const MOCK_SITES_STAT: SiteStat[] = [
  { id: 1, name: "Al-Razi Tower", status: "active", progress: 85 },
  { id: 2, name: "Marina Residences", status: "active", progress: 62 },
  { id: 3, name: "Al-Andalus Mall", status: "completed", progress: 100 },
  { id: 4, name: "Green Valley Villas", status: "on-hold", progress: 30 },
  { id: 5, name: "Al-Noor Hospital", status: "active", progress: 45 },
  { id: 6, name: "Coastal Apartments", status: "completed", progress: 100 },
  { id: 7, name: "Royal Heights", status: "on-hold", progress: 18 },
  { id: 8, name: "Sunrise Campuses", status: "active", progress: 72 },
];

export const MOCK_RESOURCES_STAT: ResourceStat[] = [
  {
    id: 1,
    siteId: 1,
    name: "Steel Reinforcement Bars",
    category: "Raw Materials",
    pricePerUnit: 12.5,
    quantity: 500,
    availability: "in-stock",
  },
  {
    id: 2,
    siteId: 1,
    name: "Concrete Mix",
    category: "Raw Materials",
    pricePerUnit: 85.0,
    quantity: 200,
    availability: "low-stock",
  },
  {
    id: 3,
    siteId: 2,
    name: "Ceramic Tiles",
    category: "Infrastructure",
    pricePerUnit: 2.5,
    quantity: 5000,
    availability: "in-stock",
  },
  {
    id: 4,
    siteId: 2,
    name: "Tower Crane",
    category: "Equipment",
    pricePerUnit: 250000,
    quantity: 2,
    availability: "in-stock",
  },
  {
    id: 5,
    siteId: 3,
    name: "PVC Pipes",
    category: "Infrastructure",
    pricePerUnit: 3.2,
    quantity: 1200,
    availability: "low-stock",
  },
  {
    id: 6,
    siteId: 4,
    name: "Electrical Cables",
    category: "Energy & Power",
    pricePerUnit: 9.0,
    quantity: 800,
    availability: "out-of-stock",
  },
  {
    id: 7,
    siteId: 5,
    name: "Insulation Panels",
    category: "Raw Materials",
    pricePerUnit: 18.0,
    quantity: 400,
    availability: "in-stock",
  },
  {
    id: 8,
    siteId: 6,
    name: "Concrete Mixer",
    category: "Equipment",
    pricePerUnit: 45000,
    quantity: 5,
    availability: "in-stock",
  },
  {
    id: 9,
    siteId: 7,
    name: "Glass Panels",
    category: "Raw Materials",
    pricePerUnit: 65.0,
    quantity: 120,
    availability: "low-stock",
  },
  {
    id: 10,
    siteId: 8,
    name: "Lighting Fixtures",
    category: "Energy & Power",
    pricePerUnit: 22.0,
    quantity: 0,
    availability: "out-of-stock",
  },
];

export const MOCK_REQUESTS_STAT: RequestStat[] = [
  {
    id: "RQ-1001",
    status: "completed",
    resources: [
      { resourceId: 1, quantity: 500, delivered: 500 },
      { resourceId: 2, quantity: 200, delivered: 150 },
    ],
    invoices: [
      { id: "INV-1", amount: 32175, date: "2026-07-04" },
    ],
  },
  {
    id: "RQ-1002",
    status: "partial",
    resources: [
      { resourceId: 3, quantity: 5000, delivered: 2500 },
    ],
    invoices: [
      { id: "INV-2", amount: 12500, date: "2026-07-02" },
    ],
  },
  {
    id: "RQ-1003",
    status: "pending",
    resources: [
      { resourceId: 5, quantity: 1200, delivered: 0 },
    ],
    invoices: [],
  },
  {
    id: "RQ-1004",
    status: "partial",
    resources: [
      { resourceId: 7, quantity: 400, delivered: 160 },
    ],
    invoices: [
      { id: "INV-3", amount: 7200, date: "2026-07-01" },
    ],
  },
  {
    id: "RQ-1005",
    status: "completed",
    resources: [
      { resourceId: 8, quantity: 5, delivered: 5 },
    ],
    invoices: [
      { id: "INV-4", amount: 225000, date: "2026-06-28" },
    ],
  },
  {
    id: "RQ-1006",
    status: "rejected",
    resources: [
      { resourceId: 6, quantity: 800, delivered: 0 },
    ],
    invoices: [],
  },
  {
    id: "RQ-1007",
    status: "pending",
    resources: [
      { resourceId: 9, quantity: 120, delivered: 0 },
    ],
    invoices: [],
  },
  {
    id: "RQ-1008",
    status: "partial",
    resources: [
      { resourceId: 10, quantity: 300, delivered: 100 },
    ],
    invoices: [
      { id: "INV-5", amount: 2200, date: "2026-06-25" },
    ],
  },
];

export const MOCK_RESOURCE_PROVIDOR_STAT: ResourceProvidorStat = {
  avgProgress: 64,
  fulfillmentRate: 78,
  lowStock: 4,
  pendingOrders: 2,
  totalInventoryValue: 3467700,
  totalInvoiced: 279075,
};

export const MOCK_WORK_SITES: WorkSite[] = [
  {
    id: 1,
    name: "Al-Razi Tower",
    location: "Aleppo, Syria",
    address: "Main Street",
    logo: { url: "", id: 0 },
    workSiteType: "Residential",
    status: "active",
    isActive: true,
  },
  {
    id: 2,
    name: "Marina Residences",
    location: "Damascus, Syria",
    address: "Corniche Rd",
    logo: { url: "", id: 0 },
    workSiteType: "Residential",
    status: "active",
    isActive: true,
  },
  {
    id: 3,
    name: "Al-Andalus Mall",
    location: "Homs, Syria",
    address: "Commercial District",
    logo: { url: "", id: 0 },
    workSiteType: "Commercial",
    status: "completed",
    isActive: true,
  },
  {
    id: 4,
    name: "Green Valley Villas",
    location: "Latakia, Syria",
    address: "Coastal Rd",
    logo: { url: "", id: 0 },
    workSiteType: "Villas",
    status: "on-hold",
    isActive: false,
  },
  {
    id: 5,
    name: "Al-Noor Hospital",
    location: "Aleppo, Syria",
    address: "Health District",
    logo: { url: "", id: 0 },
    workSiteType: "Medical",
    status: "active",
    isActive: true,
  },
  {
    id: 6,
    name: "Coastal Apartments",
    location: "Tartus, Syria",
    address: "Seafront",
    logo: { url: "", id: 0 },
    workSiteType: "Residential",
    status: "active",
    isActive: true,
  },
  {
    id: 7,
    name: "Royal Heights",
    location: "Damascus, Syria",
    address: "Malki",
    logo: { url: "", id: 0 },
    workSiteType: "Residential",
    status: "on-hold",
    isActive: false,
  },
  {
    id: 8,
    name: "Sunrise Campuses",
    location: "Aleppo, Syria",
    address: "University Rd",
    logo: { url: "", id: 0 },
    workSiteType: "Educational",
    status: "active",
    isActive: true,
  },
];

export const MOCK_ORDERS_STAT = MOCK_ORDERS;
