import { Dispatch, SetStateAction } from "react";

import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

import ImageUploader from "@/components/inputs/ImageUploader";
import Input from "@/components/inputs/Input";
import { useFileUpload } from "@/hooks/useFileUpload";

import type { BaseRegistrationValues } from "../api/create-account";

const BaseRegisterInputs = ({
  setDisableFormSubmit,
}: {
  setDisableFormSubmit: Dispatch<SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<BaseRegistrationValues>();
  const imageOfPhoto = watch("photoId");

  const { previewUrl, isPending, onChange } = useFileUpload({
    onSuccess: (id) => {
      setDisableFormSubmit(false);
      setValue("photoId", id);
    },
    onError: () => {
      setDisableFormSubmit(false);
    },
  });

  const handleImageChange = (selectedFile: File | null) => {
    onChange(selectedFile);
    setDisableFormSubmit(true);
    if (!selectedFile) {
      setValue("photoId", "");
      setValue("file", undefined);
    }
  };

  return (
    <div className="space-y-3 mt-3 ">
      <div className="flex flex-col md:flex-row gap-2 ">
        <Input
          type="text"
          iconType="user"
          required={true}
          label={t("auth.register.generalInformation.name")}
          placeholder={t("auth.register.generalInformation.name")}
          fieldName="firstName"
          errors={errors ?? null}
          {...register("firstName")}
        />
        <Input
          type="text"
          label={t("auth.register.generalInformation.lastName")}
          required={true}
          placeholder={t("auth.register.generalInformation.lastName")}
          fieldName="lastName"
          errors={errors ?? null}
          {...register("lastName")}
        />
      </div>
      <Input
        type="email"
        label={t("auth.register.generalInformation.emailPlaceholder")}
        placeholder={t("auth.register.generalInformation.emailPlaceholder")}
        required={true}
        fieldName="email"
        errors={errors ?? null}
        {...register("email")}
      />
      <Input
        type="password"
        label={t("auth.register.generalInformation.passwordPlaceholder")}
        required={true}
        placeholder={t("auth.register.generalInformation.passwordPlaceholder")}
        fieldName="password"
        errors={errors ?? null}
        {...register("password")}
      />
      <div className="flex gap-2">
        <Input
          type="text"
          required={true}
          label={t(
            "auth.register.generalInformation.nationalNumberPlaceholder",
          )}
          placeholder={t(
            "auth.register.generalInformation.nationalNumberPlaceholder",
          )}
          fieldName="personalIdentifier"
          errors={errors ?? null}
          {...register("personalIdentifier")}
        />
        <Input
          type="text"
          required={true}
          label={t("auth.register.generalInformation.phone")}
          placeholder={t("auth.register.generalInformation.phonePlaceHolder")}
          fieldName="phone"
          errors={errors ?? null}
          {...register("phone")}
        />
      </div>
      <ImageUploader
        label={t("auth.register.generalInformation.profilePhoto")}
        required={true}
        fileName={"photoUrl"}
        value={previewUrl || imageOfPhoto}
        disabled={isPending}
        onFileChange={handleImageChange}
        errors={errors ?? null}
        fieldName="photoUrl"
      />
    </div>
  );
};

export default BaseRegisterInputs;
