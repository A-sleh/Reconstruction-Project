import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  Map,
  MapPin,
  Pencil,
  Power,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import ConfirmDelete from "@/components/model/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { getDominImageURL, openInGoogleMaps } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import useAuthStore, { User } from "@/stores/useAuthStore";

import { useDeactivateWorkSite, useDeleteWorkSite } from "../api/actions";
import { WorkSite } from "../api/types";
import { StatusBadge } from "./StatusBadge";
import { WorkSiteFormModel } from "./WorkSiteFormModel";

interface Props {
  site: WorkSite;
  index: number;
}

export function SiteCard({ site, index }: Props) {
  const goto = useNavigate();
  const { t, i18n } = useTranslation();
  const langIsArabic = i18n.language === "ar";
  const deleteMutation = useDeleteWorkSite();
  const { mutate: deactivateWorkSite, isPending } = useDeactivateWorkSite();
  const { firstName, lastName } = useAuthStore((s) => s.user as User);

  const siteLogo = getDominImageURL(site.logo?.url);

  const onDelete = (s: WorkSite) => {
    deleteMutation.mutate(s.id);
  };

  const openSite = () => {
    const params = new URLSearchParams({
      siteName: site?.name ?? "",
      address: site?.address ?? "",
      status: site?.status || "active",
      manager: `${firstName} ${lastName}`,
    });
    goto(
      `${paths.app.resourceProvidor.workSite.getHref(site.id)}?${params.toString()}`,
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        !site.isActive && "opacity-75 saturate-50",
      )}
    >
      {/* Cover */}
      <div
        className="relative h-36 overflow-hidden bg-gradient-to-br from-primary to-emerald"
        onClick={openSite}
      >
        {siteLogo ? (
          <img
            src={siteLogo}
            alt={site.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Building2 className="h-14 w-14 text-white/70" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Status */}
        <div className="absolute top-3 ms-3">
          <StatusBadge status={site.isActive ? "active" : "on-hold"} />
        </div>

        {/* Actions */}
        <div
          className={cn(
            "absolute top-2 z-10 flex gap-1.5 opacity-0 transition-smooth group-hover:opacity-100",
            langIsArabic ? "start-3" : "end-3",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <WorkSiteFormModel
            openKey={`edit-work-site-${site.id}`}
            openButton={
              <Button
                size="icon"
                className="h-9 w-9 rounded-full border border-white/30 bg-white/90 text-foreground shadow-md backdrop-blur transition hover:bg-primary hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                aria-label={t("workSites.btn-edit", "Edit site")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            }
            initial={site}
          />
          <Button
            size="icon"
            isLoading={isPending}
            className="h-9 w-9 rounded-full border border-white/30 bg-white/90 text-foreground shadow-md backdrop-blur transition hover:bg-emerald hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deactivateWorkSite({
                isActive: !site.isActive,
                workSiteId: Number(site.id),
              });
            }}
            aria-label={t("workSites.btn-deactivate", "Deactivate site")}
            disabled={isPending}
          >
            <Power className="h-4 w-4" />
          </Button>
          <ConfirmDelete
            onConfirm={() => onDelete(site)}
            openButton={
              <Button
                size="icon"
                className="h-9 w-9 rounded-full border border-white/30 bg-white/90 text-foreground shadow-md backdrop-blur transition hover:bg-destructive hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                aria-label={t("workSites.btn-delete", "Delete site")}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      </div>

      {/* Body */}
      <button
        onClick={openSite}
        className="flex flex-1 flex-col p-5 text-start outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-foreground transition-smooth group-hover:text-primary">
              {site.name}
            </h3>
            <span
              className={cn(
                "mt-1 block text-xs font-medium text-primary",
                langIsArabic ? "text-right" : "text-left",
              )}
            >
              {t(
                `auth.register.providor.workSitesCategories.${site.workSiteType.toLowerCase()}`,
              )}
            </span>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-smooth group-hover:bg-primary group-hover:text-white">
            <ArrowUpRight
              className={cn("h-4 w-4", langIsArabic && "rotate-180")}
            />
          </span>
        </div>

        <div
          className={cn(
            "mt-4 flex items-center gap-2 text-sm text-muted-foreground",
            langIsArabic ? "flex-row" : "flex-row",
          )}
        >
          <MapPin className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate">{site.address || "—"}</span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Map className="h-3.5 w-3.5 text-primary" />
            {t("workSites.location", "Location")}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openInGoogleMaps(site.location);
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-smooth hover:bg-primary hover:text-white focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Map className="h-3.5 w-3.5" />
            {t("workSites.viewOnMap", "View on Map")}
          </button>
        </div>
      </button>
    </motion.div>
  );
}
