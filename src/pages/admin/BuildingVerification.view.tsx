import { useTranslation } from "react-i18next";
import PropertyStatsBar from "@/features/building-verification/components/PropertyStatsBar";
import PropertyVerificationTable from "@/features/building-verification/components/PropertyVerificationTable";
import { MOCK_PROPERTY_VERIFICATION_STATS } from "@/features/building-verification/mock/buildings";

const BuildingVerification = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div className="min-h-screen bg-background">
      <section className="container py-6 space-y-6" dir={isArabic ? "rtl" : "ltr"}>
        <header className="space-y-2">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {t("buildingVerification.badge")}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("buildingVerification.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("buildingVerification.subtitle")}
          </p>
        </header>

        <PropertyStatsBar
          stats={MOCK_PROPERTY_VERIFICATION_STATS}
          isLoading={false}
        />

        <PropertyVerificationTable />
      </section>
    </div>
  );
};

export default BuildingVerification;
