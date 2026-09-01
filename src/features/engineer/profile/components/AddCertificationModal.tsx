import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import z from "zod";
import i18n from "@/lib/i18n";
import { useTranslation } from "react-i18next";
import PopuupLayout from "@/components/layouts/Popup-layout";
import Model from "@/components/model/Model";
import { Button } from "@/components/ui/button";
import Input from "@/components/inputs/Input";
import type { ReactNode } from "react";
import type { EngineerCertification } from "../api/types";

const certificationSchema = z.object({
  name: z
    .string()
    .min(
      2,
      i18n.t("engineerProfile.skills.certification.validation.name", {
        defaultValue: "Name must be at least 2 characters",
      })
    ),
  issuer: z
    .string()
    .min(
      2,
      i18n.t("engineerProfile.skills.certification.validation.issuer", {
        defaultValue: "Issuer must be at least 2 characters",
      })
    ),
  year: z.coerce
    .number()
    .min(
      1980,
      i18n.t("engineerProfile.skills.certification.validation.year", {
        defaultValue: "Year must be valid",
      })
    )
    .max(
      2030,
      i18n.t("engineerProfile.skills.certification.validation.year", {
        defaultValue: "Year must be valid",
      })
    ),
});

type CertificationFormValues = z.infer<typeof certificationSchema>;

const defaultValues: CertificationFormValues = {
  name: "",
  issuer: "",
  year: new Date().getFullYear() as number,
};

interface Props {
  onAdd: (cert: EngineerCertification) => void;
  openButton?: ReactNode;
}

const AddCertificationModal = ({ onAdd, openButton }: Props) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CertificationFormValues>({
    resolver: zodResolver(
      certificationSchema
    ) as unknown as Resolver<CertificationFormValues>,
    defaultValues,
    mode: "onSubmit",
  });

  const handleCreate = (data: CertificationFormValues, close: () => void) => {
    onAdd({
      id: crypto.randomUUID(),
      name: data.name,
      issuer: data.issuer,
      year: data.year,
    });
    reset(defaultValues);
    close();
  };

  return (
    <PopuupLayout
      openKey="engineer-certification"
      title={t("engineerProfile.skills.certification.model.title")}
      subTitle={t("engineerProfile.skills.certification.model.subtitle")}
      openButton={
        openButton || (
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4" />
            {t("engineerProfile.skills.addCertification")}
          </Button>
        )
      }
      children={(close: () => void) => (
        <form
          onSubmit={handleSubmit((data) => handleCreate(data, close))}
          className="space-y-5 overflow-auto max-h-130"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              label={t("engineerProfile.skills.certification.fields.name")}
              placeholder={t("engineerProfile.skills.certification.placeholders.name")}
              required={true}
              fieldName="name"
              errors={errors}
              {...register("name")}
            />
            <Input
              label={t("engineerProfile.skills.certification.fields.issuer")}
              placeholder={t("engineerProfile.skills.certification.placeholders.issuer")}
              required={true}
              fieldName="issuer"
              errors={errors}
              {...register("issuer")}
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              type="number"
              min={1980}
              max={2030}
              label={t("engineerProfile.skills.certification.fields.year")}
              placeholder={t("engineerProfile.skills.certification.placeholders.year")}
              fieldName="year"
              errors={errors}
              {...register("year")}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Model.Close>
              <Button type="button" variant="outline">
                {t("engineerProfile.skills.certification.model.cancel")}
              </Button>
            </Model.Close>
            <Button type="submit">
              {t("engineerProfile.skills.certification.model.submit")}
            </Button>
          </div>
        </form>
      )}
    />
  );
};

export default AddCertificationModal;
