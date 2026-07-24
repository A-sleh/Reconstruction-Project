import { useTranslation } from "react-i18next";
import { AlertCircle, Plus } from "lucide-react";
import { useBuildingsInfinite } from "../api/query";
import type { BuildingType } from "../api/types";
import BuildingCard from "./BuildingCard";
import CardSkeleton from "../../lands-buildings/components/PropertySkeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useState } from "react";
import BuildingFilters from "./BuildingFilters";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";

interface BuildingsListProps {
  onEdit?: (buildingId: number) => void;
}

const BuildingsList: React.FC<BuildingsListProps> = ({ onEdit }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [buildingTypeFilter, setBuildingTypeFilter] = useState<string>("all");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBuildingsInfinite({
    Search: debouncedSearch || undefined,
    BuildingType:
      buildingTypeFilter !== "all" ? (buildingTypeFilter as BuildingType) : undefined,
  });

  const buildings = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <BuildingFilters
          search={search}
          onSearchChange={setSearch}
          buildingType={buildingTypeFilter}
          onBuildingTypeChange={setBuildingTypeFilter}
        />
        <Link to={paths.app.investor.createBuilding.getHref()}>
          <Button className="bg-gradient-emerald hover:opacity-95 text-white shadow-elegant gap-2">
            <Plus className="h-4 w-4" /> {t("investor.addBuilding", "Add Building")}
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex items-center justify-center py-20 gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          {t("investor.error-loading")}
        </div>
      )}

      {!isLoading && !isError && buildings.length === 0 && (
        <p className="text-center text-muted-foreground py-20">
          {t("investor.no-results")}
        </p>
      )}

      {!isLoading && !isError && buildings.length > 0 && (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {buildings.map((building, i) => (
              <BuildingCard
                key={`${building.buildingId}-${i}`}
                building={building}
                onEdit={onEdit ? () => onEdit(building.buildingId) : undefined}
              />
            ))}
          </div>
          {hasNextPage && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="text-sm text-primary hover:underline disabled:opacity-50"
              >
                {isFetchingNextPage
                  ? t("investor.loading")
                  : t("investor.loadMore")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BuildingsList;
