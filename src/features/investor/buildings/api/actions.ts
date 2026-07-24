import z from "zod";
import i18n from "i18next";
import ApiInstance from "@/config/api-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { successToast, errorToast } from "@/components/common/Toast";
import { BuildingController, QUERY_KEYS, MUTATION_KEYS } from "./index";
import type {
  CreateBuildingRequest,
  UpdateBuildingRequest,
  BuildingListItem,
  BuildingType,
} from "./types";

export const buildingFormSchema = z.object({
  name: z.string().min(1, i18n.t("investor.validation-name-req")).trim(),
  landId: z
    .string({ message: i18n.t("investor.validation-land-req") }),
    // .positive({ message: i18n.t("investor.validation-land-req") }).optional(),
  city: z.string().min(1, i18n.t("investor.validation-city-req")).trim(),
  streetName: z.string().min(1, i18n.t("investor.validation-street-req")).trim(),
  address: z.string().min(1, i18n.t("investor.validation-address-req")).trim(),
  area: z
    .number({ message: i18n.t("investor.validation-area-number") })
    .positive({ message: i18n.t("investor.validation-area-positive") }),
  buildingType: z.string().min(1, i18n.t("investor.validation-buildingType-req")),
  orientation: z.string().min(1, i18n.t("investor.validation-orientation-req")).trim(),
  location: z
    .string()
    .min(1, i18n.t("investor.validation-location-req"))
    .trim(),
  coverImageId: z.number().default(0),
  attachments: z.array(
    z.object({
      id: z.number(),
      description: z.string(),
      removed: z.boolean().optional(),
    }),
  ).default([]),
});

export type BuildingFormSchema = z.infer<typeof buildingFormSchema>;

export const initialBuildingValues: BuildingFormSchema = {
  name: "",
  landId: 2,
  city: "",
  streetName: "",
  address: "",
  area: 0,
  buildingType: "",
  orientation: "",
  location: "",
  coverImageId: 0,
  attachments: [],
};

const createBuildingApi = async (
  payload: CreateBuildingRequest,
): Promise<BuildingListItem> => {
  const { data } = await ApiInstance.post(
    `/${BuildingController.Add}`,
    payload,
  );
  return data;
};

const updateBuildingApi = async (
  payload: UpdateBuildingRequest,
): Promise<BuildingListItem> => {
  const { data } = await ApiInstance.put(
    `/${BuildingController.Update}`,
    payload,
  );
  return data;
};

export const useCreateBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.buildings.create(),
    mutationFn: createBuildingApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.buildings.all });
      successToast(i18n.t("investor.building-created-success"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || i18n.t("investor.building-created-error");
      errorToast(message);
    },
  });
};

export const useUpdateBuilding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.buildings.update(),
    mutationFn: updateBuildingApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.buildings.all });
      successToast(i18n.t("investor.building-updated-success"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || i18n.t("investor.building-updated-error");
      errorToast(message);
    },
  });
};
