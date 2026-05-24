export type SiteStatus = "active" | "on-hold" | "completed";
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
export type OrderRequestStatus = "pending" | "approved" | "rejected";

export interface WorkSite {
  id: string;
  name: string;
  location: string;
  manager: string;
  status: SiteStatus;
  startDate: string;
  progress: number;
}

export interface Resource {
  id: string;
  siteId: string;
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

const ph = (label: string, bg = "1e3a5f") =>
  `https://placehold.co/400x300/${bg}/ffffff?text=${encodeURIComponent(label)}`;

export const initialSites: WorkSite[] = [
  {
    id: "s1",
    name: "Horizon Tower",
    location: "Downtown, Chicago",
    manager: "Marcus Hale",
    status: "active",
    startDate: "2025-08-12",
    progress: 62,
  },
  {
    id: "s2",
    name: "Riverside Bridge Expansion",
    location: "Portland, OR",
    manager: "Elena Vargas",
    status: "active",
    startDate: "2025-11-03",
    progress: 28,
  },
  {
    id: "s3",
    name: "Greenfield Logistics Hub",
    location: "Austin, TX",
    manager: "Daniel Okafor",
    status: "on-hold",
    startDate: "2025-04-22",
    progress: 45,
  },
  {
    id: "s4",
    name: "Maple Street Residences",
    location: "Brooklyn, NY",
    manager: "Priya Shah",
    status: "active",
    startDate: "2026-01-09",
    progress: 14,
  },
  {
    id: "s5",
    name: "Solar Farm Phase II",
    location: "Phoenix, AZ",
    manager: "Liam Brennan",
    status: "completed",
    startDate: "2024-09-17",
    progress: 100,
  },
  {
    id: "s6",
    name: "Civic Center Renovation",
    location: "Denver, CO",
    manager: "Aiko Tanaka",
    status: "active",
    startDate: "2025-10-01",
    progress: 73,
  },
];

export const initialResources: Resource[] = [
  {
    id: "r1",
    siteId: "s1",
    name: "Steel Rebar #5",
    description: "High-tensile reinforcement steel bars, grade 60.",
    image: ph("Steel Rebar"),
    unitType: "ton",
    pricePerUnit: 825,
    category: "Raw Materials",
    quantity: 124,
    availability: "in-stock",
  },
  {
    id: "r2",
    siteId: "s1",
    name: "Tower Crane TC-7",
    description: "Self-erecting tower crane, 7-ton lifting capacity.",
    image: ph("Tower Crane", "0f1b3d"),
    unitType: "piece",
    pricePerUnit: 14500,
    category: "Heavy Equipment",
    quantity: 2,
    availability: "in-stock",
  },
  {
    id: "r3",
    siteId: "s1",
    name: "Portland Cement",
    description:
      "Type I/II cement, 50kg bags. Used for foundations and structural concrete.",
    image: ph("Cement", "475569"),
    unitType: "kg",
    pricePerUnit: 0.25,
    category: "Raw Materials",
    quantity: 4000,
    availability: "low-stock",
  },
  {
    id: "r4",
    siteId: "s2",
    name: "Concrete Mixer Truck",
    description: "8m³ rotating drum mixer with hydraulic discharge.",
    image: ph("Mixer Truck", "ea580c"),
    unitType: "piece",
    pricePerUnit: 320,
    category: "Vehicles",
    quantity: 5,
    availability: "in-stock",
  },
  {
    id: "r5",
    siteId: "s2",
    name: "Hydraulic Jack 50T",
    description: "Heavy-duty bottle jack rated for 50 tons.",
    image: ph("Hydraulic Jack", "334155"),
    unitType: "piece",
    pricePerUnit: 480,
    category: "Hand Tools",
    quantity: 12,
    availability: "in-stock",
  },
  {
    id: "r6",
    siteId: "s3",
    name: "Welders Crew",
    description: "Certified MIG/TIG welders, per shift hour.",
    image: ph("Welders", "1e3a5f"),
    unitType: "hour",
    pricePerUnit: 65,
    category: "Labor",
    quantity: 6,
    availability: "in-stock",
  },
  {
    id: "r7",
    siteId: "s4",
    name: "Scaffolding Set",
    description: "Modular steel scaffolding, 6m height kit.",
    image: ph("Scaffolding", "64748b"),
    unitType: "box",
    pricePerUnit: 240,
    category: "Heavy Equipment",
    quantity: 18,
    availability: "low-stock",
  },
  {
    id: "r8",
    siteId: "s6",
    name: "LED Site Lighting",
    description: "200W floodlights, IP65 rated for outdoor use.",
    image: ph("LED Lights", "f59e0b"),
    unitType: "piece",
    pricePerUnit: 95,
    category: "Electrical",
    quantity: 0,
    availability: "out-of-stock",
  },
];

export const initialOrderRequests: OrderRequest[] = [
  {
    id: "o1",
    siteId: "s1",
    name: "Drone Survey Kit",
    description: "Aerial mapping drone with RTK GPS for site topography scans.",
    image: ph("Drone Kit", "7c3aed"),
    unitType: "piece",
    pricePerUnit: 4200,
    proposedCategory: "Survey Tech",
    quantity: 1,
    requestedBy: "Marcus Hale",
    requestedAt: "2026-05-18",
    status: "pending",
  },
];
