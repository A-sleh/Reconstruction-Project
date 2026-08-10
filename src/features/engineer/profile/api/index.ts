const BASE_ENGINEER_PROFILE_ROUTE = "engineer/profile";

export enum EngineerProfileController {
  GetProfile = BASE_ENGINEER_PROFILE_ROUTE,
}

export const QUERY_KEYS = {
  engineerProfile: {
    all: ["engineerProfile"] as const,
    detail: () => [...QUERY_KEYS.engineerProfile.all, "detail"] as const,
    profile: () => [...QUERY_KEYS.engineerProfile.detail(), "profile"] as const,
  },
};
