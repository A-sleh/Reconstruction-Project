import { SiteStatus } from "./types";

const BASE_CONTROLLER = "worksite";

export enum SiteController {
  WorkSites = `${BASE_CONTROLLER}/get-all`,
  WorkSiteCreate = `${BASE_CONTROLLER}/create`,
  WorkSiteUpdate = `${BASE_CONTROLLER}/update`,
  WorkSiteDelete = `${BASE_CONTROLLER}/delete`,
  deactivateWorkSite = `${BASE_CONTROLLER}/deactivate`,
  WorkSitesStatistics = `${BASE_CONTROLLER}/get-summary-cards`,
}

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
