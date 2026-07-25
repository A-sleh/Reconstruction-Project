import { useTranslation } from "react-i18next";
import { Building2, Maximize, Ruler, ShieldCheck, Accessibility, MapPin } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import type { LandDetail } from "../api/types";

interface LandKPICardsProps {
  land: LandDetail;
}

export default function LandKPICards({ land }: LandKPICardsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard
        icon={<Maximize className="h-4 w-4" />}
        label={t("investor.area")}
        value={`${land.area.toLocaleString()} ${t("investor.squareMeters")}`}
        iconBg="bg-primary/10"
        iconColor="text-primary"
      />
      <StatCard
        icon={<MapPin className="h-4 w-4" />}
        label={t("investor.label-zoning")}
        value={land.zoningType}
        iconBg="bg-emerald/10"
        iconColor="text-emerald"
      />
      <StatCard
        icon={<Building2 className="h-4 w-4" />}
        label={t("investor.buildings")}
        value={`${land.buildings?.length ?? 0}`}
        iconBg="bg-amber-50"
        iconColor="text-gold"
      />
      <StatCard
        icon={<ShieldCheck className="h-4 w-4" />}
        label={t("investor.validated")}
        value={land.isValidated ? t("investor.yes") : t("investor.no")}
        iconBg={land.isValidated ? "bg-emerald/10" : "bg-muted"}
        iconColor={land.isValidated ? "text-emerald" : "text-muted-foreground"}
      />
      <StatCard
        icon={<Accessibility className="h-4 w-4" />}
        label={t("investor.label-accessibility")}
        value={land.accessability ? t("investor.yes") : t("investor.no")}
        iconBg={land.accessability ? "bg-primary/10" : "bg-muted"}
        iconColor={land.accessability ? "text-primary" : "text-muted-foreground"}
      />
      <StatCard
        icon={<Ruler className="h-4 w-4" />}
        label={t("investor.borderPoints")}
        value={t("investor.border-points", { count: land.border?.length ?? 0 })}
        iconBg="bg-slate-50"
        iconColor="text-slate"
      />
    </div>
  );
}
