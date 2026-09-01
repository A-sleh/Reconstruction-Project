export type Property = {
  id: string;
  name: string;
  type: "building" | "land";
  location: string;
  value: number;
  status: "Operational" | "Under Construction" | "Vacant" | "Leased";
  image: string;
  area: number; // m2
  // building
  floors?: { id: string; level: number; area: number; units: number; occupancy: number }[];
  // land
  zoning?: string;
  documents?: { name: string; date: string }[];
  projects?: string[]; // project ids
};

export type Project = {
  id: string;
  name: string;
  propertyId: string;
  progress: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  stages: { id: string; name: string; status: "Done" | "Active" | "Pending"; progress: number }[];
  staff: { id: string; name: string; role: string; stage: string; permissions: { read: boolean; write: boolean; manage: boolean } }[];
  resources: { id: string; name: string; category: string; quantity: number; unit: string; cost: number; status: "In Stock" | "Ordered" | "Low" }[];
  reports: { id: string; title: string; date: string; author: string; image: string }[];
  ledger: { id: string; date: string; description: string; category: string; amount: number; status: "Paid" | "Pending" | "Overdue" }[];
};

export const properties: Property[] = [
  {
    id: "p1",
    name: "Marina Heights Tower",
    type: "building",
    location: "Dubai Marina, UAE",
    value: 48500000,
    status: "Operational",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    area: 12400,
    floors: [
      { id: "f1", level: 12, area: 1100, units: 8, occupancy: 95 },
      { id: "f2", level: 11, area: 1100, units: 8, occupancy: 88 },
      { id: "f3", level: 10, area: 1100, units: 8, occupancy: 100 },
      { id: "f4", level: 9, area: 1100, units: 8, occupancy: 75 },
      { id: "f5", level: 8, area: 1100, units: 8, occupancy: 62 },
      { id: "f6", level: 7, area: 1100, units: 8, occupancy: 90 },
    ],
  },
  {
    id: "p2",
    name: "Westfield Commercial Plaza",
    type: "building",
    location: "Riyadh, KSA",
    value: 22300000,
    status: "Leased",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    area: 8600,
    floors: [
      { id: "f1", level: 5, area: 1700, units: 12, occupancy: 100 },
      { id: "f2", level: 4, area: 1700, units: 12, occupancy: 92 },
      { id: "f3", level: 3, area: 1700, units: 12, occupancy: 84 },
      { id: "f4", level: 2, area: 1700, units: 12, occupancy: 100 },
      { id: "f5", level: 1, area: 1700, units: 6, occupancy: 100 },
    ],
  },
  {
    id: "p3",
    name: "Northgate Development Land",
    type: "land",
    location: "Abu Dhabi, UAE",
    value: 15800000,
    status: "Under Construction",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    area: 24500,
    zoning: "Mixed-use Residential / Commercial",
    documents: [
      { name: "Title Deed.pdf", date: "2023-08-12" },
      { name: "Zoning Approval.pdf", date: "2024-01-04" },
      { name: "Environmental Survey.pdf", date: "2024-03-22" },
    ],
    projects: ["proj1"],
  },
  {
    id: "p4",
    name: "Coastal Reserve Parcel",
    type: "land",
    location: "Muscat, Oman",
    value: 9200000,
    status: "Vacant",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
    area: 18200,
    zoning: "Hospitality / Resort",
    documents: [
      { name: "Title Deed.pdf", date: "2022-11-30" },
      { name: "Topographic Survey.pdf", date: "2023-02-18" },
    ],
    projects: [],
  },
  {
    id: "p5",
    name: "The Atrium Residences",
    type: "building",
    location: "Doha, Qatar",
    value: 36700000,
    status: "Under Construction",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&q=80",
    area: 9800,
    floors: [
      { id: "f1", level: 8, area: 1225, units: 6, occupancy: 0 },
      { id: "f2", level: 7, area: 1225, units: 6, occupancy: 0 },
      { id: "f3", level: 6, area: 1225, units: 6, occupancy: 0 },
      { id: "f4", level: 5, area: 1225, units: 6, occupancy: 0 },
    ],
  },
  {
    id: "p6",
    name: "Innovation Park Land",
    type: "land",
    location: "Manama, Bahrain",
    value: 6400000,
    status: "Under Construction",
    image: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=800&q=80",
    area: 14000,
    zoning: "Tech Park / Office",
    documents: [
      { name: "Title Deed.pdf", date: "2024-05-01" },
      { name: "Master Plan.pdf", date: "2024-09-12" },
    ],
    projects: ["proj2"],
  },
];

export const projects: Project[] = [
  {
    id: "proj1",
    name: "Northgate Tower A",
    propertyId: "p3",
    progress: 42,
    budget: 8500000,
    spent: 3520000,
    startDate: "2024-06-01",
    endDate: "2026-04-30",
    stages: [
      { id: "s1", name: "Site Prep & Excavation", status: "Done", progress: 100 },
      { id: "s2", name: "Foundation", status: "Done", progress: 100 },
      { id: "s3", name: "Skeleton & Structure", status: "Active", progress: 65 },
      { id: "s4", name: "MEP Installation", status: "Active", progress: 18 },
      { id: "s5", name: "Finishing", status: "Pending", progress: 0 },
      { id: "s6", name: "Handover", status: "Pending", progress: 0 },
    ],
    staff: [
      { id: "e1", name: "Eng. Omar Khalid", role: "Site Lead", stage: "Skeleton & Structure", permissions: { read: true, write: true, manage: true } },
      { id: "e2", name: "Eng. Sara Mansour", role: "Structural", stage: "Skeleton & Structure", permissions: { read: true, write: true, manage: false } },
      { id: "e3", name: "Eng. Yusuf Adel", role: "MEP Lead", stage: "MEP Installation", permissions: { read: true, write: true, manage: false } },
      { id: "e4", name: "Eng. Lina Hassan", role: "QA / Safety", stage: "Skeleton & Structure", permissions: { read: true, write: false, manage: false } },
      { id: "e5", name: "Eng. Karim Nasr", role: "Foreman", stage: "Foundation", permissions: { read: true, write: true, manage: false } },
    ],
    resources: [
      { id: "r1", name: "Portland Cement", category: "Material", quantity: 1240, unit: "tons", cost: 186000, status: "In Stock" },
      { id: "r2", name: "Steel Rebar (16mm)", category: "Material", quantity: 84, unit: "tons", cost: 92400, status: "Low" },
      { id: "r3", name: "Concrete Mix C40", category: "Material", quantity: 3200, unit: "m³", cost: 412000, status: "Ordered" },
      { id: "r4", name: "Tower Crane Rental", category: "Service", quantity: 2, unit: "units", cost: 78000, status: "In Stock" },
      { id: "r5", name: "Electrical Conduit", category: "Material", quantity: 6400, unit: "m", cost: 38400, status: "In Stock" },
      { id: "r6", name: "Site Security (Outsourced)", category: "Service", quantity: 1, unit: "contract", cost: 24000, status: "In Stock" },
    ],
    reports: [
      { id: "rp1", title: "Floor 6 slab pour completed", date: "2026-04-22", author: "Eng. Sara Mansour", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80" },
      { id: "rp2", title: "Crane B inspection passed", date: "2026-04-18", author: "Eng. Lina Hassan", image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80" },
      { id: "rp3", title: "MEP layout - Floor 4 walkthrough", date: "2026-04-10", author: "Eng. Yusuf Adel", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80" },
      { id: "rp4", title: "Foundation cure verification", date: "2026-03-28", author: "Eng. Omar Khalid", image: "https://images.unsplash.com/photo-1517089596392-fb9a9033e05b?w=600&q=80" },
    ],
    ledger: [
      { id: "l1", date: "2026-04-20", description: "Cement supply - Q2 batch", category: "Materials", amount: 186000, status: "Paid" },
      { id: "l2", date: "2026-04-15", description: "Steel rebar invoice", category: "Materials", amount: 92400, status: "Pending" },
      { id: "l3", date: "2026-04-10", description: "Crane rental - April", category: "Equipment", amount: 26000, status: "Paid" },
      { id: "l4", date: "2026-04-05", description: "Site labor - March payroll", category: "Labor", amount: 184500, status: "Paid" },
      { id: "l5", date: "2026-03-28", description: "MEP subcontractor milestone", category: "Subcontract", amount: 142000, status: "Overdue" },
      { id: "l6", date: "2026-03-20", description: "Safety equipment", category: "Other", amount: 18400, status: "Paid" },
    ],
  },
  {
    id: "proj2",
    name: "Innovation Park - Block 1",
    propertyId: "p6",
    progress: 18,
    budget: 5200000,
    spent: 940000,
    startDate: "2025-11-15",
    endDate: "2027-02-01",
    stages: [
      { id: "s1", name: "Site Prep & Excavation", status: "Active", progress: 80 },
      { id: "s2", name: "Foundation", status: "Active", progress: 22 },
      { id: "s3", name: "Skeleton & Structure", status: "Pending", progress: 0 },
      { id: "s4", name: "Finishing", status: "Pending", progress: 0 },
    ],
    staff: [
      { id: "e1", name: "Eng. Tariq Salem", role: "Site Lead", stage: "Site Prep & Excavation", permissions: { read: true, write: true, manage: true } },
      { id: "e2", name: "Eng. Mona Farouk", role: "Geotechnical", stage: "Foundation", permissions: { read: true, write: true, manage: false } },
      { id: "e3", name: "Eng. Bilal Habib", role: "QA / Safety", stage: "Site Prep & Excavation", permissions: { read: true, write: false, manage: false } },
    ],
    resources: [
      { id: "r1", name: "Excavator Rental", category: "Service", quantity: 3, unit: "units", cost: 96000, status: "In Stock" },
      { id: "r2", name: "Portland Cement", category: "Material", quantity: 320, unit: "tons", cost: 48000, status: "Ordered" },
      { id: "r3", name: "Aggregate", category: "Material", quantity: 1800, unit: "m³", cost: 54000, status: "In Stock" },
    ],
    reports: [
      { id: "rp1", title: "Initial earthworks - Sector A", date: "2026-04-12", author: "Eng. Tariq Salem", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80" },
      { id: "rp2", title: "Soil testing report filed", date: "2026-03-30", author: "Eng. Mona Farouk", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&q=80" },
    ],
    ledger: [
      { id: "l1", date: "2026-04-18", description: "Excavator rental - April", category: "Equipment", amount: 32000, status: "Paid" },
      { id: "l2", date: "2026-04-08", description: "Geotechnical survey", category: "Services", amount: 28000, status: "Paid" },
      { id: "l3", date: "2026-03-22", description: "Site office setup", category: "Other", amount: 14500, status: "Paid" },
    ],
  },
];

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

// NOTE: Marketplace deal listings & the DealListing type now live in
// src/features/investor/marketplace (mock/deals.ts, api/types.ts).