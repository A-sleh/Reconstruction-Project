import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";

import Loader from "@/components/shared/Loader";
import { useLandById } from "@/features/investor/lands-buildings/api/query";
import LandBuildingsSection from "@/features/investor/lands-buildings/components/LandBuildingsSection";
import LandDetailsGrid from "@/features/investor/lands-buildings/components/LandDetailsGrid";
import LandHeroSection from "@/features/investor/lands-buildings/components/LandHeroSection";
import LandKPICards from "@/features/investor/lands-buildings/components/LandKPICards";

export default function PropertyDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: land, isLoading, error } = useLandById(id ?? "");

  if (isLoading) {
    return <Loader />;
  }

  if (error || !land) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <AlertCircle className="h-10 w-10 text-destructive/50" />
        <p className="text-sm text-muted-foreground">
          {t("investor.error-loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LandHeroSection land={land} />
      <LandKPICards land={land} />
      <LandDetailsGrid land={land} />
      <LandBuildingsSection land={land} />
    </div>
  );
}
