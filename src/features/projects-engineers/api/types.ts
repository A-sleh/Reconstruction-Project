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

export interface GetEmploingRequestsFilters {
  search?: string;
  fromDate?: Date;
  toDate?: Date;
  status?: EmploingRequestStatus;
}

export enum EmploingRequestStatus {
  PENDING,
  REJECTED,
  APPROVED,
  CANCELED,
}

export interface EmploingRequests {
  id: number;
  requestNote: string;
  engineer: EngineerSummery;
  status: EmploingRequestStatus;
  rejectedCause: string;
  approvedDate: Date;
  createdAt: Date;
}

export type EmploingRequestsPaginated = Paginated<EmploingRequests>;
