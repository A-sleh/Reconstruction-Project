import ApiInstance from "@/config/api-instance";
import { useQuery } from "@tanstack/react-query";

import { PublicEngineerController, QUERY_KEYS } from "./";
import { mockPublicEngineerProfile } from "../mockData";
import type { PublicEngineerProfile } from "./types";

const getEngineerProfile = async (
  engineerId: number | string,
): Promise<PublicEngineerProfile> => {
  const { data } = await ApiInstance.get<PublicEngineerProfile>(
    `/${PublicEngineerController.Profile}/${engineerId}`,
  );
  return data;
};

export const usePublicEngineerProfile = (engineerId: number | string) => {
  return useQuery<PublicEngineerProfile, Error>({
    queryKey: QUERY_KEYS.engineer.profile(engineerId),
    queryFn: () => getEngineerProfile(engineerId),
    staleTime: 10 * 60 * 1000,
    enabled: !!engineerId,
    placeholderData: mockPublicEngineerProfile,
  });
};