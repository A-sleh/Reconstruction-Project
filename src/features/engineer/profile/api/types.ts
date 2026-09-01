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
  rating: number;
  reviewsCount: number;
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

// ============================================================================
// Quick Engineer Search
// ============================================================================
export type EngineerExperienceRange = "all" | "0-2" | "3-5" | "5+";

export type EngineerSortOption = "experience" | "recent" | "name";

export interface EngineerFilters {
  query: string;
  specializations: EngineerSpeciality[];
  experienceRange: EngineerExperienceRange;
  hasPhone: boolean;
  hasEmail: boolean;
  sort: EngineerSortOption;
}

export interface EngineerSearchResult {
  userId: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  phone: string;
  email: string;
  personalIdentifier: string;
  role: string;
  id: string;
  engineerId: string;
  specialization: EngineerSpeciality;
  licenseNumber: string;
  yearsOfExperience: number;
  bio: string;
  createdAt: string;
  rating: number;
  reviewsCount: number;
}

// ============================================================================
// Public Engineer Profile
// ============================================================================
export interface PublicEngineerReview {
  id: number;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PublicEngineerProfile extends EngineerProfile {
  recentProjects: EngineerProject[];
  currentProject: EngineerProject | null;
  reviews: PublicEngineerReview[];
}

// ============================================================================
// Portfolio — Experience
// ============================================================================
export interface EngineerExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  isCurrent: boolean;
}

// ============================================================================
// Portfolio — Skills & Certifications
// ============================================================================
export interface EngineerCertification {
  id: string;
  name: string;
  issuer: string;
  year: number;
}

export interface EngineerPortfolioSkills {
  skills: string[];
  certifications: EngineerCertification[];
}
