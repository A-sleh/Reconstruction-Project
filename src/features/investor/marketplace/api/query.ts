import { useQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { MarketplaceController, QUERY_KEYS } from ".";
import type { DealListing } from "./types";

const getMarketplaceListings = async (): Promise<DealListing[]> => {
  const { data } = await ApiInstance.get<DealListing[]>(
    `/${MarketplaceController.GetListings}`,
  );
  return data;
};

export const useMarketplaceListings = () => {
  return useQuery<DealListing[], Error>({
    queryKey: QUERY_KEYS.marketplace.listings(),
    queryFn: getMarketplaceListings,
  });
};