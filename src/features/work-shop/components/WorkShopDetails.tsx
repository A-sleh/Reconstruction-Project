import ConfirmDelete from "@/components/model/ConfirmDelete";
import KpiCard from "@/components/shared/KpiCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Banknote,
  CalendarDays,
  Clock,
  HardHat,
  Pencil,
  Phone,
  ReceiptText,
  Trash2,
  Users,
  Wallet,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteWorkShop } from "../api/actions";
import type { WorkShop } from "../api/types";
import { MOCK_WORK_SHOPS } from "../mock/mockWorkShops";
import InvoiceModel from "./InvoiceModel";
import InvoicesTable from "./InvoicesTable";
import WorkShopModel from "./WorkShopModel";

const statusStyles: Record<string, string> = {
  open: "bg-emerald/10 text-emerald",
  "in-progress": "bg-gold/10 text-warning-foreground",
  closed: "bg-muted text-muted-foreground",
};

const WorkShopDetails = () => {
  const { projectId, workShopId } = useParams<{
    workShopId: string;
    projectId?: string;
  }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const deleteMutation = useDeleteWorkShop();

  const workShop: WorkShop | undefined = MOCK_WORK_SHOPS.find(
    (w) => w.id.toString() === workShopId,
  );

  if (!workShop) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
        <HardHat className="h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          {t("workShops.details.notFound", "Workshop not found.")}
        </p>
      </div>
    );
  }

  const percent =
    workShop.requirePrice > 0
      ? Math.min(
          100,
          Math.round((workShop.payedPrice / workShop.requirePrice) * 100),
        )
      : 0;
  const remaining = Math.max(0, workShop.requirePrice - workShop.payedPrice);

  const backHref = projectId
    ? paths.app.projects.projectDetails.getHref(Number(projectId))
    : "..";

  const detailItems = [
    {
      icon: Users,
      label: t("workShops.fields.workerNumber", "Number of Workers"),
      value: `${workShop.workerNumber.toLocaleString()} ${t(
        "workShops.card.workers",
        "Workers",
      )}`,
    },
    {
      icon: Phone,
      label: t("workShops.fields.phone", "Leader Phone Number"),
      value: (
        <span dir="ltr" className="font-medium text-foreground">
          {workShop.leaderPhoneNumber}
        </span>
      ),
    },
    {
      icon: CalendarDays,
      label: t("workShops.card.createdAt", "Created At"),
      value: new Date(workShop.createdAt).toLocaleDateString(
        i18n.language === "ar" ? "ar" : "en",
        { year: "numeric", month: "long", day: "numeric" },
      ),
    },
    {
      icon: HardHat,
      label: t("workShops.fields.status", "Status"),
      value: (
        <span
          className={cn(
            "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
            statusStyles[workShop.status],
          )}
        >
          {t(`workShops.status.${workShop.status}`, workShop.status)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 rounded-xl border border-gray-300 bg-white p-6 shadow-sm">
        <div className="flex min-w-0 items-start gap-4">
          <Button asChild variant="ghost" size="icon" className="mt-1 shrink-0">
            <button
              aria-label={t("common.back", "Back")}
              onClick={() => navigate(backHref)}
            >
              <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
            </button>
          </Button>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HardHat className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-semibold text-foreground md:text-2xl">
                {workShop.title}
              </h1>
              <span
                className={cn(
                  "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
                  statusStyles[workShop.status],
                )}
              >
                {t(`workShops.status.${workShop.status}`, workShop.status)}
              </span>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {workShop.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <WorkShopModel
            openKey={`edit-work-shop-${workShop.id}`}
            initial={workShop}
            openButton={
              <Button
                size="icon"
                variant="outline"
                aria-label={t("workShops.card.edit", "Edit workshop")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />
          <ConfirmDelete
            openKey={`delete-work-shop-${workShop.id}`}
            item={workShop.title}
            isLoading={deleteMutation.isPending}
            onConfirm={() =>
              deleteMutation.mutate(workShop.id, {
                onSuccess: () => navigate(backHref),
              })
            }
            keys={{
              title: "workShops.delete.title",
              descriptionPrefix: "workShops.delete.descriptionPrefix",
              confirm: "workShops.delete.confirm",
              cancel: "common.cancel",
            }}
            openButton={
              <Button
                size="icon"
                variant="outline"
                className="hover:bg-destructive hover:text-destructive-foreground"
                aria-label={t("workShops.card.delete", "Delete workshop")}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          icon={Banknote}
          label={t("workShops.card.paid", "Paid")}
          value={workShop.payedPrice.toLocaleString()}
          hint={`${percent.toLocaleString()}% ${t(
            "workShops.details.ofTotal",
            "of total",
          )}`}
          accent="bg-emerald/10 text-emerald"
        />
        <KpiCard
          icon={Wallet}
          label={t("workShops.card.required", "Total Required")}
          value={workShop.requirePrice.toLocaleString()}
          accent="bg-primary/10 text-primary"
        />
        <KpiCard
          icon={Clock}
          label={t("workShops.card.remaining", "Remaining")}
          value={remaining.toLocaleString()}
          accent="bg-gold/10 text-warning-foreground"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("workShops.details.infoTitle", "Workshop Information")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {detailItems.map((item) => (
              <div
                key={item.label}
                className="rounded-lg bg-muted/60 px-4 py-3"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <item.icon className="h-3.5 w-3.5 shrink-0 text-accent" />
                  <span className="truncate">{item.label}</span>
                </div>
                <p className="mt-2 truncate text-sm font-semibold text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-end justify-between gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Banknote className="h-4 w-4 text-accent" />
                <span className="text-muted-foreground">
                  {t("workShops.card.paid", "Paid")}
                </span>
                <span className="font-semibold text-foreground">
                  {workShop.payedPrice.toLocaleString()}
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
                  {workShop.requirePrice.toLocaleString()}
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
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ReceiptText className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold text-foreground md:text-xl">
              {t("workShops.invoices.title", "Invoices")}
            </h2>
          </div>
          <InvoiceModel
            workShopId={workShop.id}
            openKey={`add-invoice-work-shop-${workShop.id}`}
          />
        </div>
        <InvoicesTable />
      </div>
    </div>
  );
};

export default WorkShopDetails;
