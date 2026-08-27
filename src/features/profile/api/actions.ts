import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import ApiInstance from "@/config/api-instance";
import { successToast, errorToast } from "@/components/common/Toast";
import i18n from "i18next";
import { UserController, QUERY_KEYS, MUTATION_KEYS } from ".";
import useAuthStore, { User } from "@/stores/useAuthStore";
import type {
  Profile,
  UpdateUserPayload,
  UpdateUserSettingsPayload,
} from "./types";

// ==========================================
// 1. API Fetchers
// ==========================================

const updateUserApi = async (
  payload: UpdateUserPayload,
): Promise<Profile> => {
  const { data } = await ApiInstance.put<Profile>(
    `/${UserController.UpdateUser}`,
    payload,
  );
  return data;
};

const updateUserSettingsApi = async (
  payload: UpdateUserSettingsPayload,
): Promise<UpdateUserSettingsPayload> => {
  const { data } = await ApiInstance.put<UpdateUserSettingsPayload>(
    `/${UserController.UpdateUserSettings}`,
    payload,
  );
  return data;
};

// ==========================================
// 2. Custom Mutation Hooks
// ==========================================

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const currentUser = useAuthStore((s) => s.user);

  return useMutation({
    mutationKey: MUTATION_KEYS.profile.updateUser(),
    mutationFn: updateUserApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
      if (data?.user) {
        const user: User = {
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          photoURL: data.user.photo?.url ?? currentUser?.photoURL ?? "",
          role: (data.user.role as User["role"]) || currentUser?.role || null,
          providerRole: data.provider?.providerRole as User["providerRole"],
        };
        setUser(user);
      }
      successToast(
        i18n.t("profile.toast.updated", "Profile updated successfully"),
      );
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const serverMessage =
        error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t("profile.toast.updateError", "Failed to update profile");
      errorToast(message);
    },
  });
};

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.profile.updateSettings(),
    mutationFn: updateUserSettingsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile });
      successToast(
        i18n.t(
          "profile.toast.settingsUpdated",
          "Settings updated successfully",
        ),
      );
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const serverMessage =
        error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t("profile.toast.settingsUpdateError", "Failed to update settings");
      errorToast(message);
    },
  });
};
