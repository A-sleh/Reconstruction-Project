import SidebarFilters from "@/components/common/SidebarFilters";
import Input from "@/components/inputs/Input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import type { GetEmploingRequestsFilters } from "../api/types";
import { EmploingRequestStatus } from "../api/types";

interface Props {
  filters: GetEmploingRequestsFilters;
  onChange: (next: GetEmploingRequestsFilters) => void;
}

const STATUS_OPTIONS = [
  { value: EmploingRequestStatus.PENDING, key: "pending" },
  { value: EmploingRequestStatus.APPROVED, key: "approved" },
  { value: EmploingRequestStatus.REJECTED, key: "rejected" },
  { value: EmploingRequestStatus.CANCELED, key: "canceled" },
] as const;

const toInputValue = (date?: Date): string => {
  if (!date) return "";
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const EmploingRequestsFilters = ({ filters, onChange }: Props) => {
  const { t } = useTranslation();

  const reset = () => onChange({});
  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.fromDate ? 1 : 0) +
    (filters.toDate ? 1 : 0) +
    (filters.status !== undefined ? 1 : 0);

  return (
    <SidebarFilters reset={reset} activeCount={activeCount}>
      <div className="mt-4 space-y-6">
        <Input
          label={t("projectsEngineers.requests.search.label", "Search")}
          value={filters.search ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              search: e.target.value || undefined,
            })
          }
          placeholder={t(
            "projectsEngineers.requests.search.placeholder",
            "Search requests...",
          )}
        />

        <Separator />
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            {t(
              "projectsEngineers.filters.dateRange.label",
              "Date range",
            )}
          </Label>
          <div className="space-y-3">
            <Input
              type="date"
              label={t("projectsEngineers.filters.fromDate", "From")}
              value={toInputValue(filters.fromDate)}
              max={toInputValue(filters.toDate)}
              onChange={(e) =>
                onChange({
                  ...filters,
                  fromDate: e.target.value
                    ? new Date(e.target.value)
                    : undefined,
                })
              }
            />
            <Input
              type="date"
              label={t("projectsEngineers.filters.toDate", "To")}
              value={toInputValue(filters.toDate)}
              min={toInputValue(filters.fromDate)}
              onChange={(e) =>
                onChange({
                  ...filters,
                  toDate: e.target.value
                    ? new Date(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("projectsEngineers.filters.status.label", "Status")}
          </Label>
          <div className="space-y-2">
            {STATUS_OPTIONS.map((opt) => {
              const checked = filters.status === opt.value;
              return (
                <label
                  key={opt.value}
                  onClick={(e) => {
                    e.preventDefault();
                    onChange({
                      ...filters,
                      status: checked ? undefined : opt.value,
                    });
                  }}
                  className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Checkbox checked={checked} />
                  {t(
                    `projectsEngineers.filters.status.${opt.key}`,
                    opt.key.charAt(0).toUpperCase() + opt.key.slice(1),
                  )}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </SidebarFilters>
  );
};

export default EmploingRequestsFilters;
