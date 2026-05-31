import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Input from "@/components/inputs/Input";
import { PickCoordsFromMap } from "@/components/model/PickCoordsFromMap.model";
import ImageUploader from "@/components/inputs/ImageUploader";
import Selector from "@/components/inputs/Selector";

const ServiceProviderForm = () => {
  const { t } = useTranslation();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const logoUrl = watch("logoUrl");
  const companyLocationValue = watch("companyLocation");
  const workSiteType = watch("workSiteType");
  const handleImageChange = (file: File | null) => {
    setValue("logoUrl", file?.name ?? "");
  };

  return (
    <div className="space-y-3 mt-3">
      <div className="flex flex-col md:flex-row gap-3">
        <Input
          type="text"
          label={t("auth.register.providor.licenseLabel")}
          placeholder={t("auth.register.providor.licensePlaceholder")}
          required={true}
          fieldName="licenseOfService"
          errors={errors}
          {...register("licenseOfService")}
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
      </div>
      <ImageUploader
        label={t("auth.register.investor.imageRecord")}
        required={true}
        fileName={logoUrl}
        onFileChange={handleImageChange}
        errors={errors ?? null}
        fieldName="photoUrl"
      />
      <div>
        <Selector
          label={t("auth.register.engineer.specialtiyLabel")}
          required={true}
          value={workSiteType}
          setValue={(value) =>
            setValue("providerRole", {
              value,
            })
          }
        >
          {Array(5).map((item) => (
            <option key={item.value} value={item.value}>
              {item.value}
            </option>
          ))}
        </Selector>
      </div>
      <div className="flex flex-col md:flex-row gap-3">
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
                placeholder={t(
                  "auth.register.providor.companyLocationPlaceholder",
                )}
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
    </div>
  );
};

export default ServiceProviderForm;
