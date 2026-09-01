const BASE_PUBLIC_ROUTE = "public";

export enum PublicEngineerController {
  Profile = `${BASE_PUBLIC_ROUTE}/engineer`,
}

export const QUERY_KEYS = {
  engineer: {
    all: ["publicEngineer"] as const,
    profile: (id: number | string) =>
      [...QUERY_KEYS.engineer.all, "profile", id] as const,
  },
};