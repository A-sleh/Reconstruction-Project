import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  Package,
  Pencil,
  Send,
  User,
  XCircle,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { ProjectReportResponse } from "../api/types";
import type { ProjectReportType } from "../api/types";
import type { OrderItem } from "@/features/orders/api/types";
import ConfirmChanges from "@/components/common/ConfrimChanges";

interface Props {
  report: ProjectReportResponse;
  onBack?: () => void;
  onSubmitOrder?: (reportId: string, items: OrderItem[]) => void;
  onSendOrder?: (reportId: string) => void;
}

const typeStyles: Record<ProjectReportType, string> = {
  daily: "bg-primary/10 text-primary",
  weekly: "bg-gold/15 text-gold",
  monthly: "bg-emerald-soft text-emerald",
  yearly: "bg-accent text-accent-foreground",
  progress: "bg-gold/15 text-gold",
  "services-order": "bg-primary/10 text-primary",
  "resources-order": "bg-emerald-soft text-emerald",
};

const formatSize = (bytes: number) => {
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(1)} KB`;
  return `${bytes} B`;
};

const getFileIcon = (fileType: string) => {
  if (fileType.includes("pdf")) return "📄";
  if (fileType.includes("zip") || fileType.includes("compressed")) return "📦";
  if (fileType.includes("image")) return "🖼️";
  if (fileType.includes("xlsx") || fileType.includes("spreadsheet")) return "📊";
  return "📎";
};

const ReportDetails = ({ report, onBack, onSubmitOrder, onSendOrder }: Props) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const isOrderType =
    report.type === "services-order" || report.type === "resources-order";

  const [localChanges, setLocalChanges] = useState<Record<number, number>>({});
  const [rejectedItems, setRejectedItems] = useState<Set<number>>(new Set());

  const hasChanges =
    Object.keys(localChanges).length > 0 || rejectedItems.size > 0;

  const handleQuantityChange = (id: number, value: string, max: number) => {
    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      setLocalChanges((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      return;
    }

    const clampedValue = Math.max(0, Math.min(parsedValue, max));
    const originalItem = report.order?.find((item) => item.itemId === id);

    if (originalItem && originalItem.fulfilledQuantity === clampedValue) {
      setLocalChanges((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } else {
      setLocalChanges((prev) => ({ ...prev, [id]: clampedValue }));
    }
  };

  const handleRejectItem = (id: number) => {
    setRejectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDiscard = () => {
    setLocalChanges({});
    setRejectedItems(new Set());
  };

  const handleSubmitWithChanges = () => {
    if (!report.order) return;
    const modifiedItems = report.order
      .filter((item) => {
        if (rejectedItems.has(item.itemId)) return true;
        return localChanges[item.itemId] !== undefined;
      })
      .map((item) => ({
        ...item,
        fulfilledQuantity: rejectedItems.has(item.itemId)
          ? 0
          : (localChanges[item.itemId] ?? item.fulfilledQuantity),
      }));
    onSubmitOrder?.(report.id, modifiedItems);
    setLocalChanges({});
    setRejectedItems(new Set());
  };

  const handleSendWithoutChanges = () => {
    onSendOrder?.(report.id);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString(isArabic ? "ar" : "en", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="truncate text-xl font-semibold text-foreground md:text-2xl">
              {report.title}
            </h1>
            <span
              className={cn(
                "inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold",
                typeStyles[report.type],
              )}
            >
              {t(`projectReports.filters.reportTypes.${report.type}`)}
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {report.createdBy}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(report.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-white p-5 shadow-sm"
      >
        <p className="text-sm leading-relaxed text-foreground">
          {report.description}
        </p>
      </motion.div>

      {report.attachments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("projectReports.details.attachments", "Attachments")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {report.attachments.map((attachment) => (
              <a
                key={attachment.id}
                href={attachment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-lg border border-border/60 bg-background/50 p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted text-xl">
                  {getFileIcon(attachment.fileType)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground group-hover:text-primary">
                    {attachment.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(attachment.fileSize)}
                  </p>
                </div>
                <Download className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
              </a>
            ))}
          </div>
        </motion.div>
      )}

      {isOrderType && report.order && report.order.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("projectReports.details.orderItems", "Order Items")}
          </h2>

          <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>
                    {t("projectReports.details.columns.item", "Item")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("projectReports.details.columns.unitPrice", "Unit Price")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("projectReports.details.columns.quantity", "Quantity")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("projectReports.details.columns.fulfilled", "Fulfilled")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("projectReports.details.columns.total", "Total")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("projectReports.details.columns.actions", "Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.order.map((item) => {
                  const currentDelivered =
                    localChanges[item.itemId] !== undefined
                      ? localChanges[item.itemId]
                      : item.fulfilledQuantity;
                  const isEditing = localChanges[item.itemId] !== undefined;
                  const isRejected = rejectedItems.has(item.itemId);
                  const isCompleted = item.itemStatus === "Completed";

                  return (
                    <TableRow
                      key={item.itemId}
                      className={cn(
                        "transition-colors",
                        isEditing && "bg-gold/5",
                        isRejected && "bg-destructive/5 opacity-60",
                      )}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Package className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">
                              {item.itemName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {item.category}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <span className="font-semibold text-foreground text-sm">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {" "}/ {item.unit}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center rounded-md bg-muted px-2.5 py-1 text-sm font-medium text-foreground tabular-nums">
                          {item.quantity.toLocaleString()}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="relative inline-flex items-center">
                          <input
                            type="number"
                            min={0}
                            max={item.quantity}
                            value={currentDelivered}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.itemId,
                                e.target.value,
                                item.quantity,
                              )
                            }
                            disabled={isCompleted || isRejected}
                            className={cn(
                              "w-20 text-center text-sm font-semibold tabular-nums rounded-lg border-2 px-3 py-1.5 outline-none transition-all",
                              isRejected || isCompleted
                                ? "border-border bg-muted text-muted-foreground cursor-not-allowed"
                                : isEditing
                                  ? "border-gold bg-gold/10 text-gold shadow-[0_0_0_3px_rgba(251,191,36,0.1)]"
                                  : "border-border bg-white text-foreground hover:border-border focus:border-primary",
                            )}
                          />
                          {!isEditing && !isRejected && !isCompleted && (
                            <Pencil className="absolute -right-1 -top-1 h-3 w-3 text-muted-foreground/50 pointer-events-none" />
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <span className="font-semibold text-foreground text-sm tabular-nums">
                          ${item.totalAmount.toLocaleString()}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald">
                            <CheckCircle className="h-4 w-4" />
                            {t("projectReports.details.status.completed", "Completed")}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleRejectItem(item.itemId)}
                            className={cn(
                              "inline-flex items-center gap-1.5 text-xs font-medium transition-colors",
                              isRejected
                                ? "text-emerald hover:text-emerald/80"
                                : "text-destructive hover:text-destructive/80",
                            )}
                          >
                            {isRejected ? (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                {t("projectReports.details.actions.restore", "Restore")}
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4" />
                                {t("projectReports.details.actions.reject", "Reject")}
                              </>
                            )}
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button variant="outline" onClick={handleSendWithoutChanges}>
              <Send className="h-4 w-4" />
              {t("projectReports.details.sendAsIs", "Send Order as Is")}
            </Button>
          </div>

          {hasChanges && (
            <ConfirmChanges
              handleDiscard={handleDiscard}
              handleSave={handleSubmitWithChanges}
              isSaving={false}
            />
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ReportDetails;
