import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import type { BaseRegistrationValues } from "../api/create-account";
import Input from "@/components/inputs/Input";

const BaseRegisterInputs = () => {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useFormContext<BaseRegistrationValues>();

  return (
    <div className="space-y-3 mt-3">
      <div className="flex flex-col md:flex-row gap-2">
        <Input
          type="text"
          required={true}
          label={t("register.name")}
          placeholder={t("register.name")}
          fieldName="firstName"
          errors={errors ?? null}
          {...register("firstName")}
        />
        <Input
          type="text"
          label={t("register.lastName")}
          required={true}
          placeholder={t("register.lastName")}
          fieldName="lastName"
          errors={errors ?? null}
          {...register("lastName")}
        />
      </div>
      <Input
        type="email"
        label={t("register.emailPlaceholder")}
        placeholder={t("register.emailPlaceholder")}
        required={true}
        fieldName="email"
        errors={errors ?? null}
        {...register("email")}
      />
      <Input
        type="password"
        label={t("register.passwordPlaceholder")}
        required={true}
        placeholder={t("register.passwordPlaceholder")}
        fieldName="password"
        errors={errors ?? null}
        {...register("password")}
      />
      <Input
        type="text"
        required={true}
        label={t("register.nationalNumberPlaceholder")}
        placeholder={t("register.nationalNumberPlaceholder")}
        fieldName="NationalNumber"
        errors={errors ?? null}
        {...register("NationalNumber")}
      />
    </div>
  );
};

export default BaseRegisterInputs;
