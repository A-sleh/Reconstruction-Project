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
  workSitesCount: number;
  inactiveWorkSitesCount: number;
  itemsCategoryCount: number;
}

export type DeactivateWorkSite = {
  isActive: boolean;
  workSiteId: number;
};

const BASE_CONTROLLER = "worksite"

export enum SiteController {
  WorkSites = `${BASE_CONTROLLER}/get-all`,
  WorkSiteCreate = `${BASE_CONTROLLER}/create`,
  WorkSiteUpdate = `${BASE_CONTROLLER}/update`,
  WorkSiteDelete = `${BASE_CONTROLLER}/delete`,
  deactivateWorkSite = `${BASE_CONTROLLER}/deactivate`,
  WorkSitesStatistics = `${BASE_CONTROLLER}/get-summary-cards`,
}
