import { useTranslation } from "react-i18next";
import { TrendingUp } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { properties } from "@/data/investor/mock";
import PropertyCard from "./PropertyCard";

function InvestorLandsAndBuildingsTabs() {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <TabsList className="bg-white">
          <TabsTrigger value="all">{t("investor.allAssets")}</TabsTrigger>
          <TabsTrigger value="building">{t("investor.buildings")}</TabsTrigger>
          <TabsTrigger value="land">{t("investor.lands")}</TabsTrigger>
        </TabsList>
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5 text-emerald" /> {t("investor.portfolioUp")}{" "}
          <span className="text-emerald font-medium">{t("investor.quarterGrowth")}</span> {t("investor.thisQuarter")}
        </div>
      </div>
      <TabsContent value="all" className="mt-5">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="building" className="mt-5">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties
            .filter((p) => p.type === "building")
            .map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
        </div>
      </TabsContent>
      <TabsContent value="land" className="mt-5">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties
            .filter((p) => p.type === "land")
            .map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default InvestorLandsAndBuildingsTabs;
