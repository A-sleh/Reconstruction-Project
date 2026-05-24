import z from "zod";
import i18n from "@/lib/i18n";
import ApiInstance from "@/config/api-instance";
import { InvestorRequestDetailsController, MUTATION_KEYS } from ".";
import { useMutation } from "@tanstack/react-query";
import { errorToast, successToast } from "@/components/common/Toast";

export const InvoiceSchema = z.object({
  number: z.string().min(1, {
    message: i18n.t(
      `resourceProvidor.investor-request-details.financials.form.validation.required`,
    ),
  }),
  amount: z.coerce
    .number()
    .positive({
      message: i18n.t(
        `resourceProvidor.investor-request-details.financials.form.validation.positive_amount`,
      ),
    })
    .min(0.01, {
      message: i18n.t(
        `resourceProvidor.investor-request-details.financials.form.validation.positive_amount`,
      ),
    }),
  date: z.string().min(1, {
    message: i18n.t(
      `resourceProvidor.investor-request-details.financials.form.validation.required`,
    ),
  }),
});
export type InvoiceFormValues = z.infer<typeof InvoiceSchema>;
export const initialInvoiceFormValues: InvoiceFormValues = {
  number: "",
  amount: 0,
  date: new Date().toISOString().split("T")[0], // Defaults gracefully to today
};

const createInvoiceApi = async (
  orderId: number | string,
  payload: InvoiceFormValues,
): Promise<InvoiceFormValues> => {
  const { data } = await ApiInstance.post(
    `/${InvestorRequestDetailsController.InvestorRequestDetails}/${orderId}/invoice`,
    payload,
  );
  return data;
};

const updateResourceItemQuantity = async (
  orderId: string | number,
  payload: Record<string, number>,
) => {
  const { data } = await ApiInstance.put(
    `/${InvestorRequestDetailsController.InvestorRequestOrders}/orders/${orderId}`,
    payload,
  );
  return data;
};

const markFullyDeliveredApi = async (id: string | number) => {
  const { data } = await ApiInstance.post(
    `/${InvestorRequestDetailsController.InvestorRequestDetails}/${id}/make-full-delivered`,
  );
  return data;
};

export const useCreateInvoice = () => {
  return useMutation({
    mutationFn: (params: {
      orderId: number | string;
      payload: InvoiceFormValues;
    }) => createInvoiceApi(params.orderId, params.payload),
    mutationKey: MUTATION_KEYS.investorRequestDetails.createInvoice(),
    onSuccess: (_: any) => {
      successToast(
        i18n.t(
          "resourceProvidor.investor-request-details.financials.create-invoice-success",
        ),
      );
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t(
          "resourceProvidor.investor-request-details.financials.create-invoice-error",
        );
      errorToast(message);
    },
  });
};

export const useUpdateOrderItemsQuantity = () => {
  return useMutation({
    mutationFn: (params: {
      orderId: number | string;
      payload: Record<string, number>;
    }) => updateResourceItemQuantity(params.orderId, params.payload),
    mutationKey: MUTATION_KEYS.investorRequestDetails.updateQuantity(),
    onSuccess: (_: any) => {
      successToast(
        i18n.t("resourceProvidor.investor-request-details.update-quantity-success"),
      );
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t("resourceProvidor.investor-request-details.update-quantity-error");
      errorToast(message);
    },
  });
};

export const useMarkOrderFullyDelivered = () => {
  return useMutation({
    mutationFn: (id: number | string) => markFullyDeliveredApi(id),
    mutationKey: MUTATION_KEYS.investorRequestDetails.fullyDelivered(),
    onSuccess: (_: any) => {
      successToast(
        i18n.t("resourceProvidor.investor-request-details.delivered-success"),
      );
    },
    onError: (error: any) => {
      const serverMessage = error?.response?.data?.message || error?.message;
      const message =
        serverMessage ||
        i18n.t("resourceProvidor.investor-request-details.delivered-error");
      errorToast(message);
    },
  });
};
