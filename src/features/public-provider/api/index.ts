const BASE_PUBLIC_ROUTE = "public";

export enum PublicProviderController {
  Profile = `${BASE_PUBLIC_ROUTE}/provider`,
}

export const QUERY_KEYS = {
  provider: {
    all: ["publicProvider"] as const,
    profile: (id: number | string) =>
      [...QUERY_KEYS.provider.all, "profile", id] as const,
  },
};

export const MUTATION_KEYS = {
  contact: {
    send: () => ["publicProvider", "contact", "send"],
  },
};
