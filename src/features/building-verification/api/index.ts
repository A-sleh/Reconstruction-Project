import type { GetPropertyVerificationsFilters } from "./types";

const BASE = "admin/property-verification";

export enum PropertyVerificationController {
  GetAll = `${BASE}/get-all`,
  GetStats = `${BASE}/get-stats`,
  Approve = `${BASE}/approve`,
  Reject = `${BASE}/reject`,
}

export const QUERY_KEYS = {
  propertyVerification: {
    all: ["propertyVerification"] as const,
    lists: () => [...QUERY_KEYS.propertyVerification.all, "list"] as const,
    list: (filters: GetPropertyVerificationsFilters) =>
      [...QUERY_KEYS.propertyVerification.lists(), filters] as const,
    stats: () => [...QUERY_KEYS.propertyVerification.all, "stats"] as const,
  },
};

export const MUTATION_KEYS = {
  propertyVerification: {
    verify: () => ["propertyVerification", "verify"] as const,
  },
};
