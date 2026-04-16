import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import type { EngineerFormValues } from "../api/create-account";
import Input from "@/components/inputs/Input";
import Selector from "@/components/inputs/Selector";

const EngineerForm = () => {
  const { t } = useTranslation();
  const {
    setValue,
    register,
    watch,
    formState: {  errors },
  } = useFormContext<EngineerFormValues>();
  const specialtiy = watch("specialtiy")
  const setSpecialtiy = (value: string) => {
    setValue("specialtiy", value);
  };

  // Should cames from database
  const specialtiyList = [
    { value: "civil" },
    { value: "mechanical"},
    { value: "electrical" },
  ]

  return (
    <div className="space-y-3 mt-3">
      <Input
        type="text"
        required={true}
        label={t("auth.register.engineer.syndicateIdLabel")}
        placeholder={t("auth.register.engineer.syndicateIdPlaceholder")}
        fieldName="syndicateId"
        errors={errors ?? null}
        {...register("syndicateId")}
      />
      <Selector
        label={t("auth.register.engineer.specialtiyLabel")}
        required={true}
        value={specialtiy}
        setValue={setSpecialtiy}
      >
        {specialtiyList.map((item) => (
          <option key={item.value} value={item.value}>
            {item.value}
          </option>
        ))}
      </Selector>
    </div>
  );
};

export default EngineerForm;
