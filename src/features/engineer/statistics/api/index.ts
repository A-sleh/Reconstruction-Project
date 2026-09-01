const BASE_ENGINEER_STATISTICS_ROUTE = "engineer/statistics";

export enum EngineerStatisticsController {
  Overview = BASE_ENGINEER_STATISTICS_ROUTE,
}

export const QUERY_KEYS = {
  engineerStatistics: {
    all: ["engineerStatistics"] as const,
    overview: () => [...QUERY_KEYS.engineerStatistics.all, "overview"] as const,
  },
};