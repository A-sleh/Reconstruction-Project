import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import type { InvestorFormValues } from "../api/create-account";
import Input from "@/components/inputs/Input";
import ImageUploader from "@/components/inputs/ImageUploader";

const InvestorForm = () => {
  const { t } = useTranslation();
  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext<InvestorFormValues>();

  const imageRecordValue = watch("imageRecord");
  const imageLocalFile = watch("imageRecordFile");

  const handleImageChange = (file: File | null) => {
    setValue("imageRecord", file?.name ?? "");
    setValue("imageRecordFile", file ?? undefined);
  };

  return (
    <div className="space-y-3 mt-3">
      <Input
        type="text"
        required={true}
        label={t("auth.register.investor.commercialRegistration")}
        placeholder={t(
          "auth.register.investor.commercialRegistrationPlaceholder",
        )}
        fieldName="commercialRegistration"
        errors={errors ?? null}
        {...register("commercialRegistration")}
      />
      <ImageUploader
        label={t("auth.register.investor.imageRecord")}
        required={true}
        value={imageLocalFile || imageRecordValue}
        onFileChange={handleImageChange}
        errors={errors ?? null}
        fieldName="imageRecord"
      />
    </div>
  );
};

export default InvestorForm;
