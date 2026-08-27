import z from "zod";

import { errorToast, successToast } from "@/components/common/Toast";
import ApiInstance from "@/config/api-instance";
import i18n from "@/lib/i18n";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { MUTATION_KEYS, QUERY_KEYS, WorkSiteItemsController } from "./";
import {
  DeleteWorksiteItemParams,
  ResourcesPayload,
  ServicesPayload,
  unitTypes,
} from "./types";

export const resourceSchema = z.object({
  id: z.string().nullable().optional(),
  unit: z
    .string()
    .nonempty(i18n.t("workSites.resource.validation.unit_required")),
  resourceBankId: z
    .number()
    .min(1, i18n.t("workSites.resource.validation.resource_type_required"))
    .nullable()
    .optional(),
  resourceBank: z.any().optional(),
  imageUrl: z.string().optional(),
  imageId: z.string().optional(),
  price: z.coerce
    .number()
    .refine((value) => !Number.isNaN(value), {
      message: i18n.t("workSites.resource.validation.price_required"),
    })
    .min(1, i18n.t("workSites.resource.validation.price_min")),
  description: z
    .string()
    .nonempty(i18n.t("workSites.resource.validation.description_required")),
  isAvailable: z.boolean().nullable().optional(),
  file: z.file().optional(),
  workSiteId: z.string().nullable().optional(),
});

export type Resource = z.infer<typeof resourceSchema>;
export type ResourceFormValues = Resource & {
  id?: string;
};
export const defaultResourceValues: Resource = {
  id: null,
  isAvailable: true,
  unit: unitTypes[0],
  resourceBankId: 0,
  description: "",
  imageUrl: "",
  imageId: "",
  price: 0,
  workSiteId: null,
};

const updateResourceApi = async (
  payload: ResourceFormValues,
): Promise<ResourceFormValues> => {
  const { data } = await ApiInstance.put(
    `/${WorkSiteItemsController.UpdateWorkSite}`,
    payload,
  );
  return data;
};

const createResourceApi = async (
  payload: ResourcesPayload,
): Promise<ResourcesPayload> => {
  const { data } = await ApiInstance.post(
    `/${WorkSiteItemsController.AddResources}`,
    payload,
  );
  return data;
};

const addServicesApi = async (
  payload: ServicesPayload,
): Promise<ServicesPayload> => {
  const { data } = await ApiInstance.post(
    `/${WorkSiteItemsController.AddServices}`,
    payload,
  );
  return data;
};

const deleteWorksiteItem = async ({
  Id,
  ItemType,
}: DeleteWorksiteItemParams) => {
  const { data } = await ApiInstance.delete(
    `/${WorkSiteItemsController.DelelteResource}`,
    {
      params: {
        id: Id,
        itemType: ItemType,
      },
    },
  );
  return data;
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ResourceFormValues) => updateResourceApi(payload),
    mutationKey: MUTATION_KEYS.resource.update(),
    onSuccess: (_: any) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resources });
      successToast(i18n.t("workSites.resource.resource-update"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage || i18n.t("workSites.resource.resource-error-update");
      errorToast(message);
    },
  });
};

export const useCreateResource = () => {
  return useMutation({
    mutationFn: (payload: ResourcesPayload) => createResourceApi(payload),
    mutationKey: MUTATION_KEYS.resource.create(),
    onSuccess: (_: any) => {
      successToast(
        i18n.t("workSites.resource.resource-created", "Site created"),
      );
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t(
          "workSites.resource.resource-error-created",
          "Failed to create site",
        );
      errorToast(message);
    },
  });
};

export const useAddServices = () => {
  return useMutation({
    mutationFn: (payload: ServicesPayload) => addServicesApi(payload),
    mutationKey: MUTATION_KEYS.resource.create(),
    onSuccess: (_: any) => {
      successToast(
        i18n.t("workSites.resource.resource-created", "Services added"),
      );
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t(
          "workSites.resource.resource-error-created",
          "Failed to add services",
        );
      errorToast(message);
    },
  });
};

export const useDeleteWorksiteItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.resource.delete(),
    mutationFn: deleteWorksiteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resources });
    },
  });
};
