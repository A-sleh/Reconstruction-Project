import { useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  HardHat,
  Settings,
  X,
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

import {
  PROJECT_ENGINEER_PERMISSION_KEYS,
  type ProjectEngineerPermissionFlags,
  type ProjectMemberPermission,
} from "../api/types";
import PermissionModel from "./PermissionModel";

const PAGE_SIZE = 8;

interface Props {
  data: ProjectMemberPermission[];
  isLoading?: boolean;
  onUpdate?: (
    engineerId: number,
    permissions: ProjectEngineerPermissionFlags,
  ) => void;
}

const EngineersPersmssionTable = ({
  data,
  isLoading = false,
  onUpdate,
}: Props) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = data.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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
                {t("projectsEngineers.permissions.columns.engineer", "Engineer")}
              </TableHead>
              {PROJECT_ENGINEER_PERMISSION_KEYS.map((key) => (
                <TableHead key={key} className="text-center">
                  {t(
                    `projectsEngineers.permissions.columns.${key}`,
                    key
                      .replace(/^can/, "")
                      .replace(/([A-Z])/g, " $1")
                      .trim(),
                  )}
                </TableHead>
              ))}
              <TableHead className="text-center">
                {t("projectsEngineers.permissions.columns.actions", "Actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={PROJECT_ENGINEER_PERMISSION_KEYS.length + 2}
                  className="py-16 text-center text-muted-foreground"
                >
                  {t("projectsEngineers.permissions.empty", "No engineers found.")}
                </TableCell>
              </TableRow>
            )}

            {pageItems.map((row) => (
              <TableRow
                key={row.engineerId}
                className="hover:bg-muted/40 transition-colors"
              >
                <TableCell className="max-w-52">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <HardHat className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {row.engineerName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        #{row.engineerId}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {PROJECT_ENGINEER_PERMISSION_KEYS.map((key) => (
                  <TableCell key={key} className="text-center">
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full",
                        row.permissions[key]
                          ? "bg-emerald-soft text-emerald"
                          : "bg-muted text-muted-foreground/50",
                      )}
                    >
                      {row.permissions[key] ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
                      )}
                    </span>
                  </TableCell>
                ))}

                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <PermissionModel
                      engineerId={row.engineerId}
                      engineerName={row.engineerName}
                      initial={row.permissions}
                      onSubmit={(permissions) =>
                        onUpdate?.(row.engineerId, permissions)
                      }
                      openButton={
                        <button
                          type="button"
                          title={t(
                            "projectsEngineers.permissions.actions.update",
                            "Update permissions",
                          )}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                      }
                    />
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

export default EngineersPersmssionTable;
