import {
  BriefcaseBusiness,
  FileBadge,
  IdCard,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import type { PublicEngineerProfile } from "@/features/engineer/profile/api/types";

export default function ContactEngineer({
  engineer,
}: {
  engineer: PublicEngineerProfile;
}) {
  const { t } = useTranslation();

  const infoTiles = [
    {
      label: t("engineerProfile.contact.email"),
      value: engineer.email,
      icon: Mail,
    },
    {
      label: t("engineerProfile.contact.phone"),
      value: engineer.phone,
      icon: Phone,
    },
    {
      label: t("engineerProfile.contact.syndicateId"),
      value: engineer.syndicate_id,
      icon: IdCard,
    },
    {
      label: t("engineerProfile.professionalInfo.employmentType"),
      value: t(
        `engineerProfile.employmentType.${engineer.professionalInfo.employmentType}`,
        { defaultValue: engineer.professionalInfo.employmentType },
      ),
      icon: BriefcaseBusiness,
    },
    {
      label: t("publicEngineer.identifier"),
      value: engineer.identifier,
      icon: User,
    },
    {
      label: t("engineerProfile.professionalInfo.licenseNumber"),
      value: engineer.professionalInfo.licenseNumber,
      icon: FileBadge,
    },
  ];

  return (
    <div id="public-engineer-contact" className="scroll-mt-24 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          {t("publicEngineer.contact.title")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("publicEngineer.contact.subtitle")}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {infoTiles.map((tile) => {
            const TileIcon = tile.icon;
            return (
              <div
                key={tile.label}
                className="rounded-lg border border-gray-300 bg-card p-4"
              >
                <div className="h-9 w-9 rounded-lg bg-emerald-soft text-emerald grid place-items-center">
                  <TileIcon className="h-4 w-4" />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {tile.label}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground break-words">
                  {tile.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <Button asChild variant="outline" size="lg">
            <a href={`tel:${engineer.phone}`}>
              <Phone className="h-4 w-4" />
              {t("publicEngineer.contact.phone")}
            </a>
          </Button>
          <Button asChild variant="default" size="lg">
            <a href={`mailto:${engineer.email}`}>
              <Mail className="h-4 w-4" />
              {t("publicEngineer.contact.email")}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
