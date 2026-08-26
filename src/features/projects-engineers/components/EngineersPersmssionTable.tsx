import { useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  HardHat,
  Settings,
  UserMinus,
  UserX,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import ConfirmDelete from "@/components/model/ConfirmDelete";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import type { Permissions, ProjectEngineersPermissions } from "../api/types";
import { MOCK_PROJECT_ENGINEERS_PERMISSIONS } from "../mock/mockPermissions";
import PermissionModel from "./PermissionModel";

const PAGE_SIZE = 8;

interface Props {
  data?: ProjectEngineersPermissions[];
  isLoading?: boolean;
  onUpdate?: (permissions: Permissions) => void;
  onDeactivate?: (row: ProjectEngineersPermissions) => void;
  onRemove?: (row: ProjectEngineersPermissions) => void;
}

const PERMISSION_KEYS: (keyof Permissions)[] = [
  "canViewLogs",
  "canViewRequests",
  "canAddEngineer",
  "canRemoveEngineer",
  "canApproveRequest",
  "canRejectRequest",
];

const EngineersPersmssionTable = ({
  data = MOCK_PROJECT_ENGINEERS_PERMISSIONS,
  isLoading = false,
  onUpdate,
  onDeactivate,
  onRemove,
}: Props) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = data.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  if (isLoading) {
    return (
      <div className="space-y-2 rounded-xl border border-border bg-white p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-10 animate-pulse rounded-lg bg-muted/60"
          />
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
                {t(
                  "projectsEngineers.permissions.columns.engineer",
                  "Engineer",
                )}
              </TableHead>
              {PERMISSION_KEYS.map((key) => (
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
                {t(
                  "projectsEngineers.permissions.columns.actions",
                  "Actions",
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={PERMISSION_KEYS.length + 2}
                  className="py-16 text-center text-muted-foreground"
                >
                  {t("projectsEngineers.permissions.empty", "No engineers found.")}
                </TableCell>
              </TableRow>
            )}

            {pageItems.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-muted/40 transition-colors"
              >
                <TableCell className="max-w-52">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                      {row.engineer.imageUrl ? (
                        <img
                          src={row.engineer.imageUrl}
                          alt={row.engineer.fullName}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <HardHat className="h-4 w-4 text-primary" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">
                        {row.engineer.fullName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {row.engineer.spec}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {PERMISSION_KEYS.map((key) => (
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
                      openKey={`edit-permissions-${row.id}`}
                      engineer={row.engineer}
                      initial={row.permissions}
                      onSubmit={onUpdate}
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
                    <ConfirmDelete
                      openKey={`deactivate-${row.id}`}
                      item={row.engineer.fullName}
                      onConfirm={() => onDeactivate?.(row)}
                      keys={{
                        title: "projectsEngineers.permissions.deactivate.title",
                        descriptionPrefix:
                          "projectsEngineers.permissions.deactivate.descriptionPrefix",
                        confirm: "projectsEngineers.permissions.deactivate.confirm",
                        cancel: "projectsEngineers.permissions.deactivate.cancel",
                      }}
                      openButton={
                        <button
                          type="button"
                          title={t(
                            "projectsEngineers.permissions.actions.deactivate",
                            "Deactivate",
                          )}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-gold transition-colors hover:bg-gold/10 focus-visible:outline-none"
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      }
                    />
                    <ConfirmDelete
                      openKey={`remove-engineer-${row.id}`}
                      item={row.engineer.fullName}
                      onConfirm={() => onRemove?.(row)}
                      keys={{
                        title: "projectsEngineers.permissions.remove.title",
                        descriptionPrefix:
                          "projectsEngineers.permissions.remove.descriptionPrefix",
                        confirm: "projectsEngineers.permissions.remove.confirm",
                        cancel: "projectsEngineers.permissions.remove.cancel",
                      }}
                      openButton={
                        <button
                          type="button"
                          title={t(
                            "projectsEngineers.permissions.actions.remove",
                            "Remove",
                          )}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none"
                        >
                          <UserX className="h-4 w-4" />
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
            {t("common.prev", "Prev")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={safePage === totalPages}
            onClick={() => setPage(safePage + 1)}
          >
            {t("common.next", "Next")}
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EngineersPersmssionTable;
