import { GetAllSystemUsersFilters } from "./types";

const BASE_SYSTEM_USER_ROUTE = "admin/system-user";

export enum SystemUserController {
  GetAll = `${BASE_SYSTEM_USER_ROUTE}/get-all`,
  GetStats = `${BASE_SYSTEM_USER_ROUTE}/get-stats`,
  Activate = `${BASE_SYSTEM_USER_ROUTE}/activate`,
  Deactivate = `${BASE_SYSTEM_USER_ROUTE}/deactivate`,
}

export const QUERY_KEYS = {
  systemUsers: {
    all: ["systemUsers"] as const,
    lists: () => [...QUERY_KEYS.systemUsers.all, "list"] as const,
    list: (filters: GetAllSystemUsersFilters) =>
      [...QUERY_KEYS.systemUsers.lists(), filters] as const,
    stats: () => [...QUERY_KEYS.systemUsers.all, "stats"] as const,
  },
};

export const MUTATION_KEYS = {
  systemUsers: {
    activate: () => ["systemUsers", "activate"],
    deactivate: () => ["systemUsers", "deactivate"],
  },
};
