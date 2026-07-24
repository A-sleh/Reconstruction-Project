import { useNavigate, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { paths } from "@/config/paths";
import BuildingForm from "@/features/investor/buildings/components/BuildingForm";

const CreateBuilding = () => {
  const { t } = useTranslation();
  const goto = useNavigate();
  const [searchParams] = useSearchParams();
  const landId = Number(searchParams.get("landId")) || 0;

  const onSuccessCreated = () => {
    goto(paths.app.investor.hisLandsAndBuildings.getHref());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => goto(-1)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t("investor.createBuilding", "Create New Building")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("investor.createBuildingDesc", "Fill in the details to add a new building")}
          </p>
        </div>
      </div>
      <BuildingForm landId={landId} onSuccess={onSuccessCreated} />
    </div>
  );
};

export default CreateBuilding;
