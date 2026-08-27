import { IImage } from "@/types";

export type SiteStatus = "active" | "on-hold";
export interface WorkSite {
  id: number | string;
  name: string;
  location: string;
  address: string;
  logo: IImage;
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
