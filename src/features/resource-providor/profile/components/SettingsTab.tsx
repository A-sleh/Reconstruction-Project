import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import SectionHeader from "./SectionHeader";
import { Trash2 } from "lucide-react";
import ToggleRow from "./ToggleRow";

export default function SettingsTab() {
  const { t } = useTranslation();

  return (
    <div>
      <SectionHeader
        title={t("resourceProvidor.profile.settings.title")}
        subtitle={t("resourceProvidor.profile.settings.subtitle")}
      />
      <div className="space-y-4">
        <ToggleRow
          title={t("resourceProvidor.profile.settings.notificationEmail.title")}
          desc={t("resourceProvidor.profile.settings.notificationEmail.description")}
          defaultChecked
        />
        <ToggleRow
          title={t("resourceProvidor.profile.settings.instantNotifications.title")}
          desc={t("resourceProvidor.profile.settings.instantNotifications.description")}
        />
        <ToggleRow
          title={t("resourceProvidor.profile.settings.marketingMessages.title")}
          desc={t("resourceProvidor.profile.settings.marketingMessages.description")}
        />
      </div>

      <div className="mt-8 rounded-2xl border-2 border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive shrink-0">
            <Trash2 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-destructive">
              {t("resourceProvidor.profile.settings.dangerZone.title")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("resourceProvidor.profile.settings.dangerZone.description")}
            </p>
            <Button variant="destructive" className="mt-4">
              {t("resourceProvidor.profile.settings.dangerZone.button")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}