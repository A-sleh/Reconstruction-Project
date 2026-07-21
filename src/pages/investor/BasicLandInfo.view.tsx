import BasicLandInfoHeader from "@/features/investor/lands-buildings/components/BasicLandInfoHeader";
import BasicLandInfoForm from "@/features/investor/lands-buildings/components/BasicLandInfoForm";
import { useNavigate } from "react-router";
import { paths } from "@/config/paths";

const BasicLandInfo = () => {
  const goto = useNavigate();

  const onSuccessCreated = () => {
    goto(paths.app.investor.hisLandsAndBuildings.getHref());
  };

  return (
    <div className="space-y-6">
      <BasicLandInfoHeader />
      <BasicLandInfoForm onSuccess={onSuccessCreated}/>
    </div>
  );
};

export default BasicLandInfo;
