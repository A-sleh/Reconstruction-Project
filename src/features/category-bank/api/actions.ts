import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { BankItemController, QUERY_KEYS, MUTATION_KEYS } from ".";
import {
  ResolveRequestParams,
  RejectRequestParams,
  ApproveRequestParams,
  AddRequestParams,
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