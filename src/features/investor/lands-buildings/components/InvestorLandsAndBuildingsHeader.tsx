import { useTranslation } from "react-i18next";

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
    </div>
  );
}

export default InvestorLandsAndBuildingsHeader;
