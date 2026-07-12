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

// ============= Marketplace Deals (maps to deal/land/building tables) =============

export type DealListing = {
  id: string;
  kind: "land" | "building";
  price: number;
  dealArea: number;
  terms?: string;
  ownerId: string;
  isValidated: boolean;
  createdAt: string;
  lat: number;
  lng: number;
  image: string;
  // land fields
  land?: {
    location: string;
    address: string;
    area: number;
    border: string;
    zoning: string;
    accessibility: string;
  };
  // building fields
  building?: {
    city: string;
    streetName: string;
    address: string;
    zoneType: "Residential" | "Commercial" | "Mixed-use" | "Industrial" | "Hospitality";
    readinessLevel: "Shell & Core" | "Semi-finished" | "Fully Finished" | "Under Construction";
    orientation: string;
    buildingType: string;
    landIdRef?: string;
    area: number;
  };
};

export const dealListings: DealListing[] = [
  {
    id: "d1",
    kind: "building",
    price: 4250000,
    dealArea: 1850,
    terms: "Cash or 30% down, 24-month installments",
    ownerId: "u_inv_104",
    isValidated: true,
    createdAt: "2026-05-22",
    lat: 25.0763,
    lng: 55.1392,
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=900&q=80",
    building: {
      city: "Dubai",
      streetName: "Al Sufouh Road",
      address: "Tower 12, Al Sufouh Road, Dubai Marina",
      zoneType: "Residential",
      readinessLevel: "Fully Finished",
      orientation: "NW",
      buildingType: "Mid-rise Apartment",
      area: 1850,
    },
  },
  {
    id: "d2",
    kind: "land",
    price: 2100000,
    dealArea: 6400,
    terms: "Outright sale, clear title",
    ownerId: "u_inv_211",
    isValidated: true,
    createdAt: "2026-05-10",
    lat: 24.4539,
    lng: 54.3773,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80",
    land: {
      location: "Abu Dhabi - Khalifa City",
      address: "Plot 88, Sector E-22, Khalifa City",
      area: 6400,
      border: "Bounded N: arterial road, S: green belt, E: villa plots, W: utility easement",
      zoning: "Residential Villa",
      accessibility: "Direct paved road access, utilities at boundary",
    },
  },
  {
    id: "d3",
    kind: "building",
    price: 9750000,
    dealArea: 4200,
    terms: "Negotiable, partial seller financing available",
    ownerId: "u_inv_087",
    isValidated: false,
    createdAt: "2026-06-02",
    lat: 24.7136,
    lng: 46.6753,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80",
    building: {
      city: "Riyadh",
      streetName: "King Fahd Road",
      address: "Block 4, King Fahd Road, Olaya District",
      zoneType: "Commercial",
      readinessLevel: "Shell & Core",
      orientation: "E",
      buildingType: "Office Tower",
      area: 4200,
    },
  },
  {
    id: "d4",
    kind: "land",
    price: 5400000,
    dealArea: 12800,
    ownerId: "u_inv_142",
    isValidated: true,
    createdAt: "2026-04-18",
    lat: 23.5880,
    lng: 58.3829,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80",
    land: {
      location: "Muscat - Al Mouj",
      address: "Coastal Parcel CR-09, Al Mouj",
      area: 12800,
      border: "Bounded N: marina promenade, S: ring road, E: parcel CR-10, W: beach reserve",
      zoning: "Hospitality / Resort",
      accessibility: "Two paved frontages, sea-front access",
    },
  },
  {
    id: "d5",
    kind: "building",
    price: 1850000,
    dealArea: 920,
    terms: "Quick sale, vacant on transfer",
    ownerId: "u_inv_311",
    isValidated: false,
    createdAt: "2026-06-12",
    lat: 25.2854,
    lng: 51.5310,
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=900&q=80",
    building: {
      city: "Doha",
      streetName: "Al Sadd Street",
      address: "Villa 14, Al Sadd Street, West Bay",
      zoneType: "Mixed-use",
      readinessLevel: "Semi-finished",
      orientation: "S",
      buildingType: "Townhouse",
      area: 920,
    },
  },
  {
    id: "d6",
    kind: "land",
    price: 980000,
    dealArea: 3200,
    terms: "Open to JV / development partnership",
    ownerId: "u_inv_055",
    isValidated: true,
    createdAt: "2026-03-30",
    lat: 26.2235,
    lng: 50.5876,
    image: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=900&q=80",
    land: {
      location: "Manama - Seef District",
      address: "Lot 207, Seef District",
      area: 3200,
      border: "Bounded N: commercial strip, S: service road, E: lot 208, W: lot 206",
      zoning: "Tech Park / Office",
      accessibility: "Service road frontage, fiber + power available",
    },
  },
  {
    id: "d7",
    kind: "building",
    price: 6300000,
    dealArea: 2750,
    ownerId: "u_inv_198",
    isValidated: true,
    createdAt: "2026-05-28",
    lat: 29.3759,
    lng: 47.9774,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80",
    building: {
      city: "Kuwait City",
      streetName: "Arabian Gulf Street",
      address: "Building 7, Arabian Gulf Street, Salmiya",
      zoneType: "Hospitality",
      readinessLevel: "Fully Finished",
      orientation: "NE",
      buildingType: "Boutique Hotel",
      area: 2750,
    },
  },
  {
    id: "d8",
    kind: "land",
    price: 3650000,
    dealArea: 8900,
    ownerId: "u_inv_233",
    isValidated: false,
    createdAt: "2026-06-18",
    lat: 21.4858,
    lng: 39.1925,
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80",
    land: {
      location: "Jeddah - North Obhur",
      address: "Parcel NO-47, North Obhur",
      area: 8900,
      border: "Bounded N: corniche, S: highway 110, E: parcel NO-48, W: parcel NO-46",
      zoning: "Mixed-use Residential / Commercial",
      accessibility: "Highway exit at 400m, 2 frontages",
    },
  },
];