import EmptyState from "@/components/common/EmptyState";
import { FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { GetAllReportProjectFilters } from "../api/types";
import { MOCK_PROJECT_REPORTS } from "../mock/mockReports";
import ReportFilters from "./ReportFilters";
import ReportsTable from "./ReportsTable";

const ProjectReports = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<GetAllReportProjectFilters>({});

  const reports = useMemo(() => {
    return MOCK_PROJECT_REPORTS.filter((report) => {
      const matchesSearch =
        !filters.search ||
        report.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.description
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        report.createdBy.toLowerCase().includes(filters.search.toLowerCase());

      const reportDate = new Date(report.createdAt).getTime();
      const matchesFrom =
        !filters.fromDate ||
        reportDate >= new Date(filters.fromDate).getTime();
      const matchesTo =
        !filters.toDate ||
        reportDate <= new Date(filters.toDate).getTime() + 86_399_000;

      const matchesType =
        !filters.ProjectReportType ||
        report.type === filters.ProjectReportType;

      return matchesSearch && matchesFrom && matchesTo && matchesType;
    });
  }, [filters]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground md:text-2xl">
              {t("projectReports.header.title", "Project Reports")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(
                "projectReports.header.subTitle",
                "View and manage all project reports.",
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="lg:order-2">
          <ReportFilters filters={filters} onChange={setFilters} />
        </div>

        <div className="lg:order-1">
          {reports.length === 0 ? (
            <EmptyState
              icon={FileText}
              message={t(
                "projectReports.empty",
                "No reports match your filters.",
              )}
            />
          ) : (
            <ReportsTable data={reports} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectReports;
