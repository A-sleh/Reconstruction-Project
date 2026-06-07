export type SiteStatus = "active" | "on-hold";
export interface WorkSite {
  id: number | string;
  name: string;
  location: string;
  address: string;
  logoURL: string;
  workSiteType: string;
  status: string;
}
export interface WorkSiteStatistics {
  totalWorkSites: number;
  activeWorkSites: number;
  onHoldWorkSites: number;
}

export enum SiteController {
  WorkSites = "Worksite/GetAll",
  WorkSiteCreate = "Worksite/Create",
  WorkSiteUpdate = "Worksite/Update",
  WorkSiteDelete = "Worksite/Delete",
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
  },
};

export const statuses: SiteStatus[] = ["active", "on-hold"];
