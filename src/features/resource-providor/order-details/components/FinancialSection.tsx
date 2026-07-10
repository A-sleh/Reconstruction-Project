import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { FileText, Plus } from "lucide-react";
import z from "zod";
import i18n from "@/lib/i18n";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import Input from "@/components/inputs/Input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router";
import { formatDate } from "@/lib/helpers";
import { OrderPayment } from "@/features/orders/api/types";
import { useAddPayment } from "@/features/orders/api/actions";

const PaymentSchema = z.object({
  amount: z.coerce.number().positive({
    message: i18n.t(
      "resourceProvidor.investor-request-details.financials.form.validation.positive_amount",
    ),
  }),
  paymentDate: z.string().min(1, {
    message: i18n.t(
      "resourceProvidor.investor-request-details.financials.form.validation.required",
    ),
  }),
});

type PaymentFormValues = z.infer<typeof PaymentSchema>;

const initialPaymentFormValues: PaymentFormValues = {
  amount: 0,
  paymentDate: new Date().toISOString().split("T")[0],
};

interface FinancialSectionProps {
  payments: OrderPayment[];
  totalPaid: number;
}

const FinancialSection = ({
  payments,
  totalPaid,
}: FinancialSectionProps) => {
  const { orderId = "" } = useParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { mutate: addPayment, isPending } = useAddPayment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: initialPaymentFormValues,
  });

  const onSubmit = (data: PaymentFormValues) => {
    addPayment(
      {
        orderId: Number(orderId),
        amount: data.amount,
        paymentDate: data.paymentDate,
      },
      {
        onSuccess: () => {
          reset(initialPaymentFormValues);
        },
      },
    );
  };

  return (
    <div
      className="grid lg:grid-cols-3 gap-6 my-4"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Invoices List Card Box */}
      <div className="lg:col-span-2 rounded-xl border border-gray-300 bg-card overflow-hidden bg-white">
        <div className="p-4 border-b border-gray-300 flex items-center justify-between bg-white">
          <h3 className="font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t(
              `resourceProvidor.investor-request-details.financials.invoice_box.title`,
            )}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t(
              `resourceProvidor.investor-request-details.financials.invoice_box.total`,
              {
                amount: totalPaid.toLocaleString(),
              },
            )}
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className={isArabic ? "text-right" : "text-left"}>
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {t(
                  `resourceProvidor.investor-request-details.financials.invoice_box.columns.date`,
                )}
              </TableHead>
              <TableHead className={isArabic ? "text-left" : "text-right"}>
                {t(
                  `resourceProvidor.investor-request-details.financials.invoice_box.columns.quantity`,
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment, idx) => (
              <TableRow key={idx}>
                <TableCell
                  className={`font-medium ${isArabic ? "text-right" : "text-left"}`}
                >
                  {formatDate(payment.paymentDate, isArabic)}
                </TableCell>
                  <TableCell
                    className={`font-semibold ${isArabic ? "text-left" : "text-right"}`}
                  >
                    {payment.amount}
                  </TableCell>
                </TableRow>
              ))
            }
            {payments.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  {t(
                    `resourceProvidor.investor-request-details.financials.invoice_box.empty`,
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Creation/Record Form Box Panel managed by React Hook Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border border-gray-300 bg-white p-4 space-y-3 h-fit shadow-sm"
      >
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <Plus className="h-4 w-4" />
          {t(`resourceProvidor.investor-request-details.financials.form.title`)}
        </h3>

        <Input
          label={t(
            `resourceProvidor.investor-request-details.financials.form.fields.amount`,
          )}
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          disabled={isPending}
          {...register("amount")}
          fieldName="amount"
          errors={errors}
        />

        <Input
          label={t(
            `resourceProvidor.investor-request-details.financials.form.fields.date`,
          )}
          type="date"
          disabled={isPending}
          {...register("paymentDate")}
          fieldName="paymentDate"
          errors={errors}
        />

        <Button
          type="submit"
          variant="default"
          className="w-full mt-4"
          disabled={isPending}
        >
          {isPending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            t(
              `resourceProvidor.investor-request-details.financials.form.submit`,
            )
          )}
        </Button>
      </form>
    </div>
  );
};

export default FinancialSection;
