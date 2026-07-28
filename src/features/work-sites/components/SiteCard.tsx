import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Landmark,
  MapPin,
  Pencil,
  Power,
  Trash2,
  Map,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import useAuthStore, { User } from "@/stores/useAuthStore";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { WorkSiteFormModel } from "./WorkSiteFormModel";
import ConfirmDelete from "@/components/model/ConfirmDelete";
import { WorkSite } from "../api/types";
import { useDeactivateWorkSite, useDeleteWorkSite } from "../api/actions";
import { openInGoogleMaps } from "@/lib/helpers";

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

  const onDelete = (s: WorkSite) => {
    deleteMutation.mutate(s.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative h-full bg-white overflow-hidden rounded-2xl"
    >
      <div
        className={`absolute  top-4 z-10 flex gap-1 opacity-0 transition-smooth group-hover:opacity-100
        ${langIsArabic ? "left-4 right-auto" : "right-4 left-auto"}`}
      >
        <WorkSiteFormModel
          openKey={`edit-work-site-${site.id}`}
          openButton={
            <Button
              size="icon"
              className="h-8 w-8 rounded-full shadow-md hover:bg-blue-400"
              onClick={(e) => {
                e.preventDefault();
              }}
              aria-label={t("workSites.btn-edit", "Edit site")}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          }
          initial={site}
        />
        <Button
          size="icon"
          isLoading={isPending}
          className="h-8 w-8 rounded-full shadow-md hover:bg-green-400 hover:text-secondary-foreground"
          onClick={(e) => {
            e.preventDefault();
            deactivateWorkSite({
              isActive: !site.isActive,
              workSiteId: Number(site.id),
            });
          }}
          aria-label={t("workSites.btn-deactivate", "Deactivate site")}
          disabled={isPending}
        >
          <Power className="h-3.5 w-3.5" />
        </Button>
        <ConfirmDelete
          onConfirm={() => onDelete(site)}
          openButton={
            <Button
              size="icon"
              className="h-8 w-8 rounded-full shadow-md hover:bg-destructive hover:text-destructive-foreground"
              onClick={(e) => {
                e.preventDefault();
              }}
              aria-label={t("workSites.btn-delete", "Delete site")}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          }
        />
      </div>

      <button
        onClick={() => {
          const params = new URLSearchParams({
            siteName: site?.name ?? "",
            address: site?.address ?? "",
            status: site?.status || "active",
            manager: `${firstName} ${lastName}`,
          });
          goto(`${paths.app.resourceProvidor.workSite.getHref(site.id)}?${params.toString()}`);
        }}
        className="block h-full w-full rounded-xl p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
      >
        <div className="flex items-center justify-between ">
          <StatusBadge status={site.isActive ? "active" : "on-hold"} />
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-smooth group-hover:gradient-accent group-hover:text-accent-foreground group-hover:opacity-0">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-end gap-4">
            <img
              src={site.logoURL}
              alt={site.name}
              className="h-8 w-8 rounded-full object-cover bg-black"
            />
            <div className="flex-1 min-w-0">
              <h3 className="mt-3 text-lg font-semibold text-foreground group-hover:text-primary transition-smooth">
                {site.name}
              </h3>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-accent" />
            <span className="truncate">{site.address}</span>
          </div>
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Landmark className="h-4 w-4 text-accent" />
              <span>
                {t(
                  `auth.register.providor.workSitesCategories.${site.workSiteType.toLowerCase()}`,
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openInGoogleMaps(site.location);
              }}
              className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-smooth hover:bg-primary hover:text-white"
            >
              <Map className="h-3.5 w-3.5" />
              {t("workSites.viewOnMap", "View on Map")}
            </button>
          </div>
        </div>
      </button>
    </motion.div>
  );
}
