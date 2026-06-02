import Selector from "@/components/inputs/Selector";
import { useTranslation } from "react-i18next";

interface WorkSiteTypeProps {
  value: string;
  setValue: (value: string) => void;
  label?: string;
  asInput: boolean;
}
export const workSiteTypes = [
  "Office",
  "Company",
  "Factory",
  "Warehouse",
  "Quarry",
  "Workshop",
];

const WorkSiteType: React.FC<WorkSiteTypeProps> = ({
  value,
  setValue,
  label,
  asInput = false,
}) => {
  const { t } = useTranslation();

  const workSiteTypesFinal = asInput
    ? [...workSiteTypes, "Other"]
    : workSiteTypes;

  return (
    <Selector label={label} required={false} value={value} setValue={setValue} asInput={asInput}>
      {!asInput && (
        <option value="">{t("resourceProvidor.workSites.filters.all")}</option>
      )}
      {workSiteTypesFinal.map((item) => (
        <option key={item} value={item.toString()}>
          {t(
            `auth.register.providor.workSitesCategories.${item.toLocaleLowerCase()}`,
          )}
        </option>
      ))}
    </Selector>
  );
};

export default WorkSiteType;
