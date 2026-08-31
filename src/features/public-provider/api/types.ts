import { IImage } from "@/types";
import { PureResource } from "@/features/work-site-items/api/types";

export interface PublicProviderProfile {
  id: number;
  name: string;
  photo: IImage;
  providerType: "Resource" | "Service";
  licenseNumber: string;
  phone: string;
  email: string;
  bio: string;
  workSitesCount: number;
  inventoryCount: number;
  fulfillmentRate: number;
  totalInvoiced: number;
  rating: number;
  reviewsCount: number;
  workSites: PublicWorkSite[];
  inventory: PureResource[];
  reviews: PublicReview[];
}

export interface PublicWorkSite {
  id: number | string;
  name: string;
  logo: IImage;
  workSiteType: string;
  address: string;
  location: string;
  status: string;
}

export interface PublicReview {
  id: number;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
