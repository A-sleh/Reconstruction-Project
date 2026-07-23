import { Paginated } from "@/types";

export enum EZoningType {
  Residential = 0,
  Commercial = 1,
  Agricultural = 2,
  Industrial = 3,
  MixedUse = 4,
  Hospitality = 5,
  Office = 6,
  TechPark = 7,
}

export interface GetAllLandsFilters {
  HasBuilding: boolean;
  PageNumber?: number;
  PageSize?: number;
}

export const ZONING_LABELS: Record<EZoningType, string> = {
  [EZoningType.Residential]: "Residential",
  [EZoningType.Commercial]: "Commercial",
  [EZoningType.Agricultural]: "Agricultural",
  [EZoningType.Industrial]: "Industrial",
  [EZoningType.MixedUse]: "Mixed Use",
  [EZoningType.Hospitality]: "Hospitality",
  [EZoningType.Office]: "Office",
  [EZoningType.TechPark]: "Tech Park",
};

export interface ILoncation {
  longitude: number;
  latitude: number;
}

export interface Land {
  id: string;
  name: string;
  border: string[];
  isValidated: boolean;
  zoning: EZoningType;
  accessability: boolean;
  address: string;
  area: number;
  location: string;
  coverImageUrl: string;
}
export interface LandListItem {
  id: string;
  landId: string;
  name: string;
  border: ILoncation[];
  isValidated: boolean;
  zoningType: EZoningType;
  accessability: boolean;
  address: string;
  area: number;
  location: ILoncation;
  coverImageUrl: string;
}

export interface LandFormValues {
  name: string;
  border: string[];
  isValidated: boolean;
  zoning: EZoningType;
  accessability: boolean;
  address: string;
  area: number;
  location: string;
  coverImageId: string;
}

export interface CreateLandRequest extends LandFormValues {}
export interface UpdateLandRequest extends LandFormValues {
  id: string;
}

export interface LandResponse {
  data: Land;
  message: string;
  isSuccess: boolean;
}

export interface InvestorPropertiesSummary {
  totalBuidlings: number;
  totalLands: number;
  allOpenedProjects: number;
}

export interface LandsResponse extends Paginated<LandListItem> {}
