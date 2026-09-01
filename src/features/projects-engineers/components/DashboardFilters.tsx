import SidebarFilters from "@/components/common/SidebarFilters";
import Input from "@/components/inputs/Input";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

export interface DashboardFiltersState {
  fromDate?: string;
  toDate?: string;
}

interface Props {
  filters: DashboardFiltersState;
  onChange: (next: DashboardFiltersState) => void;
}

const DashboardFilters = ({ filters, onChange }: Props) => {
  const { t } = useTranslation();

  const reset = () => onChange({});
  const activeCount =
    (filters.fromDate ? 1 : 0) + (filters.toDate ? 1 : 0);

  return (
    <SidebarFilters reset={reset} activeCount={activeCount}>
      <div className="mt-4 space-y-6">
        <div className="space-y-2">
          <Separator />
          <div className="space-y-3">
            <Input
              type="date"
              label={t(
                "projectsEngineers.dashboard.filters.fromDate",
                "From",
              )}
              value={filters.fromDate ?? ""}
              max={filters.toDate}
              onChange={(e) =>
                onChange({
                  ...filters,
                  fromDate: e.target.value || undefined,
                })
              }
            />
            <Input
              type="date"
              label={t("projectsEngineers.dashboard.filters.toDate", "To")}
              value={filters.toDate ?? ""}
              min={filters.fromDate}
              onChange={(e) =>
                onChange({
                  ...filters,
                  toDate: e.target.value || undefined,
                })
              }
            />
          </div>
        </div>
      </div>
    </SidebarFilters>
  );
};

export default DashboardFilters;