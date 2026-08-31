import { type ReactNode, useRef, useState } from "react";

import { Plus } from "lucide-react";
import { type Resolver, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import Input from "@/components/inputs/Input";
import PopuupLayout from "@/components/layouts/Popup-layout";
import Model from "@/components/model/Model";
import { Button } from "@/components/ui/button";
import AttachmentList, {
  type AttachmentListHandle,
} from "@/features/attachment/components/AttachmentList";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  initialInvoiceValues,
  invoiceFormSchema,
  type InvoiceFormValues,
  useAddInvoice,
} from "../api/actions";

interface Props {
  openKey: string;
  workShopId: number;
  openButton?: ReactNode | null;
}

export function InvoiceModel({ openKey, workShopId, openButton }: Props) {
  const { t } = useTranslation();
  const { projectId } = useParams<{ projectId?: string }>();
  const [listKey, setListKey] = useState(0);
  const attachmentListRef = useRef<AttachmentListHandle>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: zodResolver(
      invoiceFormSchema,
    ) as unknown as Resolver<InvoiceFormValues>,
    defaultValues: initialInvoiceValues,
    criteriaMode: "all",
    mode: "onSubmit",
  });

  const { mutate: addInvoice, isPending: isSaving } = useAddInvoice();

  const onSubmit = (values: InvoiceFormValues, close: () => void) => {
    // const attachments =
    //   attachmentListRef.current?.getValues().map((a) => a.id) ?? [];
    addInvoice(
      {
        workshopId: Number(workShopId),
        paymentDate: new Date(values.data),
        amount: values.payedAmount,
        projectId: Number(projectId),
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
            <Button type="submit" disabled={isSaving} isLoading={isSaving}>
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
