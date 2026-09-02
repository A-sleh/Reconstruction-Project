import { Pencil } from "lucide-react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";

import Input from "@/components/inputs/Input";
import PopuupLayout from "@/components/layouts/Popup-layout";
import Model from "@/components/model/Model";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import i18n from "@/lib/i18n";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  type EngineerProfile,
  type EngineerSpeciality,
  type EngineerSpecialization,
} from "../api/engineer-profile";

const editProfileSchema = z.object({
  firstName: z
    .string()
    .min(
      2,
      i18n.t("auth.register.generalInformation.validation.name_required"),
    ),
  lastName: z
    .string()
    .min(
      2,
      i18n.t("auth.register.generalInformation.validation.last_name_required"),
    ),
  email: z.string().email(i18n.t("auth.register.validation.invalid_email")),
  phone: z
    .string()
    .min(6, i18n.t("auth.register.generalInformation.validation.phone")),
  identifier: z.string().min(1),
  syndicateId: z.coerce.number().min(1),
  speciality: z.string().min(1),
  specialization: z.string().min(1),
  licenseNumber: z
    .string()
    .min(1, i18n.t("engineerProfile.edit.validation.license")),
  yearsOfExperiece: z.coerce.number().min(0),
  bio: z.string().min(1, i18n.t("engineerProfile.edit.validation.bio")),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface Props {
  profile: EngineerProfile;
  onUpdate: (updates: Partial<EngineerProfile>) => void;
}

const EditProfileModal = ({ profile, onUpdate }: Props) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(
      editProfileSchema,
    ) as unknown as Resolver<EditProfileFormValues>,
    mode: "onSubmit",
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone,
      identifier: profile.identifier,
      syndicateId: profile.syndicateId,
      speciality: profile.speciality,
      specialization: profile.professionalInfo.specialization,
      licenseNumber: profile.professionalInfo.licenseNumber,
      yearsOfExperiece: profile.professionalInfo.yearsOfExperiece,
      bio: profile.professionalInfo.bio,
    },
  });

  const handleSave = (data: EditProfileFormValues, close: () => void) => {
    onUpdate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      identifier: data.identifier,
      syndicateId: data.syndicateId,
      speciality: data.speciality as EngineerSpeciality,
      professionalInfo: {
        ...profile.professionalInfo,
        specialization: data.specialization as EngineerSpecialization,
        licenseNumber: data.licenseNumber,
        yearsOfExperiece: data.yearsOfExperiece,
        bio: data.bio,
      },
    });
    close();
  };

  return (
    <PopuupLayout
      openKey="engineer-edit-profile"
      title={t("engineerProfile.edit.title")}
      subTitle={t("engineerProfile.edit.subtitle")}
      openButton={
        <Button size="sm" variant="outline">
          <Pencil className="h-4 w-4" />
          {t("engineerProfile.editProfile")}
        </Button>
      }
      children={(close: () => void) => (
        <form
          onSubmit={handleSubmit((data) => handleSave(data, close))}
          className="space-y-5 overflow-auto max-h-130"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              label={t("engineerProfile.edit.fields.firstName")}
              required={true}
              fieldName="firstName"
              errors={errors}
              {...register("firstName")}
            />
            <Input
              label={t("engineerProfile.edit.fields.lastName")}
              required={true}
              fieldName="lastName"
              errors={errors}
              {...register("lastName")}
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              label={t("engineerProfile.edit.fields.email")}
              required={true}
              fieldName="email"
              errors={errors}
              {...register("email")}
            />
            <Input
              label={t("engineerProfile.edit.fields.phone")}
              required={true}
              fieldName="phone"
              errors={errors}
              {...register("phone")}
            />
          </div>

          <Input
            type="number"
            label={t("engineerProfile.edit.fields.yearsOfExperience")}
            required={true}
            fieldName="yearsOfExperiece"
            errors={errors}
            {...register("yearsOfExperiece", { valueAsNumber: true })}
          />

          <Textarea
            label={t("engineerProfile.edit.fields.bio")}
            rows={4}
            fieldName="bio"
            errors={errors}
            {...register("bio")}
          />

          <div className="flex justify-end gap-3 pt-2">
            <Model.Close>
              <Button type="button" variant="outline">
                {t("engineerProfile.edit.cancel")}
              </Button>
            </Model.Close>
            <Button type="submit">{t("engineerProfile.edit.submit")}</Button>
          </div>
        </form>
      )}
    />
  );
};

export default EditProfileModal;
