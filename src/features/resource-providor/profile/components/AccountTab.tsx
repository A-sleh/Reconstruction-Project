import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import SectionHeader from "./SectionHeader";
import { Button } from "@/components/ui/button";
import Input from "@/components/inputs/Input";
import ImageUploader from "@/components/inputs/ImageUploader";

type AccountFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  personalIdentifier: string;
  phone: string;
  photoUrl: string;
};

export default function AccountTab() {
  const { t } = useTranslation();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AccountFormValues>();

  const imageOfPhoto = watch("photoUrl");

  const handleImageChange = (file: File | null) => {
    setValue("photoUrl", file?.name ?? "");
  };

  return (
    <div>
      <SectionHeader
        title={t("resourceProvidor.profile.account.title")}
        subtitle={t("resourceProvidor.profile.account.subtitle")}
      />
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            type="text"
            label={t("resourceProvidor.profile.account.firstName")}
            placeholder={t("resourceProvidor.profile.account.firstNamePlaceholder")}
            fieldName="firstName"
            errors={errors ?? null}
            {...register("firstName")}
          />
          <Input
            type="text"
            label={t("resourceProvidor.profile.account.lastName")}
            placeholder={t("resourceProvidor.profile.account.lastNamePlaceholder")}
            fieldName="lastName"
            errors={errors ?? null}
            {...register("lastName")}
          />
          <Input
            type="email"
            label={t("resourceProvidor.profile.account.email")}
            placeholder={t("resourceProvidor.profile.account.emailPlaceholder")}
            fieldName="email"
            errors={errors ?? null}
            iconType="email"
            {...register("email")}
          />
          <Input
            type="password"
            label={t("resourceProvidor.profile.account.password")}
            placeholder={t("resourceProvidor.profile.account.passwordPlaceholder")}
            fieldName="password"
            errors={errors ?? null}
            iconType="password"
            {...register("password")}
          />
          <Input
            type="text"
            label={t("resourceProvidor.profile.account.personalIdentifier")}
            placeholder={t("resourceProvidor.profile.account.personalIdentifierPlaceholder")}
            fieldName="personalIdentifier"
            errors={errors ?? null}
            iconType="personalIdentifier"
            {...register("personalIdentifier")}
          />
          <Input
            type="tel"
            label={t("resourceProvidor.profile.account.phone")}
            placeholder={t("resourceProvidor.profile.account.phonePlaceholder")}
            fieldName="phone"
            errors={errors ?? null}
            {...register("phone")}
          />
        </div>

        <ImageUploader
          label={t("resourceProvidor.profile.account.profilePhoto")}
          required={false}
          fileName={imageOfPhoto}
          onFileChange={handleImageChange}
          errors={errors ?? null}
          fieldName="photoUrl"
        />

        <div className="flex justify-start pt-2">
          <Button type="submit" size="lg">
            {t("resourceProvidor.profile.saveChanges")}
          </Button>
        </div>
      </form>
    </div>
  );
}
