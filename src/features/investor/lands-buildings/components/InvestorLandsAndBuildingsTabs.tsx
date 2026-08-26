import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TrendingUp, AlertCircle, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLandsInfinite } from "../api/query";
import PropertyCard from "./PropertyCard";
import CardSkeleton from "./PropertySkeleton";
import BuildingsList from "../../buildings/components/BuildingsList";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";

type LandFilterValue = "all" | "with_building" | "without_building";

function InvestorLandsAndBuildingsTabs() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [mainTab, setMainTab] = useState<"land" | "building">("land");
  const [landFilter, setLandFilter] = useState<LandFilterValue>("all");

  const hasBuilding =
    landFilter === "all" ? undefined : landFilter === "with_building";

  const {
    data: landsData,
    isLoading: isLoadingLands,
    isError: isErrorLands,
    fetchNextPage: fetchNextPageLands,
    hasNextPage: hasNextPageLands,
    isFetchingNextPage: isFetchingNextPageLands,
  } = useLandsInfinite({ HasBuilding: hasBuilding });

  const lands = landsData?.pages.flatMap((p) => p.data) ?? [];

  return (
    <Tabs
      value={mainTab}
      onValueChange={(v) => setMainTab(v as "land" | "building")}
      className="w-full"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <TabsList className="bg-white">
          <TabsTrigger value="land">{t("investor.lands")}</TabsTrigger>
          <TabsTrigger value="building">{t("investor.buildings")}</TabsTrigger>
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

      <div className="my-5">
        {mainTab === "land" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <Tabs
                value={landFilter}
                onValueChange={(v) => setLandFilter(v as LandFilterValue)}
                dir={isArabic ? "rtl" : "ltr"}
              >
                <TabsList>
                  <TabsTrigger value="all">
                    {t("investor.landFilters.all")}
                  </TabsTrigger>
                  <TabsTrigger value="with_building">
                    {t("investor.landFilters.withBuilding")}
                  </TabsTrigger>
                  <TabsTrigger value="without_building">
                    {t("investor.landFilters.withoutBuilding")}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Link to={paths.app.investor.basicLandInfo.getHref()}>
                <Button className="bg-gradient-emerald hover:opacity-95 text-white shadow-elegant gap-2">
                  <Plus className="h-4 w-4" /> {t("investor.addProperty")}
                </Button>
              </Link>
            </div>

            {isLoadingLands && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            )}

            {isErrorLands && (
              <div className="flex items-center justify-center py-20 gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                {t("investor.error-loading")}
              </div>
            )}

            {!isLoadingLands && !isErrorLands && lands.length === 0 && (
              <p className="text-center text-muted-foreground py-20">
                {t("investor.no-results")}
              </p>
            )}

            {!isLoadingLands && !isErrorLands && lands.length > 0 && (
              <>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {lands.map((land, i) => (
                    <PropertyCard key={`${land.name}-${i}`} p={land} />
                  ))}
                </div>
                {hasNextPageLands && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => fetchNextPageLands()}
                      disabled={isFetchingNextPageLands}
                      className="text-sm text-primary hover:underline disabled:opacity-50"
                    >
                      {isFetchingNextPageLands
                        ? t("investor.loading")
                        : t("investor.loadMore")}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        <TabsContent value="building">
          <BuildingsList />
        </TabsContent>
      </div>
    </Tabs>
  );
}

export default InvestorLandsAndBuildingsTabs;
