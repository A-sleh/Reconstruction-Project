import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import i18n from "@/lib/i18n";
import { errorToast, successToast } from "@/components/common/Toast";
import { BankItemController, QUERY_KEYS, MUTATION_KEYS } from ".";
import {
  ResolveRequestParams,
  RejectRequestParams,
  ApproveRequestParams,
  AddRequestParams,
  CategoryPayload,
  AddResourceTagsParams,
  AddServiceTagsParams,
  RemoveResourceTagsParams,
  RemoveServiceTagsParams,
} from "./types";

// ==========================================
// API Fetchers
// ==========================================
const resolveRequest = async (payload: ResolveRequestParams) => {
  const { data } = await ApiInstance.put(`/${BankItemController.ResolveRequest}`, payload);
  return data;
};

const rejectRequest = async (payload: RejectRequestParams) => {
  const { data } = await ApiInstance.put(`/${BankItemController.RejectRequest}`, payload);
  return data;
};

const approveRequest = async ({ RequestId }: ApproveRequestParams) => {
  const { data } = await ApiInstance.put(
    `/${BankItemController.ApproveRequest}`,
    {},
    { params: { requestId: RequestId } }
  );
  return data;
};

const addRequest = async (payload: AddRequestParams) => {
  const { data } = await ApiInstance.post(
    `/${BankItemController.AddRequest}`, 
    payload
  );
  return data;
};

// ==========================================
// Custom Mutation Hooks
// ==========================================
export const useResolveBankItemRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.bankItems.resolve(),
    mutationFn: resolveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bankItems.all });
    },
  });
};

export const useRejectBankItemRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.bankItems.reject(),
    mutationFn: rejectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bankItems.all });
    },
  });
};

export const useApproveBankItemRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.bankItems.approve(),
    mutationFn: approveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bankItems.all });
    },
  });
};

export const useAddBankItemRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.bankItems.add(),
    mutationFn: addRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bankItems.all });
    },
  });
};

// ==========================================
// Bank Category CRUD
// ==========================================
const createCategoryApi = async (payload: CategoryPayload): Promise<CategoryPayload> => {
  const { data } = await ApiInstance.post(
    `/${BankItemController.CreateCategory}`,
    payload,
  );
  return data;
};

const updateCategoryApi = async ({
  id,
  ...payload
}: CategoryPayload & { id: number }): Promise<CategoryPayload> => {
  const { data } = await ApiInstance.put(
    `/${BankItemController.UpdateCategory}/${id}`,
    payload,
  );
  return data;
};

const deleteCategoryApi = async (id: number) => {
  const { data } = await ApiInstance.delete(
    `/${BankItemController.DeleteCategory}/${id}`,
  );
  return data;
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.category.create(),
    mutationFn: createCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bankCategories });
      successToast(i18n.t("categoryBank.toast.createSuccess", "Category created"));
    },
    onError: () => {
      errorToast(i18n.t("categoryBank.toast.createError", "Failed to create category"));
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.category.update(),
    mutationFn: updateCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bankCategories });
      successToast(i18n.t("categoryBank.toast.updateSuccess", "Category updated"));
    },
    onError: () => {
      errorToast(i18n.t("categoryBank.toast.updateError", "Failed to update category"));
    },
  });
};

// ==========================================
// Tags Mutations
// ==========================================
const addResourceTagsApi = async (payload: AddResourceTagsParams) => {
  const { data } = await ApiInstance.post(
    `/${BankItemController.AddResourceTags}`,
    payload,
  );
  return data;
};

const addServiceTagsApi = async (payload: AddServiceTagsParams) => {
  const { data } = await ApiInstance.post(
    `/${BankItemController.AddServiceTags}`,
    payload,
  );
  return data;
};

const removeResourceTagsApi = async (payload: RemoveResourceTagsParams) => {
  const { data } = await ApiInstance.delete(
    `/${BankItemController.RemoveResourceTags}`,
    { data: payload },
  );
  return data;
};

const removeServiceTagsApi = async (payload: RemoveServiceTagsParams) => {
  const { data } = await ApiInstance.delete(
    `/${BankItemController.RemoveServiceTags}`,
    { data: payload },
  );
  return data;
};

export const useAddResourceTags = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.tags.addResource(),
    mutationFn: addResourceTagsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resources });
      successToast(i18n.t("categoryBank.toast.tagsAdded", "Tags added"));
    },
    onError: () => {
      errorToast(i18n.t("categoryBank.toast.tagsAddError", "Failed to add tags"));
    },
  });
};

export const useAddServiceTags = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.tags.addService(),
    mutationFn: addServiceTagsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services });
      successToast(i18n.t("categoryBank.toast.tagsAdded", "Tags added"));
    },
    onError: () => {
      errorToast(i18n.t("categoryBank.toast.tagsAddError", "Failed to add tags"));
    },
  });
};

export const useRemoveResourceTags = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.tags.removeResource(),
    mutationFn: removeResourceTagsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resources });
      successToast(i18n.t("categoryBank.toast.tagsRemoved", "Tags removed"));
    },
    onError: () => {
      errorToast(i18n.t("categoryBank.toast.tagsRemoveError", "Failed to remove tags"));
    },
  });
};

export const useRemoveServiceTags = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.tags.removeService(),
    mutationFn: removeServiceTagsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services });
      successToast(i18n.t("categoryBank.toast.tagsRemoved", "Tags removed"));
    },
    onError: () => {
      errorToast(i18n.t("categoryBank.toast.tagsRemoveError", "Failed to remove tags"));
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.category.delete(),
    mutationFn: deleteCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bankCategories });
      successToast(i18n.t("categoryBank.toast.deleteSuccess", "Category deleted"));
    },
    onError: () => {
      errorToast(i18n.t("categoryBank.toast.deleteError", "Failed to delete category"));
    },
  });
};