const BASE_MARKETPLACE_ROUTE = "marketplace";

export enum MarketplaceController {
  GetListings = `${BASE_MARKETPLACE_ROUTE}/listings`,
}

export const QUERY_KEYS = {
  marketplace: {
    all: ["marketplace"] as const,
    lists: () => [...QUERY_KEYS.marketplace.all, "listing"] as const,
    listings: () => [...QUERY_KEYS.marketplace.lists()] as const,
  },
};
