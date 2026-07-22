import { GetAllLandsFilters } from "./types";

const BASE_LAND_ROUTE = "land";
const BASE_INVESTOR_ROUTE = "inverstor";

export enum LandController {
  CreateLand = `${BASE_LAND_ROUTE}/create-land`,
  UpdateLand = `${BASE_LAND_ROUTE}/update-land`,
  DeleteLand = `${BASE_LAND_ROUTE}/delete-land`,
  GetLandById = `${BASE_LAND_ROUTE}/get-by-id`,
  GetAllLands = `${BASE_LAND_ROUTE}/get-all`,
  GetInvestorProperties = `${BASE_INVESTOR_ROUTE}/get-investor-properties`,
}

export const QUERY_KEYS = {
  lands: {
    all: ["lands"] as const,
    lists: () => [...QUERY_KEYS.lands.all, "list"] as const,
    list: (filters: GetAllLandsFilters) =>
      [...QUERY_KEYS.lands.lists(), filters.HasBuilding] as const,
    detail: (id: string | number) =>
      [...QUERY_KEYS.lands.all, "detail", id] as const,
    investorProperties: () =>
      [...QUERY_KEYS.lands.all, "investorProperties"] as const,
  },
};

export const MUTATION_KEYS = {
  lands: {
    create: () => ["lands", "create"],
    update: () => ["lands", "update"],
    delete: () => ["lands", "delete"],
  },
};
