import { Paginated } from "@/types";

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
