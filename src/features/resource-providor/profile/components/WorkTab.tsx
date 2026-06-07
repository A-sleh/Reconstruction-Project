import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import SectionHeader from "./SectionHeader";
import Input from "@/components/inputs/Input";

type WorkFormValues = {
  license: string;
};

export default function WorkTab() {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
  } = useForm<WorkFormValues>();

  return (
    <div>
      <SectionHeader
        title={t("resourceProvidor.profile.work.title")}
        subtitle={t("resourceProvidor.profile.work.subtitle")}
      />
      <form className="space-y-6 max-w-xl" onSubmit={(e) => e.preventDefault()}>
        <Input
          type="text"
          label={t("resourceProvidor.profile.work.license")}
          required={true}
          placeholder={t("resourceProvidor.profile.work.licensePlaceholder")}
          fieldName="license"
          errors={errors ?? null}
          {...register("license", { required: true })}
        />
        <Button type="submit" size="lg">
          {t("resourceProvidor.profile.saveChanges")}
        </Button>
      </form>
    </div>
  );
}
