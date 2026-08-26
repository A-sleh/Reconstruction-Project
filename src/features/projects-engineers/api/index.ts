import { GetAllEngineersFilters } from "./types";

const BASE_PROJECTS_ENGINEERS_ROUTE = "projects-engineers";

export enum ProjectsEngineersController {
  GetAll = `${BASE_PROJECTS_ENGINEERS_ROUTE}/get-all`,
}

export const QUERY_KEYS = {
  engineers: {
    all: ["projectsEngineers"] as const,
    lists: () => [...QUERY_KEYS.engineers.all, "list"] as const,
    list: (filters: GetAllEngineersFilters) =>
      [...QUERY_KEYS.engineers.lists(), filters] as const,
  },
};

export const MUTATION_KEYS = {
  engineers: {},
};
