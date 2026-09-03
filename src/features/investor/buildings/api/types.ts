import { Paginated } from "@/types";

// ============================================================================
// Enums
// ============================================================================
export type BuildingType =
  | "Residential"
  | "Commercial"
  | "Industrial"
  | "Administrative"
  | "Educational"
  | "Healthcare"
  | "Religious"
  | "MixedUse"
  | "Infrastructure"
  | "Other";

export type BuildingPartType =
  | "Floor"
  | "Room"
  | "Bathroom"
  | "Office"
  | "Kitchen"
  | "Roof"
  | "Hall";

// ============================================================================
// Core Entities
// ============================================================================
export interface BuildingAttachment {
  id: number;
  name: string;
  url: string;
  description: string;
}

export interface BuildingPart {
  id: number;
  area: number;
  name: string;
  buildingPartType: BuildingPartType;
  subParts: BuildingPart[];
}

export interface ILoncation {
  longitude: number;
  latitude: number;
}

export interface BuildingListItem {
  landId: number;
  buildingId: number;
  name: string;
  city: string;
  streetName: string;
  zoneType: string;
  readinessLevel: string;
  orientation: string;
  buildingType: BuildingType;
  area: number;
  address: string;
  location: ILoncation;
  coverImageUrl: string;
  updateAt: string;
  buildingParts: BuildingPart[];
  attachments: BuildingAttachment[];
}

export interface BuildingDetails extends BuildingListItem {}

// ============================================================================
// API Response Wrappers
// ============================================================================
export interface BuildingsResponse extends Paginated<BuildingListItem> {}

// ============================================================================
// Query Filters
// ============================================================================
export interface GetAllBuildingsFilters {
  Search?: string;
  BuildingType?: BuildingType;
  PageNumber?: number;
  PageSize?: number;
}

// ============================================================================
// Request Bodies
// ============================================================================
export interface CreateBuildingRequest {
  name: string;
  landId: number;
  city: string;
  streetName: string;
  address: string;
  area: number;
  buildingType: BuildingType;
  orientation: string;
  location: string;
  coverImageId: number;
  buildingBorder: string[];
  attachments: { id: number; description: string }[];
}

export interface UpdateBuildingRequest {
  buildingId: number;
  name: string;
  streetName: string;
  area: number;
  location: string;
  coverImageId: number;
  buildingParts: {
    id: number;
    area: number;
    buildingPartType: BuildingPartType;
  }[];
  attachments: { id: number; description: string }[];
}
