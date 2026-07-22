import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { successToast, errorToast } from "@/components/common/Toast";
import i18n from "i18next";
import { SystemUserController, QUERY_KEYS, MUTATION_KEYS } from ".";

// ==========================================
// 1. API Fetchers
// ==========================================

const activateUser = async (id: number) => {
  const { data } = await ApiInstance.post(
    `/${SystemUserController.Activate}/${id}`,
  );
  return data;
};

const deactivateUser = async (id: number) => {
  const { data } = await ApiInstance.post(
    `/${SystemUserController.Deactivate}/${id}`,
  );
  return data;
};

const deleteUser = async (id: number) => {
  const { data } = await ApiInstance.delete(
    `/${SystemUserController.Delete}/${id}`,
  );
  return data;
};

// ==========================================
// 2. Custom Mutation Hooks
// ==========================================

export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.systemUsers.activate(),
    mutationFn: activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.systemUsers.all,
      });
      successToast(i18n.t("systemUsers.toast.activateSuccess"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage || i18n.t("systemUsers.toast.activateError");
      errorToast(message);
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.systemUsers.deactivate(),
    mutationFn: deactivateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.systemUsers.all,
      });
      successToast(i18n.t("systemUsers.toast.deactivateSuccess"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage || i18n.t("systemUsers.toast.deactivateError");
      errorToast(message);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.systemUsers.delete(),
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.systemUsers.all,
      });
      successToast(i18n.t("systemUsers.toast.deleteSuccess"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage || i18n.t("systemUsers.toast.deleteError");
      errorToast(message);
    },
  });
};
