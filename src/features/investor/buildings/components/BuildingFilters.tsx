import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUILDING_TYPES } from "./BuildingTypes";

interface BuildingFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  buildingType: string;
  onBuildingTypeChange: (value: string) => void;
}

const BuildingFilters: React.FC<BuildingFiltersProps> = ({
  search,
  onSearchChange,
  buildingType,
  onBuildingTypeChange,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      <div className="relative w-72">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("investor.searchBuildings", "Search buildings...")}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pr-9 w-full bg-white"
        />
      </div>
      <Select value={buildingType} onValueChange={onBuildingTypeChange}>
        <SelectTrigger className="w-fit bg-white" dir={isArabic ? "rtl" : "ltr"}>
          <SelectValue
            placeholder={t("investor.filterByType", "Filter by type")}
          />
        </SelectTrigger>
        <SelectContent dir={isArabic ? "rtl" : "ltr"}>
          <SelectItem value="all">
            {t("investor.allTypes", "All Types")}
          </SelectItem>
          {BUILDING_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BuildingFilters;
