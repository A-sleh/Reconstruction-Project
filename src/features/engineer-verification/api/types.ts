export type EngineerVerificationStatus =
  | "PENDING"
  | "VERIFIED"
  | "REJECTED"
  | (string & {});

export type EngineerVerifyDecision = "VERIFIED" | "REJECTED";

export interface EngineerVerificationItem {
  id: string;
  engineerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  speciality: string;
  syndicateId: string;
  licenseNumber: string;
  yearsOfExperience: number;
  specialization: string;
  status: EngineerVerificationStatus;
  createdAt: string;
  submittedDocs: { id: string; name: string }[];
}

export interface EngineerVerificationStats {
  pending: number;
  verified: number;
  rejected: number;
  total: number;
}

export interface VerifyEngineerRequest {
  engineerId: string;
  decision: EngineerVerifyDecision;
  reason?: string;
}

export interface EngineerVerificationResponse {
  data: EngineerVerificationItem[];
  total: number;
}

export interface GetEngineerVerificationsFilters {
  status?: EngineerVerificationStatus;
  search?: string;
  page?: number;
  limit?: number;
}
