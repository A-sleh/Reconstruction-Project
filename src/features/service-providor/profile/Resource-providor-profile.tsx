import { useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { FiCamera, FiUser } from "react-icons/fi";
import Input from "@/components/inputs/Input";

type ProfileData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  personalIdentifier: string;
  phone: string;
};

const ResourceProvidorProfile = () => {
  const { t } = useTranslation();
  const isOwner = false; // Change to false to simulate viewing another user's profile

  const [profile, setProfile] = useState<ProfileData>({
    firstName: "Sara",
    lastName: "Almasri",
    email: "sara.almasri@example.com",
    password: "Password123!",
    nationalNumber: "12345678901234",
    phone: "+966 59 123 4567",
  });
  const [imagePreview, setImagePreview] = useState<string>(
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
  );
  const [message, setMessage] = useState<string>("");

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(t("profile.updatedMessage"));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_10px_50px_rgba(15,23,42,0.05)]">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{t("profile.sectionTitle")}</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{t("profile.title")}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {t("profile.description")}
            </p>
          </div>

          <div className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${isOwner ? "bg-emerald-500" : "bg-slate-400"}`} />
            {isOwner ? t("profile.editableStatusOwner") : t("profile.editableStatusViewer")}
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[340px_1fr]">
          <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt={t("profile.profileImageAlt")}
                  className="h-44 w-44 rounded-full object-cover shadow-sm"
                />
                {isOwner && (
                  <label className="absolute bottom-0 right-0 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-slate-700 shadow border border-slate-200 transition hover:bg-slate-100">
                    <FiCamera className="h-5 w-5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xl font-semibold text-slate-900">
                  {profile.firstName} {profile.lastName}
                </p>
                <p className="text-sm text-slate-500">{profile.email}</p>
                <p className="text-sm text-slate-500">
                  {t("profile.nationalNumberLabel")}: {profile.personalIdentifier}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4 rounded-3xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-3 text-slate-700">
                <FiUser className="h-5 w-5" />
                <p className="text-sm font-medium">{t("profile.firstName")}</p>
              </div>
              <p className="text-sm text-slate-500">{profile.firstName}</p>
              <div className="flex items-center gap-3 text-slate-700">
                <FiUser className="h-5 w-5" />
                <p className="text-sm font-medium">{t("profile.email")}</p>
              </div>
              <p className="text-sm text-slate-500">{profile.email}</p>
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={t("profile.firstName")}
                type="text"
                value={profile.firstName}
                setValue={(value) => handleInputChange("firstName", value)}
                disabled={!isOwner}
                placeholder={t("profile.firstName")}
                iconType="user"
              />
              <Input
                label={t("profile.lastName")}
                type="text"
                value={profile.lastName}
                setValue={(value) => handleInputChange("lastName", value)}
                disabled={!isOwner}
                placeholder={t("profile.lastName")}
                iconType="user"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={t("profile.email")}
                type="email"
                value={profile.email}
                setValue={(value) => handleInputChange("email", value)}
                disabled={!isOwner}
                placeholder={t("profile.email")}
                iconType="email"
              />
              <Input
                label={t("profile.password")}
                type="password"
                value={profile.password}
                setValue={(value) => handleInputChange("password", value)}
                disabled={!isOwner}
                placeholder={t("profile.password")}
                iconType="password"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={t("profile.nationalNumberLabel")}
                type="text"
                value={profile.personalIdentifier}
                setValue={(value) => handleInputChange("personalIdentifier", value)}
                disabled={!isOwner}
                placeholder={t("profile.nationalNumberLabel")}
                iconType="personalIdentifier"
              />
              <Input
                label={t("profile.phone")}
                type="tel"
                value={profile.phone}
                setValue={(value) => handleInputChange("phone", value)}
                disabled={!isOwner}
                placeholder={t("profile.phone")}
                iconType="user"
              />
            </div>

            {isOwner && (
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {t("profile.saveButton")}
              </button>
            )}

            {!isOwner && (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {t("profile.readOnlyNotice")}
              </div>
            )}

            {message && <p className="text-sm text-emerald-700">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResourceProvidorProfile;
