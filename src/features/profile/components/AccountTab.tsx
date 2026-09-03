import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BsShieldCheck } from "react-icons/bs";

import ConfrimChanges from "@/components/common/ConfrimChanges";
import ImageUploader from "@/components/inputs/ImageUploader";
import Input from "@/components/inputs/Input";
import { useFileUpload } from "@/hooks/useFileUpload";
import { getDominImageURL } from "@/lib/helpers";
import useAuthStore from "@/stores/useAuthStore";

import { useUpdateUser } from "../api/actions";
import { useProfile } from "../api/queries";
import SectionHeader from "./SectionHeader";

type AccountFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  personalIdentifier: string;
  phone: string;
};

export default function AccountTab() {
  const { t } = useTranslation();
  const { updateUserImage } = useAuthStore((s) => s);
  const [updateImage, setUpdateImage] = useState(false);
  const { data: profile, isLoading } = useProfile();

  const { isPending, onChange, previewUrl, fileId } = useFileUpload({
    onSuccess: () => {
      setUpdateImage(true);
    },
  });
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AccountFormValues>();

  const firstName = watch("firstName");
  const lastName = watch("lastName");

  useEffect(() => {
    if (profile?.user) {
      reset({
        firstName: profile.user.firstName ?? "",
        lastName: profile.user.lastName ?? "",
        email: profile.user.email ?? "",
        personalIdentifier: profile.user.personalIdentifier ?? "",
        phone: profile.user.phone ?? "",
      });
    }
  }, [profile, reset]);

  const handleImageChange = (file: File | null) => {
    onChange(file);
  };

  useEffect(() => {
    if (profile?.user.photo.url) {
      updateUserImage(profile?.user.photo.url);
    }
  }, [profile?.user.photo.url]);

  const onSubmit = (values: AccountFormValues) => {
    updateUser(
      {
        user: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          personalIdentifier: values.personalIdentifier,
          phone: values.phone,
          photoId: fileId ? Number(fileId) : (profile?.user?.photo?.id ?? 0),
        },
      },
      {
        onSuccess: () => {
          setUpdateImage(false);
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title={t("profile.account.title")}
        subtitle={t("profile.account.subtitle")}
      />

      {/* Profile summary card */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-card sm:flex-row">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary to-emerald text-white shadow-md">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="profile"
                className="h-full w-full object-cover"
              />
            ) : profile?.user?.photo?.url ? (
              <img
                src={getDominImageURL(profile.user.photo.url)}
                alt="profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold">
                {(firstName || "U").charAt(0)}
                {(lastName || "").charAt(0)}
              </span>
            )}
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald text-white ring-2 ring-white">
            <BsShieldCheck className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="text-center sm:text-start">
          <h3 className="text-lg font-bold text-foreground">
            {firstName || profile?.user?.firstName}{" "}
            {lastName || profile?.user?.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">
            {profile?.user?.email || "—"}
          </p>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            type="text"
            label={t("profile.account.firstName")}
            placeholder={t("profile.account.firstNamePlaceholder")}
            fieldName="firstName"
            errors={errors ?? null}
            loadInitialValue={isLoading}
            {...register("firstName")}
          />
          <Input
            type="text"
            label={t("profile.account.lastName")}
            placeholder={t("profile.account.lastNamePlaceholder")}
            fieldName="lastName"
            errors={errors ?? null}
            loadInitialValue={isLoading}
            {...register("lastName")}
          />
          <Input
            type="email"
            label={t("profile.account.email")}
            placeholder={t("profile.account.emailPlaceholder")}
            fieldName="email"
            errors={errors ?? null}
            iconType="email"
            loadInitialValue={isLoading}
            {...register("email")}
          />
          <Input
            type="text"
            label={t("profile.account.personalIdentifier")}
            placeholder={t("profile.account.personalIdentifierPlaceholder")}
            fieldName="personalIdentifier"
            errors={errors ?? null}
            iconType="personalIdentifier"
            loadInitialValue={isLoading}
            {...register("personalIdentifier")}
          />
          <Input
            type="tel"
            label={t("profile.account.phone")}
            placeholder={t("profile.account.phonePlaceholder")}
            fieldName="phone"
            errors={errors ?? null}
            loadInitialValue={isLoading}
            {...register("phone")}
          />
        </div>

        <ImageUploader
          label={t("profile.account.profilePhoto")}
          required={false}
          value={
            previewUrl || getDominImageURL(profile?.user?.photo?.url || "")
          }
          onFileChange={handleImageChange}
          disabled={isPending || isLoading}
          errors={errors ?? null}
          fieldName="photoUrl"
        />
      </form>

      {(isDirty || updateImage) && (
        <ConfrimChanges
          isSaving={isPending || isUpdating}
          handleSave={handleSubmit(onSubmit)}
          handleDiscard={() => reset()}
        />
      )}
    </div>
  );
}
