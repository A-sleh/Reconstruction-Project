import SidebarFilters from "@/components/common/SidebarFilters";
import Input from "@/components/inputs/Input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

import type {
  GetAllReportProjectFilters,
  ProjectReportType,
} from "../api/types";

interface Props {
  filters: GetAllReportProjectFilters;
  onChange: (next: GetAllReportProjectFilters) => void;
}

const REPORT_TYPES: ProjectReportType[] = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "progress",
  "services-order",
  "resources-order",
];

const ReportFilters = ({ filters, onChange }: Props) => {
  const { t } = useTranslation();

  const reset = () => onChange({});
  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.fromDate ? 1 : 0) +
    (filters.toDate ? 1 : 0) +
    (filters.ProjectReportType ? 1 : 0);

  return (
    <SidebarFilters reset={reset} activeCount={activeCount}>
      <div className="mt-4 space-y-6">
        <Input
          label={t("projectReports.filters.search.label", "Search")}
          value={filters.search ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              search: e.target.value || undefined,
            })
          }
          placeholder={t(
            "projectReports.filters.search.placeholder",
            "Search reports...",
          )}
        />

        <Separator />

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("projectReports.filters.dateRange.label", "Date range")}
          </Label>
          <div className="space-y-3">
            <Input
              type="date"
              label={t("projectReports.filters.fromDate", "From")}
              value={filters.fromDate ?? ""}
              max={filters.toDate ?? ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  fromDate: e.target.value || undefined,
                })
              }
            />
            <Input
              type="date"
              label={t("projectReports.filters.toDate", "To")}
              value={filters.toDate ?? ""}
              min={filters.fromDate ?? ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  toDate: e.target.value || undefined,
                })
              }
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("projectReports.filters.type.label", "Report Type")}
          </Label>
          <div className="space-y-2">
            {REPORT_TYPES.map((type) => {
              const checked = filters.ProjectReportType === type;
              return (
                <label
                  key={type}
                  onClick={(e) => {
                    e.preventDefault();
                    onChange({
                      ...filters,
                      ProjectReportType: checked ? undefined : type,
                    });
                  }}
                  className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Checkbox checked={checked} />
                  {t(`projectReports.filters.reportTypes.${type}`)}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </SidebarFilters>
  );
};

export default ReportFilters;
