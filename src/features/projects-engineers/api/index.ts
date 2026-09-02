import { GetAllEngineersFilters } from "./types";

const BASE_PROJECTS_ENGINEERS_ROUTE = "projects-engineers";
const BASE_PROJECT_ROUTE = "project";

export enum ProjectsEngineersController {
  GetAll = `${BASE_PROJECTS_ENGINEERS_ROUTE}/get-all`,
}

export enum ProjectPermissionsController {
  GetMembersPermissions = `${BASE_PROJECT_ROUTE}/get-project-members-permissions`,
  UpdateEngineerPermissions = `${BASE_PROJECT_ROUTE}/update-project-engineer-permissions`,
}

export const QUERY_KEYS = {
  engineers: {
    all: ["projectsEngineers"] as const,
    lists: () => [...QUERY_KEYS.engineers.all, "list"] as const,
    list: (filters: GetAllEngineersFilters) =>
      [...QUERY_KEYS.engineers.lists(), filters] as const,
    permissions: (projectId: number) =>
      [...QUERY_KEYS.engineers.all, "permissions", projectId] as const,
  },
};

export const MUTATION_KEYS = {
  engineers: {
    updatePermissions: () => ["projectsEngineers", "update-permissions"],
  },
};
