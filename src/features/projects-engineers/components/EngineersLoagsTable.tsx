import { useState } from "react";

import {
  CalendarDays,
  Camera,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  HardHat,
  LogIn,
  LogOut,
  ReceiptText,
  TrendingUp,
  Truck,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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

import type { EmploersActionsLogs, EngineersProjectAction } from "../api/types";
import { ENGINEERS_PROJECT_ACTIONS } from "../api/types";
import { MOCK_EMPLOERS_ACTIONS_LOGS } from "../mock/mockEmploersLogs";

const PAGE_SIZE = 8;

interface Props {
  logs?: EmploersActionsLogs[];
  isLoading?: boolean;
}

const actionIcons: Record<
  EngineersProjectAction,
  { icon: typeof LogIn; className: string; chip: string }
> = {
  checked_in: {
    icon: LogIn,
    className: "text-emerald",
    chip: "bg-emerald-soft",
  },
  checked_out: {
    icon: LogOut,
    className: "text-muted-foreground",
    chip: "bg-muted",
  },
  daily_report: {
    icon: FileText,
    className: "text-primary",
    chip: "bg-primary/10",
  },
  progress_update: {
    icon: TrendingUp,
    className: "text-gold",
    chip: "bg-gold/15",
  },
  site_photos: {
    icon: Camera,
    className: "text-accent-foreground",
    chip: "bg-accent",
  },
  task_completed: {
    icon: ClipboardCheck,
    className: "text-emerald",
    chip: "bg-emerald-soft",
  },
  material_request: {
    icon: Truck,
    className: "text-warning-foreground",
    chip: "bg-warning/15",
  },
  invoice_added: {
    icon: ReceiptText,
    className: "text-destructive",
    chip: "bg-destructive/10",
  },
};

const EngineersLoagsTable = ({
  logs = MOCK_EMPLOERS_ACTIONS_LOGS,
  isLoading = false,
}: Props) => {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(1);

  const formatDateTime = (date: Date) =>
    new Date(date).toLocaleString(i18n.language === "ar" ? "ar" : "en", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = logs.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  if (isLoading) {
    return (
      <div className="space-y-2 rounded-xl border border-border bg-white p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-muted/60" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>
                {t("projectsEngineers.logs.columns.engineer")}
              </TableHead>
              <TableHead className="w-2/5">
                {t("projectsEngineers.logs.columns.activity")}
              </TableHead>
              <TableHead>
                {t("projectsEngineers.logs.columns.workSite")}
              </TableHead>
              <TableHead>{t("projectsEngineers.logs.columns.time")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading && pageItems.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-16 text-center text-muted-foreground"
                >
                  {t("projectsEngineers.logs.empty")}
                </TableCell>
              </TableRow>
            )}

            {pageItems.map((log) => {
              const meta =
                actionIcons[log.action] ??
                actionIcons[ENGINEERS_PROJECT_ACTIONS[0]];
              const ActionIcon = meta.icon;
              return (
                <TableRow
                  key={log.id}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <TableCell className="max-w-44">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                        {log.engineerId.imageUrl ? (
                          <img
                            src={log.engineerId.imageUrl}
                            alt={log.engineerId.fullName}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <HardHat className="h-4 w-4 text-primary" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">
                          {log.engineerId.fullName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {log.engineerId.spec}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="max-w-sm">
                    <div className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                          meta.chip,
                        )}
                      >
                        <ActionIcon
                          className={cn("h-3.5 w-3.5", meta.className)}
                        />
                      </span>
                      <div className="min-w-0">
                        <p
                          className={cn(
                            "truncate text-sm font-semibold",
                            meta.className,
                          )}
                        >
                          {t(`projectsEngineers.logs.actions.${log.action}`)}
                        </p>
                        <p
                          title={log.description}
                          className="line-clamp-1 text-xs text-muted-foreground"
                        >
                          {log.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="max-w-48">
                    <span
                      title={log.workSite}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground"
                    >
                      <HardHat className="h-3.5 w-3.5 shrink-0 text-accent" />
                      <span className="truncate">{log.workSite}</span>
                    </span>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDateTime(log.createdAt)}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={safePage === 1}
            onClick={() => setPage(safePage - 1)}
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            {t("common.table.prev", "Prev")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={safePage === totalPages}
            onClick={() => setPage(safePage + 1)}
          >
            {t("common.table.next", "Next")}
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EngineersLoagsTable;
