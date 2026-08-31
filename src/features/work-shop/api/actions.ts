import { errorToast, successToast } from "@/components/common/Toast";
import ApiInstance from "@/config/api-instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import i18n from "i18next";
import { z } from "zod";
import { MUTATION_KEYS, QUERY_KEYS, WorkShopController } from ".";
import type {
  AddInvoicePayload,
  AddWorkShopsPayload,
  AddWorkShopPaymentPayload,
  UpdateWorkShopPayload,
} from "./types";
import { WORK_SHOP_STATUSES } from "./types";

export const workShopFormSchema = z.object({
  jobTitle: z
    .string()
    .min(1, i18n.t("workShops.validation.title", "Title is required"))
    .trim(),
  description: z
    .string()
    .min(1, i18n.t("workShops.validation.description", "Description is required"))
    .trim(),
  memberNumber: z.coerce
    .number()
    .int()
    .min(1, i18n.t("workShops.validation.workerNumber", "At least one worker")),
  supervisorPhoneNumber: z
    .string()
    .min(1, i18n.t("workShops.validation.phone", "Phone number is required")),
  totalCost: z.coerce
    .number()
    .min(0, i18n.t("workShops.validation.totalCost", "Invalid amount")),
  startWorkDate: z
    .string()
    .min(1, i18n.t("workShops.validation.startWorkDate", "Start date is required")),
  endWorkDate: z
    .string()
    .min(1, i18n.t("workShops.validation.endWorkDate", "End date is required")),
  status: z.enum(WORK_SHOP_STATUSES),
});

export type WorkShopFormValues = z.infer<typeof workShopFormSchema>;

export const initialWorkShopValues: WorkShopFormValues = {
  jobTitle: "",
  description: "",
  memberNumber: 1,
  supervisorPhoneNumber: "",
  totalCost: 0,
  startWorkDate: "",
  endWorkDate: "",
  status: "Pending",
};

export const invoiceFormSchema = z.object({
  data: z
    .string()
    .min(1, i18n.t("workShops.validation.invoiceDate", "Date is required")),
  description: z
    .string()
    .min(
      1,
      i18n.t("workShops.validation.invoiceDescription", "Description is required"),
    )
    .trim(),
  payedAmount: z.coerce
    .number()
    .positive(i18n.t("workShops.validation.payedAmount", "Amount must be greater than zero")),
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

export const initialInvoiceValues: InvoiceFormValues = {
  data: "",
  description: "",
  payedAmount: 0,
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isAxiosError(error)) {
    const serverMessage = (
      error.response?.data as { message?: string } | undefined
    )?.message;
    return serverMessage || error.message || fallback;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

const createWorkShopApi = async (
  payload: AddWorkShopsPayload,
): Promise<void> => {
  await ApiInstance.post(`/${WorkShopController.Create}`, payload);
};

const updateWorkShopApi = async (
  payload: UpdateWorkShopPayload,
): Promise<void> => {
  await ApiInstance.put(`/${WorkShopController.Update}`, payload);
};

const deleteWorkShopApi = async (id: number): Promise<void> => {
  await ApiInstance.delete(`/${WorkShopController.Delete}`, {
    params: { WorkshopId: id },
  });
};

const addWorkShopPaymentApi = async (
  payload: AddWorkShopPaymentPayload,
): Promise<void> => {
  await ApiInstance.post(`/${WorkShopController.AddPayment}`, payload);
};

const addInvoiceApi = async (payload: AddInvoicePayload): Promise<void> => {
  await ApiInstance.post(`/${WorkShopController.AddInvoice}`, payload);
};

export const useCreateWorkShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.workShops.create(),
    mutationFn: createWorkShopApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.workShops.all,
      });
      successToast(i18n.t("workShops.toast.createSuccess", "Workshop created"));
    },
    onError: (error) => {
      errorToast(
        getErrorMessage(
          error,
          i18n.t("workShops.toast.createError", "Failed to create workshop"),
        ),
      );
    },
  });
};

export const useUpdateWorkShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.workShops.update(),
    mutationFn: updateWorkShopApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.workShops.all,
      });
      successToast(i18n.t("workShops.toast.updateSuccess", "Workshop updated"));
    },
    onError: (error) => {
      errorToast(
        getErrorMessage(
          error,
          i18n.t("workShops.toast.updateError", "Failed to update workshop"),
        ),
      );
    },
  });
};

export const useDeleteWorkShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.workShops.delete(),
    mutationFn: deleteWorkShopApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.workShops.all,
      });
      successToast(i18n.t("workShops.toast.deleteSuccess", "Workshop deleted"));
    },
    onError: (error) => {
      errorToast(
        getErrorMessage(
          error,
          i18n.t("workShops.toast.deleteError", "Failed to delete workshop"),
        ),
      );
    },
  });
};

export const useAddWorkShopPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.workShops.addPayment(),
    mutationFn: addWorkShopPaymentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.workShops.all,
      });
      successToast(
        i18n.t("workShops.toast.paymentSuccess", "Payment added"),
      );
    },
    onError: (error) => {
      errorToast(
        getErrorMessage(
          error,
          i18n.t("workShops.toast.paymentError", "Failed to add payment"),
        ),
      );
    },
  });
};

export const useAddInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: MUTATION_KEYS.workShops.addInvoice(),
    mutationFn: addInvoiceApi,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.workShops.invoices(variables.workShopId),
      });
      successToast(i18n.t("workShops.toast.invoiceSuccess", "Invoice added"));
    },
    onError: (error) => {
      errorToast(
        getErrorMessage(
          error,
          i18n.t("workShops.toast.invoiceError", "Failed to add invoice"),
        ),
      );
    },
  });
};