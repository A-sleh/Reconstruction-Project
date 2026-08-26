import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ClipboardList } from "lucide-react";

import EmptyState from "@/components/common/EmptyState";
import type { GetAllReportProjectFilters } from "../api/types";
import { MOCK_PROJECT_REPORTS } from "../mock/mockReports";
import ReportFilters from "./ReportFilters";
import ReportsTable from "./ReportsTable";

const OrderReports = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<GetAllReportProjectFilters>({});

  const reports = useMemo(() => {
    return MOCK_PROJECT_REPORTS.filter((report) => {
      if (
        report.type !== "services-order" &&
        report.type !== "resources-order"
      )
        return false;

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

      return matchesSearch && matchesFrom && matchesTo;
    });
  }, [filters]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground md:text-2xl">
              {t(
                "project.details.manageReports.orders.title",
                "Order Reports",
              )}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(
                "project.details.manageReports.orders.subTitle",
                "Manage services and resources orders.",
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
              icon={ClipboardList}
              message={t(
                "project.details.manageReports.orders.empty",
                "No order reports match your filters.",
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

export default OrderReports;
