import z from "zod";
import i18n from "i18next";
import ApiInstance from "@/config/api-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { successToast, errorToast } from "@/components/common/Toast";
import { LandController, QUERY_KEYS, MUTATION_KEYS } from "./index";
import type {
  LandFormValues,
  Land,
  CreateLandRequest,
  UpdateLandRequest,
} from "./types";
import { EZoningType } from "./types";

export const landFormSchema = z.object({
  name: z
    .string()
    .min(1, i18n.t("investor.validation-name-req"))
    .trim(),
  address: z
    .string()
    .min(1, i18n.t("investor.validation-address-req"))
    .trim(),
  location: z
    .string()
    .min(1, i18n.t("investor.validation-location-req"))
    .trim(),
  area: z
    .number({ message: i18n.t("investor.validation-area-number") })
    .positive({ message: i18n.t("investor.validation-area-positive") }),
  zoning: z.nativeEnum(EZoningType, {
    message: i18n.t("investor.validation-zoning-req"),
  }),
  border: z
    .array(z.string().min(1))
    .min(1, i18n.t("investor.validation-border-req")),
  isValidated: z.boolean().default(false),
  accessability: z.boolean().default(false),
  coverImageUrl: z.string().default(""),
});

export type LandFormSchema = z.infer<typeof landFormSchema>;

export const initialLandValues: LandFormSchema = {
  name: "",
  address: "",
  location: "",
  area: 0,
  zoning: EZoningType.Residential,
  border: [],
  isValidated: false,
  accessability: false,
  coverImageUrl: "",
};

const createLandApi = async (payload: CreateLandRequest): Promise<Land> => {
  const { data } = await ApiInstance.post(
    `/${LandController.CreateLand}`,
    payload,
  );
  return data;
};

const updateLandApi = async (payload: UpdateLandRequest): Promise<Land> => {
  const { data } = await ApiInstance.put(
    `/${LandController.UpdateLand}`,
    payload,
  );
  return data;
};

export const useCreateLand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.lands.create(),
    mutationFn: createLandApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lands.all });
      successToast(i18n.t("investor.land-created-success"));
    },
    onError: () => {
      errorToast(i18n.t("investor.land-created-error"));
    },
  });
};

export const useUpdateLand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.lands.update(),
    mutationFn: updateLandApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lands.all });
      successToast(i18n.t("investor.land-updated-success"));
    },
    onError: () => {
      errorToast(i18n.t("investor.land-updated-error"));
    },
  });
};
