export type PropertyKind = "land" | "building";

export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED" | (string & {});

export type VerifyDecision = "APPROVED" | "REJECTED";

export interface PropertyVerificationItem {
  id: string;
  propertyId: string;
  kind: PropertyKind;
  name: string;
  address: string;
  city: string;
  zoneType: string;
  area: number;
  ownerName: string;
  ownerId: string;
  status: VerificationStatus;
  requestedAt: string;
  attachments: { id: number; name: string }[];
}

export interface PropertyVerificationStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface VerifyPropertyRequest {
  propertyId: string;
  decision: VerifyDecision;
  reason?: string;
}

export interface PropertyVerificationResponse {
  data: PropertyVerificationItem[];
  total: number;
}

export interface GetPropertyVerificationsFilters {
  kind?: PropertyKind;
  status?: VerificationStatus;
  search?: string;
  page?: number;
  limit?: number;
}
