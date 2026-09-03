import type { ReportType } from "./types";

const BASE_REPORT_ROUTE = "report";

// ============================================================================
// Route Controller
// ============================================================================

export enum ReportController {
  CreateProgress = `${BASE_REPORT_ROUTE}/create-progress`,
  CreateAchievement = `${BASE_REPORT_ROUTE}/create-achievement`,
  CreateNeedsAndRequests = `${BASE_REPORT_ROUTE}/create-needs-and-requests`,
  GetById = `${BASE_REPORT_ROUTE}/get-by-id`,
}

// ============================================================================
// Query Key Factory
// ============================================================================

export const QUERY_KEYS = {
  reports: {
    all: ["reports"] as const,
    lists: () => [...QUERY_KEYS.reports.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...QUERY_KEYS.reports.lists(), filters] as const,
    detail: (id: number) =>
      [...QUERY_KEYS.reports.all, "detail", id] as const,
    byType: (type: ReportType) =>
      [...QUERY_KEYS.reports.all, "type", type] as const,
  },
};

// ============================================================================
// Mutation Key Factory
// ============================================================================

export const MUTATION_KEYS = {
  reports: {
    createProgress: () => ["reports", "create-progress"] as const,
    createAchievement: () => ["reports", "create-achievement"] as const,
    createNeedsAndRequests: () =>
      ["reports", "create-needs-and-requests"] as const,
  },
};
