import ApiInstance from "@/config/api-instance";
import { useQuery } from "@tanstack/react-query";

import { PublicProviderController, QUERY_KEYS } from "./";
import { mockProviderProfile } from "../mockData";
import type { PublicProviderProfile } from "./types";

const getProviderProfile = async (
  providerId: number | string,
): Promise<PublicProviderProfile> => {
  const { data } = await ApiInstance.get<PublicProviderProfile>(
    `/${PublicProviderController.Profile}/${providerId}`,
  );
  return data;
};

export const usePublicProviderProfile = (providerId: number | string) => {
  return useQuery<PublicProviderProfile, Error>({
    queryKey: QUERY_KEYS.provider.profile(providerId),
    queryFn: () => getProviderProfile(providerId),
    staleTime: 10 * 60 * 1000,
    enabled: !!providerId,
    placeholderData: mockProviderProfile,
  });
};
