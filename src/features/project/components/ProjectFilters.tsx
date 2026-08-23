import SidebarFilters from "@/components/common/SidebarFilters";
import Input from "@/components/inputs/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import type { GetAllProjectsFilters } from "../api/types";
import { PROJECT_STATUSES } from "../api/types";

interface Props {
  filters: GetAllProjectsFilters;
  onChange: (next: GetAllProjectsFilters) => void;
}

const ProjectFilters = ({ filters, onChange }: Props) => {
  const { t } = useTranslation();
  const reset = () => onChange({});
  const activeCount = (filters.Search ? 1 : 0) + (filters.Status ? 1 : 0);
  console.log(filters);

  return (
    <SidebarFilters reset={reset} activeCount={activeCount}>
      <div className="mt-4 space-y-6">
        <Input
          label={t("project.filters.search.label")}
          value={filters.Search ?? ""}
          onChange={(e) =>
            onChange({
              ...filters,
              Search: e.target.value || undefined,
            })
          }
          placeholder={t("project.filters.search.placeholder")}
        />

        <Separator />

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            {t("project.filters.status.label")}
          </Label>
          <div className="space-y-2">
            {PROJECT_STATUSES.map((status) => {
              const checked = filters.Status === status;
              return (
                <label
                  key={status}
                  onClick={(e) => {
                    e.preventDefault();
                    onChange({
                      ...filters,
                      Status: checked ? undefined : status,
                    });
                  }}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground text-muted-foreground"
                >
                  <Checkbox checked={checked} />
                  {t(`project.status.${status}`)}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </SidebarFilters>
  );
};

export default ProjectFilters;
