import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Input from "@/components/inputs/Input";
import { PickCoordsFromMap } from "@/components/model/PickCoordsFromMap.model";
import ImageUploader from "@/components/inputs/ImageUploader";
import Selector from "@/components/inputs/Selector";
import { Label } from "@/components/ui/Label";
import { workSiteTypes } from "../api/create-account";

const ServiceProviderForm = () => {
  const { t } = useTranslation();
  const {
    register,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useFormContext();

  const logoUrl = watch("logoUrl");
  const providerRole = watch("providerRole");
  const companyLocationValue = watch("companyLocation");
  const workSiteType = watch("workSiteType");

  const changeProviderRole = (type: "Resource" | "Service") => {
    setValue("providerRole", type);
  };

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
        <div className="w-full flex gap-1 flex-col">
          <Label className="text-[13px] mb-0.5 md:text-sm">
            {t("auth.register.providor.registerType")}
          </Label>
          <div className="flex gap-2 items-center">
            <span
              onClick={() => changeProviderRole("Service")}
              className={`px-2 py-1 flex-1 text-center min-h-11 rounded-md border border-primary font-semibold hover:bg-primary hover:text-white transition-all ${providerRole != "Resource" && "bg-primary text-white"}`}
              style={{ lineHeight: "30px" }}
            >
              {t("auth.register.providor.serviceProviderBtn")}
            </span>
            <span
              onClick={() => changeProviderRole("Resource")}
              className={`px-2 py-1 flex-1 text-center min-h-11 rounded-md border border-primary font-semibold hover:bg-primary hover:text-white transition-all ${providerRole == "Resource" && "bg-primary text-white"}`}
              style={{ lineHeight: "30px" }}
            >
              {t("auth.register.providor.resourceProviderBtn")}
            </span>
          </div>
        </div>
      </div>
      <ImageUploader
        label={t("auth.register.providor.companyLogo")}
        required={true}
        fileName={logoUrl}
        onFileChange={handleImageChange}
        errors={errors ?? null}
        fieldName="logoUrl"
      />
      <div>
        <Selector
          label={t("auth.register.engineer.specialtiyLabel")}
          required={true}
          value={workSiteType}
          setValue={(value: string) => {
            console.log(value);
            setValue("workSiteType", value);
          }}
        >
          {workSiteTypes.map((item) => (
            <option key={item} value={item.toString()}>
              {t(
                `auth.register.providor.workSitesCategories.${item.toLocaleLowerCase()}`,
              )}
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
