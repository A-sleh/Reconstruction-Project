import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Input from "@/components/inputs/Input";
import { PickCoordsFromMap } from "@/components/model/PickCoordsFromMap.model";

const ServiceProviderForm = () => {
  const { t } = useTranslation();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const companyLocationValue = watch("companyLocation");

  return (
    <div className="space-y-3 mt-3">
      <Input
        type="text"
        label={t("auth.register.providor.licenseLabel")}
        placeholder={t("auth.register.providor.licensePlaceholder")}
        required={true}
        fieldName="license"
        errors={errors}
        {...register("license")}
      />
      <Input
        type="text"
        label={t("auth.register.providor.companyNameLabel")}
        placeholder={t("auth.register.providor.companyNamePlaceholder")}
        required={true}
        fieldName="companyName"
        errors={errors}
        {...register("companyName")}
      />

      <Input
        type="text"
        label={t("auth.register.providor.companyAddressLabel")}
        placeholder={t("auth.register.providor.companyAddressPlaceholder")}
        required={true}
        fieldName="companyAddress"
        errors={errors}
        {...register("companyAddress")}
      />
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="text"
              readOnly={true}
              label={t("auth.register.providor.companyLocationLabel")}
              placeholder={t("auth.register.providor.companyLocationPlaceholder")}
              required={true}
              fieldName="companyLocation"
              errors={errors}
              value={companyLocationValue}
              setValue={(value) => setValue("companyLocation", value)}
              {...register("companyLocation")}
            />
          </div>
          <span className="mt-7">
            <PickCoordsFromMap
              setValue={setValue}
              value={companyLocationValue}
            />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderForm;
