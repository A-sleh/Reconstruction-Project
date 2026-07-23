import { GetAllBuildingsFilters } from "./types";

const BASE_BUILDING_ROUTE = "building";

export enum BuildingController {
  GetAll = `${BASE_BUILDING_ROUTE}/get-all`,
  GetById = `${BASE_BUILDING_ROUTE}/get-by-id`,
  Add = `${BASE_BUILDING_ROUTE}/add`,
  Update = `${BASE_BUILDING_ROUTE}/update`,
}

export const QUERY_KEYS = {
  buildings: {
    all: ["buildings"] as const,
    lists: () => [...QUERY_KEYS.buildings.all, "list"] as const,
    list: (filters: GetAllBuildingsFilters) =>
      [...QUERY_KEYS.buildings.lists(), filters] as const,
    detail: (id: number) =>
      [...QUERY_KEYS.buildings.all, "detail", id] as const,
  },
};

export const MUTATION_KEYS = {
  buildings: {
    create: () => ["buildings", "create"],
    update: () => ["buildings", "update"],
  },
};
