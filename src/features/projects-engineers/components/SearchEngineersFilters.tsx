import SidebarFilters from "@/components/common/SidebarFilters";
import Input from "@/components/inputs/Input";
import RangeSlider from "@/components/shared/RangeSlider";
import StarRating from "@/components/shared/StarRating";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";

import type { GetAllEngineersFilters } from "../api/types";
import { ENGINEER_SPECS } from "../api/types";

interface Props {
  filters: GetAllEngineersFilters;
  onChange: (next: GetAllEngineersFilters) => void;
}

const MAX_YEARS = 30;

const SearchEngineersFilters = ({ filters, onChange }: Props) => {
  const { t } = useTranslation();

  const reset = () => onChange({});
  const activeCount =
    (filters.search ? 1 : 0) +
    (filters.spec ? 1 : 0) +
    (filters.yearsOfExperiance ? 1 : 0) +
    (filters.rate ? 1 : 0) +
    (filters.numberOfCompletedProjects ? 1 : 0) +
    (filters.isAvilable ? 1 : 0);

  const years = filters.yearsOfExperiance ?? 0;

  return (
    <SidebarFilters reset={reset} activeCount={activeCount}>
      <div className="mt-4 space-y-6">
        <Input
          label={t("projectsEngineers.filters.search.label", "Search")}
          value={filters.search ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              search: e.target.value || undefined,
            })
          }
          placeholder={t(
            "projectsEngineers.filters.search.placeholder",
            "Search engineers...",
          )}
        />

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              {t(
                "projectsEngineers.filters.experience.label",
                "Years of Experience",
              )}
            </Label>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary tabular-nums">
              {years > 0
                ? t(
                    "projectsEngineers.filters.experience.value",
                    "{{count}}+ yrs",
                    {
                      count: years,
                    },
                  )
                : t("projectsEngineers.filters.experience.any", "Any")}
            </span>
          </div>
          <RangeSlider
            value={years}
            min={0}
            max={MAX_YEARS}
            step={1}
            onChange={(v) =>
              onChange({
                ...filters,
                yearsOfExperiance: v > 0 ? v : undefined,
              })
            }
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("projectsEngineers.filters.rate.label", "Minimum Rating")}
            </Label>
            {filters.rate ? (
              <span className="text-xs font-medium text-warning-foreground tabular-nums">
                {filters.rate}+
              </span>
            ) : null}
          </div>
          <StarRating
            value={filters.rate}
            onChange={(rate) => onChange({ ...filters, rate })}
          />
        </div>

        <Separator />

        <Input
          type="number"
          min={0}
          label={t(
            "projectsEngineers.filters.projects.label",
            "Min Completed Projects",
          )}
          value={
            filters.numberOfCompletedProjects !== undefined
              ? String(filters.numberOfCompletedProjects)
              : ""
          }
          onChange={(e) =>
            onChange({
              ...filters,
              numberOfCompletedProjects: e.target.value
                ? Number(e.target.value)
                : undefined,
            })
          }
          placeholder={t(
            "projectsEngineers.filters.projects.placeholder",
            "e.g. 10",
          )}
        />

        <Separator />

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("projectsEngineers.filters.spec.label", "Specialty")}
          </Label>
          <div className="space-y-2">
            {ENGINEER_SPECS.map((spec) => {
              const checked = filters.spec === spec;
              return (
                <label
                  key={spec}
                  onClick={(e) => {
                    e.preventDefault();
                    onChange({
                      ...filters,
                      spec: checked ? undefined : spec,
                    });
                  }}
                  className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Checkbox checked={checked} />
                  {spec}
                </label>
              );
            })}
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <Label className="text-sm text-muted-foreground">
            {t("projectsEngineers.filters.available.label", "Available now")}
          </Label>
          <Switch
            checked={!!filters.isAvilable}
            onCheckedChange={(v) =>
              onChange({ ...filters, isAvilable: v || undefined })
            }
          />
        </div>
      </div>
    </SidebarFilters>
  );
};

export default SearchEngineersFilters;
