import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

function InvestorLandsAndBuildingsHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {t("investor.dashboard")}
        </p>
        <h1 className="text-3xl font-semibold mt-1 text-foreground">
          {t("investor.portfolioOverview")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("investor.portfolioDescription")}
        </p>
      </div>
      <Button className="bg-gradient-emerald hover:opacity-95 text-white shadow-elegant gap-2">
        <Plus className="h-4 w-4" /> {t("investor.addProperty")}
      </Button>
    </div>
  );
}

export default InvestorLandsAndBuildingsHeader;
