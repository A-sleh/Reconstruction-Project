export type EngineerInviteStatus = "PENDING" | "ACCEPTED" | "DECLINED" | (string & {});
export type EngineerJoinRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELED" | (string & {});

export interface EngineerInvite {
  id: string;
  fromName: string;
  fromTitle: string;
  avatarUrl?: string;
  projectId: string;
  projectName: string;
  workSiteName: string;
  message: string;
  compensation: string;
  sentAt: string;
  status: EngineerInviteStatus;
}

export interface EngineerJoinRequest {
  id: string;
  projectId: string;
  projectName: string;
  workSiteName: string;
  note: string;
  status: EngineerJoinRequestStatus;
  sentAt: string;
  repliedAt?: string;
  rejectionReason?: string;
}

export interface EngineerRequestsStats {
  invites: { pending: number; accepted: number; declined: number; total: number };
  requests: { pending: number; approved: number; rejected: number; canceled: number; total: number };
}

export type InviteDecision = "ACCEPTED" | "DECLINED";
