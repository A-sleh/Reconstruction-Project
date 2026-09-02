import { useTranslation } from "react-i18next";

import Selector from "@/components/inputs/Selector";

import { EEngineeringRole, engineeringRoleLabels } from "../api/create-account";

interface EngineeringRoleSelectorProps {
  value: EEngineeringRole;
  setValue: (value: EEngineeringRole) => void;
  required?: boolean;
  disabled?: boolean;
}

const EngineeringRoleSelector = ({
  value,
  setValue,
  required = false,
  disabled = false,
}: EngineeringRoleSelectorProps) => {
  const { t } = useTranslation();

  const handleChange = (newValue: string) => {
    setValue(Number(newValue) as EEngineeringRole);
  };

  return (
    <Selector
      label={t("auth.register.engineer.engineeringRoleLabel")}
      required={required}
      value={value}
      setValue={handleChange}
      disabled={disabled}
    >
      {Object.values(EEngineeringRole)
        .filter((v) => typeof v === "number")
        .map((role) => (
          <option key={role} value={role}>
            {engineeringRoleLabels[role as EEngineeringRole]}
          </option>
        ))}
    </Selector>
  );
};

export default EngineeringRoleSelector;
