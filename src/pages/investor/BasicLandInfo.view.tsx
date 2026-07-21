import BasicLandInfoHeader from "@/features/investor/lands-buildings/components/BasicLandInfoHeader";
import BasicLandInfoForm from "@/features/investor/lands-buildings/components/BasicLandInfoForm";
import { useLocation, useNavigate } from "react-router";
import { paths } from "@/config/paths";

const BasicLandInfo = () => {
  const goto = useNavigate();
  const { state } = useLocation();
  const land = state?.land ? state?.land : null;

  const onSuccessCreated = () => {
    goto(paths.app.investor.hisLandsAndBuildings.getHref());
  };

  return (
    <div className="space-y-6">
      <BasicLandInfoHeader updateable={land != null} />
      <BasicLandInfoForm onSuccess={onSuccessCreated} initial={land} />
    </div>
  );
};

export default BasicLandInfo;
