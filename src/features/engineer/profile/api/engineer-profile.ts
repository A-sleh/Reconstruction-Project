// ============================================================================
// Engineer Profile — API response types
// Mirrors the `/engineer/profile` response payload.
// ============================================================================

// Broad engineering role (maps to the EEngineeringRole enum values)
export type EngineerSpeciality =
  | "Architect"
  | "StructuralEngineer"
  | "CivilEngineer"
  | "MechanicalEngineer"
  | "ElectricalEngineer"
  | "GeotechnicalEngineer"
  | "SanitaryEngineer"
  | "FireSafetyEngineer"
  | "QuantitySurveyor"
  | "ConstructionProjectManager"
  | "RestorationArchitect"
  | "StructuralRemediationEngineer"
  | "ForensicEngineer"
  | "EnvironmentalHazmatSpecialist"
  | "UrbanPlanner"
  | (string & {});

export const ENGINEER_SPECIALITIES: EngineerSpeciality[] = [
  "Architect",
  "StructuralEngineer",
  "CivilEngineer",
  "MechanicalEngineer",
  "ElectricalEngineer",
  "GeotechnicalEngineer",
  "SanitaryEngineer",
  "FireSafetyEngineer",
  "QuantitySurveyor",
  "ConstructionProjectManager",
  "RestorationArchitect",
  "StructuralRemediationEngineer",
  "ForensicEngineer",
  "EnvironmentalHazmatSpecialist",
  "UrbanPlanner",
];

export const ENGINEER_SPECIALIZATIONS: EngineerSpecialization[] = [
  "ArchitecturalEngineer",
  "StructuralEngineer",
  "CivilEngineer",
  "MechanicalEngineer",
  "ElectricalEngineer",
  "GeotechnicalEngineer",
  "SanitaryEngineer",
  "FireSafetyEngineer",
  "QuantitySurveyor",
];

// Professional specialization (from professionalInfo.specialization)
export type EngineerSpecialization =
  | "ArchitecturalEngineer"
  | "StructuralEngineer"
  | "CivilEngineer"
  | "MechanicalEngineer"
  | "ElectricalEngineer"
  | "GeotechnicalEngineer"
  | "SanitaryEngineer"
  | "FireSafetyEngineer"
  | "QuantitySurveyor"
  | (string & {});

export type EngineerVerificationStatus =
  | "VERIFIED"
  | "PENDING"
  | "REJECTED"
  | (string & {});

export interface EngineerPhoto {
  id: number;
  url: string;
}

export interface EngineerProfessionalInfo {
  specialization: EngineerSpecialization;
  licenseNumber: string;
  yearsOfExperiece: number;
  bio: string;
}

export interface EngineerPortfolioAttachment {
  id: number;
  fileId: number;
  url: string;
  description: string;
}

export interface EngineerPortfolio {
  id: number;
  title: string;
  description: string;
  year: number;
  projectId: number;
  attachments: EngineerPortfolioAttachment[];
}

export interface EngineerProjectRef {
  projectId: number;
  projectName: string;
}

export interface EngineerProfile {
  engineerId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  photo: EngineerPhoto | null;
  identifier: string;
  syndicateId: number;
  speciality: EngineerSpeciality;
  professionalInfo: EngineerProfessionalInfo;
  verificationStatus: EngineerVerificationStatus;
  numberOfProjectsContributed: number;
  portfolios: EngineerPortfolio[];
  projects: EngineerProjectRef[];
}
