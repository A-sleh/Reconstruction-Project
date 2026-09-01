import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { paths } from "@/config/paths";
import { BriefcaseBusiness, FileBadge, Mail, Phone, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { EngineerSearchResult } from "../api/types";

const EngineerSummeryCard = ({
  engineer,
}: {
  engineer: EngineerSearchResult;
}) => {
  const { t } = useTranslation();

  const fullName = `${engineer.firstName} ${engineer.lastName}`;
  const initials =
    `${engineer.firstName?.[0] ?? ""}${engineer.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full">
            {engineer.photoUrl ? (
              <img
                src={engineer.photoUrl}
                alt={fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full grid place-items-center bg-gradient-primary text-white">
                {initials ? (
                  <span className="text-sm font-bold">{initials}</span>
                ) : (
                  <User className="h-6 w-6" />
                )}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-foreground">
              {fullName}
            </h3>
            <span className="mt-1 inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {t(`engineerProfile.speciality.${engineer.specialization}`, {
                defaultValue: engineer.specialization,
              })}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-foreground">
            <BriefcaseBusiness className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>
              {t("engineerProfile.professionalInfo.yearsOfExperienceValue", {
                count: engineer.yearsOfExperience,
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileBadge className="h-4 w-4 shrink-0" />
            <span>
              {t("engineerProfile.engineerSearch.license")}: #
              {engineer.licenseNumber}
            </span>
          </div>
          {engineer.bio && (
            <p className="line-clamp-2 pt-1 text-sm text-muted-foreground">
              {engineer.bio}
            </p>
          )}
        </div>

        <div className="border-t border-gray-300 pt-4 mt-4">
          <div className="flex items-center gap-2">
            {engineer.phone && (
              <Button
                asChild
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0"
              >
                <a
                  href={`tel:${engineer.phone}`}
                  aria-label={t("engineerProfile.contact.phone")}
                >
                  <Phone className="h-4 w-4" />
                </a>
              </Button>
            )}
            {engineer.email && (
              <Button
                asChild
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0"
              >
                <a
                  href={`mailto:${engineer.email}`}
                  aria-label={t("engineerProfile.contact.email")}
                >
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button asChild className="flex-1">
              <a href={paths.public.engineerProfile.getHref(engineer.engineerId)}>
                {t("engineerProfile.engineerSearch.viewProfile")}
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngineerSummeryCard;
