import { Paginated } from "@/types";

export const ENGINEER_SPECS = [
  "Structural Engineering",
  "Civil Engineering",
  "Architectural Design",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Site Supervision",
] as const;

export interface GetAllEngineersFilters {
  search?: string;
  spec?: string;
  yearsOfExperiance?: number;
  rate?: number;
  numberOfCompletedProjects?: number;
  isAvilable?: boolean;
  PageNumber?: number;
  PageSize?: number;
}

export interface EngineerSummery {
  id: number;
  fullName: string;
  imageUrl: string;
  spec: string;
  yearsOfExperiance: number;
  contactNumber: string;
  numberOfCompletedProjects: number;
  location: string;
  address: string;
  rate: number;
  isAvilable: boolean;
}

export type Engineers = Paginated<EngineerSummery>;
