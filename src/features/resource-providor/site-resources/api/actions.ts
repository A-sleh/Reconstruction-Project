import z from "zod";
import i18n from "@/lib/i18n";
import { errorToast, successToast } from "@/components/common/Toast";
import { useMutation } from "@tanstack/react-query";
import {
  availabilities,
  MUTATION_KEYS,
  ResourcesPayload,
  unitTypes,
  WorkSiteResourcesController,
} from ".";
import ApiInstance from "@/config/api-instance";

export const resourceSchema = z.object({
  unit: z
    .string()
    .nonempty(
      i18n.t("resourceProvidor.workSites.resource.validation.unit_required"),
    ),
  resourceBankId: z
    .number()
    .min(
      1,
      i18n.t(
        "resourceProvidor.workSites.resource.validation.resource_type_required",
      ),
    ),
  resourceBank: z.any().optional(),
  imageUrl: z
    .string()
    .nonempty(
      i18n.t("resourceProvidor.workSites.resource.validation.image_required"),
    ),
  price: z.coerce
    .number()
    .refine((value) => !Number.isNaN(value), {
      message: i18n.t(
        "resourceProvidor.workSites.resource.validation.price_required",
      ),
    })
    .min(1, i18n.t("resourceProvidor.workSites.resource.validation.price_min")),
  description: z
    .string()
    .nonempty(
      i18n.t(
        "resourceProvidor.workSites.resource.validation.description_required",
      ),
    ),
  availability: z
    .string()
    .nonempty(
      i18n.t(
        "resourceProvidor.workSites.resource.validation.availability_required",
      ),
    ),
  file: z.file().optional(),
});

export type Resource = z.infer<typeof resourceSchema>;
export type ResourceFormValues = Resource & {
  id?: string;
};
export const defaultResourceValues: Resource = {
  availability: availabilities[0],
  unit: unitTypes[0],
  resourceBankId: 0,
  description: "",
  imageUrl: "",
  price: 0,
};

const updateResourceApi = async (
  siteId: number | string,
  payload: ResourceFormValues,
): Promise<ResourceFormValues> => {
  const { data } = await ApiInstance.put(
    `/${WorkSiteResourcesController.WorkSite}/${siteId}/resources/${payload.id}`,
    payload,
  );
  return data;
};

const createResourceApi = async (
  payload: ResourcesPayload,
): Promise<ResourcesPayload> => {
  const { data } = await ApiInstance.post(
    `/${WorkSiteResourcesController.AddResources}`,
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
    mutationFn: (params: {
      siteId: number | string;
      payload: ResourceFormValues;
    }) => updateResourceApi(params.siteId, params.payload),
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
    mutationFn: (payload: ResourcesPayload) => createResourceApi(payload),
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
