import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { errorToast, successToast } from "@/components/common/Toast";
import ApiInstance from "@/config/api-instance";
import i18n from "@/lib/i18n";

import { MUTATION_KEYS, ProjectPermissionsController, QUERY_KEYS } from "./";
import type {
  GetProjectMembersPermissionsParams,
  ProjectMemberPermission,
  UpdateProjectEngineerPermissionsPayload,
} from "./types";

// ==========================================
// API Fetchers
// ==========================================

const getProjectMembersPermissions = async ({
  ProjectId,
}: GetProjectMembersPermissionsParams): Promise<ProjectMemberPermission[]> => {
  const { data } = await ApiInstance.get<ProjectMemberPermission[]>(
    `/${ProjectPermissionsController.GetMembersPermissions}`,
    { params: { ProjectId } },
  );
  return data;
};

const updateProjectEngineerPermissions = async (
  payload: UpdateProjectEngineerPermissionsPayload,
) => {
  const { data } = await ApiInstance.put(
    `/${ProjectPermissionsController.UpdateEngineerPermissions}`,
    payload,
  );
  return data;
};

// ==========================================
// Query Hook
// ==========================================

export const useProjectMembersPermissions = (projectId: number) => {
  return useQuery<ProjectMemberPermission[], Error>({
    queryKey: QUERY_KEYS.engineers.permissions(projectId),
    queryFn: () =>
      getProjectMembersPermissions({ ProjectId: projectId }),
    enabled: Number.isFinite(projectId),
  });
};

// ==========================================
// Mutation Hook
// ==========================================

export const useUpdateProjectEngineerPermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.engineers.updatePermissions(),
    mutationFn: updateProjectEngineerPermissions,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.engineers.permissions(variables.projectId),
      });
      successToast(
        i18n.t(
          "projectsEngineers.permissions.toast.updateSuccess",
          "Engineer permissions updated successfully",
        ),
      );
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t(
          "projectsEngineers.permissions.toast.updateError",
          "Failed to update engineer permissions",
        );
      errorToast(message);
    },
  });
};
