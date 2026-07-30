import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { BankItemController, QUERY_KEYS, MUTATION_KEYS } from ".";
import {
  ResolveRequestParams,
  RejectRequestParams,
  ApproveRequestParams,
  AddRequestParams,
  CategoryPayload,
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
    },
  });
};