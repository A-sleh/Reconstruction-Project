import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Edit3,
  FileText,
  Tag,
  User,
  XCircle,
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

import type { ProjectReportResponse, ProjectReportType } from "../api/types";
import { MOCK_PROJECT_REPORTS } from "../mock/mockReports";
import ReportAttachmentsModal from "./ReportAttachmentsModal";

const PAGE_SIZE = 8;

interface Props {
  data?: ProjectReportResponse[];
  isLoading?: boolean;
}

const typeColors: Record<ProjectReportType, string> = {
  daily: "bg-primary/10 text-primary",
  weekly: "bg-emerald-soft text-emerald",
  monthly: "bg-gold/15 text-gold",
  yearly: "bg-gold/15 text-gold",
  progress: "bg-accent text-accent-foreground",
  "services-order": "bg-primary/10 text-primary",
  "resources-order": "bg-emerald-soft text-emerald",
};

const ReportsTable = ({
  data = MOCK_PROJECT_REPORTS,
  isLoading = false,
}: Props) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString(i18n.language === "ar" ? "ar" : "en", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = data.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const handleRowClick = (reportId: string) => {
    navigate(`reports/${reportId}`);
  };

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
                {t("projectReports.columns.title", "Title")}
              </TableHead>
              <TableHead className="max-w-48">
                {t("projectReports.columns.description", "Description")}
              </TableHead>
              <TableHead>
                {t("projectReports.columns.createdBy", "Created By")}
              </TableHead>
              <TableHead className="text-center">
                {t("projectReports.columns.attachments", "Files")}
              </TableHead>
              <TableHead>
                {t("projectReports.columns.type", "Type")}
              </TableHead>
              <TableHead>
                {t("projectReports.columns.createdAt", "Date")}
              </TableHead>
              <TableHead className="text-center">
                {t("projectReports.columns.actions", "Actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-16 text-center text-muted-foreground"
                >
                  {t("projectReports.empty", "No reports found.")}
                </TableCell>
              </TableRow>
            )}

            {pageItems.map((report) => {
              const isOrder =
                report.type === "services-order" ||
                report.type === "resources-order";
              const itemCount = report.order?.length ?? 0;

              return (
                <TableRow
                  key={report.id}
                  onClick={() => handleRowClick(report.id)}
                  className="cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <TableCell className="max-w-52">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-4 w-4 text-primary" />
                      </span>
                      <p
                        title={report.title}
                        className="truncate font-medium text-foreground"
                      >
                        {report.title}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="max-w-48">
                    <p
                      title={report.description}
                      className="line-clamp-1 text-xs text-muted-foreground"
                    >
                      {report.description}
                    </p>
                  </TableCell>

                  <TableCell>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <User className="h-3.5 w-3.5 shrink-0" />
                      {report.createdBy}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground tabular-nums">
                      <FileText className="h-3.5 w-3.5" />
                      {report.attachments.length}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span
                        className={cn(
                          "w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                          typeColors[report.type],
                        )}
                      >
                        {t(
                          `projectReports.filters.reportTypes.${report.type}`,
                          report.type,
                        )}
                      </span>
                      {isOrder && itemCount > 0 && (
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Tag className="h-3 w-3" />
                          {t(
                            "projectReports.columns.itemCount",
                            "{{count}} items",
                            { count: itemCount },
                          )}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(report.createdAt)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div
                      className="flex items-center justify-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        title={t("projectReports.actions.update", "Update")}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title={t("projectReports.actions.cancel", "Cancel")}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                      <ReportAttachmentsModal
                        attachments={report.attachments}
                        reportTitle={report.title}
                      />
                    </div>
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

export default ReportsTable;
