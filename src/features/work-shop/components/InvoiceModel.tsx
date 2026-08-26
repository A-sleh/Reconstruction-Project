import { useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Input from "@/components/inputs/Input";
import Model from "@/components/model/Model";
import PopuupLayout from "@/components/layouts/Popup-layout";
import AttachmentList, {
  type AttachmentListHandle,
} from "@/features/attachment/components/AttachmentList";
import {
  initialInvoiceValues,
  invoiceFormSchema,
  useAddInvoice,
  type InvoiceFormValues,
} from "../api/actions";

interface Props {
  openKey: string;
  workShopId: number;
  openButton?: ReactNode | null;
}

export function InvoiceModel({ openKey, workShopId, openButton }: Props) {
  const { t } = useTranslation();
  const [listKey, setListKey] = useState(0);
  const attachmentListRef = useRef<AttachmentListHandle>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: initialInvoiceValues,
    criteriaMode: "all",
    mode: "onSubmit",
  });

  const { mutate: addInvoice, isPending: isSaving } = useAddInvoice();

  const onSubmit = (values: InvoiceFormValues, close: () => void) => {
    const attachments =
      attachmentListRef.current?.getValues().map((a) => a.id) ?? [];
    addInvoice(
      {
        workShopId,
        data: new Date(values.data),
        description: values.description,
        payedAmount: values.payedAmount,
        attachments,
      },
      {
        onSuccess: () => {
          reset();
          setListKey((k) => k + 1);
          close();
        },
      },
    );
  };

  return (
    <PopuupLayout
      openKey={openKey}
      title={t("workShops.invoice.title", "New Invoice")}
      subTitle={t(
        "workShops.invoice.subTitle",
        "Record a payment made to this workshop.",
      )}
      openButton={
        openButton || (
          <Button className="shrink-0">
            <Plus className="h-4 w-4" />
            {t("workShops.invoice.trigger", "Add Invoice")}
          </Button>
        )
      }
    >
      {(close: () => void) => (
        <form
          onSubmit={handleSubmit((values) => onSubmit(values, close))}
          className="space-y-5 overflow-auto max-h-130"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              type="number"
              min={0}
              label={t("workShops.fields.payedAmount", "Paid Amount")}
              placeholder="0"
              fieldName="payedAmount"
              errors={errors}
              {...register("payedAmount")}
            />
            <Input
              type="date"
              label={t("workShops.fields.invoiceDate", "Date")}
              fieldName="data"
              errors={errors}
              {...register("data")}
            />
          </div>

          <Input
            label={t("workShops.fields.invoiceDescription", "Description")}
            placeholder={t(
              "workShops.placeholders.invoiceDescription",
              "e.g. Second payment for concrete works",
            )}
            fieldName="description"
            errors={errors}
            {...register("description")}
          />

          <AttachmentList
            key={listKey}
            ref={attachmentListRef}
            mode="self-contained"
          />

          <div className="flex justify-end gap-3 pt-2">
            <Model.Close>
              <Button type="button" variant="outline">
                {t("common.cancel", "Cancel")}
              </Button>
            </Model.Close>
            <Button
              type="submit"
              disabled={isSaving}
              isLoading={isSaving}
            >
              {isSaving
                ? t("common.loading", "Saving...")
                : t("common.create", "Add Invoice")}
            </Button>
          </div>
        </form>
      )}
    </PopuupLayout>
  );
}

export default InvoiceModel;
