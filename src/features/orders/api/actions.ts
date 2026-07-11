import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApiInstance from "@/config/api-instance";
import { successToast, errorToast } from "@/components/common/Toast";
import i18n from "i18next";
import { InvestorRequestController, QUERY_KEYS, MUTATION_KEYS } from ".";
import {
  AddPaymentRequestBody,
  AddReceiveInvoiceRequestBody,
  ApproveOrderCancellationRequestBody,
  ApproveOrderItemCancellationRequestBody,
  CancelOrderItemRequestBody,
  CancelOrderRequestBody,
  MarkAsReceivedRequestBody,
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

const rejectOrder = async ({
  OrderId,
  reason,
}: OrderByIdParams & { reason: string }) => {
  const { data } = await ApiInstance.post(
    `/${InvestorRequestController.RejectOrder}`,
    {
      reason,
    },
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

const approveOrderItemCancellation = async (
  payload: ApproveOrderItemCancellationRequestBody,
) => {
  const { data } = await ApiInstance.post(
    `/${InvestorRequestController.ApproveOrderItemCancellation}`,
    payload,
  );
  return data;
};

const markAsReceived = async (payload: MarkAsReceivedRequestBody) => {
  const { data } = await ApiInstance.post(
    `/${InvestorRequestController.MarkAsReceived}`,
    payload,
  );
  return data;
};

const cancelOrder = async (payload: CancelOrderRequestBody) => {
  const { data } = await ApiInstance.post(
    `/${InvestorRequestController.CancelOrder}`,
    payload,
  );
  return data;
};

const cancelOrderItem = async (payload: CancelOrderItemRequestBody) => {
  const { data } = await ApiInstance.post(
    `/${InvestorRequestController.CancelOrderItem}`,
    payload,
  );
  return data;
};

const approveOrderCancellation = async (
  payload: ApproveOrderCancellationRequestBody,
) => {
  const { data } = await ApiInstance.post(
    `/${InvestorRequestController.ApproveOrderCancellation}`,
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
      successToast(i18n.t("orders.toast.approveOrderSuccess"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message = serverMessage || i18n.t("orders.toast.approveOrderError");
      errorToast(message);
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
      successToast(i18n.t("orders.toast.rejectOrderSuccess"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message = serverMessage || i18n.t("orders.toast.rejectOrderError");
      errorToast(message);
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
      successToast(i18n.t("orders.toast.addPaymentSuccess"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message = serverMessage || i18n.t("orders.toast.addPaymentError");
      errorToast(message);
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
      successToast(i18n.t("orders.toast.addReceiveInvoiceSuccess"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message = serverMessage || i18n.t("orders.toast.addReceiveInvoiceError");
      errorToast(message);
    },
  });
};

export const useApproveOrderItemCancellation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.orders.approveOrderItemCancellation(),
    mutationFn: approveOrderItemCancellation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      successToast(i18n.t("orders.toast.approveOrderItemCancellationSuccess"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message = serverMessage || i18n.t("orders.toast.approveOrderItemCancellationError");
      errorToast(message);
    },
  });
};

export const useMarkAsReceived = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.orders.markAsReceived(),
    mutationFn: markAsReceived,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      successToast(i18n.t("orders.toast.markAsReceivedSuccess"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message = serverMessage || i18n.t("orders.toast.markAsReceivedError");
      errorToast(message);
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.orders.cancelOrder(),
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      successToast(i18n.t("orders.toast.cancelOrderSuccess"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message = serverMessage || i18n.t("orders.toast.cancelOrderError");
      errorToast(message);
    },
  });
};

export const useCancelOrderItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.orders.cancelOrderItem(),
    mutationFn: cancelOrderItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      successToast(i18n.t("orders.toast.cancelOrderItemSuccess"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message = serverMessage || i18n.t("orders.toast.cancelOrderItemError");
      errorToast(message);
    },
  });
};

export const useApproveOrderCancellation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.orders.approveOrderCancellation(),
    mutationFn: approveOrderCancellation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all });
      successToast(i18n.t("orders.toast.approveOrderCancellationSuccess"));
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message = serverMessage || i18n.t("orders.toast.approveOrderCancellationError");
      errorToast(message);
    },
  });
};
