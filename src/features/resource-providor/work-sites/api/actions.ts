import z from "zod";
import i18n from "i18next";
import ApiInstance from "@/config/api-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { successToast, errorToast } from "@/components/common/Toast";
import { WorkSite, QUERY_KEYS, SiteController, MUTATION_KEYS } from "./index";

// Define the validation schema with dynamic translation messages inside the component
export const siteFormSchema = z.object({
  name: z
    .string()
    .min(1, i18n.t("resourceProvidor.workSites.validation-name-req"))
    .trim(),
  companyLocation: z
    .string()
    .min(1, i18n.t("resourceProvidor.workSites.validation-location-req"))
    .trim(),
  address: z
    .string()
    .min(1, i18n.t("resourceProvidor.workSites.validation-address-req"))
    .trim(),
  manager: z
    .string()
    .min(1, i18n.t("resourceProvidor.workSites.validation-manager-req"))
    .trim(),
  status: z.enum(["active", "on-hold"] as const, {
    required_error: i18n.t("resourceProvidor.workSites.validation-status-req"),
    invalid_type_error: i18n.t(
      "resourceProvidor.workSites.validation-status-invalid",
    ),
  }),
});

export type SiteFormValues = z.infer<typeof siteFormSchema>;
export const initialSiteValues: SiteFormValues = {
  name: "",
  companyLocation: "",
  address: "",
  manager: "",
  status: "active",
};

const updateWorkSiteApi = async (site: WorkSite): Promise<WorkSite> => {
  console.log(site)
  const { data } = await ApiInstance.put(
    `/${SiteController.WorkSites}/${site.id}`,
    site,
  );
  return data;
};

const createWorkSiteApi = async (
  payload: SiteFormValues,
): Promise<WorkSite> => {
  const { data } = await ApiInstance.post(
    `/${SiteController.WorkSites}`,
    payload,
  );
  return data;
};

const deleteWorkSiteApi = async (id: string | number): Promise<void> => {
  await ApiInstance.delete(`/${SiteController.WorkSites}/${id}`);
};

export const useUpdateWorkSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (site: WorkSite) => updateWorkSiteApi(site),
    mutationKey: MUTATION_KEYS.workSites.update(),
    onSuccess: (_: any) => {
      successToast(
        i18n.t("resourceProvidor.workSites.site-updated", "Site updated"),
      );
      try {
        queryClient.invalidateQueries(QUERY_KEYS.workSites());
      } catch (e) {}
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t(
          "resourceProvidor.workSites.update-error",
          "Failed to update site",
        );
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
      successToast(
        i18n.t("resourceProvidor.workSites.site-deleted", "Site deleted"),
      );
      try {
        queryClient.invalidateQueries(QUERY_KEYS.workSites());
      } catch (e) {}
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t(
          "resourceProvidor.workSites.delete-error",
          "Failed to delete site",
        );
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
      successToast(
        i18n.t("resourceProvidor.workSites.site-created", "Site created"),
      );
      try {
        queryClient.invalidateQueries(QUERY_KEYS.workSites());
      } catch (e) {}
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t(
          "resourceProvidor.workSites.create-error",
          "Failed to create site",
        );
      errorToast(message);
    },
  });
};
