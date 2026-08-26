import { useTranslation } from "react-i18next";
import { Building2, CalendarDays, UserRound } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/Skeleton";
import type { WorkShopInovcesHistory } from "../api/types";
import { MOCK_WORK_SHOP_INVOICES } from "../mock/mockInvoices";

interface Props {
  invoices?: WorkShopInovcesHistory[];
  isLoading?: boolean;
}

const initialsOf = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

export default function InvoicesTable({
  invoices = MOCK_WORK_SHOP_INVOICES,
  isLoading = false,
}: Props) {
  const { t, i18n } = useTranslation();

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString(i18n.language === "ar" ? "ar" : "en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="rounded-xl border border-gray-300 bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>
                {t("workShops.invoices.columns.workshop", "Workshop")}
              </TableHead>
              <TableHead>{t("workShops.invoices.columns.date", "Date")}</TableHead>
              <TableHead className="text-right">
                {t("workShops.invoices.columns.amount", "Amount")}
              </TableHead>
              <TableHead className="w-44">
                {t("workShops.invoices.columns.modifiedBy", "Modified By")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {Array.from({ length: 4 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading && invoices.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-16 text-muted-foreground"
                >
                  {t("workShops.invoices.empty", "No invoices recorded yet.")}
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              invoices.map((invoice, index) => (
                <TableRow
                  key={`${invoice.toWorkShop}-${index}`}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium">
                      <Building2 className="h-4 w-4 shrink-0 text-accent" />
                      <span className="truncate">{invoice.toWorkShop}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(invoice.date)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {invoice.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                        {initialsOf(invoice.modifyedBy) || (
                          <UserRound className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <span className="truncate text-sm text-muted-foreground">
                        {invoice.modifyedBy}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
