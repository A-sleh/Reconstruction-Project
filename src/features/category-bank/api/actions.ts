import { errorToast, successToast } from "@/components/common/Toast";
import ApiInstance from "@/config/api-instance";
import i18n from "@/lib/i18n";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BankItemController, MUTATION_KEYS, QUERY_KEYS } from ".";
import {
  AddRequestParams,
  AddResourceTagsParams,
  AddServiceTagsParams,
  ApproveRequestParams,
  CategoryPayload,
  CreateResourcePayload,
  CreateServicePayload,
  RejectRequestParams,
  RemoveResourceTagsParams,
  RemoveServiceTagsParams,
  ResolveRequestParams,
  UpdateResourcePayload,
  UpdateServicePayload,
} from "./types";

// ==========================================
// API Fetchers
// ==========================================
const resolveRequest = async (payload: ResolveRequestParams) => {
  const { data } = await ApiInstance.put(
    `/${BankItemController.ResolveRequest}`,
    payload,
  );
  return data;
};

const rejectRequest = async (payload: RejectRequestParams) => {
  const { data } = await ApiInstance.put(
    `/${BankItemController.RejectRequest}`,
    payload,
  );
  return data;
};

const approveRequest = async ({ RequestId }: ApproveRequestParams) => {
  const { data } = await ApiInstance.put(
    `/${BankItemController.ApproveRequest}`,
    {},
    { params: { requestId: RequestId } },
  );
  return data;
};

const addRequest = async (payload: AddRequestParams) => {
  const { data } = await ApiInstance.post(
    `/${BankItemController.AddRequest}`,
    payload,
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
      successToast(
        i18n.t("categoryBank.toast.resolveSuccess", "Request resolved"),
      );
    },
    onError: () => {
      errorToast(
        i18n.t("categoryBank.toast.resolveError", "Failed to resolve request"),
      );
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
      successToast(
        i18n.t("categoryBank.toast.rejectSuccess", "Request rejected"),
      );
    },
    onError: () => {
      errorToast(
        i18n.t("categoryBank.toast.rejectError", "Failed to reject request"),
      );
    },
  });
};

export const useCancelBankItemRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.bankItems.reject(),
    mutationFn: rejectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bankItems.all });
      successToast(
        i18n.t("categoryBank.toast.cancelSuccess", "Request cancelled"),
      );
    },
    onError: () => {
      errorToast(
        i18n.t("categoryBank.toast.cancelError", "Failed to cancel request"),
      );
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
      successToast(
        i18n.t("categoryBank.toast.approveSuccess", "Request approved"),
      );
    },
    onError: () => {
      errorToast(
        i18n.t("categoryBank.toast.approveError", "Failed to approve request"),
      );
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
      successToast(
        i18n.t("categoryBank.toast.createSuccess", "Request added"),
      );
    },
    onError: () => {
      errorToast(
        i18n.t("categoryBank.toast.createError", "Failed to add request"),
      );
    },
  });
};

// ==========================================
// Bank Category CRUD
// ==========================================
const createCategoryApi = async (
  payload: Omit<CategoryPayload, "id">,
): Promise<CategoryPayload> => {
  const { data } = await ApiInstance.post(
    `/${BankItemController.CreateCategory}`,
    payload,
  );
  return data;
};

const updateCategoryApi = async (
  payload: CategoryPayload,
): Promise<CategoryPayload> => {
  const { data } = await ApiInstance.put(
    `/${BankItemController.UpdateCategory}`,
    payload,
  );
  return data;
};

const deleteCategoryApi = async (id: number) => {
  const { data } = await ApiInstance.delete(
    `/${BankItemController.DeleteCategory}`,
    {
      params: { id },
    },
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
      successToast(
        i18n.t("categoryBank.toast.createSuccess", "Category created"),
      );
    },
    onError: () => {
      errorToast(
        i18n.t("categoryBank.toast.createError", "Failed to create category"),
      );
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
      successToast(
        i18n.t("categoryBank.toast.updateSuccess", "Category updated"),
      );
    },
    onError: () => {
      errorToast(
        i18n.t("categoryBank.toast.updateError", "Failed to update category"),
      );
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
  const { data } = await ApiInstance.post(
    `/${BankItemController.RemoveResourceTags}`,
    { data: payload },
  );
  return data;
};

const removeServiceTagsApi = async (payload: RemoveServiceTagsParams) => {
  const { data } = await ApiInstance.post(
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
      errorToast(
        i18n.t("categoryBank.toast.tagsAddError", "Failed to add tags"),
      );
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
      errorToast(
        i18n.t("categoryBank.toast.tagsAddError", "Failed to add tags"),
      );
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
      errorToast(
        i18n.t("categoryBank.toast.tagsRemoveError", "Failed to remove tags"),
      );
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
      errorToast(
        i18n.t("categoryBank.toast.tagsRemoveError", "Failed to remove tags"),
      );
    },
  });
};

// ==========================================
// Bank Item CRUD - Services
// ==========================================
const createServiceApi = async (payload: CreateServicePayload) => {
  const { data } = await ApiInstance.post(
    `/${BankItemController.AddService}`,
    payload,
  );
  return data;
};

const updateServiceApi = async (payload: UpdateServicePayload) => {
  const { data } = await ApiInstance.put(
    `/${BankItemController.UpdateService}`,
    payload,
  );
  return data;
};

const deleteServiceApi = async (serviceBankId: number) => {
  const { data } = await ApiInstance.delete(
    `/${BankItemController.DeleteService}`,
    { params: { BankId: serviceBankId } },
  );
  return data;
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.bankItem.createService(),
    mutationFn: createServiceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services });
      successToast(
        i18n.t("categoryBank.toast.serviceCreated", "Service created"),
      );
    },
    onError: () => {
      errorToast(
        i18n.t(
          "categoryBank.toast.serviceCreateError",
          "Failed to create service",
        ),
      );
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.bankItem.updateService(),
    mutationFn: updateServiceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services });
      successToast(
        i18n.t("categoryBank.toast.serviceUpdated", "Service updated"),
      );
    },
    onError: () => {
      errorToast(
        i18n.t(
          "categoryBank.toast.serviceUpdateError",
          "Failed to update service",
        ),
      );
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.bankItem.deleteService(),
    mutationFn: deleteServiceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.services });
      successToast(
        i18n.t("categoryBank.toast.serviceDeleted", "Service deleted"),
      );
    },
    onError: () => {
      errorToast(
        i18n.t(
          "categoryBank.toast.serviceDeleteError",
          "Failed to delete service",
        ),
      );
    },
  });
};

// ==========================================
// Bank Item CRUD - Resources
// ==========================================
const createResourceItemApi = async (payload: CreateResourcePayload) => {
  const { data } = await ApiInstance.post(
    `/${BankItemController.AddResource}`,
    payload,
  );
  return data;
};

const updateResourceItemApi = async (payload: UpdateResourcePayload) => {
  const { data } = await ApiInstance.put(
    `/${BankItemController.UpdateResource}`,
    payload,
  );
  return data;
};

const deleteResourceItemApi = async (resourceBankId: number) => {
  const { data } = await ApiInstance.delete(
    `/${BankItemController.DeleteResource}`,
    { params: { BankId: resourceBankId } },
  );
  return data;
};

export const useCreateResourceItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.bankItem.createResource(),
    mutationFn: createResourceItemApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resources });
      successToast(
        i18n.t("categoryBank.toast.resourceCreated", "Resource created"),
      );
    },
    onError: () => {
      errorToast(
        i18n.t(
          "categoryBank.toast.resourceCreateError",
          "Failed to create resource",
        ),
      );
    },
  });
};

export const useUpdateResourceItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.bankItem.updateResource(),
    mutationFn: updateResourceItemApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resources });
      successToast(
        i18n.t("categoryBank.toast.resourceUpdated", "Resource updated"),
      );
    },
    onError: () => {
      errorToast(
        i18n.t(
          "categoryBank.toast.resourceUpdateError",
          "Failed to update resource",
        ),
      );
    },
  });
};

export const useDeleteResourceItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: MUTATION_KEYS.bankItem.deleteResource(),
    mutationFn: deleteResourceItemApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.resources });
      successToast(
        i18n.t("categoryBank.toast.resourceDeleted", "Resource deleted"),
      );
    },
    onError: () => {
      errorToast(
        i18n.t(
          "categoryBank.toast.resourceDeleteError",
          "Failed to delete resource",
        ),
      );
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
      successToast(
        i18n.t("categoryBank.toast.deleteSuccess", "Category deleted"),
      );
    },
    onError: () => {
      errorToast(
        i18n.t("categoryBank.toast.deleteError", "Failed to delete category"),
      );
    },
  });
};
