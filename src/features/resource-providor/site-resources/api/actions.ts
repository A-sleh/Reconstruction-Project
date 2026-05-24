import z from "zod";
import i18n from "@/lib/i18n";
import { errorToast, successToast } from "@/components/common/Toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MUTATION_KEYS, Resource, WorkSiteResourcesController } from ".";
import ApiInstance from "@/config/api-instance";

export const resourceSchema = z.object({
  name: z
    .string()
    .min(
      1,
      i18n.t(
        "resourceProvidor.workSites.resource.validation.name_required",
        "Name is required",
      ),
    ),
  description: z.string().optional(),
  image: z.string().optional(),
  unitType: z.string().optional(),
  pricePerUnit: z.coerce.number().min(0),
  quantity: z.coerce.number().min(0),
  availability: z.string().optional(),
  category: z.string().optional(),
  customCategory: z.string().optional(),
});

export type ResourceFormValues = z.infer<typeof resourceSchema>;
export const defaultResourceValues: ResourceFormValues = {
  name: "",
  description: "",
  image: "",
  unitType: "piece",
  pricePerUnit: 0,
  quantity: 0,
  availability: "in-stock",
  category: "",
  customCategory: "",
};

const updateResourceApi = async (
  siteId: number | string,
  payload: Omit<Resource,"availability">,
): Promise<ResourceFormValues> => {
  const { data } = await ApiInstance.put(
    `/${WorkSiteResourcesController.WorkSite}/${siteId}/resources/${payload.id}`,
    payload,
  );
  return data;
};

const createResourceApi = async (
  siteId: number | string,
  payload: ResourceFormValues,
): Promise<ResourceFormValues> => {
  const { data } = await ApiInstance.post(
    `/${WorkSiteResourcesController.WorkSite}/${siteId}/resources`,
    payload,
  );
  return data;
};

const askeToAddResourceApi = async (
  siteId: number | string,
  payload: ResourceFormValues,
): Promise<ResourceFormValues> => {
  const { data } = await ApiInstance.post(
    `/${WorkSiteResourcesController.WorkSite}/${siteId}/resources/request`,
    payload,
  );
  return data;
};

const deleteResourceApi = async (
  siteId: string | number,
  resourceId: string | number,
): Promise<void> => {
  await ApiInstance.delete(
    `/${WorkSiteResourcesController.WorkSite}/${siteId}/resources/${resourceId}`,
  );
};

export const useUpdateResource = () => {
  return useMutation({
    mutationFn: (params: { siteId: number | string, payload: Omit<Resource,"availability"> }) =>
      updateResourceApi(params.siteId, params.payload),
    mutationKey: MUTATION_KEYS.resource.update(),
    onSuccess: (_: any) => {
      successToast(
        i18n.t("resourceProvidor.workSites.resource.resource-update"),
      );
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t("resourceProvidor.workSites.resource.resource-error-update");
      errorToast(message);
    },
  });
};

export const useRequestToAddResource = () => {
  return useMutation({
    mutationFn: (params: {
      siteId: number | string;
      payload: ResourceFormValues;
    }) => askeToAddResourceApi(params.siteId, params.payload),
    mutationKey: MUTATION_KEYS.resource.create(),
    onSuccess: (_: any) => {
      successToast(
        i18n.t(
          "resourceProvidor.workSites.resource.resource-request",
          "Site created",
        ),
      );
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t(
          "resourceProvidor.workSites.resource.resource-error-request",
          "Failed to request resource",
        );
      errorToast(message);
    },
  });
};

export const useCreateResource = () => {
  return useMutation({
    mutationFn: (params: {
      siteId: number | string;
      payload: ResourceFormValues;
    }) => createResourceApi(params.siteId, params.payload),
    mutationKey: MUTATION_KEYS.resource.create(),
    onSuccess: (_: any) => {
      successToast(
        i18n.t(
          "resourceProvidor.workSites.resource.resource-created",
          "Site created",
        ),
      );
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t(
          "resourceProvidor.workSites.resource.resource-error-created",
          "Failed to create site",
        );
      errorToast(message);
    },
  });
};

export const useDeleteResource = () => {
  return useMutation({
    mutationFn: (params: {
      siteId: string | number;
      resourceId: string | number;
    }) => deleteResourceApi(params.siteId, params.resourceId),
    mutationKey: MUTATION_KEYS.resource.delete(),
    onSuccess: () => {
      successToast(
        i18n.t(
          "resourceProvidor.workSites.resource.resource-deleted",
          "Site deleted",
        ),
      );
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t(
          "resourceProvidor.workSites.resource.resource-error-deleted",
          "Failed to delete site",
        );
      errorToast(message);
    },
  });
};
