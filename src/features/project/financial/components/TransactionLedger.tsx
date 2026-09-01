import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Receipt, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmptyState from "@/components/common/EmptyState";
import { fmtCurrency } from "@/lib/helpers";
import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_STATUSES,
  type ProjectTransaction,
  type TransactionCategory,
  type TransactionDirection,
  type TransactionStatus,
} from "../api/types";

const PAGE_SIZE = 8;

const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  "workshop": "hsl(170.46 100% 25%)",
  "provider-resource": "hsl(199 89% 48%)",
  "provider-service": "hsl(142 71% 45%)",
  "engineer": "hsl(262 83% 58%)",
  "other": "hsl(38 92% 50%)",
};

interface TransactionLedgerProps {
  transactions: ProjectTransaction[];
}

const TransactionLedger = ({ transactions }: TransactionLedgerProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | TransactionCategory>("all");
  const [direction, setDirection] = useState<"all" | TransactionDirection>("all");
  const [status, setStatus] = useState<"all" | TransactionStatus>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return transactions.filter((tx) => {
      if (category !== "all" && tx.category !== category) return false;
      if (direction !== "all" && tx.direction !== direction) return false;
      if (status !== "all" && tx.status !== status) return false;
      if (!query) return true;
      const party = tx.counterParty.toLowerCase();
      const categoryLabel = t(
        `project.financial.categories.${tx.category}`,
      ).toLowerCase();
      return party.includes(query) || categoryLabel.includes(query);
    });
  }, [transactions, search, category, direction, status, t]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentItems = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  useEffect(() => {
    setPage(1);
  }, [search, category, direction, status]);

  return (
    <Card dir={i18n.dir()}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Receipt className="h-5 w-5 text-primary" />
          {t("project.financial.ledger.title")}
        </CardTitle>
        <CardDescription>
          {t("project.financial.ledger.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 md:flex-row md:flex-wrap">
          <div className="relative w-full md:w-64">
            <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("project.financial.ledger.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9 w-full"
            />
          </div>
          <Select value={category} onValueChange={(v) => setCategory(v as "all" | TransactionCategory)}>
            <SelectTrigger dir={i18n.dir()} className="w-full md:w-44">
              <SelectValue placeholder={t("project.financial.ledger.allCategories")} />
            </SelectTrigger>
            <SelectContent dir={i18n.dir()}>
              <SelectItem value="all">
                {t("project.financial.ledger.allCategories")}
              </SelectItem>
              {TRANSACTION_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {t(`project.financial.categories.${cat}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={direction} onValueChange={(v) => setDirection(v as "all" | TransactionDirection)}>
            <SelectTrigger dir={i18n.dir()} className="w-full md:w-40">
              <SelectValue placeholder={t("project.financial.ledger.allDirections")} />
            </SelectTrigger>
            <SelectContent dir={i18n.dir()}>
              <SelectItem value="all">
                {t("project.financial.ledger.allDirections")}
              </SelectItem>
              <SelectItem value="income">
                {t("project.financial.ledger.income")}
              </SelectItem>
              <SelectItem value="expense">
                {t("project.financial.ledger.expense")}
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => setStatus(v as "all" | TransactionStatus)}>
            <SelectTrigger dir={i18n.dir()} className="w-full md:w-40">
              <SelectValue placeholder={t("project.financial.ledger.allStatuses")} />
            </SelectTrigger>
            <SelectContent dir={i18n.dir()}>
              <SelectItem value="all">
                {t("project.financial.ledger.allStatuses")}
              </SelectItem>
              {TRANSACTION_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {t(`project.financial.statuses.${s}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 rounded-md border border-gray-300">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("project.financial.ledger.columns.date")}</TableHead>
                <TableHead>{t("project.financial.ledger.columns.counterParty")}</TableHead>
                <TableHead>{t("project.financial.ledger.columns.category")}</TableHead>
                <TableHead>{t("project.financial.ledger.columns.direction")}</TableHead>
                <TableHead className="text-right">
                  {t("project.financial.ledger.columns.amount")}
                </TableHead>
                <TableHead>{t("project.financial.ledger.columns.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <EmptyState message={t("project.financial.ledger.empty")} />
                    <p className="pb-4 text-center text-xs text-muted-foreground">
                      {t("project.financial.ledger.emptyHint")}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString(
                        isArabic ? "ar-SY" : "en-US",
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-2">
                        {tx.counterParty}
                        {tx.source === "sample" && (
                          <Badge variant="outline" className="text-[10px]">
                            {t("project.financial.ledger.sampleBadge")}
                          </Badge>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1.5 font-normal">
                        <svg className="h-2 w-2" viewBox="0 0 10 10">
                          <circle
                            cx="5"
                            cy="5"
                            r="5"
                            fill={CATEGORY_COLORS[tx.category]}
                          />
                        </svg>
                        {t(`project.financial.categories.${tx.category}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          tx.direction === "income"
                            ? "text-emerald-600"
                            : "text-destructive"
                        }
                      >
                        {t(`project.financial.ledger.${tx.direction}`)}
                      </span>
                    </TableCell>
                    <TableCell
                      className={`text-right tabular-nums ${
                        tx.direction === "income"
                          ? "text-emerald-600"
                          : "text-destructive"
                      }`}
                    >
                      {fmtCurrency(tx.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          tx.status === "paid"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : tx.status === "pending"
                              ? "bg-gold/10 text-gold"
                              : "bg-destructive/10 text-destructive"
                        }
                      >
                        {t(`project.financial.statuses.${tx.status}`)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {currentItems.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
                {t("common.table.prev", "Prev")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                {t("common.table.next", "Next")}
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionLedger;
