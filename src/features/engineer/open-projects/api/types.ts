export enum EngineeringDiscipline {
  Structural = "Structural",
  Civil = "Civil",
  Architectural = "Architectural",
  Electrical = "Electrical",
  Mechanical = "Mechanical",
  Geotechnical = "Geotechnical",
  Surveying = "Surveying",
  ProjectManagement = "ProjectManagement",
}

export enum ProjectScale {
  Small = "Small",
  Mid = "Mid",
  Enterprise = "Enterprise",
}

export type OpenProjectStatus = "Open" | "ClosingSoon";

export interface OpenProject {
  id: number;
  title: string;
  thumbnailUrl: string;
  region: string;
  requiredSpecialties: EngineeringDiscipline[];
  overview: string;
  highLevelDeliverables: string[];
  requiredSkills: string[];
  scale: ProjectScale;
  durationWeeks: number;
  applicationDeadline: string;
  status: OpenProjectStatus;
  postedAt: string;
}

export interface OpenProjectsFilters {
  Search?: string;
  Specialties?: EngineeringDiscipline[];
  Scale?: ProjectScale;
  MinDurationWeeks?: number;
  MaxDurationWeeks?: number;
  DeadlineWithinDays?: number;
}

export interface ApplyToProjectPayload {
  projectId: number;
  proposal: string;
  portfolioUrl: string;
  estimatedTimelineWeeks: number;
  bidAmount: number;
}

export interface ApplyResponse {
  applicationId: number;
  status: "PENDING";
  submittedAt: string;
}

/**
 * Sensitive data — documented contract only.
 * Never included in the public OpenProject payload.
 */
export interface RestrictedProjectDetails {
  investor: { id: number; name: string; contactPhone?: string };
  budget: { total: number; paid: number; remaining: number };
  blueprints: string[];
}
