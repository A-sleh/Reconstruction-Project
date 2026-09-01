import { GetEngineerVerificationsFilters } from "./types";

const BASE = "admin/engineer-verification";

export enum EngineerVerificationController {
  GetAll = `${BASE}/get-all`,
  GetStats = `${BASE}/get-stats`,
  Approve = `${BASE}/approve`,
  Reject = `${BASE}/reject`,
}

export const QUERY_KEYS = {
  engineerVerification: {
    all: ["engineerVerification"] as const,
    lists: () =>
      [...QUERY_KEYS.engineerVerification.all, "list"] as const,
    list: (filters: GetEngineerVerificationsFilters) =>
      [...QUERY_KEYS.engineerVerification.lists(), filters] as const,
    stats: () =>
      [...QUERY_KEYS.engineerVerification.all, "stats"] as const,
  },
};

export const MUTATION_KEYS = {
  engineerVerification: {
    verify: () => ["engineerVerification", "verify"] as const,
  },
};
