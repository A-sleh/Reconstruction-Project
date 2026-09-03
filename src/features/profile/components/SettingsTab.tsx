import { useState } from "react";
import { useTranslation } from "react-i18next";
import SectionHeader from "./SectionHeader";
import ToggleRow from "./ToggleRow";
import { useUpdateUserSettings } from "../api/actions";

export default function SettingsTab() {
  const { t } = useTranslation();
  const { mutate: updateSettings, isPending } = useUpdateUserSettings();

  const [emailNotification, setEmailNotification] = useState(false);
  const [systemNotification, setSystemNotification] = useState(false);
  const [openToWork, setOpenToWork] = useState(false);

  const handleEmailChange = (checked: boolean) => {
    setEmailNotification(checked);
    updateSettings({
      allowedEmailNotification: checked,
      allowedSystemNotification: systemNotification,
      openToWork,
    });
  };

  const handleSystemChange = (checked: boolean) => {
    setSystemNotification(checked);
    updateSettings({
      allowedEmailNotification: emailNotification,
      allowedSystemNotification: checked,
      openToWork,
    });
  };

  const handleAvailabilityChange = (checked: boolean) => {
    setOpenToWork(checked);
    updateSettings({
      allowedEmailNotification: emailNotification,
      allowedSystemNotification: systemNotification,
      openToWork: checked,
    });
  };

  return (
    <div>
      <SectionHeader
        title={t("profile.settings.title")}
        subtitle={t("profile.settings.subtitle")}
      />
      <div className="space-y-4">
        <ToggleRow
          title={t("profile.settings.availability.title")}
          desc={t("profile.settings.availability.description")}
          checked={openToWork}
          onChange={handleAvailabilityChange}
        />
        <div className="border-t border-gray-200 pt-1" />
        <ToggleRow
          title={t("profile.settings.notificationEmail.title")}
          desc={t("profile.settings.notificationEmail.description")}
          checked={emailNotification}
          onChange={handleEmailChange}
        />
        <ToggleRow
          title={t("profile.settings.instantNotifications.title")}
          desc={t("profile.settings.instantNotifications.description")}
          checked={systemNotification}
          onChange={handleSystemChange}
        />
        <p className="text-xs text-muted-foreground">
          {isPending
            ? t("profile.settings.saving", "Saving...")
            : t(
                "profile.settings.savedHint",
                "Changes are saved automatically.",
              )}
        </p>
      </div>
    </div>
  );
}