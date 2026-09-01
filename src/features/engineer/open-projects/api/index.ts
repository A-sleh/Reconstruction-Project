import type { OpenProjectsFilters } from "./types";
import type { ApplyToProjectPayload, ApplyResponse } from "./types";
import { MOCK_OPEN_PROJECTS } from "../mock/openProjects";

const BASE_ROUTE = "engineer/open-projects";

export const OpenProjectsController = {
  GetAll: `${BASE_ROUTE}/get-all`,
  GetById: `${BASE_ROUTE}/get-by-id`,
  Apply: `${BASE_ROUTE}/apply`,
} as const;

export const QUERY_KEYS = {
  openProjects: {
    all: ["openProjects"] as const,
    lists: () => [...QUERY_KEYS.openProjects.all, "list"] as const,
    list: (filters: OpenProjectsFilters) =>
      [...QUERY_KEYS.openProjects.lists(), filters] as const,
    detail: (id: number) =>
      [...QUERY_KEYS.openProjects.all, "detail", id] as const,
  },
};

export const MUTATION_KEYS = {
  openProjects: {
    apply: () => ["openProjects", "apply"] as const,
  },
};

// Mock-backed (swap real fetch for ApiInstance when backend is ready)
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getOpenProjects() {
  await delay(350);
  return MOCK_OPEN_PROJECTS;
}

export async function getOpenProjectById(id: number) {
  await delay(200);
  return MOCK_OPEN_PROJECTS.find((p) => p.id === id);
}

export async function submitApplication(
  payload: ApplyToProjectPayload,
): Promise<ApplyResponse> {
  const _ = payload;
  await delay(1200);
  return {
    applicationId: Math.floor(1000 + Math.random() * 9000),
    status: "PENDING",
    submittedAt: new Date().toISOString(),
  };
}
