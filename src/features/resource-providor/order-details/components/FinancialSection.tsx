import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { FileText, Plus } from "lucide-react";

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
import { Invoice } from "../../orders/api";
import {
  initialInvoiceFormValues,
  InvoiceFormValues,
  InvoiceSchema,
  useCreateInvoice,
} from "../api/actions";
import { useParams } from "react-router";

interface FinancialSectionProps {
  invoices: Invoice[];
  totalInvoiced: number;
}

const FinancialSection = ({
  invoices,
  totalInvoiced,
}: FinancialSectionProps) => {
  const { orderId = "" } = useParams();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { mutate: createInvoice, isPending } = useCreateInvoice();

  // Initialize React Hook Form with Zod validation resolver baseline
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: initialInvoiceFormValues,
  });

  const onSubmit = (data: InvoiceFormValues) => {
    createInvoice(
      { orderId, payload: data },
      {
        onSuccess: () => {
          reset(initialInvoiceFormValues);
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
                amount: totalInvoiced.toLocaleString(),
              },
            )}
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className={isArabic ? "text-right" : "text-left"}>
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {t(
                  `resourceProvidor.investor-request-details.financials.invoice_box.columns.number`,
                )}
              </TableHead>
              <TableHead className={isArabic ? "text-right" : "text-left"}>
                {t(
                  `resourceProvidor.investor-request-details.financials.invoice_box.columns.date`,
                )}
              </TableHead>
              <TableHead className={isArabic ? "text-left" : "text-right"}>
                {t(
                  `resourceProvidor.investor-request-details.financials.invoice_box.columns.amount`,
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((i) => (
              <TableRow key={i.id}>
                <TableCell
                  className={`font-medium ${isArabic ? "text-right" : "text-left"}`}
                >
                  {i.number}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(i.date).toLocaleDateString()}
                </TableCell>
                <TableCell
                  className={`font-semibold ${isArabic ? "text-left" : "text-right"}`}
                >
                  ${i.amount.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
            {invoices.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
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
            `resourceProvidor.investor-request-details.financials.form.fields.number`,
          )}
          placeholder="INV-1234"
          disabled={isPending}
          {...register("number")}
          fieldName="number"
          errors={errors}
        />

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
          {...register("date")}
          fieldName="date"
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
