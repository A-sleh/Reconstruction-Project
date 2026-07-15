import { SiteStatus } from "./types";

export const QUERY_KEYS = {
  resourceProvidor: ["resourceProvidor"],
  workSites: (filter?: string) => [
    "resourceProvidor",
    "workSites",
    filter ?? "all",
  ],
  statistics: ["resourceProvidor", "statistics"],
};

export const MUTATION_KEYS = {
  workSites: {
    create: () => ["resourceProvidor", "workSites", "create"],
    update: () => ["resourceProvidor", "workSites", "update"],
    delete: () => ["resourceProvidor", "workSites", "delete"],
    deactivate: () => ["resourceProvidor", "workSites", "deactivate"],
  },
};

export const statuses: SiteStatus[] = ["active", "on-hold"];
