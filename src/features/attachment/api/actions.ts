import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { successToast, errorToast } from "@/components/common/Toast";
import i18n from "i18next";
import { FileController, MUTATION_KEYS, QUERY_KEYS } from ".";
import type { FileUploadResponse, FileDeleteParams } from "./types";

// ==========================================
// 1. API Fetchers
// ==========================================

const uploadFileApi = async (file: File): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await ApiInstance.post(`/${FileController.Upload}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

const deleteFileApi = async ({ fileId }: FileDeleteParams) => {
  const { data } = await ApiInstance.delete(`/${FileController.Delete}`, {
    params: { fileId },
  });
  return data;
};

// ==========================================
// 2. Custom Hooks
// ==========================================

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.files.upload(),
    mutationFn: uploadFileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.all });
      successToast(i18n.t("attachment.upload-success", "File uploaded successfully"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        i18n.t("attachment.upload-error", "Failed to upload file");
      errorToast(message);
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.files.delete(),
    mutationFn: deleteFileApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.files.all });
      successToast(i18n.t("attachment.delete-success", "File deleted successfully"));
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        i18n.t("attachment.delete-error", "Failed to delete file");
      errorToast(message);
    },
  });
};
