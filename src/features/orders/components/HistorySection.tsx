import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, CheckCircle2, Clock, Package } from "lucide-react";
import {  OrderReceiveInvoice } from "@/features/orders/api/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/helpers";

interface HistorySectionProps {
  invoices: OrderReceiveInvoice[];
}

const HistorySection = ({ invoices }: HistorySectionProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setExpandedIdx((prev) => (prev === idx ? null : idx));
  };

  if (invoices.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 my-2 mb-4 text-center">
        <Package className="h-10 w-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-400">
          {t("resourceProvidor.investor-request-details.history_section.empty")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden my-2 mb-4" dir={isArabic ? "rtl" : "ltr"}>
      {invoices.map((invoice, idx) => {
        const isExpanded = expandedIdx === idx;
        const itemCount = invoice.receiveInvoiceItems.length;

        return (
          <div
            key={idx}
            className={cn("border-b border-gray-100 last:border-b-0")}
          >
            {/* Header Row */}
            <button
              onClick={() => toggle(idx)}
              className={cn(
                "w-full flex items-center justify-between px-5 py-4 transition-colors duration-150",
                isExpanded ? "bg-gray-50/80" : "hover:bg-gray-50/50",
              )}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                    invoice.isApprovedByCustomer
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-amber-100 text-amber-600",
                  )}
                >
                  {invoice.isApprovedByCustomer ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Clock className="h-5 w-5" />
                  )}
                </div>

                {/* Info */}
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(invoice.receiveDate, isArabic)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t(
                      "resourceProvidor.investor-request-details.history_section.items_received",
                      { count: itemCount },
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Status Badge */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                    invoice.isApprovedByCustomer
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      invoice.isApprovedByCustomer
                        ? "bg-emerald-500"
                        : "bg-amber-500",
                    )}
                  />
                  {invoice.isApprovedByCustomer
                    ? t(
                        "resourceProvidor.investor-request-details.history_section.approved",
                      )
                    : t(
                        "resourceProvidor.investor-request-details.history_section.pending",
                      )}
                </span>

                {/* Chevron */}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-gray-400 transition-transform duration-200",
                    isExpanded && "rotate-180",
                  )}
                />
              </div>
            </button>

            {/* Expanded Content */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="bg-gray-50/50 px-5 pb-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className={!isArabic ? "text-left" : "text-right"}>
                            {t("resourceProvidor.investor-request-details.history_section.columns.name")}
                          </TableHead>
                          <TableHead className={!isArabic ? "text-left" : "text-right"}>
                            {t("resourceProvidor.investor-request-details.history_section.columns.category")}
                          </TableHead>
                          <TableHead className={isArabic ? "text-left" : "text-right"}>
                            {t("resourceProvidor.investor-request-details.history_section.columns.qty")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoice.receiveInvoiceItems.map((item, itemIdx) => (
                          <TableRow key={itemIdx}>
                            <TableCell className="font-medium">
                              {item.name}
                            </TableCell>
                            <TableCell>
                              {item.category}
                            </TableCell>
                            <TableCell className={isArabic ? "text-left tabular-nums font-semibold" : "text-right tabular-nums font-semibold"}>
                              {item.quantity.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default HistorySection;
