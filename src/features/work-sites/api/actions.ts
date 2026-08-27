import i18n from "i18next";
import z from "zod";

import { errorToast, successToast } from "@/components/common/Toast";
import ApiInstance from "@/config/api-instance";
import { workSiteTypes } from "@/features/work-sites/components/WorkSiteType";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MUTATION_KEYS, QUERY_KEYS, SiteController } from "./index";
import { DeactivateWorkSite, WorkSite } from "./types";

// Define the validation schema with dynamic translation messages inside the component
export const siteFormSchema = z.object({
  name: z.string().min(1, i18n.t("workSites.validation-name-req")).trim(),
  location: z
    .string()
    .min(1, i18n.t("workSites.validation-location-req"))
    .trim(),
  address: z.string().min(1, i18n.t("workSites.validation-address-req")).trim(),
  workSiteType: z.string(),
  logoId: z.string().optional(),
  logoURL: z.string().optional(),
  file: z.file().optional(),
});

export type SiteFormValues = z.infer<typeof siteFormSchema>;
export const initialSiteValues: SiteFormValues = {
  name: "",
  address: "",
  workSiteType: workSiteTypes[0],
  logoId: "",
  location: "",
};

const updateWorkSiteApi = async (site: WorkSite): Promise<WorkSite> => {
  const { data } = await ApiInstance.put(
    `/${SiteController.WorkSiteUpdate}`,
    site,
  );
  return data;
};

const changeWorkSiteActivationApi = async (
  IsActive: boolean,
  WorkSiteId: number,
): Promise<void> => {
  console.log(IsActive);
  const { data } = await ApiInstance.patch(
    `/${SiteController.deactivateWorkSite}`,
    {},
    {
      params: {
        WorkSiteId: WorkSiteId ?? 0,
        IsActive,
      },
    },
  );
  return data;
};

const createWorkSiteApi = async (
  payload: SiteFormValues,
): Promise<WorkSite> => {
  const { data } = await ApiInstance.post(
    `/${SiteController.WorkSiteCreate}`,
    payload,
  );
  return data;
};

const deleteWorkSiteApi = async (id: string | number): Promise<void> => {
  await ApiInstance.delete(`/${SiteController.WorkSiteDelete}`, {
    params: { WorkSiteId: id ?? 0 },
  });
};

export const useDeactivateWorkSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: DeactivateWorkSite) =>
      changeWorkSiteActivationApi(params.isActive, params.workSiteId),
    mutationKey: MUTATION_KEYS.workSites.deactivate(),
    onSuccess: (_: any) => {
      successToast(
        i18n.t(
          "workSites.site-activation-updated",
          "Work site activation updated successfully.",
        ),
      );
      try {
        //@ts-ignore
        queryClient.invalidateQueries(QUERY_KEYS.workSites);
        //@ts-ignore
        queryClient.invalidateQueries(QUERY_KEYS.statistics);
      } catch (e) {}
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t("workSites.update-error", "Failed to update site");
      errorToast(message);
    },
  });
};

export const useUpdateWorkSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (site: WorkSite) => updateWorkSiteApi(site),
    mutationKey: MUTATION_KEYS.workSites.update(),
    onSuccess: (_: any) => {
      successToast(i18n.t("workSites.site-updated", "Site updated"));
      try {
        //@ts-ignore
        queryClient.invalidateQueries(QUERY_KEYS.workSites);
        //@ts-ignore
        queryClient.invalidateQueries(QUERY_KEYS.statistics);
      } catch (e) {}
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t("workSites.update-error", "Failed to update site");
      errorToast(message);
    },
  });
};

export const useDeleteWorkSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteWorkSiteApi(id),
    mutationKey: MUTATION_KEYS.workSites.delete(),
    onSuccess: () => {
      successToast(i18n.t("workSites.site-deleted", "Site deleted"));
      try {
        //@ts-ignore
        queryClient.invalidateQueries(QUERY_KEYS.workSites);
        //@ts-ignore
        queryClient.invalidateQueries(QUERY_KEYS.statistics);
      } catch (e) {}
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t("workSites.delete-error", "Failed to delete site");
      errorToast(message);
    },
  });
};

export const useCreateWorkSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SiteFormValues) => createWorkSiteApi(payload),
    mutationKey: MUTATION_KEYS.workSites.create(),
    onSuccess: (_: any) => {
      successToast(i18n.t("workSites.site-created", "Site created"));
      try {
        //@ts-ignore
        queryClient.invalidateQueries(QUERY_KEYS.workSites);
        //@ts-ignore
        queryClient.invalidateQueries(QUERY_KEYS.statistics);
      } catch (e) {}
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t("workSites.create-error", "Failed to create site");
      errorToast(message);
    },
  });
};
