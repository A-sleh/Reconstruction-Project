import { CalendarDays, FolderOpen, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

import type {
  EngineerPortfolio,
  EngineerProfile,
} from "../api/engineer-profile";
import PortfolioModal from "./PortfolioModal";

interface Props {
  profile: EngineerProfile;
  canEdit: boolean;
  onAdd: (portfolio: EngineerPortfolio) => void;
  onUpdate: (portfolio: EngineerPortfolio) => void;
  onDelete: (id: number | string) => void;
}

const PortfolioSection = ({
  profile,
  canEdit,
  onAdd,
  onUpdate,
  onDelete,
}: Props) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language == "ar";

  return (
    <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
      {canEdit && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {t("engineerProfile.portfolio.title")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("engineerProfile.portfolio.subtitle")}
            </p>
          </div>
          <PortfolioModal onSave={onAdd} />
        </div>
      )}

      {profile.portfolios.length === 0 ? (
        <div className="rounded-lg border border-gray-300 bg-white p-10 text-center">
          <FolderOpen className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            {t("engineerProfile.portfolio.empty")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.portfolios.map((portfolio) => {
            const cover = portfolio.attachments.find((att) => att.url);
            return (
              <div
                key={portfolio.id}
                className="group flex flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-card"
              >
                <div className="relative h-40 overflow-hidden bg-muted">
                  {cover ? (
                    <img
                      src={cover.url}
                      alt={portfolio.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-primary">
                      <FolderOpen className="h-12 w-12 text-white/80" />
                    </div>
                  )}
                  <span className="absolute top-3 start-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
                    <CalendarDays className="h-3 w-3" />
                    {portfolio.year}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-bold text-foreground">
                    {portfolio.title}
                  </h3>
                  <p className="mt-1 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {portfolio.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {portfolio.attachments.length}{" "}
                      {t("engineerProfile.portfolio.attachments", {
                        defaultValue: "attachments",
                        count: portfolio.attachments.length,
                      })}
                    </span>
                    {canEdit && (
                      <div className="flex items-center gap-2">
                        <PortfolioModal
                          portfolio={portfolio}
                          onSave={onUpdate}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(portfolio.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PortfolioSection;
