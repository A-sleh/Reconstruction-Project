import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import EmptyState from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/features/work-sites/components/StatusBadge";
import { getDominImageURL, parseCoordinates } from "@/lib/helpers";
import type { PublicWorkSite } from "../api/types";

interface WorkSitesGalleryProps {
  workSites: PublicWorkSite[];
}

export default function WorkSitesGallery({
  workSites,
}: WorkSitesGalleryProps) {
  const { t } = useTranslation();

  if (!workSites?.length)
    return <EmptyState message={t("publicProvider.workSites.empty")} />;

  const openMaps = (location?: string) => {
    const coords = location ? parseCoordinates(location) : null;
    if (coords) {
      window.open(
        `https://www.google.com/maps?q=${coords.lat},${coords.lng}`,
        "_blank",
        "noopener,noreferrer",
      );
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {workSites.map((site, index) => (
        <motion.div
          key={typeof site.id === "number" ? site.id : site.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant">
            <div className="relative h-36 overflow-hidden bg-muted">
              <img
                src={getDominImageURL(site.logo?.url ?? "")}
                alt={site.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute left-3 top-3">
                <StatusBadge status={site.status} />
              </div>
            </div>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  {site.name}
                </h3>
                <Badge variant="secondary">{site.workSiteType}</Badge>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="line-clamp-1">{site.address}</span>
              </div>
              {site.location && (
                <button
                  type="button"
                  onClick={() => openMaps(site.location)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  {t("publicProvider.workSites.mapsLink")}
                </button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
