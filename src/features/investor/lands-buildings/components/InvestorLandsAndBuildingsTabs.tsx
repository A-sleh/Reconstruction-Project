import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TrendingUp, AlertCircle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/Label";
import { useLandsInfinite } from "../api/query";
import PropertyCard from "./PropertyCard";
import CardSkeleton from "./PropertySkeleton";

type TabValue = "all" | "building" | "land";

function InvestorLandsAndBuildingsTabs() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabValue>("all");
  const [withProjects, setWithProjects] = useState(false);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLandsInfinite({ HasBuilding: false });

  const lands = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => setTab(v as TabValue)}
      className="w-full"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <TabsList className="bg-white">
          <TabsTrigger value="all">{t("investor.allAssets")}</TabsTrigger>
          <TabsTrigger value="building">{t("investor.buildings")}</TabsTrigger>
          <TabsTrigger value="land">{t("investor.lands")}</TabsTrigger>
        </TabsList>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5 text-emerald" />{" "}
          {t("investor.portfolioUp")}{" "}
          <span className="text-emerald font-medium">
            {t("investor.quarterGrowth")}
          </span>{" "}
          {t("investor.thisQuarter")}
        </div>
      </div>

      <div className="mt-5">
        {tab === "land" && (
          <div className="flex items-center gap-2 mb-4">
            <Checkbox
              id="with-projects"
              checked={withProjects}
              onCheckedChange={(checked) => setWithProjects(checked === true)}
            />
            <Label htmlFor="with-projects" className="cursor-pointer text-sm">
              {t("investor.withProjects")}
            </Label>
          </div>
        )}

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

        {!isLoading && !isError && lands.length === 0 && (
          <p className="text-center text-muted-foreground py-20">
            {t("investor.no-results")}
          </p>
        )}

        {!isLoading && !isError && lands.length > 0 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {lands.map((land, i) => (
                <PropertyCard key={`${land.name}-${i}`} p={land} />
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
    </Tabs>
  );
}

export default InvestorLandsAndBuildingsTabs;
