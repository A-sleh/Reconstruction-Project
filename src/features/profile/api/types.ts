import type { IImage, ProviderRole, Role } from "@/types";

export interface UserProfile {
  userId: number;
  firstName: string;
  lastName: string;
  photo: IImage;
  phone: string;
  email: string;
  personalIdentifier: string;
  role: Role | string;
}

export interface InvestorProfile {
  commercialRegisterId: string;
}

export interface ProviderProfile {
  licenseOfService: string;
  providerRole: ProviderRole | string;
}

export interface Profile {
  user: UserProfile;
  investor: InvestorProfile;
  provider: ProviderProfile;
}

export interface UpdateUserPayload {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    photoId: number;
    phone: string;
    personalIdentifier: string;
  };
}

export interface UpdateUserSettingsPayload {
  allowedEmailNotification: boolean;
  allowedSystemNotification: boolean;
}
