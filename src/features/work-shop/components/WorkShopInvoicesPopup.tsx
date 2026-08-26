import { FileText, Paperclip } from "lucide-react";
import { useTranslation } from "react-i18next";
import PopuupLayout from "@/components/layouts/Popup-layout";
import type { InvoicePayload } from "../api/types";
import { MOCK_INVOICES_BY_WORK_SHOP } from "../mock/mockInvoices";
import type { WorkShop } from "../api/types";

interface Props {
  openKey: string;
  workShop: WorkShop;
  invoices?: InvoicePayload[];
  openButton?: React.ReactNode | null;
}

export function WorkShopInvoicesPopup({
  openKey,
  workShop,
  invoices,
  openButton,
}: Props) {
  const { t, i18n } = useTranslation();

  const list = invoices ?? MOCK_INVOICES_BY_WORK_SHOP[workShop.id] ?? [];

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString(i18n.language === "ar" ? "ar" : "en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <PopuupLayout
      openKey={openKey}
      title={t("workShops.invoices.popup.title", "Workshop Invoices")}
      subTitle={workShop.title}
      openButton={openButton}
    >
      <div className="space-y-3 overflow-auto max-h-130">
        {list.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            {t(
              "workShops.invoices.popup.empty",
              "No invoices recorded for this workshop yet.",
            )}
          </p>
        ) : (
          list.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center gap-3 rounded-lg border border-gray-300 bg-muted/30 p-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {invoice.description ||
                    t("workShops.invoices.popup.unnamed", "Invoice")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(invoice.data)}
                  {invoice.attachments.length > 0 && (
                    <span className="ms-2 inline-flex items-center gap-1">
                      <Paperclip className="h-3 w-3" />
                      {invoice.attachments.length}
                    </span>
                  )}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                {invoice.payedAmount.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </PopuupLayout>
  );
}

export default WorkShopInvoicesPopup;
