const BASE = "engineer/requests";

export enum EngineerRequestsController {
  GetInvites = `${BASE}/get-invites`,
  GetJoinRequests = `${BASE}/get-join-requests`,
  GetStats = `${BASE}/get-stats`,
  AcceptInvite = `${BASE}/accept-invite`,
  DeclineInvite = `${BASE}/decline-invite`,
  CancelJoinRequest = `${BASE}/cancel-join-request`,
}

export const QUERY_KEYS = {
  engineerRequests: {
    all: ["engineerRequests"] as const,
    invites: () => [...QUERY_KEYS.engineerRequests.all, "invites"] as const,
    joinRequests: () =>
      [...QUERY_KEYS.engineerRequests.all, "joinRequests"] as const,
    stats: () => [...QUERY_KEYS.engineerRequests.all, "stats"] as const,
  },
};

export const MUTATION_KEYS = {
  engineerRequests: {
    respondInvite: () => ["engineerRequests", "respond-invite"] as const,
    cancelJoinRequest: () => ["engineerRequests", "cancel-join-request"] as const,
  },
};
