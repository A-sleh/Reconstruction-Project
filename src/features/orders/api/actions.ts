import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { InvestorRequestController, QUERY_KEYS, MUTATION_KEYS } from ".";
import {
  AddPaymentRequestBody,
  AddReceiveInvoiceRequestBody,
  OrderByIdParams,
} from "./types";

// ==========================================
// 1. API Fetchers (Bringing in your original code)
// ==========================================

const approveOrder = async ({ OrderId }: OrderByIdParams) => {
  const { data } = await ApiInstance.post(
    `/${InvestorRequestController.AcceptOrder}`,
    {},
    { params: { orderId: OrderId } },
  );
  return data;
};

const rejectOrder = async ({ OrderId }: OrderByIdParams) => {
  const { data } = await ApiInstance.post(
    `/${InvestorRequestController.RejectOrder}`,
    {},
    { params: { orderId: OrderId } },
  );
  return data;
};

const addAddPayment = async (payload: AddPaymentRequestBody) => {
  const { data } = await ApiInstance.post(
    `/${InvestorRequestController.AddPayment}`,
    payload,
  );
  return data;
};

const addReceiveInvoice = async (payload: AddReceiveInvoiceRequestBody) => {
  const { data } = await ApiInstance.post(
    `/${InvestorRequestController.AddReceiveInvoice}`,
    payload,
  );
  return data;
};

// ==========================================
// 2. Custom Mutation Hooks
// ==========================================

/**
 * Hook to approve an order. Automatically invalidates the order lists and details.
 */
export const useApproveOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.orders.accept(),
    mutationFn: approveOrder,
    onSuccess: (data, variables) => {
      // Invalidate the generic order list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });

      // If you implement a specific detail cache later, you can invalidate it like this:
      // queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.orders.detail(), variables.OrderId] });
    },
  });
};

/**
 * Hook to reject an order.
 */
export const useRejectOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.orders.reject(),
    mutationFn: rejectOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
    },
  });
};

/**
 * Hook to record a new payment.
 */
export const useAddPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.orders.addPayment(),
    mutationFn: addAddPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
    },
  });
};

/**
 * Hook to add a received invoice.
 */
export const useAddReceiveInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.orders.addReceiveInvoice(),
    mutationFn: addReceiveInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
    },
  });
};
