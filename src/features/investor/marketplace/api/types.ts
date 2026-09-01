export type DealKind = "land" | "building";

export interface DealListing {
  id: string;
  kind: DealKind;
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
    zoneType:
      | "Residential"
      | "Commercial"
      | "Mixed-use"
      | "Industrial"
      | "Hospitality";
    readinessLevel:
      | "Shell & Core"
      | "Semi-finished"
      | "Fully Finished"
      | "Under Construction";
    orientation: string;
    buildingType: string;
    landIdRef?: string;
    area: number;
  };
}

export interface GetMarketplaceListingsFilters {
  search?: string;
  kind?: DealKind | "all";
  verifiedOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  sort?: string;
}
