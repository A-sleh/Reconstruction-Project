import { useQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { EngineerProfileController, QUERY_KEYS } from ".";
import type { EngineerProfile } from "./types";

// ==========================================
// 1. API Fetchers
// ==========================================

const getEngineerProfile = async (): Promise<EngineerProfile> => {
  const { data } = await ApiInstance.get<EngineerProfile>(
    `/${EngineerProfileController.GetProfile}`,
  );
  return data;
};

// ==========================================
// 2. Custom Query Hooks
// ==========================================

export const useEngineerProfile = () => {
  return useQuery<EngineerProfile, Error>({
    queryKey: QUERY_KEYS.engineerProfile.profile(),
    queryFn: getEngineerProfile,
  });
};
