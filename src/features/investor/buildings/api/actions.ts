import i18n from "i18next";
import ApiInstance from "@/config/api-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { successToast, errorToast } from "@/components/common/Toast";
import { BuildingController, QUERY_KEYS, MUTATION_KEYS } from "./index";
import type { CreateBuildingRequest, UpdateBuildingRequest, BuildingListItem } from "./types";

const createBuildingApi = async (payload: CreateBuildingRequest): Promise<BuildingListItem> => {
  const { data } = await ApiInstance.post(
    `/${BuildingController.Add}`,
    payload,
  );
  return data;
};

const updateBuildingApi = async (payload: UpdateBuildingRequest): Promise<BuildingListItem> => {
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
