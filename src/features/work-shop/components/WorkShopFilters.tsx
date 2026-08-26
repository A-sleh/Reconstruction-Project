import SidebarFilters from "@/components/common/SidebarFilters";
import Input from "@/components/inputs/Input";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import type { GetAllWorkShopsFilters } from "../api/types";

interface Props {
  filters: GetAllWorkShopsFilters;
  onChange: (next: GetAllWorkShopsFilters) => void;
}

const WorkShopFilters = ({ filters, onChange }: Props) => {
  const { t } = useTranslation();
  const reset = () => onChange({});
  const activeCount =
    (filters.Search ? 1 : 0) +
    (filters.fromDate ? 1 : 0) +
    (filters.toDate ? 1 : 0);

  return (
    <SidebarFilters reset={reset} activeCount={activeCount}>
      <div className="mt-4 space-y-6">
        <Input
          label={t("workShops.filters.search.label", "Search")}
          value={filters.Search ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              Search: e.target.value || undefined,
            })
          }
          placeholder={t(
            "workShops.filters.search.placeholder",
            "Search workshops...",
          )}
        />

        <Separator />

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("workShops.filters.dateRange.label", "Date range")}
          </Label>
          <div className="space-y-3">
            <Input
              type="date"
              label={t("workShops.filters.fromDate", "From")}
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
              label={t("workShops.filters.toDate", "To")}
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

export default WorkShopFilters;
