import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import Input from "@/components/inputs/Input";

import { useProfile } from "../api/queries";
import SectionHeader from "./SectionHeader";

type WorkFormValues = {
  license: string;
};

export default function WorkTab() {
  const { t } = useTranslation();
  const { data: profile, isLoading } = useProfile();

  const {
    register,
    reset,
    formState: { errors },
  } = useForm<WorkFormValues>();

  useEffect(() => {
    reset({
      license: profile?.provider?.licenseOfService ?? "",
    });
  }, [profile, reset]);

  return (
    <div className="space-y-6">
      <SectionHeader
        title={t("profile.work.title")}
        subtitle={t("profile.work.subtitle")}
      />

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <Input
          type="text"
          label={t("profile.work.license")}
          required={true}
          placeholder={t("profile.work.licensePlaceholder")}
          fieldName="license"
          errors={errors ?? null}
          loadInitialValue={isLoading}
          {...register("license", { required: true })}
        />
        {/* <Button type="submit" size="lg" disabled={isLoading}>
          {t("profile.saveChanges")}
        </Button> */}
      </form>
    </div>
  );
}
