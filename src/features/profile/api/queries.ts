import { useQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { UserController, QUERY_KEYS } from ".";
import type { Profile } from "./types";

const fetchProfileAPI = async (): Promise<Profile> => {
  const { data } = await ApiInstance.get<Profile>(
    `/${UserController.Profile}`,
  );
  return data;
};

export const useProfile = () => {
  return useQuery<Profile, unknown>({
    queryKey: QUERY_KEYS.profile,
    queryFn: fetchProfileAPI,
  });
};
