import { Filter, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Input from "@/components/inputs/Input";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { PROJECT_STATUSES } from "../api/types";
import type { GetAllProjectsFilters } from "../api/types";

interface Props {
  filters: GetAllProjectsFilters;
  onChange: (next: GetAllProjectsFilters) => void;
}

const ProjectFilters = ({ filters, onChange }: Props) => {
  const { t } = useTranslation();

  const reset = () => onChange({});

  const activeCount =
    (filters.Search ? 1 : 0) + (filters.Status ? 1 : 0);

  return (
    <aside className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm sticky top-16 self-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Filter className="h-4 w-4" /> {t("project.filters.title")}
          {activeCount > 0 && (
            <span className="rounded-full bg-primary text-white text-[10px] px-1.5 py-0.5 font-medium">
              {activeCount}
            </span>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={reset}
          className="h-7 px-2 text-xs"
        >
          <RotateCcw className="h-3 w-3" /> {t("project.filters.resetButton")}
        </Button>
      </div>

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
                  onClick={() =>
                    onChange({
                      ...filters,
                      Status: checked ? undefined : status,
                    })
                  }
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
    </aside>
  );
};

export default ProjectFilters;
