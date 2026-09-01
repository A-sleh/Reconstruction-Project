import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS, getOpenProjects, getOpenProjectById } from "./index";

export const useOpenProjects = () =>
  useQuery({
    queryKey: QUERY_KEYS.openProjects.lists(),
    queryFn: getOpenProjects,
  });

export const useOpenProjectById = (id: number) =>
  useQuery({
    queryKey: QUERY_KEYS.openProjects.detail(id),
    queryFn: () => getOpenProjectById(id),
  });
