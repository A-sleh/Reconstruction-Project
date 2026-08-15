import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { ProjectController, QUERY_KEYS } from ".";
import type {
  GetAllProjectsFilters,
  ProjectListItem,
  ProjectsResponse,
} from "./types";

const getAllProjects = async (filters: GetAllProjectsFilters) => {
  const { data } = await ApiInstance.get<ProjectsResponse>(
    `/${ProjectController.GetAll}`,
    { params: { ...filters } },
  );
  return data;
};

const getProjectById = async (projectId: number) => {
  const { data } = await ApiInstance.get<ProjectListItem>(
    `/${ProjectController.GetById}`,
    { params: { ProjectId: projectId } },
  );
  return data;
};

export const useProjectsInfinite = (
  filters: Omit<GetAllProjectsFilters, "PageNumber" | "PageSize"> & {
    PageSize?: number;
  },
) => {
  return useInfiniteQuery<ProjectsResponse, Error>({
    queryKey: QUERY_KEYS.projects.list(filters),
    queryFn: async ({ pageParam = 0 }) => {
      return await getAllProjects({
        ...filters,
        PageNumber: pageParam as number,
        PageSize: filters.PageSize ?? 10,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) {
        return lastPage.pageNum + 1;
      }
      return undefined;
    },
  });
};

export const useProjectById = (projectId: number) => {
  return useQuery<ProjectListItem, Error>({
    queryKey: QUERY_KEYS.projects.detail(projectId),
    queryFn: () => getProjectById(projectId),
    enabled: !!projectId,
  });
};
