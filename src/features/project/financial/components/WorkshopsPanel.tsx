import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import {
  Plus,
  Receipt,
  ReceiptText,
  Wrench,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import EmptyState from "@/components/common/EmptyState";
import { fmtCurrency } from "@/lib/helpers";
import InvoiceModel from "@/features/work-shop/components/InvoiceModel";
import { useWorkShopInvoices } from "@/features/work-shop/api/queries";
import type { WorkshopBudgetItem } from "../api/types";

function WorkshopInvoicesDialog({
  workshopId,
  workshopName,
  trigger,
}: {
  workshopId: number;
  workshopName: string;
  trigger: ReactNode;
}) {
  const { t, i18n } = useTranslation();
  const { data, isLoading } = useWorkShopInvoices(workshopId);

  const invoices = data?.invoices ?? [];
  const locale = i18n.language === "ar" ? "ar-SY" : "en-US";
  const total = invoices.reduce((sum, inv) => sum + inv.payedAmount, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t("project.financial.workshopsPanel.viewInvoices")} —{" "}
            {workshopName}
          </DialogTitle>
          <DialogDescription>
            {t("project.financial.workshopsPanel.subtitle")}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-96 overflow-auto">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : invoices.length === 0 ? (
            <EmptyState
              icon={Receipt}
              message={t("project.financial.workshopsPanel.noInvoices")}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    {t("project.financial.workshopsPanel.columns.date")}
                  </TableHead>
                  <TableHead>
                    {t("project.financial.workshopsPanel.columns.description")}
                  </TableHead>
                  <TableHead className="text-right">
                    {t("project.financial.workshopsPanel.columns.amount")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      {new Date(inv.data).toLocaleDateString(locale)}
                    </TableCell>
                    <TableCell>{inv.description || "—"}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {fmtCurrency(inv.payedAmount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} className="font-medium">
                    {t("project.financial.workshopsPanel.columns.amount")}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {fmtCurrency(total)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function WorkshopsPanel({
  items,
  isLoading = false,
}: {
  items: WorkshopBudgetItem[];
  isLoading?: boolean;
}) {
  const { t } = useTranslation();

  const showSkeleton = isLoading && items.length === 0;
  const showEmpty = !isLoading && items.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("project.financial.workshopsPanel.title")}</CardTitle>
        <CardDescription>
          {t("project.financial.workshopsPanel.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showSkeleton && (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {showEmpty && (
          <EmptyState
            icon={Wrench}
            message={t("project.financial.ledger.empty")}
          />
        )}

        {!showSkeleton && !showEmpty && (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => {
              const percentage =
                item.required > 0
                  ? Math.round((item.paid / item.required) * 100)
                  : 0;
              return (
                <Card key={item.workshopId} className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Wrench className="h-4 w-4" />
                      </div>
                      <p className="font-semibold">{item.workshopName}</p>
                    </div>
                    <Badge className="bg-muted text-muted-foreground">
                      {item.status}
                    </Badge>
                  </div>

                  <Progress value={percentage} className="mt-4 h-2" />

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("project.financial.budgetUtilization.paid")}
                      </span>
                      <span className="font-medium tabular-nums text-emerald">
                        {fmtCurrency(item.paid)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("project.financial.budgetUtilization.required")}
                      </span>
                      <span className="font-medium tabular-nums text-muted-foreground">
                        {fmtCurrency(item.required)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("project.financial.kpi.workshopRemaining")}
                      </span>
                      <span className="font-medium tabular-nums text-gold">
                        {fmtCurrency(item.remaining)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <WorkshopInvoicesDialog
                      workshopId={item.workshopId}
                      workshopName={item.workshopName}
                      trigger={
                        <Button variant="outline" size="sm">
                          <ReceiptText />
                          {t("project.financial.workshopsPanel.viewInvoices")}
                        </Button>
                      }
                    />
                    <InvoiceModel
                      openKey={`ws-invoice-${item.workshopId}`}
                      workShopId={item.workshopId}
                      openButton={
                        <Button size="sm">
                          <Plus />
                          {t("project.financial.workshopsPanel.addInvoice")}
                        </Button>
                      }
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
