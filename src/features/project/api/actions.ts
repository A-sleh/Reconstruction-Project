import { useMutation, useQueryClient } from "@tanstack/react-query";
import { errorToast, successToast } from "@/components/common/Toast";
import ApiInstance from "@/config/api-instance";
import i18n from "@/lib/i18n";
import { MUTATION_KEYS, ProjectController, QUERY_KEYS } from ".";
import type {
  CreateProjectPayload,
  DeleteProjectParams,
  RespondToProjectApplicationPayload,
  UpdateProjectPayload,
  UpdateProjectSettingPayload,
} from "./types";

// ==========================================
// API Fetchers
// ==========================================

const deleteProject = async ({ id }: DeleteProjectParams) => {
  const { data } = await ApiInstance.delete(`/${ProjectController.Delete}`, {
    params: { id },
  });
  return data;
};

const updateProject = async (payload: UpdateProjectPayload) => {
  const { data } = await ApiInstance.put(
    `/${ProjectController.Update}`,
    payload,
  );
  return data;
};

const createProject = async (payload: CreateProjectPayload) => {
  const { data } = await ApiInstance.post(
    `/${ProjectController.Create}`,
    payload,
  );
  return data;
};

const updateProjectSetting = async (
  payload: UpdateProjectSettingPayload,
) => {
  const { data } = await ApiInstance.put(
    `/${ProjectController.UpdateProjectSetting}`,
    payload,
  );
  return data;
};

const respondToProjectApplication = async (
  payload: RespondToProjectApplicationPayload,
) => {
  const { data } = await ApiInstance.post(
    `/${ProjectController.RespondToProjectApplication}`,
    payload,
  );
  return data;
};

// ==========================================
// Custom Mutation Hooks
// ==========================================

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.projects.delete(),
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      successToast(i18n.t("project.toast.deleteProjectSuccess"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage || i18n.t("project.toast.deleteProjectError");
      errorToast(message);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.projects.update(),
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      successToast(i18n.t("project.toast.updateProjectSuccess"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage || i18n.t("project.toast.updateProjectError");
      errorToast(message);
    },
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.projects.create(),
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      successToast(i18n.t("project.toast.createProjectSuccess"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage || i18n.t("project.toast.createProjectError");
      errorToast(message);
    },
  });
};

export const useUpdateProjectSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.projects.updateSetting(),
    mutationFn: updateProjectSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      successToast(i18n.t("project.toast.updateProjectSettingSuccess"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage || i18n.t("project.toast.updateProjectSettingError");
      errorToast(message);
    },
  });
};

export const useRespondToProjectApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.projects.respondToProjectApplication(),
    mutationFn: respondToProjectApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects.all });
      successToast(i18n.t("project.toast.respondToProjectApplicationSuccess"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t("project.toast.respondToProjectApplicationError");
      errorToast(message);
    },
  });
};
