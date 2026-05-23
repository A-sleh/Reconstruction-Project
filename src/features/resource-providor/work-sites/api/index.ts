export type SiteStatus = "active" | "on-hold";
export interface WorkSite {
  id: string;
  name: string;
  companyLocation: string;
  address: string;
  manager: string;
  status: SiteStatus;
}
export interface WorkSiteStatistics {
  totalWorkSites: number;
  activeWorkSites: number;
  onHoldWorkSites: number;
}

export enum SiteController {
  WorkSites = "workSites",
  WorkSitesStatistics = "workSites-statistics",
}

export const QUERY_KEYS = {
  resourceProvidor: ["resourceProvidor"],
  workSites: () => ["resourceProvidor", "workSites"],
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
