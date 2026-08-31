import ConfirmDelete from "@/components/model/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Banknote,
  CalendarDays,
  FileStack,
  Pencil,
  Phone,
  ReceiptText,
  Trash2,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteWorkShop } from "../api/actions";
import type { WorkShop } from "../api/types";
import InvoiceModel from "./InvoiceModel";
import WorkShopInvoicesPopup from "./WorkShopInvoicesPopup";
import WorkShopModel from "./WorkShopModel";

interface Props {
  workShop: WorkShop;
  index?: number;
}

export default function WorkShopCard({ workShop, index = 0 }: Props) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();
  const deleteMutation = useDeleteWorkShop();

  const percent =
    workShop.totalCost > 0
      ? Math.min(
          100,
          Math.round((workShop.costPaid / workShop.totalCost) * 100),
        )
      : 0;
  const remaining = Math.max(0, workShop.totalCost - workShop.costPaid);

  const statusStyles: Record<string, string> = {
    Pending: "bg-gold/10 text-warning-foreground",
    InProgress: "bg-primary/10 text-primary",
    Completed: "bg-success/10 text-success",
    Canceled: "bg-destructive/10 text-destructive",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => {
        if (projectId)
          navigate(
            paths.app.projects.projectWorkShopDetails.getHref(
              Number(projectId),
              workShop.id,
            ),
          );
      }}
      className="group relative h-full cursor-pointer overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
    >
      <div
        className="absolute top-4 inset-e-4 z-10 flex gap-1 opacity-0 transition-smooth group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <WorkShopModel
          openKey={`edit-work-shop-${workShop.id}`}
          initial={workShop}
          openButton={
            <Button
              size="icon"
              className="h-8 w-8 rounded-full shadow-md hover:bg-primary hover:text-white"
              aria-label={t("workShops.card.edit", "Edit workshop")}
              title={t("workShops.card.edit", "Edit workshop")}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          }
        />
        <InvoiceModel
          openKey={`add-invoice-work-shop-${workShop.id}`}
          workShopId={workShop.id}
          openButton={
            <Button
              size="icon"
              className="h-8 w-8 rounded-full shadow-md hover:bg-gold hover:text-white"
              aria-label={t("workShops.card.addInvoice", "Add invoice")}
              title={t("workShops.card.addInvoice", "Add invoice")}
            >
              <ReceiptText className="h-3.5 w-3.5" />
            </Button>
          }
        />
        <WorkShopInvoicesPopup
          openKey={`invoices-work-shop-${workShop.id}`}
          workShop={workShop}
          openButton={
            <Button
              size="icon"
              className="h-8 w-8 rounded-full shadow-md hover:bg-accent hover:text-white"
              aria-label={t("workShops.card.viewInvoices", "View invoices")}
              title={t("workShops.card.viewInvoices", "View invoices")}
            >
              <FileStack className="h-3.5 w-3.5" />
            </Button>
          }
        />
        <ConfirmDelete
          openKey={`delete-work-shop-${workShop.id}`}
          item={workShop.name}
          isLoading={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate(workShop.id)}
          keys={{
            title: "workShops.delete.title",
            descriptionPrefix: "workShops.delete.descriptionPrefix",
            confirm: "workShops.delete.confirm",
            cancel: "common.cancel",
          }}
          openButton={
            <Button
              size="icon"
              className="h-8 w-8 rounded-full shadow-md hover:bg-destructive hover:text-destructive-foreground"
              aria-label={t("workShops.card.delete", "Delete workshop")}
              title={t("workShops.card.delete", "Delete workshop")}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          }
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <span
            className={cn(
              "mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
              statusStyles[workShop.status],
            )}
          >
            {t(`workShops.status.${workShop.status}`, workShop.status)}
          </span>
          <h3 className="truncate text-lg font-semibold text-foreground transition-smooth group-hover:text-primary">
            {workShop.name}
          </h3>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            {new Date(workShop.startWorkDate).toLocaleDateString(
              i18n.language === "ar" ? "ar" : "en",
              { year: "numeric", month: "short", day: "numeric" },
            )}
          </span>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-smooth group-hover:hidden">
          <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
        </div>
      </div>

      <p className="mt-4 line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground">
        {workShop.description}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm">
          <Users className="h-4 w-4 shrink-0 text-accent" />
          <span className="truncate text-muted-foreground">
            {workShop.memberNumber.toLocaleString()}{" "}
            {t("workShops.card.workers", "Workers")}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm">
          <Phone className="h-4 w-4 shrink-0 text-accent" />
          <span dir="ltr" className="truncate text-muted-foreground">
            {workShop.supervisorPhoneNumber}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-end justify-between gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Banknote className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">
              {t("workShops.card.paid", "Paid")}
            </span>
            <span className="font-semibold text-foreground">
              {workShop.costPaid.toLocaleString()}
            </span>
          </div>
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium",
              percent >= 100
                ? "bg-success/10 text-success"
                : "bg-gold/10 text-warning-foreground",
            )}
          >
            {percent.toLocaleString()}%
          </span>
        </div>
        <Progress value={percent} className="h-2" />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>
            {t("workShops.card.required", "Required")}:
            <span className="font-medium text-foreground">
              {" "}
              {workShop.totalCost.toLocaleString()}
            </span>
          </span>
          <span>
            {t("workShops.card.remaining", "Remaining")}:
            <span className="font-medium text-foreground">
              {" "}
              {remaining.toLocaleString()}
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
