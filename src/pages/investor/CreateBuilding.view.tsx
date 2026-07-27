import { useNavigate, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { paths } from "@/config/paths";
import BuildingForm from "@/features/investor/buildings/components/BuildingForm";
import type { ILoncation } from "@/features/investor/lands-buildings/api/types";
import BasicLandInfoHeader from "@/features/investor/lands-buildings/components/BasicLandInfoHeader";

const CreateBuilding = () => {
  const { t } = useTranslation();
  const goto = useNavigate();
  const [searchParams] = useSearchParams();
  const landId = Number(searchParams.get("landId")) || 0;
  const borderRaw = searchParams.get("border");
  const border: ILoncation[] = borderRaw
    ? JSON.parse(decodeURIComponent(borderRaw))
    : [];

  const onSuccessCreated = () => {
    goto(paths.app.investor.landBuildingDetails.getHref(landId.toString()));
  };

  return (
    <div className="space-y-6">
      <BasicLandInfoHeader
        updateable={false}
        title={t("investor.createBuilding", "Create New Building")}
        description={t(
          "investor.createBuildingDesc",
          "Fill in the details to add a new building",
        )}
      />
      <BuildingForm
        landId={landId}
        landBorder={border}
        onSuccess={onSuccessCreated}
      />
    </div>
  );
};

export default CreateBuilding;
