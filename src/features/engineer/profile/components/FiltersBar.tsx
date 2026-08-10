import Select from "@/components/inputs/Selector";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Mail, Phone, Search, SlidersHorizontal, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type {
  EngineerExperienceRange,
  EngineerFilters,
  EngineerSortOption,
  EngineerSpeciality,
} from "../api/types";

interface FiltersBarProps {
  filters: EngineerFilters;
  onChange: (updates: Partial<EngineerFilters>) => void;
  onReset?: () => void;
  className?: string;
}

const SPECIALIZATION_OPTIONS: EngineerSpeciality[] = [
  "CIVIL",
  "ARCHITECTURE",
  "ELECTRICAL",
  "MECHANICAL",
];

const EXPERIENCE_OPTIONS: EngineerExperienceRange[] = [
  "all",
  "0-2",
  "3-5",
  "5+",
];

const EXPERIENCE_LABELS: Record<EngineerExperienceRange, string> = {
  all: "experienceAll",
  "0-2": "experience0_2",
  "3-5": "experience3_5",
  "5+": "experience5Plus",
};

const FiltersBar = ({
  filters,
  onChange,
  onReset,
  className,
}: FiltersBarProps) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const toggleSpecialization = (option: EngineerSpeciality) => {
    const next = filters.specializations.includes(option)
      ? filters.specializations.filter((s) => s !== option)
      : [...filters.specializations, option];
    onChange({ specializations: next });
  };

  const resetFilters = () => {
    onChange({
      query: "",
      specializations: [],
      experienceRange: "all",
      hasPhone: false,
      hasEmail: false,
      sort: "experience",
    });
  };

  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        {t("engineerProfile.engineerSearch.filtersTitle")}
      </div>

      <div className="relative">
        <Search
          className={cn(
            "absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
            isArabic ? "right-3" : "left-3",
          )}
        />
        <Input
          value={filters.query}
          onChange={(e) => onChange({ query: e.target.value })}
          placeholder={t("engineerProfile.engineerSearch.searchPlaceholder")}
          className={cn(isArabic ? "pr-9" : "pl-9")}
        />
      </div>

      <div className="space-y-2">
        <Select
          value={filters.sort}
          setValue={(value) => onChange({ sort: value as EngineerSortOption })}
          label={t("engineerProfile.engineerSearch.sortLabel")}
        >
          <option value="experience">
            {t("engineerProfile.engineerSearch.sortExperience")}
          </option>
          <option value="recent">
            {t("engineerProfile.engineerSearch.sortRecent")}
          </option>
          <option value="name">
            {t("engineerProfile.engineerSearch.sortName")}
          </option>
        </Select>

        <Separator />

        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("engineerProfile.engineerSearch.specializationLabel")}
          </Label>
          {SPECIALIZATION_OPTIONS.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted/50"
            >
              <Checkbox
                checked={filters.specializations.includes(option)}
                onCheckedChange={() => toggleSpecialization(option)}
              />
              <span className="text-sm text-foreground">
                {t(`engineerProfile.speciality.${option}`)}
              </span>
            </label>
          ))}
        </div>

        <div className="space-y-2">
          <Select
            value={filters.experienceRange}
            setValue={(value) =>
              onChange({ experienceRange: value as EngineerExperienceRange })
            }
            label={t("engineerProfile.engineerSearch.experienceLabel")}
          >
            {EXPERIENCE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {t(
                  `engineerProfile.engineerSearch.${EXPERIENCE_LABELS[option]}`,
                )}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("engineerProfile.engineerSearch.contactLabel")}
          </Label>
          <div className="flex items-center justify-between gap-3 rounded-md border border-gray-300 bg-card p-3">
            <span className="flex items-center gap-2 text-sm text-foreground">
              <Phone className="h-4 w-4 text-muted-foreground" />
              {t("engineerProfile.engineerSearch.hasPhone")}
            </span>
            <Switch
              checked={filters.hasPhone}
              onCheckedChange={(checked) => onChange({ hasPhone: checked })}
            />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-md border border-gray-300 bg-card p-3">
            <span className="flex items-center gap-2 text-sm text-foreground">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {t("engineerProfile.engineerSearch.hasEmail")}
            </span>
            <Switch
              checked={filters.hasEmail}
              onCheckedChange={(checked) => onChange({ hasEmail: checked })}
            />
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onReset ?? resetFilters}
        >
          <X className="h-4 w-4" />
          {t("engineerProfile.engineerSearch.resetFilters")}
        </Button>
      </div>
    </div>
  );
};

export default FiltersBar;
