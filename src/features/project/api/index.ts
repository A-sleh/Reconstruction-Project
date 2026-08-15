import { GetAllProjectsFilters } from "./types";

const BASE_PROJECT_ROUTE = "project";

export enum ProjectController {
  GetAll = `${BASE_PROJECT_ROUTE}/get-all`,
  GetById = `${BASE_PROJECT_ROUTE}/get-by-id`,
  Delete = `${BASE_PROJECT_ROUTE}/delete-project`,
  Update = `${BASE_PROJECT_ROUTE}/update-project`,
  Create = `${BASE_PROJECT_ROUTE}/create-project`,
}

export const QUERY_KEYS = {
  projects: {
    all: ["projects"] as const,
    lists: () => [...QUERY_KEYS.projects.all, "list"] as const,
    list: (filters: GetAllProjectsFilters) =>
      [...QUERY_KEYS.projects.lists(), filters] as const,
    detail: (projectId: number) =>
      [...QUERY_KEYS.projects.all, "detail", projectId] as const,
  },
};

export const MUTATION_KEYS = {
  projects: {
    create: () => ["projects", "create"],
    update: () => ["projects", "update"],
    delete: () => ["projects", "delete"],
  },
};
