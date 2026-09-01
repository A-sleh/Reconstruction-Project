import { useQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { EngineerRequestsController, QUERY_KEYS } from ".";
import type {
  EngineerInvite,
  EngineerJoinRequest,
  EngineerRequestsStats,
} from "./types";

const getEngineerInvites = async (): Promise<EngineerInvite[]> => {
  const { data } = await ApiInstance.get<EngineerInvite[]>(
    `/${EngineerRequestsController.GetInvites}`,
  );
  return data;
};

const getEngineerJoinRequests = async (): Promise<EngineerJoinRequest[]> => {
  const { data } = await ApiInstance.get<EngineerJoinRequest[]>(
    `/${EngineerRequestsController.GetJoinRequests}`,
  );
  return data;
};

const getEngineerRequestsStats = async (): Promise<EngineerRequestsStats> => {
  const { data } = await ApiInstance.get<EngineerRequestsStats>(
    `/${EngineerRequestsController.GetStats}`,
  );
  return data;
};

export const useEngineerInvites = () => {
  return useQuery<EngineerInvite[], Error>({
    queryKey: QUERY_KEYS.engineerRequests.invites(),
    queryFn: getEngineerInvites,
  });
};

export const useEngineerJoinRequests = () => {
  return useQuery<EngineerJoinRequest[], Error>({
    queryKey: QUERY_KEYS.engineerRequests.joinRequests(),
    queryFn: getEngineerJoinRequests,
  });
};

export const useEngineerRequestsStats = () => {
  return useQuery<EngineerRequestsStats, Error>({
    queryKey: QUERY_KEYS.engineerRequests.stats(),
    queryFn: getEngineerRequestsStats,
  });
};
