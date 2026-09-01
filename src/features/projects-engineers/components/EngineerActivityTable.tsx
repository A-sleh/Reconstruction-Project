import { useState } from "react";
import { ChevronLeft, ChevronRight, HardHat } from "lucide-react";
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
import { ENGINEERS_PROJECT_ACTIONS } from "../api/types";
import { actionIcons } from "./actionMeta";

export interface EngineerActivityRow {
  name: string;
  spec: string;
  total: number;
  counts: Record<string, number>;
}

interface Props {
  rows: EngineerActivityRow[];
}

const PAGE_SIZE = 8;

const EngineerActivityTable = ({ rows }: Props) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const maxTotal = Math.max(1, ...rows.map((r) => r.total));

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>
                {t("projectsEngineers.dashboard.table.engineer")}
              </TableHead>
              {ENGINEERS_PROJECT_ACTIONS.map((action) => (
                <TableHead key={action} className="text-center">
                  <span title={t(`projectsEngineers.logs.actions.${action}`)}>
                    {t(`projectsEngineers.logs.actions.${action}`)}
                  </span>
                </TableHead>
              ))}
              <TableHead className="text-end">
                {t("projectsEngineers.dashboard.table.total")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={ENGINEERS_PROJECT_ACTIONS.length + 2}
                  className="py-16 text-center text-muted-foreground"
                >
                  {t("projectsEngineers.dashboard.table.empty")}
                </TableCell>
              </TableRow>
            )}

            {pageItems.map((row) => (
              <TableRow key={row.name} className="hover:bg-muted/40 transition-colors">
                <TableCell className="max-w-56">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <HardHat className="h-4 w-4 text-primary" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {row.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {row.spec}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {ENGINEERS_PROJECT_ACTIONS.map((action) => {
                  const meta = actionIcons[action];
                  const count = row.counts[action] ?? 0;
                  const Icon = meta.icon;
                  return (
                    <TableCell key={action} className="text-center p-2">
                      <span
                        title={String(count)}
                        className={`inline-flex h-6 min-w-6 items-center justify-center gap-1 rounded-full px-1.5 ${meta.chip} ${meta.className}`}
                      >
                        <Icon className="h-3 w-3" />
                        <span className="text-[11px] font-bold tabular-nums">
                          {count || 0}
                        </span>
                      </span>
                    </TableCell>
                  );
                })}

                <TableCell className="text-end">
                  <div className="inline-flex items-center gap-2">
                    <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${(row.total / maxTotal) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold tabular-nums">
                      {row.total}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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

export default EngineerActivityTable;