export type SiteStatus = "active" | "on-hold";
export interface WorkSite {
  id: number | string;
  name: string;
  location: string;
  address: string;
  logoURL: string;
  workSiteType: string;
  status: string;
  isActive: boolean;
}
export interface WorkSiteStatistics {
  totalWorkSites: number;
  activeWorkSites: number;
  onHoldWorkSites: number;
}

export type DeactivateWorkSite = {
  isActive: boolean;
  workSiteId: number;
};

export enum SiteController {
  WorkSites = "worksite/get-all",
  WorkSiteCreate = "worksite/create",
  WorkSiteUpdate = "worksite/update",
  WorkSiteDelete = "worksite/delete",
  deactivateWorkSite = "worksite/deactivate",
  WorkSitesStatistics = "workSites-statistics",
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
