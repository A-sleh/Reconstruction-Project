import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TrendingUp, AlertCircle, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useLandsInfinite } from "../api/query";
import PropertyCard from "./PropertyCard";
import CardSkeleton from "./PropertySkeleton";
import BuildingsList from "../../buildings/components/BuildingsList";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";

type TabValue = "building" | "land";

function InvestorLandsAndBuildingsTabs() {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const isArabic = i18n.language == "ar";
  const [tab, setTab] = useState<TabValue>("land");
  const [withProjects, setWithProjects] = useState(false);

  // Land query
  const {
    data: landsData,
    isLoading: isLoadingLands,
    isError: isErrorLands,
    fetchNextPage: fetchNextPageLands,
    hasNextPage: hasNextPageLands,
    isFetchingNextPage: isFetchingNextPageLands,
  } = useLandsInfinite({ HasBuilding: withProjects });

  const lands = landsData?.pages.flatMap((p) => p.data) ?? [];

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => setTab(v as TabValue)}
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

      <div className="mt-5">
        {tab === "land" && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 mb-4 px-4 py-2.5 rounded-xl bg-muted/50 border border-border/50 w-fit">
              <Switch
                id="with-projects"
                checked={withProjects}
                onCheckedChange={setWithProjects}
              />
              <label
                htmlFor="with-projects"
                className="cursor-pointer text-sm font-medium text-foreground select-none"
              >
                {t("investor.withProjects")}
              </label>
            </div>
            <Link to={paths.app.investor.basicLandInfo.getHref()}>
              <Button className="bg-gradient-emerald hover:opacity-95 text-white shadow-elegant gap-2">
                <Plus className="h-4 w-4" /> {t("investor.addProperty")}
              </Button>
            </Link>
          </div>
        )}

        {tab === "land" && (
          <>
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

        {tab === "building" && <BuildingsList />}
      </div>
    </Tabs>
  );
}

export default InvestorLandsAndBuildingsTabs;
