export type SiteStatus = "active" | "on-hold" | "completed";
export type ResourceAvailability = "in-stock" | "low-stock" | "out-of-stock";
export type ResourceType = "Material" | "Equipment" | "Tool" | "Vehicle" | "Labor";

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
  type: ResourceType;
  quantity: number;
  unitPrice: number;
  availability: ResourceAvailability;
}

export const initialSites: WorkSite[] = [
  { id: "s1", name: "Horizon Tower", location: "Downtown, Chicago", manager: "Marcus Hale", status: "active", startDate: "2025-08-12", progress: 62 },
  { id: "s2", name: "Riverside Bridge Expansion", location: "Portland, OR", manager: "Elena Vargas", status: "active", startDate: "2025-11-03", progress: 28 },
  { id: "s3", name: "Greenfield Logistics Hub", location: "Austin, TX", manager: "Daniel Okafor", status: "on-hold", startDate: "2025-04-22", progress: 45 },
  { id: "s4", name: "Maple Street Residences", location: "Brooklyn, NY", manager: "Priya Shah", status: "active", startDate: "2026-01-09", progress: 14 },
  { id: "s5", name: "Solar Farm Phase II", location: "Phoenix, AZ", manager: "Liam Brennan", status: "completed", startDate: "2024-09-17", progress: 100 },
  { id: "s6", name: "Civic Center Renovation", location: "Denver, CO", manager: "Aiko Tanaka", status: "active", startDate: "2025-10-01", progress: 73 },
];

export const initialResources: Resource[] = [
  { id: "r1", siteId: "s1", name: "Steel Rebar #5", type: "Material", quantity: 1240, unitPrice: 8.25, availability: "in-stock" },
  { id: "r2", siteId: "s1", name: "Tower Crane TC-7", type: "Equipment", quantity: 2, unitPrice: 14500, availability: "in-stock" },
  { id: "r3", siteId: "s1", name: "Portland Cement (50kg)", type: "Material", quantity: 80, unitPrice: 12.4, availability: "low-stock" },
  { id: "r4", siteId: "s2", name: "Concrete Mixer Truck", type: "Vehicle", quantity: 5, unitPrice: 320, availability: "in-stock" },
  { id: "r5", siteId: "s2", name: "Hydraulic Jack 50T", type: "Tool", quantity: 12, unitPrice: 480, availability: "in-stock" },
  { id: "r6", siteId: "s3", name: "Welders (Crew)", type: "Labor", quantity: 6, unitPrice: 65, availability: "in-stock" },
  { id: "r7", siteId: "s4", name: "Scaffolding Set", type: "Equipment", quantity: 18, unitPrice: 240, availability: "low-stock" },
  { id: "r8", siteId: "s6", name: "LED Site Lighting", type: "Tool", quantity: 0, unitPrice: 95, availability: "out-of-stock" },
];
