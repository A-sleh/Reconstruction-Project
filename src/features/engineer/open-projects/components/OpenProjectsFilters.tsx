import { Search, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { EngineeringDiscipline, ProjectScale } from "../api/types";
import {
  DISCIPLINE_META,
  SCALE_META,
  MAX_DURATION_WEEKS,
  DEADLINE_OPTIONS,
} from "../constants";
import type { OpenProjectsFilters as FilterState } from "../api/types";

interface Props {
  filters: FilterState;
  onUpdate: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

export default function OpenProjectsFilters({
  filters,
  onUpdate,
  onReset,
}: Props) {
  const { t } = useTranslation();

  const specialties = Object.values(EngineeringDiscipline);
  const scales = Object.values(ProjectScale);

  const durationValue: [number, number] = [
    filters.MinDurationWeeks ?? 0,
    filters.MaxDurationWeeks ?? MAX_DURATION_WEEKS,
  ];

  return (
    <div className="space-y-5 rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {t("openProjects.filters.specialties")}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-7 gap-1 px-2 text-xs text-muted-foreground"
        >
          <RotateCcw className="h-3 w-3" />
          {t("openProjects.filters.reset")}
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("openProjects.filters.searchPlaceholder")}
          value={filters.Search ?? ""}
          onChange={(e) => onUpdate({ Search: e.target.value })}
          className="pl-9"
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          {t("openProjects.filters.specialties")}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {specialties.map((s) => {
            const active = filters.Specialties?.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => {
                  const current = filters.Specialties ?? [];
                  const next = active
                    ? current.filter((x) => x !== s)
                    : [...current, s];
                  onUpdate({
                    Specialties: next.length > 0 ? next : undefined,
                  });
                }}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-gray-300 bg-muted/50 text-muted-foreground hover:border-primary/40"
                }`}
              >
                {t(DISCIPLINE_META[s].shortKey)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          {t("openProjects.filters.scale")}
        </p>
        <Select
          value={filters.Scale ?? "all"}
          onValueChange={(v) =>
            onUpdate({
              Scale: v === "all" ? undefined : (v as ProjectScale),
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("openProjects.filters.allScales")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t("openProjects.filters.allScales")}
            </SelectItem>
            {scales.map((s) => (
              <SelectItem key={s} value={s}>
                {t(SCALE_META[s].tKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          {t("openProjects.filters.duration")}
        </p>
        <Slider
          min={0}
          max={MAX_DURATION_WEEKS}
          step={4}
          value={durationValue}
          onValueChange={([min, max]) =>
            onUpdate({
              MinDurationWeeks: min === 0 ? undefined : min,
              MaxDurationWeeks:
                max === MAX_DURATION_WEEKS ? undefined : max,
            })
          }
        />
        <p className="text-[11px] text-muted-foreground/60">
          {durationValue[0] === 0 && durationValue[1] === MAX_DURATION_WEEKS
            ? t("openProjects.filters.durationAny")
            : t("openProjects.filters.durationMax", {
                weeks: durationValue[1],
              })}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">
          {t("openProjects.filters.deadline")}
        </p>
        <Select
          value={String(filters.DeadlineWithinDays ?? 0)}
          onValueChange={(v) =>
            onUpdate({
              DeadlineWithinDays: Number(v) === 0 ? undefined : Number(v),
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DEADLINE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {t(opt.tKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
