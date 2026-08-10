// ============================================================================
// Enums
// ============================================================================
export type EngineerSpeciality =
  | "CIVIL"
  | "ARCHITECTURE"
  | "ELECTRICAL"
  | "MECHANICAL"
  | (string & {});

export type EngineerEmploymentType =
  | "FIRM_EMPLOYEE"
  | "FREELANCER"
  | "GOVERNMENT_EMPLOYEE"
  | (string & {});

export type EngineerVerificationStatus =
  | "VERIFIED"
  | "PENDING"
  | "REJECTED"
  | (string & {});

// ============================================================================
// Core Entities
// ============================================================================
export interface EngineerProfessionalInfo {
  specialization: EngineerSpeciality;
  licenseNumber: string;
  yearsOfExperience: number;
  bio: string;
  employmentType: EngineerEmploymentType;
}

export interface EngineerProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  photo_url: string | null;
  identifier: string;
  speciality: EngineerSpeciality;
  syndicate_id: string;
  professionalInfo: EngineerProfessionalInfo;
  verificationStatus: EngineerVerificationStatus;
}

export type EngineerProjectStatus =
  | "COMPLETED"
  | "IN_PROGRESS"
  | "PLANNING"
  | (string & {});

export interface EngineerProject {
  id: string;
  title: string;
  description: string;
  category: string;
  client: string;
  location: string;
  budget: number;
  status: EngineerProjectStatus;
  startDate: string;
  endDate: string | null;
  imageUrl: string | null;
  createdAt: string;
}
